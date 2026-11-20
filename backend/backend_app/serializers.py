from rest_framework import serializers

from .models import AppUser, Admission, Attendance, Course, Enrollment, Feedback, StudyMaterial, Video


class app_user_serializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = [
            'id', 'username', 'email', 'role', 'degree', 'mobile',
            'first_name', 'last_name', 'is_active', 'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']


class trainer_brief_serializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['id', 'username', 'first_name', 'last_name']


class video_serializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'course', 'title', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class study_material_serializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMaterial
        fields = ['id', 'course', 'title', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class course_serializer(serializers.ModelSerializer):
    trainers = serializers.PrimaryKeyRelatedField(
        queryset=AppUser.objects.filter(role='trainer'), many=True, required=False,
    )
    trainer_details = trainer_brief_serializer(source='trainers', many=True, read_only=True)
    videos = video_serializer(many=True, read_only=True)
    materials = study_material_serializer(many=True, read_only=True)
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'duration', 'fees', 'description',
            'trainers', 'trainer_details', 'videos', 'materials',
            'student_count', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_student_count(self, obj):
        return obj.enrollments.count()


class enrollment_serializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_name', 'course', 'course_name',
            'completion_status', 'enrolled_at',
        ]
        read_only_fields = ['id', 'enrolled_at']


class attendance_serializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'student', 'student_name', 'course', 'course_name', 'date', 'status', 'marked_by',
        ]
        read_only_fields = ['id', 'marked_by']


class feedback_serializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Feedback
        fields = [
            'id', 'student', 'student_name', 'course', 'course_name',
            'message', 'rating', 'trainer_response', 'created_at',
        ]
        read_only_fields = ['id', 'student', 'created_at']


class admission_serializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    assigned_bde_name = serializers.CharField(source='assigned_bde.get_full_name', read_only=True)

    class Meta:
        model = Admission
        fields = [
            'id', 'student_name', 'mobile', 'email', 'degree',
            'course', 'course_name', 'fees', 'duration',
            'created_by', 'created_by_name',
            'assigned_bde', 'assigned_bde_name', 'lead_status', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_by', 'assigned_bde', 'lead_status', 'created_at', 'updated_at']
