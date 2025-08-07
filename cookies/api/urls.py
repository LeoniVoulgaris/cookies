from .views import ProductView
from .views import CartItemView
from django.urls import path

urlpatterns = [
    path('Product', ProductView.as_view()),
    path('CartItem', CartItemView.as_view()),  # Include the API URLs
]
