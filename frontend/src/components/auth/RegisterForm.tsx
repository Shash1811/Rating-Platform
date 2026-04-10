import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RegisterDto } from '../../types';
import ShowcaseArt from '../common/ShowcaseArt';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterDto>({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      return 'Name must be between 20 and 60 characters';
    }
    if (formData.address.length > 400) {
      return 'Address must be less than 400 characters';
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      return 'Password must be between 8 and 16 characters';
    }
    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      return 'Password must contain at least one uppercase letter and one special character';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="surface-card auth-visual">
        <div className="eyebrow">Fresh start</div>
        <h1 className="auth-visual__headline">Build your account and join a colorful store community.</h1>
        <p className="auth-visual__copy">
          Create your profile once, then explore stores, submit ratings, and manage your access through one beautiful interface.
        </p>
        <ul className="auth-list">
          <li>Secure password rules</li>
          <li>Store search and ratings</li>
          <li>Role-aware dashboards</li>
          <li>Clean account settings</li>
        </ul>
        <div className="showcase-frame">
          <ShowcaseArt />
        </div>
      </section>

      <section className="surface-card auth-card">
        <div className="auth-card__header">
          <div className="eyebrow">Create profile</div>
          <h2>Open your account</h2>
          <p>Complete the form below and we will set up your access right away.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-stack">
            <label htmlFor="name" className="field-label">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Use 20 to 60 characters"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="email" className="field-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="8-16 chars, uppercase, special character"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="address" className="field-label">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={4}
              placeholder="Tell us where you are based"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <div className="button-row">
            <button type="submit" disabled={isLoading} className="button-primary">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in here</Link>
        </p>
      </section>
    </div>
  );
};

export default RegisterForm;
