import React from 'react';

function EditProfileForm({ loading, editing, saving, user, form, onChange, onEditToggle, onCancel, onSave }) {
  if (loading) {
    return (
      <div className="profile-form profile-form--loading">
        <div className="profile-skeleton profile-skeleton--line" />
        <div className="profile-skeleton profile-skeleton--line" />
        <div className="profile-skeleton profile-skeleton--line" />
      </div>
    );
  }

  return (
    <div className="profile-form">
      <div className="profile-form__header">
        <div>
          <p className="profile-form__eyebrow">Profile details</p>
          <h3>{editing ? 'Edit your details' : 'Read only view'}</h3>
        </div>
        {!editing ? (
          <button className="profile-form__link-btn" onClick={onEditToggle}>Edit</button>
        ) : null}
      </div>

      <div className="profile-field">
        <label>Name</label>
        {editing ? (
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter your name"
          />
        ) : (
          <p>{user.name || '-'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Email</label>
        {editing ? (
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="Enter your email"
          />
        ) : (
          <p>{user.email || '-'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Password</label>
        {editing ? (
          <input
            type="password"
            value={form.password}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        ) : (
          <p>••••••••</p>
        )}
      </div>

      <div className="profile-field">
        <label>Wallet Balance</label>
        <p className="profile-money">₹{Number(user.wallet || 0).toLocaleString('en-IN')}</p>
      </div>

      <div className="profile-form__actions">
        {!editing ? (
          <button className="profile-btn profile-btn--primary profile-btn--wide" onClick={onEditToggle}>
            Edit Profile
          </button>
        ) : (
          <>
            <button className="profile-btn profile-btn--ghost profile-btn--wide" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button className="profile-btn profile-btn--primary profile-btn--wide" onClick={onSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(EditProfileForm);
