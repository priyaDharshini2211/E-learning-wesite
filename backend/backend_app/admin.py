from django.contrib import admin

from .models import AppUser, Admission, Attendance, Course, Enrollment, Feedback, StudyMaterial, Video


@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    exclude = ['password']


@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = ['student_name', 'course', 'lead_status', 'assigned_bde', 'created_by', 'created_at']
    list_filter = ['lead_status', 'course']


admin.site.register(Course)
admin.site.register(Video)
admin.site.register(StudyMaterial)
admin.site.register(Enrollment)
admin.site.register(Attendance)
admin.site.register(Feedback)
