from django.urls import path
from . import views
urlpatterns = [
    path("products/", views.product, name="products"),
    path("products_detail/<slug:slug>/", views.product_detail, name="product_detail"),
    path("cart/", views.cart_view, name="cart"),
    path("cart/update/<int:item_id>/", views.update_cart_item, name="update_cart_item"),
]
