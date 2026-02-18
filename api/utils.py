from jose import jwt
from django.conf import settings
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