from .views import ProductView
from django.urls import path

urlpatterns = [
    path('home', ProductView.as_view()),  # Include the API URLs
]
