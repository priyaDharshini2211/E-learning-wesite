import os

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from backend_app.models import AppUser


class Command(BaseCommand):
    help = "Creates a single bootstrap Admin account for local development, if one doesn't already exist."

    def handle(self, *args, **options):
        username = os.environ.get('SEED_ADMIN_USERNAME', 'admin')
        email = os.environ.get('SEED_ADMIN_EMAIL', 'admin@example.com')
        password = os.environ.get('SEED_ADMIN_PASSWORD', 'Admin@12345')

        if AppUser.objects.filter(role='admin').exists():
            self.stdout.write(self.style.WARNING('An admin account already exists. Skipping.'))
            return

        AppUser.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            role='admin',
        )
        self.stdout.write(self.style.SUCCESS(f"Created admin '{username}' with password '{password}'."))
