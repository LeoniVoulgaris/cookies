from django.urls import path
from .views import index

urlpatterns = [
    path('', index) ,
    path('products', index),
    path('signup', index),
    path('signin', index) # Include the API URLs
]