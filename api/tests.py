from datetime import datetime, timezone as dt_timezone
from decimal import Decimal
from unittest.mock import patch
from zoneinfo import ZoneInfo

from django.test import TestCase
from django.test import override_settings
from rest_framework.test import APIClient

from .models import Cart, CartItem, Customer, Order, Product
from .utils import get_order_availability


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

	@patch('api.views.get_order_availability')
	@patch('api.views.get_or_create_customer_from_token')
	def test_checkout_persists_customer_shipping_details(self, mock_customer, mock_order_availability):
		mock_customer.return_value = self.customer
		mock_order_availability.return_value = {
			'is_open': True,
			'next_open_at': None,
			'timezone': 'Europe/London',
			'reason': None,
		}
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
		self.assertEqual(order.total_price, Decimal('20.99'))


@override_settings(
	ORDER_WINDOW_TIMEZONE='Europe/London',
	ORDER_WINDOW_START_WEEKDAY=2,
	ORDER_WINDOW_START_HOUR=6,
	ORDER_WINDOW_START_MINUTE=0,
	ORDER_WINDOW_END_WEEKDAY=4,
	ORDER_WINDOW_END_HOUR=6,
	ORDER_WINDOW_END_MINUTE=0,
	ORDER_WINDOW_FORCE_OPEN=False,
)
class OrderAvailabilityTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.customer = Customer.objects.create(
			supabase_user_id='22222222-2222-2222-2222-222222222222',
			email='availability@example.com',
		)
		self.product = Product.objects.create(
			name='Availability Cookie Box',
			slug='availability-cookie-box',
			price=Decimal('17.00'),
			category='box',
		)
		self.auth_header = {'HTTP_AUTHORIZATION': 'Bearer fake-token'}

	def _london_to_utc(self, year, month, day, hour, minute=0):
		london_dt = datetime(year, month, day, hour, minute, tzinfo=ZoneInfo('Europe/London'))
		return london_dt.astimezone(dt_timezone.utc)

	def _create_cart(self):
		cart = Cart.objects.create(customer=self.customer, is_active=True)
		CartItem.objects.create(
			cart=cart,
			product=self.product,
			quantity=1,
			price_at_addition=Decimal('17.00'),
		)
		return cart

	def test_order_availability_boundaries(self):
		test_cases = [
			('before_closure', self._london_to_utc(2026, 4, 1, 5, 59), True),
			('start_of_closure', self._london_to_utc(2026, 4, 1, 6, 0), False),
			('during_closure', self._london_to_utc(2026, 4, 2, 12, 0), False),
			('just_before_reopen', self._london_to_utc(2026, 4, 3, 5, 59), False),
			('at_reopen', self._london_to_utc(2026, 4, 3, 6, 0), True),
		]

		for label, current_time, expected_open in test_cases:
			with self.subTest(label=label):
				availability = get_order_availability(now=current_time)
				self.assertEqual(availability['is_open'], expected_open)

	@patch('api.views.get_order_availability')
	@patch('api.views.get_or_create_customer_from_token')
	def test_checkout_blocked_during_closure_window(self, mock_customer, mock_order_availability):
		mock_customer.return_value = self.customer
		mock_order_availability.return_value = {
			'is_open': False,
			'next_open_at': '2026-04-03T06:00:00+01:00',
			'timezone': 'Europe/London',
			'reason': 'weekly_closure_window',
		}
		self._create_cart()

		response = self.client.post('/api/checkout/', {'payment_method': 'cash_on_delivery'}, format='json', **self.auth_header)

		self.assertEqual(response.status_code, 409)
		self.assertEqual(response.data['error_code'], 'orders_closed')
		self.assertTrue(response.data['orders_closed'])
		self.assertIsNotNone(response.data['next_open_at'])
		self.assertEqual(Order.objects.count(), 0)

	@patch('api.views.get_order_availability')
	@patch('api.views.stripe.checkout.Session.create')
	@patch('api.views.get_or_create_customer_from_token')
	def test_stripe_session_blocked_during_closure_window(self, mock_customer, mock_session_create, mock_order_availability):
		mock_customer.return_value = self.customer
		mock_order_availability.return_value = {
			'is_open': False,
			'next_open_at': '2026-04-03T06:00:00+01:00',
			'timezone': 'Europe/London',
			'reason': 'weekly_closure_window',
		}
		self._create_cart()

		response = self.client.post('/api/create-checkout-session/', {'payment_method': 'card'}, format='json', **self.auth_header)

		self.assertEqual(response.status_code, 409)
		self.assertEqual(response.data['error_code'], 'orders_closed')
		self.assertEqual(Order.objects.count(), 0)
		mock_session_create.assert_not_called()

	@patch('api.views.get_order_availability')
	@patch('api.views.stripe.checkout.Session.create')
	@patch('api.views.get_or_create_customer_from_token')
	def test_stripe_session_created_when_orders_open(self, mock_customer, mock_session_create, mock_order_availability):
		mock_customer.return_value = self.customer
		mock_order_availability.return_value = {
			'is_open': True,
			'next_open_at': None,
			'timezone': 'Europe/London',
			'reason': None,
		}
		self._create_cart()
		mock_session_create.return_value = type('StripeSession', (), {'url': 'https://stripe.example/checkout'})()

		response = self.client.post(
			'/api/create-checkout-session/',
			{'payment_method': 'card', 'email': 'availability@example.com'},
			format='json',
			**self.auth_header,
		)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data['url'], 'https://stripe.example/checkout')
		mock_session_create.assert_called_once()
		self.assertEqual(Order.objects.count(), 1)
