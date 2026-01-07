from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser



class Product(models.Model):
    CATEGORY_CHOICES = [
        ('snack', 'Snack'),
        ('beverage', 'Beverage'),
        ('dessert', 'Dessert'),
    ]

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(blank=True, null=True)
    image = models.ImageField(upload_to="img", null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='snack')

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