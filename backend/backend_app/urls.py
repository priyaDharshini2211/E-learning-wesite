from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path('auth/login/', views.login_user, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accounts/me/', views.me, name='me'),

    path('users/', views.users_collection, name='users_collection'),
    path('users/<int:id>/', views.user_detail, name='user_detail'),

    path('courses/', views.courses_collection, name='courses_collection'),
    path('courses/<int:id>/', views.course_detail, name='course_detail'),

    path('videos/', views.videos_collection, name='videos_collection'),
    path('videos/<int:id>/', views.video_detail, name='video_detail'),

    path('materials/', views.materials_collection, name='materials_collection'),
    path('materials/<int:id>/', views.material_detail, name='material_detail'),

    path('enrollments/', views.enrollments_collection, name='enrollments_collection'),
    path('enrollments/<int:id>/', views.enrollment_detail, name='enrollment_detail'),

    path('attendance/', views.attendance_collection, name='attendance_collection'),
    path('attendance/<int:id>/', views.attendance_detail, name='attendance_detail'),

    path('feedback/', views.feedback_collection, name='feedback_collection'),
    path('feedback/<int:id>/', views.feedback_detail, name='feedback_detail'),

    path('admissions/', views.admissions_collection, name='admissions_collection'),
    path('admissions/<int:id>/', views.admission_detail, name='admission_detail'),
    path('admissions/<int:id>/assign/', views.assign_bde, name='assign_bde'),
    path('admissions/<int:id>/update-status/', views.update_admission_status, name='update_admission_status'),
]
