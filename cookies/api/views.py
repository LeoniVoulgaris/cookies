from django.shortcuts import render
from rest_framework import generics
from .serializers import ProductSerializer
from .models import Product

class ProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

