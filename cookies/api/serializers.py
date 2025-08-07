from rest_framework import serializers
from .models import Product
#from .models import User
from .models import CartItem    
from .models import Order
from .models import OrderItem
from django.contrib.auth import get_user_model





class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id','name', 'price', 'description')

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    #user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'total_price', 'status', 'shipping_address', 'stripe_payment_id', 'items']


