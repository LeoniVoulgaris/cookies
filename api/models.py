from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser
import uuid


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('box', 'Cookie Box'),
        ('classic', 'Classic Cookie'),
        ('limited', 'Limited Cookie'),
    ]

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(blank=True, null=True)
    image = models.ImageField(upload_to="img", null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='box')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            unique_slug = self.slug
            counter = 1
            if Product.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{self.slug}-{counter}"
                counter += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)


class Customer(models.Model):
    """
    Acts as a reference to the Supabase User.
    The supabase_user_id will be extracted from the JWT sent by React.
    """
    supabase_user_id = models.UUIDField(unique=True, primary_key=True)
    email = models.EmailField(blank=True, null=True)
    full_name = models.CharField(max_length=200, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email if self.email else str(self.supabase_user_id)

class Cart(models.Model):
    """
    The parent container for cart items.
    Linked to a Customer via their Supabase ID.
    """
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True) # False once it becomes an Order

    def __str__(self):
        return f"Cart {self.id} - {self.customer}"

class CartItem(models.Model):
    """
    Individual products within a cart.
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE) # References existing Product model
    quantity = models.PositiveIntegerField(default=1)
    # price_at_addition ensures the price doesn't change for the user if you update the Product price later
    price_at_addition = models.DecimalField(max_digits=10, decimal_places=2)
    customisation = models.JSONField(null=True, blank=True)

    class Meta:
        # Prevents the same product being added as multiple rows in the same cart
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    # Delivery details (captured at checkout)
    full_name = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    delivery_method = models.CharField(
        max_length=20,
        choices=[('delivery', 'Delivery'), ('collection', 'Collection')],
        default='delivery',
    )

    def __str__(self):
        return f"Order {self.id} - {self.customer}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    customisation = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} x {self.product_name}"