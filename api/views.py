from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
from decimal import Decimal
import stripe
from .models import Product, Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, OrderSerializer
from .utils import get_or_create_customer_from_token
from .serializers import ProductSerializer, DetailedProductSerializer


BASE_URL = settings.REACT_BASE_URL
SHIPPING_FEE = Decimal('4.45')


def _save_customer_shipping_details(customer, data):
    """Persist latest checkout contact/shipping details on the customer profile."""
    changed = False
    fields = {
        'email': data.get('email', ''),
        'full_name': data.get('full_name', ''),
        'address': data.get('address', ''),
        'city': data.get('city', ''),
        'postal_code': data.get('postal_code', ''),
        'country': data.get('country', ''),
    }
    for field, value in fields.items():
        if value and getattr(customer, field, None) != value:
            setattr(customer, field, value)
            changed = True
    if changed:
        customer.save()

@api_view(['GET'])
def product(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def product_detail(request, slug):
    product = Product.objects.get(slug=slug)
    serializer = DetailedProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([AllowAny])
@csrf_exempt
def cart_view(request):
    customer = get_or_create_customer_from_token(request)
    if not customer:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    # Always get or create the active cart for this customer
    cart, _ = Cart.objects.get_or_create(customer=customer, is_active=True)

    if request.method == 'GET':
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    elif request.method == 'POST':
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        customisation = request.data.get('customisation', None)

        try:
            product = Product.objects.get(id=product_id)
            item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'price_at_addition': product.price}
            )

            if customisation is not None:
                # Box with customisation: replace quantity and flavour selection
                item.quantity = quantity
                item.customisation = customisation
            else:
                if not created:
                    item.quantity += quantity
                else:
                    item.quantity = quantity

            item.save()
            return Response(CartSerializer(cart).data)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PATCH'])
@authentication_classes([])
@permission_classes([AllowAny])
@csrf_exempt
def update_cart_item(request, item_id):
    customer = get_or_create_customer_from_token(request)
    if not customer:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        item = CartItem.objects.get(id=item_id, cart__customer=customer)
        new_quantity = int(request.data.get('quantity', 0))

        if new_quantity <= 0:
            item.delete()
        else:
            item.quantity = new_quantity
            item.save()

        return Response(CartSerializer(item.cart).data)
    except CartItem.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
@csrf_exempt
def checkout_view(request):
    customer = get_or_create_customer_from_token(request)
    if not customer:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        cart = Cart.objects.get(customer=customer, is_active=True)
    except Cart.DoesNotExist:
        return Response({"error": "No active cart found"}, status=status.HTTP_400_BAD_REQUEST)

    if not cart.items.exists():
        return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

    _save_customer_shipping_details(customer, request.data)

    subtotal = sum(item.quantity * item.price_at_addition for item in cart.items.all())
    total = subtotal + SHIPPING_FEE
    order = Order.objects.create(
        customer=customer,
        total_price=total,
        full_name=request.data.get('full_name', ''),
        email=request.data.get('email', ''),
        address=request.data.get('address', ''),
        city=request.data.get('city', ''),
        postal_code=request.data.get('postal_code', ''),
        country=request.data.get('country', ''),
        instructions=request.data.get('instructions', ''),
        payment_method=request.data.get('payment_method', ''),
    )

    for item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=item.product,
            product_name=item.product.name,
            quantity=item.quantity,
            price=item.price_at_addition,
            customisation=item.customisation
        )

    cart.is_active = False
    cart.save()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def order_detail(request, order_id):
    customer = get_or_create_customer_from_token(request)
    if not customer:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        order = Order.objects.get(id=order_id, customer=customer)
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
@csrf_exempt
def create_stripe_checkout_session(request):
    customer = get_or_create_customer_from_token(request)
    if not customer:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        cart = Cart.objects.get(customer=customer, is_active=True)
    except Cart.DoesNotExist:
        return Response({'error': 'No active cart found'}, status=status.HTTP_400_BAD_REQUEST)

    if not cart.items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    _save_customer_shipping_details(customer, request.data)

    subtotal = sum(item.quantity * item.price_at_addition for item in cart.items.all())
    total = subtotal + SHIPPING_FEE
    order = Order.objects.create(
        customer=customer,
        total_price=total,
        status='pending',
        full_name=request.data.get('full_name', ''),
        email=request.data.get('email', ''),
        address=request.data.get('address', ''),
        city=request.data.get('city', ''),
        postal_code=request.data.get('postal_code', ''),
        country=request.data.get('country', ''),
        instructions=request.data.get('instructions', ''),
        payment_method='card',
    )

    for item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=item.product,
            product_name=item.product.name,
            quantity=item.quantity,
            price=item.price_at_addition,
            customisation=item.customisation
        )

    cart.is_active = False
    cart.save()

    stripe.api_key = settings.STRIPE_SECRET_KEY

    line_items = [
        {
            'price_data': {
                'currency': 'gbp',
                'product_data': {'name': item.product_name},
                'unit_amount': int(item.price * 100),
            },
            'quantity': item.quantity,
        }
        for item in order.items.all()
    ]

    line_items.append(
        {
            'price_data': {
                'currency': 'gbp',
                'product_data': {'name': 'Shipping'},
                'unit_amount': int(SHIPPING_FEE * 100),
            },
            'quantity': 1,
        }
    )

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=line_items,
        mode='payment',
        customer_email=order.email or None,
        metadata={'order_id': order.id},
        success_url=f"{BASE_URL}/checkout?stripe_success=true&order_id={order.id}",
        cancel_url=f"{BASE_URL}/checkout",
    )

    return Response({'url': session.url})


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session.get('metadata', {}).get('order_id')
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                order.status = 'confirmed'
                order.save()
            except Order.DoesNotExist:
                pass

    return HttpResponse(status=200)