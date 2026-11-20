import client from "./client";

export const listCourses = () => client.get("/courses/").then((r) => r.data);
export const createCourse = (payload) => client.post("/courses/", payload).then((r) => r.data);
export const updateCourse = (id, payload) => client.patch(`/courses/${id}/`, payload).then((r) => r.data);
export const deleteCourse = (id) => client.delete(`/courses/${id}/`).then((r) => r.data);

const asFormData = (fields) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => fd.append(key, value));
  return fd;
};

export const uploadVideo = ({ course, title, file }) =>
  client
    .post("/videos/", asFormData({ course, title, file }), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const deleteVideo = (id) => client.delete(`/videos/${id}/`).then((r) => r.data);

export const uploadMaterial = ({ course, title, file }) =>
  client
    .post("/materials/", asFormData({ course, title, file }), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const deleteMaterial = (id) => client.delete(`/materials/${id}/`).then((r) => r.data);

export const listEnrollments = (params) => client.get("/enrollments/", { params }).then((r) => r.data);
export const createEnrollment = (payload) => client.post("/enrollments/", payload).then((r) => r.data);
export const updateEnrollment = (id, payload) => client.patch(`/enrollments/${id}/`, payload).then((r) => r.data);

export const listAttendance = (params) => client.get("/attendance/", { params }).then((r) => r.data);
export const markAttendance = (payload) => client.post("/attendance/", payload).then((r) => r.data);
export const updateAttendance = (id, payload) => client.patch(`/attendance/${id}/`, payload).then((r) => r.data);

export const listFeedback = (params) => client.get("/feedback/", { params }).then((r) => r.data);
export const submitFeedback = (payload) => client.post("/feedback/", payload).then((r) => r.data);
export const respondFeedback = (id, trainer_response) =>
  client.patch(`/feedback/${id}/`, { trainer_response }).then((r) => r.data);
