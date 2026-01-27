from django.urls import path
from . import views
urlpatterns = [
    path("products/", views.product, name="products"),
    path("products_detail/<slug:slug>/", views.product_detail, name="product_detail")
]
