import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ShowcaseArt from '../common/ShowcaseArt';

const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

const ChangePasswordForm: React.FC = () => {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!passwordPattern.test(formData.newPassword)) {
      return 'New password must be 8-16 characters and include one uppercase letter and one special character.';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return 'New password and confirm password must match.';
    }

    if (formData.currentPassword === formData.newPassword) {
      return 'New password must be different from the current password.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess('Password updated successfully.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="surface-card hero-panel">
        <div className="hero-panel__content">
          <div className="eyebrow">Secure settings</div>
          <h1 className="page-title">Refresh your password without leaving the experience behind.</h1>
          <p className="page-subtitle">
            Keep your account safe with the same strong password rules used throughout the platform.
          </p>
          <div className="hero-badges">
            <span className="info-pill">8 to 16 characters</span>
            <span className="info-pill">One uppercase letter</span>
            <span className="info-pill">One special character</span>
          </div>
        </div>

        <div className="hero-panel__media">
          <div className="showcase-frame">
            <ShowcaseArt />
          </div>
        </div>
      </section>

      <section className="surface-card form-panel">
        <div className="page-header">
          <div className="page-header__text">
            <div className="eyebrow">Update credentials</div>
            <h2 className="page-title" style={{ fontSize: '2.1rem' }}>Change Password</h2>
            <p>Confirm your current password first, then set a new one.</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field-stack">
              <label htmlFor="currentPassword" className="field-label">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="field-stack">
              <label htmlFor="newPassword" className="field-label">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-stack">
            <label htmlFor="confirmPassword" className="field-label">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <p className="helper-copy">
              Match the new password exactly and keep it different from the current one.
            </p>
          </div>

          {error && <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          <div className="button-row">
            <button type="submit" disabled={isLoading} className="button-primary">
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="button-secondary">
              Back to Dashboard
            </button>
            <Link to="/dashboard" className="button-ghost">
              Return Home
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ChangePasswordForm;
