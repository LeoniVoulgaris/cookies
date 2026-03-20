from rest_framework import serializers
from .models import Product, Cart, CartItem, Order, OrderItem





class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','name','slug','image','description','price','category']



class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'slug', 'image', 'description', 'category', 'similar_products']


    def get_similar_products(self, product):
        if product.category == 'box':
            products = Product.objects.filter(category='box').exclude(id=product.id)
        else:
            products = Product.objects.filter(category__in=['classic', 'limited']).exclude(id=product.id)
        serializer = ProductSerializer(products, many=True)
        return serializer.data


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.product.image:
            return obj.product.image.url
        return None

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'image', 'quantity', 'price_at_addition', 'customisation']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'created_at']

    def get_total_price(self, obj):
        return sum(item.quantity * item.price_at_addition for item in obj.items.all())


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'total_price', 'created_at', 'items',
            'full_name', 'email', 'address', 'city', 'postal_code',
            'country', 'instructions', 'payment_method', 'delivery_method',
        ]