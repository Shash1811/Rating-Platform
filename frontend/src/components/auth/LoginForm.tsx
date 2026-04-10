import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginDto } from '../../types';
import ShowcaseArt from '../common/ShowcaseArt';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="surface-card auth-visual">
        <div className="eyebrow">Role-based access</div>
        <h1 className="auth-visual__headline">Step into a brighter dashboard for stores, shoppers, and owners.</h1>
        <p className="auth-visual__copy">
          Track ratings, manage users, and move through every workflow from one polished login system.
        </p>
        <ul className="auth-list">
          <li>Administrator controls</li>
          <li>Store owner insights</li>
          <li>Customer ratings flow</li>
          <li>Fast password updates</li>
        </ul>
        <div className="showcase-frame">
          <ShowcaseArt />
        </div>
      </section>

      <section className="surface-card auth-card">
        <div className="auth-card__header">
          <div className="eyebrow">Welcome back</div>
          <h2>Sign in to your account</h2>
          <p>Pick up right where you left off and open your role-specific workspace.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <div className="button-row">
            <button type="submit" disabled={isLoading} className="button-primary">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
};

export default LoginForm;
