import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { DashboardStats, Store, UserRole } from '../types';
import ShowcaseArt from './common/ShowcaseArt';

const formatRole = (role?: UserRole) =>
  role
    ? role
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : '';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ownerStores, setOwnerStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.role === UserRole.ADMIN) {
          const dashboardStats = await apiService.getDashboardStats();
          setStats(dashboardStats);
        }

        if (user?.role === UserRole.STORE_OWNER) {
          const myStores = await apiService.getMyStores();
          setOwnerStores(myStores);
        }
      } catch (err: any) {
        if (user?.role === UserRole.ADMIN || user?.role === UserRole.STORE_OWNER) {
          setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <section className="surface-card status-card">
        <h2 className="page-title" style={{ fontSize: '2rem' }}>Loading your dashboard...</h2>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="surface-card hero-panel">
        <div className="hero-panel__content">
          <div className="eyebrow">Role-aware workspace</div>
          <h1 className="page-title">Welcome back, {user?.name}.</h1>
          <p className="page-subtitle">
            You are signed in as <strong>{formatRole(user?.role)}</strong>. Everything you need is gathered in one colorful control center.
          </p>
          <div className="hero-badges">
            <span className="info-pill">Live ratings workflow</span>
            <span className="info-pill">Sorted listings</span>
            <span className="info-pill">Secure account controls</span>
          </div>
        </div>

        <div className="hero-panel__media">
          <div className="showcase-frame">
            <ShowcaseArt />
          </div>
        </div>
      </section>

      {error && <div className="alert alert--error">{error}</div>}

      {user?.role === UserRole.ADMIN && stats && (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-card__icon stat-card__icon--coral">U</div>
              <p className="stat-card__label">Total Users</p>
              <p className="stat-card__value">{stats.totalUsers}</p>
            </article>
            <article className="stat-card">
              <div className="stat-card__icon stat-card__icon--teal">S</div>
              <p className="stat-card__label">Total Stores</p>
              <p className="stat-card__value">{stats.totalStores}</p>
            </article>
            <article className="stat-card">
              <div className="stat-card__icon stat-card__icon--sky">R</div>
              <p className="stat-card__label">Total Ratings</p>
              <p className="stat-card__value">{stats.totalRatings}</p>
            </article>
          </section>

          <section className="card-grid">
            <Link to="/admin/users" className="action-card">
              <div className="eyebrow">People management</div>
              <h3 className="action-card__title">Manage users and roles</h3>
              <p className="action-card__copy">
                Add admins, normal users, and store owners while keeping filters and user detail views close at hand.
              </p>
              <span className="action-card__link">Open Users</span>
            </Link>

            <Link to="/admin/stores" className="action-card">
              <div className="eyebrow">Store operations</div>
              <h3 className="action-card__title">Create and assign stores</h3>
              <p className="action-card__copy">
                Launch store profiles, assign owners, and review average ratings from one view.
              </p>
              <span className="action-card__link">Open Stores</span>
            </Link>
          </section>
        </>
      )}

      {user?.role === UserRole.NORMAL_USER && (
        <section className="card-grid">
          <Link to="/stores" className="action-card">
            <div className="eyebrow">Explore</div>
            <h3 className="action-card__title">Browse all stores</h3>
            <p className="action-card__copy">
              Search by name or address, compare overall ratings, and quickly submit your own score.
            </p>
            <span className="action-card__link">Start browsing</span>
          </Link>

          <Link to="/my-ratings" className="action-card">
            <div className="eyebrow">Your history</div>
            <h3 className="action-card__title">Review your ratings</h3>
            <p className="action-card__copy">
              Sort your past ratings, revisit stores, and keep your personal feedback tidy.
            </p>
            <span className="action-card__link">Open my ratings</span>
          </Link>
        </section>
      )}

      {user?.role === UserRole.STORE_OWNER && (
        <>
          <div className="page-header">
            <div className="page-header__text">
              <div className="eyebrow">Owner snapshot</div>
              <h2 className="page-title" style={{ fontSize: '2.2rem' }}>Your store performance at a glance</h2>
              <p>See average rating trends and the latest people leaving feedback on your storefronts.</p>
            </div>
            <Link to="/my-stores" className="button-secondary">
              Open full store view
            </Link>
          </div>

          {ownerStores.length > 0 ? (
            <section className="record-grid">
              {ownerStores.map((store) => (
                <article key={store.id} className="surface-card store-card">
                  <div className="store-card__header">
                    <div>
                      <div className="eyebrow">Assigned store</div>
                      <h3 className="action-card__title">{store.name}</h3>
                      <p className="muted-copy">{store.address}</p>
                    </div>
                    <span className="badge badge--teal">Owner View</span>
                  </div>

                  <div className="summary-grid">
                    <div className="metric-card">
                      <p className="metric-card__label">Average Rating</p>
                      <p className="metric-card__value">
                        {typeof store.averageRating === 'number' && store.averageRating > 0
                          ? `${store.averageRating.toFixed(1)}/5`
                          : 'No ratings'}
                      </p>
                    </div>
                    <div className="metric-card">
                      <p className="metric-card__label">Total Ratings</p>
                      <p className="metric-card__value">{store.ratingUsers?.length ?? 0}</p>
                    </div>
                  </div>

                  <div className="list-stack">
                    <p className="field-label">Recent customer feedback</p>
                    {store.ratingUsers && store.ratingUsers.length > 0 ? (
                      store.ratingUsers.slice(0, 4).map((ratingUser, index) => (
                        <div key={index} className="record-card">
                          <div className="record-card__body">
                            <p className="record-card__title">{ratingUser.user.name}</p>
                            <div className="record-card__meta">
                              <span>{ratingUser.user.email}</span>
                              <span>{new Date(ratingUser.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className="badge badge--sun">Rating {ratingUser.rating}/5</span>
                        </div>
                      ))
                    ) : (
                      <div className="record-card">
                        <div className="record-card__body">
                          <p className="record-card__copy">No users have rated this store yet.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <section className="surface-card empty-card">
              <p className="helper-copy">
                You do not have any stores yet. Ask an administrator to assign one to your account.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
