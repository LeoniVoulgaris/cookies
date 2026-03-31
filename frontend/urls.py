from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('', index),
    path('products', index),
    path('checkout', index),
    path('checkout/', index),
    path('checkout/success', index),
    path('checkout/success/', index),
    path('signup', index),
    path('signin', index),
    # Add a path for product/slug
    path('product/<str:slug>', index),
    # Catch-all SPA fallback, excluding backend/admin/static/media paths.
    re_path(r'^(?!admin/?$|admin/|api/|media/|static/).*$' , index),
]