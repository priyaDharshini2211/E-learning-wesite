from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings

from .models import AppUser


class AppUserJWTAuthentication(JWTAuthentication):
    """Resolves the JWT's user_id claim against AppUser instead of Django's auth.User."""

    def get_user(self, validated_token):
        user_id = validated_token.get(api_settings.USER_ID_CLAIM)

        if user_id is None:
            return None

        try:
            return AppUser.objects.get(id=user_id)
        except AppUser.DoesNotExist:
            return None
