from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer, DetailedProductSerializer
from rest_framework.response import Response
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Cart, CartItem
from .serializers import CartSerializer
from .utils import get_or_create_customer_from_token


BASE_URL = settings.REACT_BASE_URL

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

        try:
            product = Product.objects.get(id=product_id)
            # Use get_or_create to avoid duplicate lines for the same product
            item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'price_at_addition': product.price} # Set price from DB
            )

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