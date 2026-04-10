import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import { User, UserRole } from '../../types';
import ShowcaseArt from '../common/ShowcaseArt';

const formatRole = (role: UserRole) =>
  role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const AdminUserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError('Invalid user id.');
        setLoading(false);
        return;
      }

      try {
        const userDetails = await apiService.getUser(Number(id));
        setUser(userDetails);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [id]);

  if (loading) {
    return (
      <section className="surface-card status-card">
        <h1 className="page-title" style={{ fontSize: '2rem' }}>
          Loading user details...
        </h1>
      </section>
    );
  }

  if (error) {
    return (
      <div className="page-stack">
        <div className="alert alert--error">{error}</div>
        <div className="button-row">
          <Link to="/admin/users" className="button-secondary">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-stack">
        <section className="surface-card empty-card">
          <p className="helper-copy">User not found.</p>
        </section>
        <div className="button-row">
          <Link to="/admin/users" className="button-secondary">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="surface-card hero-panel">
        <div className="hero-panel__content">
          <div className="eyebrow">Detailed profile</div>
          <h1 className="page-title">{user.name}</h1>
          <p className="page-subtitle">
            Review account details, role metadata, and owner performance from a single profile view.
          </p>
          <div className="hero-badges">
            <span className="info-pill">{formatRole(user.role)}</span>
            <span className="info-pill">{user.email}</span>
            <span className="info-pill">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="hero-panel__media">
          <div className="showcase-frame">
            <ShowcaseArt />
          </div>
        </div>
      </section>

      <div className="button-row">
        <Link to="/admin/users" className="button-secondary">
          Back to Users
        </Link>
      </div>

      <section className="split-panel">
        <article className="surface-card details-card">
          <div className="eyebrow">Profile</div>
          <h2 className="action-card__title">Core details</h2>
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{user.address}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{formatRole(user.role)}</dd>
            </div>
          </dl>
        </article>

        <article className="surface-card details-card">
          <div className="eyebrow">Metadata</div>
          <h2 className="action-card__title">Account timeline</h2>
          <dl>
            <div>
              <dt>Created At</dt>
              <dd>{new Date(user.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt>Updated At</dt>
              <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </article>
      </section>

      {user.role === UserRole.STORE_OWNER && (
        <section className="surface-card">
          <div className="page-header">
            <div className="page-header__text">
              <div className="eyebrow">Owner summary</div>
              <h2 className="page-title" style={{ fontSize: '2rem' }}>
                Store owner performance
              </h2>
              <p>These metrics summarize the storefronts and ratings attached to this owner account.</p>
            </div>
          </div>

          <div className="summary-grid">
            <div className="metric-card">
              <p className="metric-card__label">Average Rating</p>
              <p className="metric-card__value">{(user.averageRating ?? 0).toFixed(1)}/5</p>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Total Stores</p>
              <p className="metric-card__value">{user.totalStores ?? 0}</p>
            </div>
            <div className="metric-card">
              <p className="metric-card__label">Total Ratings</p>
              <p className="metric-card__value">{user.totalRatings ?? 0}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminUserDetails;
