from django.urls import path
from .views import index

urlpatterns = [
    path('', index)  # Include the API URLs
]