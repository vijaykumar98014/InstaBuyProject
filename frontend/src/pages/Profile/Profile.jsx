import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userAPI } from "../../services/api";
import { setUser } from "../../redux/userSlice";
import EditProfileForm from "./components/EditProfileForm";
import "./Profile.css";

const normalizeUser = (data = {}) => ({
  userId: data.userId ?? data.id ?? "",
  name: data.name ?? data.userName ?? data.username ?? "",
  email: data.email ?? "",
  wallet: Number(data.wallet ?? data.walletBalance ?? 0),
});

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user || {});
  const storedUserId = useMemo(
    () => reduxUser.userId || localStorage.getItem("userId") || "",
    [reduxUser.userId],
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUserData] = useState({
    userId: storedUserId,
    name: reduxUser.userName || "",
    email: reduxUser.email || "",
    wallet: Number(reduxUser.wallet || 0),
  });
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const loadProfile = useCallback(async () => {
    if (!storedUserId) {
      toast.error("Please login to view profile");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await userAPI.get(`/api/users/${storedUserId}`);
      const normalized = normalizeUser(res?.data || {});
      setUserData({ ...normalized, userId: storedUserId });
      setForm({ name: normalized.name, email: normalized.email, password: "" });

      dispatch(
        setUser({
          userId: storedUserId,
          userName: normalized.name,
          email: normalized.email,
          wallet: normalized.wallet,
        }),
      );
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to load profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate, storedUserId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFieldChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleEditToggle = useCallback(() => {
    setEditing(true);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
    });
  }, [user.email, user.name]);

  const handleCancel = useCallback(() => {
    setEditing(false);
    setForm({ name: user.name || "", email: user.email || "", password: "" });
  }, [user.email, user.name]);

  const handleSave = useCallback(async () => {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    if (!payload.name || !payload.email) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);
    try {
      const res = await userAPI.put(`/api/users/${storedUserId}`, payload);
      const updated = normalizeUser(res?.data || { ...payload });
      const nextUser = {
        userId: storedUserId,
        name: updated.name || payload.name,
        email: updated.email || payload.email,
        wallet: Number(updated.wallet || 0),
      };

      setUserData(nextUser);
      setEditing(false);
      setForm({ name: nextUser.name, email: nextUser.email, password: "" });

      dispatch(
        setUser({
          userId: storedUserId,
          userName: nextUser.name,
          email: nextUser.email,
          wallet: nextUser.wallet,
        }),
      );

      localStorage.setItem("userName", nextUser.name);
      localStorage.setItem("email", nextUser.email);

      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }, [
    dispatch,
    form.email,
    form.password,
    form.name,
    storedUserId,
  ]);

  return (
    <main className="profile-page">
      <section className="profile-shell">
        <header className="profile-hero">
          <div>
            <p className="profile-kicker">Account settings</p>
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">
              View your account details and edit your profile securely.
            </p>
          </div>

          <div className="profile-actions">
            {!editing ? (
              <button
                className="profile-btn profile-btn--primary"
                onClick={handleEditToggle}
                disabled={loading}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="profile-btn profile-btn--ghost"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="profile-btn profile-btn--primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </header>

        <div className="profile-grid">
          <section className="profile-card profile-card--summary">
            {loading ? (
              <div className="profile-loader">
                <div className="profile-skeleton profile-skeleton--avatar" />
                <div className="profile-skeleton profile-skeleton--line" />
                <div className="profile-skeleton profile-skeleton--line short" />
              </div>
            ) : (
              <>
                <div className="profile-avatar">
                  {(user.name || reduxUser.userName || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="profile-summary__meta">
                  <h2>{user.name || reduxUser.userName || "User"}</h2>
                  <p>{user.email || reduxUser.email || "No email available"}</p>
                </div>

                <div className="profile-stats">
                  <article>
                    <span>User ID</span>
                    <strong>{user.userId || "-"}</strong>
                  </article>
                  <article>
                    <span>Wallet Balance</span>
                    <strong>
                      ₹{Number(user.wallet || 0).toLocaleString("en-IN")}
                    </strong>
                  </article>
                </div>
              </>
            )}
          </section>

          <section className="profile-card profile-card--form">
            <EditProfileForm
              loading={loading}
              editing={editing}
              saving={saving}
              user={user}
              form={form}
              onChange={handleFieldChange}
              onEditToggle={handleEditToggle}
              onCancel={handleCancel}
              onSave={handleSave}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

export default React.memo(Profile);
