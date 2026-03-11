from django.contrib import admin
from .models import Product, Customer, Cart, CartItem, Order, OrderItem

admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Cart)
admin.site.register(CartItem)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'quantity', 'price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'email', 'city', 'country', 'total_price', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('full_name', 'email', 'address')
    readonly_fields = ('customer', 'created_at', 'updated_at', 'total_price')
    inlines = [OrderItemInline]
