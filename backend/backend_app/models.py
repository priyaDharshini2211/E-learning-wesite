from django.db import models

ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('bde', 'BDE'),
    ('lead', 'Lead'),
    ('trainer', 'Course Trainer'),
    ('student', 'Student'),
]


class AppUser(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    degree = models.CharField(max_length=150, blank=True)
    mobile = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Lets DRF's IsAuthenticated permission treat this as a logged-in user
    # once AppUserJWTAuthentication has resolved it from the token.
    @property
    def is_authenticated(self):
        return True

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return f"{self.username} ({self.role})"


class Course(models.Model):
    name = models.CharField(max_length=200)
    duration = models.CharField(max_length=100, help_text="e.g. '6 weeks', '3 months'")
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    trainers = models.ManyToManyField(
        AppUser, related_name='courses_taught', blank=True,
        limit_choices_to={'role': 'trainer'},
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Video(models.Model):
    course = models.ForeignKey(Course, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='course_videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.name} - {self.title}"


class StudyMaterial(models.Model):
    course = models.ForeignKey(Course, related_name='materials', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='study_materials/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.name} - {self.title}"


COMPLETION_STATUS_CHOICES = [
    ('not_started', 'Not Started'),
    ('in_progress', 'In Progress'),
    ('completed', 'Completed'),
]


class Enrollment(models.Model):
    student = models.ForeignKey(
        AppUser, related_name='enrollments', on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
    )
    course = models.ForeignKey(Course, related_name='enrollments', on_delete=models.CASCADE)
    completion_status = models.CharField(
        max_length=20, choices=COMPLETION_STATUS_CHOICES, default='not_started',
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'course']

    def __str__(self):
        return f"{self.student.username} -> {self.course.name}"


ATTENDANCE_STATUS_CHOICES = [
    ('present', 'Present'),
    ('absent', 'Absent'),
]


class Attendance(models.Model):
    student = models.ForeignKey(
        AppUser, related_name='attendance_records', on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
    )
    course = models.ForeignKey(Course, related_name='attendance_records', on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS_CHOICES)
    marked_by = models.ForeignKey(
        AppUser, related_name='attendance_marked', on_delete=models.SET_NULL, null=True,
    )

    class Meta:
        unique_together = ['student', 'course', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.student.username} - {self.course.name} - {self.date} - {self.status}"


class Feedback(models.Model):
    student = models.ForeignKey(
        AppUser, related_name='feedback_given', on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
    )
    course = models.ForeignKey(Course, related_name='feedback', on_delete=models.CASCADE)
    message = models.TextField()
    rating = models.PositiveSmallIntegerField()
    trainer_response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.username} - {self.course.name} ({self.rating}/5)"


LEAD_STATUS_CHOICES = [
    ('new', 'New'),
    ('contacted', 'Contacted'),
    ('interested', 'Interested'),
    ('converted', 'Converted'),
    ('lost', 'Lost'),
]


class Admission(models.Model):
    student_name = models.CharField(max_length=200)
    mobile = models.CharField(max_length=20)
    email = models.EmailField()
    degree = models.CharField(max_length=150, blank=True)
    course = models.ForeignKey(Course, related_name='admissions', on_delete=models.PROTECT)
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100, blank=True)

    created_by = models.ForeignKey(
        AppUser, related_name='admissions_created', on_delete=models.SET_NULL,
        null=True, limit_choices_to={'role': 'lead'},
    )
    assigned_bde = models.ForeignKey(
        AppUser, related_name='admissions_assigned', on_delete=models.SET_NULL,
        null=True, blank=True, limit_choices_to={'role': 'bde'},
    )
    lead_status = models.CharField(max_length=20, choices=LEAD_STATUS_CHOICES, default='new')
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student_name} - {self.course.name} ({self.lead_status})"
