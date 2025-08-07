from django.shortcuts import render
from rest_framework import generics
from .serializers import ProductSerializer
from .models import Product
#from .serializers import UserSerializer
#from .models import User
from .serializers import CartItemSerializer
from .models import CartItem
from .serializers import OrderSerializer
from .models import Order
from .serializers import OrderItemSerializer
from .models import OrderItem




 

class ProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CartItemView(generics.CreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

class OrderView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemView(generics.CreateAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

