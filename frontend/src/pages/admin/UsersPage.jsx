import { useEffect, useState } from "react";
import { createUser, deleteUser, listUsers, updateUser } from "../../api/usersApi";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import RoleBadge from "../../components/RoleBadge";

const ROLES = ["admin", "bde", "lead", "trainer", "student"];
const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  role: "student",
  degree: "",
  mobile: "",
  first_name: "",
  last_name: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = () => listUsers().then(setUsers);

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createUser(form);
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Could not create user.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = (user) => updateUser(user.id, { is_active: !user.is_active }).then(refresh);
  const remove = (user) => {
    if (confirm(`Delete user "${user.username}"?`)) deleteUser(user.id).then(refresh);
  };

  if (!users) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Admin is the only role that can create accounts.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + New User
        </button>
      </div>

      <div className="card p-3">
        <DataTable
          columns={[
            { key: "username", header: "Username" },
            { key: "name", header: "Name", render: (r) => `${r.first_name} ${r.last_name}`.trim() || "—" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role", render: (r) => <RoleBadge role={r.role} /> },
            { key: "mobile", header: "Mobile" },
            {
              key: "status",
              header: "Status",
              render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} />,
            },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleActive(r)}>
                    {r.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={users}
          emptyLabel="No users yet"
        />
      </div>

      {showForm && (
        <Modal
          title="Create user"
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving…" : "Create"}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-6">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label">First name</label>
              <input
                className="form-control"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Last name</label>
              <input
                className="form-control"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Degree</label>
              <input
                className="form-control"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Mobile</label>
              <input
                className="form-control"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </div>
            {error && (
              <div className="col-12">
                <div className="alert alert-danger py-2 small mb-0">{error}</div>
              </div>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}
