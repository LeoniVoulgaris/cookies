from .views import main
from django.urls import path

urlpatterns = [
    path('', main),  # Include the API URLs
]
