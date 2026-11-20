export const NAV_ITEMS = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: "bi-grid-1x2", end: true },
    { to: "/admin/users", label: "Users", icon: "bi-people" },
    { to: "/admin/courses", label: "Courses", icon: "bi-mortarboard" },
    { to: "/admin/admissions", label: "Admissions", icon: "bi-journal-text" },
  ],
  bde: [
    { to: "/bde", label: "Dashboard", icon: "bi-grid-1x2", end: true },
    { to: "/bde/leads", label: "My Leads", icon: "bi-telephone-outbound" },
  ],
  lead: [
    { to: "/lead", label: "Dashboard", icon: "bi-grid-1x2", end: true },
    { to: "/lead/new-admission", label: "New Admission", icon: "bi-person-plus" },
  ],
  trainer: [
    { to: "/trainer", label: "Dashboard", icon: "bi-grid-1x2", end: true },
    { to: "/trainer/courses", label: "My Courses", icon: "bi-mortarboard" },
    { to: "/trainer/attendance", label: "Attendance", icon: "bi-calendar-check" },
    { to: "/trainer/materials", label: "Materials", icon: "bi-folder2-open" },
    { to: "/trainer/feedback", label: "Feedback", icon: "bi-chat-square-heart" },
  ],
  student: [
    { to: "/student", label: "Dashboard", icon: "bi-grid-1x2", end: true },
    { to: "/student/courses", label: "My Courses", icon: "bi-mortarboard" },
    { to: "/student/attendance", label: "Attendance", icon: "bi-calendar-check" },
    { to: "/student/materials", label: "Materials", icon: "bi-folder2-open" },
  ],
};

export const ROLE_LABEL = {
  admin: "Administrator",
  bde: "Business Development",
  lead: "Admissions Lead",
  trainer: "Course Trainer",
  student: "Student",
};
