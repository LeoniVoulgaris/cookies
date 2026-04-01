from datetime import timedelta
from zoneinfo import ZoneInfo

from jose import jwt
from django.conf import settings
from django.utils import timezone
from .models import Customer

def get_or_create_customer_from_token(request):
    """
    Extracts JWT from Authorization header and returns/creates a Customer.
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ')[1]

    try:
        # 1. Decode & Verify Token
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )

        # 2. Extract Supabase User ID (sub)
        supabase_user_id = payload.get('sub')
        email = payload.get('email')

        # 3. Find or Create the Customer record in Django
        customer, created = Customer.objects.get_or_create(
            supabase_user_id=supabase_user_id,
            defaults={'email': email}
        )
        return customer

    except Exception as e:
        print(f"JWT Verification Failed: {e}")
        return None


def get_order_availability(now=None):
    """Return whether ordering is currently open and when it reopens if closed."""
    timezone_name = getattr(settings, 'ORDER_WINDOW_TIMEZONE', 'Europe/London')
    business_tz = ZoneInfo(timezone_name)
    current_time = (now or timezone.now()).astimezone(business_tz)

    if getattr(settings, 'ORDER_WINDOW_FORCE_OPEN', False):
        return {
            'is_open': True,
            'next_open_at': None,
            'timezone': timezone_name,
            'reason': None,
        }

    start_weekday = getattr(settings, 'ORDER_WINDOW_START_WEEKDAY', 2)
    start_hour = getattr(settings, 'ORDER_WINDOW_START_HOUR', 6)
    start_minute = getattr(settings, 'ORDER_WINDOW_START_MINUTE', 0)
    end_weekday = getattr(settings, 'ORDER_WINDOW_END_WEEKDAY', 4)
    end_hour = getattr(settings, 'ORDER_WINDOW_END_HOUR', 6)
    end_minute = getattr(settings, 'ORDER_WINDOW_END_MINUTE', 0)

    week_start = current_time - timedelta(
        days=current_time.weekday(),
        hours=current_time.hour,
        minutes=current_time.minute,
        seconds=current_time.second,
        microseconds=current_time.microsecond,
    )
    start_dt = week_start + timedelta(days=start_weekday, hours=start_hour, minutes=start_minute)
    end_dt = week_start + timedelta(days=end_weekday, hours=end_hour, minutes=end_minute)

    if start_dt <= end_dt:
        is_closed = start_dt <= current_time < end_dt
        next_open_at = end_dt if is_closed else None
    else:
        # Supports windows that span the week boundary.
        is_closed = current_time >= start_dt or current_time < end_dt
        if is_closed:
            next_open_at = end_dt if current_time < end_dt else end_dt + timedelta(days=7)
        else:
            next_open_at = None

    return {
        'is_open': not is_closed,
        'next_open_at': next_open_at.isoformat() if next_open_at else None,
        'timezone': timezone_name,
        'reason': 'weekly_closure_window' if is_closed else None,
    }