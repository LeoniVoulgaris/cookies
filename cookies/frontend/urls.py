from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('', index),
    path('products', index),
    path('signup', index),
    path('signin', index),
    # Add a path for product/slug
    path('product/<str:slug>', index),
    # Catch-all pattern as fallback
    re_path(r'^.*/$', index)
]