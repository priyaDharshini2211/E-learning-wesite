import client from "./client";

export const listAdmissions = () => client.get("/admissions/").then((r) => r.data);
export const createAdmission = (payload) => client.post("/admissions/", payload).then((r) => r.data);
export const assignBDE = (id, assigned_bde) =>
  client.patch(`/admissions/${id}/assign/`, { assigned_bde }).then((r) => r.data);
export const updateLeadStatus = (id, payload) =>
  client.patch(`/admissions/${id}/update-status/`, payload).then((r) => r.data);
