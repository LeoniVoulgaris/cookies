from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from .models import Cart, CartItem, Customer, Order, Product


class CheckoutFlowTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.customer = Customer.objects.create(
			supabase_user_id='11111111-1111-1111-1111-111111111111',
			email='user@example.com',
		)
		self.product = Product.objects.create(
			name='Classic Cookie Box',
			slug='classic-cookie-box',
			price=Decimal('17.00'),
			category='box',
		)
		self.auth_header = {'HTTP_AUTHORIZATION': 'Bearer fake-token'}

	@patch('api.views.get_or_create_customer_from_token')
	def test_cart_add_and_get(self, mock_customer):
		mock_customer.return_value = self.customer

		add_response = self.client.post(
			'/api/cart/',
			{'product_id': self.product.id, 'quantity': 2, 'customisation': {'flavours': {'Milk Chocolate Chip Cookie': 3, 'White Chocolate Chip Cookie': 3}}},
			format='json',
			**self.auth_header,
		)
		self.assertEqual(add_response.status_code, 200)
		self.assertEqual(len(add_response.data['items']), 1)
		self.assertEqual(add_response.data['items'][0]['quantity'], 2)

		get_response = self.client.get('/api/cart/', **self.auth_header)
		self.assertEqual(get_response.status_code, 200)
		self.assertEqual(len(get_response.data['items']), 1)

	@patch('api.views.get_or_create_customer_from_token')
	def test_checkout_persists_customer_shipping_details(self, mock_customer):
		mock_customer.return_value = self.customer
		cart = Cart.objects.create(customer=self.customer, is_active=True)
		CartItem.objects.create(
			cart=cart,
			product=self.product,
			quantity=1,
			price_at_addition=Decimal('17.00'),
			customisation={'flavours': {'Milk Chocolate Chip Cookie': 3, 'White Chocolate Chip Cookie': 3}},
		)

		payload = {
			'full_name': 'Jane Doe',
			'email': 'jane@example.com',
			'address': '123 Cookie Street',
			'city': 'London',
			'postal_code': 'SW1A 1AA',
			'country': 'United Kingdom',
			'instructions': 'Leave by the porch',
			'payment_method': 'cash_on_delivery',
		}
		response = self.client.post('/api/checkout/', payload, format='json', **self.auth_header)

		self.assertEqual(response.status_code, 201)
		self.customer.refresh_from_db()
		self.assertEqual(self.customer.full_name, 'Jane Doe')
		self.assertEqual(self.customer.address, '123 Cookie Street')
		self.assertEqual(self.customer.city, 'London')
		self.assertEqual(self.customer.postal_code, 'SW1A 1AA')
		self.assertEqual(self.customer.country, 'United Kingdom')

		order = Order.objects.get(id=response.data['id'])
		self.assertEqual(order.address, '123 Cookie Street')
		self.assertEqual(order.payment_method, 'cash_on_delivery')
		self.assertEqual(order.total_price, Decimal('21.45'))
