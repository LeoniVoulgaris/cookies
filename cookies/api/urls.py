from .views import ProductView, CartItemView, OrderView, OrderItemView
from django.urls import path

urlpatterns = [
    path('Product', ProductView.as_view()),
    path('CartItem', CartItemView.as_view()), 
    path('Order', OrderView.as_view()),
    path('OrderItem', OrderItemView.as_view()), # Include the API URLs
]
