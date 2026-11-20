from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import AppUser, Admission, Attendance, Course, Enrollment, Feedback, StudyMaterial, Video
from .serializers import (
    admission_serializer,
    app_user_serializer,
    attendance_serializer,
    course_serializer,
    enrollment_serializer,
    feedback_serializer,
    study_material_serializer,
    video_serializer,
)


def forbidden(message='You do not have permission to perform this action.'):
    return Response({'detail': message}, status=status.HTTP_403_FORBIDDEN)


def not_found():
    return Response(status=status.HTTP_404_NOT_FOUND)


def issue_tokens(user):
    refresh = RefreshToken()
    refresh['user_id'] = user.id
    refresh['role'] = user.role
    refresh['username'] = user.username
    return refresh


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = AppUser.objects.get(username=username)
    except AppUser.DoesNotExist:
        return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active or not check_password(password, user.password):
        return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = issue_tokens(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'id': user.id,
        'username': user.username,
        'role': user.role,
        'full_name': user.get_full_name(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(app_user_serializer(request.user, context={'request': request}).data)


# ---------------------------------------------------------------------------
# Users (admin only - the only way any account other than the seeded admin
# gets created)
# ---------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def users_collection(request):
    if request.user.role != 'admin':
        return forbidden()

    if request.method == 'GET':
        users = AppUser.objects.all().order_by('-date_joined')
        role = request.query_params.get('role')
        if role:
            users = users.filter(role=role)
        return Response(app_user_serializer(users, many=True, context={'request': request}).data)

    data = request.data.copy()
    password = data.pop('password', None)
    if not password:
        return Response({'password': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if AppUser.objects.filter(email=data.get('email')).exists():
        return Response({'email': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(password)
    except DjangoValidationError as exc:
        return Response({'password': exc.messages}, status=status.HTTP_400_BAD_REQUEST)

    serializer = app_user_serializer(data=data, context={'request': request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = AppUser(**serializer.validated_data)
    user.password = make_password(password)
    user.save()
    return Response(app_user_serializer(user, context={'request': request}).data, status=status.HTTP_201_CREATED)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, id):
    if request.user.role != 'admin':
        return forbidden()

    try:
        target = AppUser.objects.get(id=id)
    except AppUser.DoesNotExist:
        return not_found()

    if request.method == 'DELETE':
        target.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    data = request.data.copy()
    password = data.pop('password', None)
    serializer = app_user_serializer(target, data=data, partial=True, context={'request': request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    if password:
        target.password = make_password(password)
        target.save(update_fields=['password'])
    return Response(app_user_serializer(target, context={'request': request}).data)


# ---------------------------------------------------------------------------
# Courses
# ---------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def courses_collection(request):
    user = request.user

    if request.method == 'GET':
        courses = Course.objects.all().prefetch_related('videos', 'materials', 'trainers')
        if user.role == 'trainer':
            courses = courses.filter(trainers=user)
        elif user.role == 'student':
            courses = courses.filter(enrollments__student=user).distinct()
        return Response(course_serializer(courses, many=True, context={'request': request}).data)

    if user.role != 'admin':
        return forbidden()

    serializer = course_serializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def course_detail(request, id):
    if request.user.role != 'admin':
        return forbidden()

    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return not_found()

    if request.method == 'DELETE':
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = course_serializer(course, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _is_assigned_trainer(user, course):
    return course.trainers.filter(id=user.id).exists()


# ---------------------------------------------------------------------------
# Videos & study material
# ---------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def videos_collection(request):
    user = request.user

    if request.method == 'GET':
        videos = Video.objects.all()
        if user.role == 'trainer':
            videos = videos.filter(course__trainers=user)
        elif user.role == 'student':
            videos = videos.filter(course__enrollments__student=user)
        course_id = request.query_params.get('course')
        if course_id:
            videos = videos.filter(course_id=course_id)
        return Response(video_serializer(videos.distinct(), many=True, context={'request': request}).data)

    if user.role not in ('admin', 'trainer'):
        return forbidden()

    try:
        course = Course.objects.get(id=request.data.get('course'))
    except Course.DoesNotExist:
        return Response({'course': 'Invalid course.'}, status=status.HTTP_400_BAD_REQUEST)

    if user.role == 'trainer' and not _is_assigned_trainer(user, course):
        return forbidden('You are not assigned to this course.')

    serializer = video_serializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def video_detail(request, id):
    user = request.user
    try:
        video = Video.objects.get(id=id)
    except Video.DoesNotExist:
        return not_found()

    if user.role == 'admin' or (user.role == 'trainer' and _is_assigned_trainer(user, video.course)):
        video.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return forbidden()


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def materials_collection(request):
    user = request.user

    if request.method == 'GET':
        materials = StudyMaterial.objects.all()
        if user.role == 'trainer':
            materials = materials.filter(course__trainers=user)
        elif user.role == 'student':
            materials = materials.filter(course__enrollments__student=user)
        course_id = request.query_params.get('course')
        if course_id:
            materials = materials.filter(course_id=course_id)
        return Response(study_material_serializer(materials.distinct(), many=True, context={'request': request}).data)

    if user.role not in ('admin', 'trainer'):
        return forbidden()

    try:
        course = Course.objects.get(id=request.data.get('course'))
    except Course.DoesNotExist:
        return Response({'course': 'Invalid course.'}, status=status.HTTP_400_BAD_REQUEST)

    if user.role == 'trainer' and not _is_assigned_trainer(user, course):
        return forbidden('You are not assigned to this course.')

    serializer = study_material_serializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def material_detail(request, id):
    user = request.user
    try:
        material = StudyMaterial.objects.get(id=id)
    except StudyMaterial.DoesNotExist:
        return not_found()

    if user.role == 'admin' or (user.role == 'trainer' and _is_assigned_trainer(user, material.course)):
        material.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return forbidden()


# ---------------------------------------------------------------------------
# Enrollments
# ---------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def enrollments_collection(request):
    user = request.user

    if request.method == 'GET':
        enrollments = Enrollment.objects.select_related('student', 'course')
        if user.role == 'student':
            enrollments = enrollments.filter(student=user)
        elif user.role == 'trainer':
            enrollments = enrollments.filter(course__trainers=user)
        elif user.role != 'admin':
            enrollments = enrollments.none()
        course_id = request.query_params.get('course')
        if course_id:
            enrollments = enrollments.filter(course_id=course_id)
        return Response(enrollment_serializer(enrollments, many=True, context={'request': request}).data)

    if user.role != 'admin':
        return forbidden()

    try:
        student = AppUser.objects.get(id=request.data.get('student'))
    except AppUser.DoesNotExist:
        return Response({'student': 'Invalid student.'}, status=status.HTTP_400_BAD_REQUEST)
    if student.role != 'student':
        return Response({'student': 'Selected user is not a student.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = enrollment_serializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def enrollment_detail(request, id):
    user = request.user
    try:
        enrollment = Enrollment.objects.get(id=id)
    except Enrollment.DoesNotExist:
        return not_found()

    if user.role == 'admin' or (user.role == 'trainer' and _is_assigned_trainer(user, enrollment.course)):
        serializer = enrollment_serializer(enrollment, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return forbidden()


# ---------------------------------------------------------------------------
# Attendance
# ---------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def attendance_collection(request):
    user = request.user

    if request.method == 'GET':
        records = Attendance.objects.select_related('student', 'course')
        if user.role == 'student':
            records = records.filter(student=user)
        elif user.role == 'trainer':
            records = records.filter(course__trainers=user)
        elif user.role != 'admin':
            records = records.none()
        course_id = request.query_params.get('course')
        if course_id:
            records = records.filter(course_id=course_id)
        return Response(attendance_serializer(records, many=True, context={'request': request}).data)

    if user.role not in ('admin', 'trainer'):
        return forbidden()

    try:
        course = Course.objects.get(id=request.data.get('course'))
    except Course.DoesNotExist:
        return Response({'course': 'Invalid course.'}, status=status.HTTP_400_BAD_REQUEST)
    if user.role == 'trainer' and not _is_assigned_trainer(user, course):
        return forbidden('You are not assigned to this course.')

    serializer = attendance_serializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(marked_by=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def attendance_detail(request, id):
    user = request.user
    try:
        record = Attendance.objects.get(id=id)
    except Attendance.DoesNotExist:
        return not_found()

    if user.role == 'admin' or (user.role == 'trainer' and _is_assigned_trainer(user, record.course)):
        serializer = attendance_serializer(record, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return forbidden()


# ---------------------------------------------------------------------------
# Feedback
# ---------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def feedback_collection(request):
    user = request.user

    if request.method == 'GET':
        items = Feedback.objects.select_related('student', 'course')
        if user.role == 'student':
            items = items.filter(student=user)
        elif user.role == 'trainer':
            items = items.filter(course__trainers=user)
        elif user.role != 'admin':
            items = items.none()
        return Response(feedback_serializer(items, many=True, context={'request': request}).data)

    if user.role != 'student':
        return forbidden('Only students can submit feedback.')

    try:
        course = Course.objects.get(id=request.data.get('course'))
    except Course.DoesNotExist:
        return Response({'course': 'Invalid course.'}, status=status.HTTP_400_BAD_REQUEST)
    if not Enrollment.objects.filter(student=user, course=course).exists():
        return forbidden('You are not enrolled in this course.')

    serializer = feedback_serializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(student=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def feedback_detail(request, id):
    user = request.user
    try:
        item = Feedback.objects.get(id=id)
    except Feedback.DoesNotExist:
        return not_found()

    if user.role == 'trainer':
        if not _is_assigned_trainer(user, item.course):
            return forbidden()
        if set(request.data.keys()) - {'trainer_response'}:
            return forbidden('Trainers may only set the response.')
    elif user.role != 'admin' and item.student_id != user.id:
        return forbidden()

    serializer = feedback_serializer(item, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------------------------------------------------------
# Admissions
# ---------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admissions_collection(request):
    user = request.user

    if request.method == 'GET':
        admissions = Admission.objects.select_related('course', 'created_by', 'assigned_bde')
        if user.role == 'lead':
            admissions = admissions.filter(created_by=user)
        elif user.role == 'bde':
            admissions = admissions.filter(assigned_bde=user)
        elif user.role != 'admin':
            admissions = admissions.none()
        return Response(admission_serializer(admissions, many=True, context={'request': request}).data)

    if user.role != 'lead':
        return forbidden('Only the admissions Lead role can submit admissions.')

    serializer = admission_serializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(created_by=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def admission_detail(request, id):
    if request.user.role != 'admin':
        return forbidden()

    try:
        admission = Admission.objects.get(id=id)
    except Admission.DoesNotExist:
        return not_found()

    if request.method == 'DELETE':
        admission.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = admission_serializer(admission, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def assign_bde(request, id):
    if request.user.role != 'admin':
        return forbidden()

    try:
        admission = Admission.objects.get(id=id)
    except Admission.DoesNotExist:
        return not_found()

    try:
        bde = AppUser.objects.get(id=request.data.get('assigned_bde'), role='bde')
    except AppUser.DoesNotExist:
        return Response({'assigned_bde': 'Invalid BDE user.'}, status=status.HTTP_400_BAD_REQUEST)

    admission.assigned_bde = bde
    admission.save(update_fields=['assigned_bde'])
    return Response(admission_serializer(admission, context={'request': request}).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_admission_status(request, id):
    user = request.user
    try:
        admission = Admission.objects.get(id=id)
    except Admission.DoesNotExist:
        return not_found()

    if user.role not in ('admin', 'bde'):
        return forbidden()
    if user.role == 'bde' and admission.assigned_bde_id != user.id:
        return forbidden('This admission is not assigned to you.')

    lead_status = request.data.get('lead_status')
    valid_statuses = {choice for choice, _ in Admission._meta.get_field('lead_status').choices}
    if lead_status not in valid_statuses:
        return Response({'lead_status': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

    admission.lead_status = lead_status
    if 'notes' in request.data:
        admission.notes = request.data.get('notes', '')
    admission.save(update_fields=['lead_status', 'notes', 'updated_at'])
    return Response(admission_serializer(admission, context={'request': request}).data)
