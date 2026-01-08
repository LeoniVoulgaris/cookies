from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer, DetailedProductSerializer
from rest_framework.response import Response
from django.conf import settings



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
