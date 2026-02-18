from rest_framework import serializers
from .models import Product
from .models import Cart, CartItem, Product





class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','name','slug','image','description','category','price']



class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'slug', 'image', 'description', 'category', 'similar_products']


    def get_similar_products(self, product):
        products = Product.objects.filter(category=product.category).exclude(id=product.id)
        serializer = ProductSerializer(products, many=True)

        return serializer.data


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    image = serializers.ReadOnlyField(source='product.image.url')

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'image', 'quantity', 'price_at_addition']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'created_at']

    def get_total_price(self, obj):
        return sum(item.quantity * item.price_at_addition for item in obj.items.all())