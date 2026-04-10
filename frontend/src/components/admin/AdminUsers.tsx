import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { FilterUsersDto, User, UserRole, UserSortField } from '../../types';
import ShowcaseArt from '../common/ShowcaseArt';

const formatRole = (role: UserRole) =>
  role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatSortField = (sortBy: UserSortField) => {
  const labels: Record<UserSortField, string> = {
    name: 'Name',
    email: 'Email',
    address: 'Address',
    role: 'Role',
    createdAt: 'Created Date',
  };

  return labels[sortBy];
};

const getRoleBadgeClass = (role: UserRole) => {
  if (role === UserRole.ADMIN) {
    return 'badge--rose';
  }

  if (role === UserRole.STORE_OWNER) {
    return 'badge--teal';
  }

  return 'badge--sky';
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState<FilterUsersDto>({
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: UserRole.NORMAL_USER,
  });

  useEffect(() => {
    void fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userList = await apiService.getUsers(filters);
      setUsers(userList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await apiService.createUser(formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: UserRole.NORMAL_USER,
      });
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        await fetchUsers();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <section className="surface-card status-card">
        <h1 className="page-title" style={{ fontSize: '2rem' }}>
          Loading users...
        </h1>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="surface-card hero-panel">
        <div className="hero-panel__content">
          <div className="eyebrow">Admin console</div>
          <h1 className="page-title">User management with a cleaner, friendlier flow.</h1>
          <p className="page-subtitle">
            Filter the directory, create new accounts, and open detailed profiles from one bright, polished workspace.
          </p>
          <div className="hero-badges">
            <span className="info-pill">{users.length} matching users</span>
            <span className="info-pill">Sorted by {formatSortField(filters.sortBy ?? 'name')}</span>
            <span className="info-pill">Role-aware admin actions</span>
          </div>
        </div>

        <div className="hero-panel__media">
          <div className="showcase-frame">
            <ShowcaseArt />
          </div>
        </div>
      </section>

      {error && <div className="alert alert--error">{error}</div>}

      <section className="surface-card toolbar-panel">
        <div className="page-header">
          <div className="page-header__text">
            <div className="eyebrow">Filter and sort</div>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>
              Explore the user directory
            </h2>
            <p>Search by name, email, address, or role, then switch the ordering to review the list your way.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className={showCreateForm ? 'button-secondary' : 'button-primary'}
          >
            {showCreateForm ? 'Hide Create Form' : 'Create New User'}
          </button>
        </div>

        <div className="control-grid">
          <div className="field-stack">
            <label htmlFor="filter-name" className="field-label">
              Name
            </label>
            <input
              id="filter-name"
              type="text"
              name="name"
              placeholder="Filter by name"
              value={filters.name ?? ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="filter-email" className="field-label">
              Email
            </label>
            <input
              id="filter-email"
              type="email"
              name="email"
              placeholder="Filter by email"
              value={filters.email ?? ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="filter-address" className="field-label">
              Address
            </label>
            <input
              id="filter-address"
              type="text"
              name="address"
              placeholder="Filter by address"
              value={filters.address ?? ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="filter-role" className="field-label">
              Role
            </label>
            <select id="filter-role" name="role" onChange={handleFilterChange} value={filters.role ?? ''}>
              <option value="">All Roles</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.NORMAL_USER}>Normal User</option>
              <option value={UserRole.STORE_OWNER}>Store Owner</option>
            </select>
          </div>

          <div className="field-stack">
            <label htmlFor="sort-by" className="field-label">
              Sort field
            </label>
            <select id="sort-by" name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
              <option value={'name' as UserSortField}>Name</option>
              <option value={'email' as UserSortField}>Email</option>
              <option value={'address' as UserSortField}>Address</option>
              <option value={'role' as UserSortField}>Role</option>
              <option value={'createdAt' as UserSortField}>Created Date</option>
            </select>
          </div>

          <div className="field-stack">
            <label htmlFor="sort-order" className="field-label">
              Sort order
            </label>
            <select id="sort-order" name="sortOrder" onChange={handleFilterChange} value={filters.sortOrder}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </section>

      {showCreateForm && (
        <section className="surface-card form-panel">
          <div className="page-header">
            <div className="page-header__text">
              <div className="eyebrow">Create account</div>
              <h2 className="page-title" style={{ fontSize: '2rem' }}>
                Add a new user
              </h2>
              <p>Fill out the required details and assign the correct role during creation.</p>
            </div>
          </div>

          <form onSubmit={handleCreateUser} className="auth-form">
            <div className="form-grid">
              <div className="field-stack">
                <label htmlFor="new-user-name" className="field-label">
                  Name
                </label>
                <input
                  id="new-user-name"
                  type="text"
                  name="name"
                  placeholder="20 to 60 characters"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={20}
                  maxLength={60}
                />
              </div>

              <div className="field-stack">
                <label htmlFor="new-user-email" className="field-label">
                  Email
                </label>
                <input
                  id="new-user-email"
                  type="email"
                  name="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="field-stack">
                <label htmlFor="new-user-password" className="field-label">
                  Password
                </label>
                <input
                  id="new-user-password"
                  type="password"
                  name="password"
                  placeholder="8-16 chars, uppercase, special"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  maxLength={16}
                  pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$"
                  title="Password must be 8-16 characters, include one uppercase letter, and one special character."
                />
              </div>

              <div className="field-stack">
                <label htmlFor="new-user-role" className="field-label">
                  Role
                </label>
                <select
                  id="new-user-role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  <option value={UserRole.NORMAL_USER}>Normal User</option>
                  <option value={UserRole.STORE_OWNER}>Store Owner</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
            </div>

            <div className="field-stack">
              <label htmlFor="new-user-address" className="field-label">
                Address
              </label>
              <textarea
                id="new-user-address"
                name="address"
                placeholder="Maximum 400 characters"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={4}
                maxLength={400}
                required
              />
            </div>

            <div className="button-row">
              <button type="submit" className="button-primary">
                Create User
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="button-secondary">
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="surface-card list-panel">
        <div className="page-header">
          <div className="page-header__text">
            <div className="eyebrow">Results</div>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>
              Matching users
            </h2>
            <p>Open any user to see full details, and remove accounts directly from this list when needed.</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-card">
            <p className="helper-copy">No users matched the current filters.</p>
          </div>
        ) : (
          <div className="list-stack">
            {users.map((user) => (
              <article key={user.id} className="record-card">
                <div className="record-card__body">
                  <div className="record-card__meta">
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>{formatRole(user.role)}</span>
                    <span>{user.email}</span>
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="record-card__title">{user.name}</h3>
                  <p className="record-card__copy">{user.address}</p>
                </div>

                <div className="record-actions">
                  <Link to={`/admin/users/${user.id}`} className="button-ghost button-small">
                    View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDeleteUser(user.id)}
                    className="button-danger button-small"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUsers;
