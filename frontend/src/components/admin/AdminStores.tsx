import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import {
  CreateStoreDto,
  FilterStoresDto,
  Store,
  StoreSortField,
  User,
  UserRole,
} from '../../types';
import ShowcaseArt from '../common/ShowcaseArt';

const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [storeOwners, setStoreOwners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState<FilterStoresDto>({
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [formData, setFormData] = useState<CreateStoreDto>({
    name: '',
    email: '',
    address: '',
    ownerId: 0,
  });

  useEffect(() => {
    void fetchStores();
  }, [filters]);

  useEffect(() => {
    void fetchStoreOwners();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const storeList = await apiService.getStores(filters);
      setStores(storeList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreOwners = async () => {
    try {
      const owners = await apiService.getUsers({
        role: UserRole.STORE_OWNER,
        sortBy: 'name',
        sortOrder: 'asc',
      });
      setStoreOwners(owners);
      if (owners.length > 0) {
        setFormData((prev) => ({
          ...prev,
          ownerId: prev.ownerId || owners[0].id,
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch store owners');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await apiService.createStore(formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        email: '',
        address: '',
        ownerId: storeOwners[0]?.id ?? 0,
      });
      await fetchStores();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
  };

  const handleDeleteStore = async (storeId: number) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await apiService.deleteStore(storeId);
        await fetchStores();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete store');
      }
    }
  };

  if (loading) {
    return (
      <section className="surface-card status-card">
        <h1 className="page-title" style={{ fontSize: '2rem' }}>
          Loading stores...
        </h1>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="surface-card hero-panel">
        <div className="hero-panel__content">
          <div className="eyebrow">Store operations</div>
          <h1 className="page-title">Create stores, assign owners, and monitor ratings in one place.</h1>
          <p className="page-subtitle">
            This admin view keeps creation, filtering, and owner assignment together so the workflow feels smooth from start to finish.
          </p>
          <div className="hero-badges">
            <span className="info-pill">{stores.length} stores loaded</span>
            <span className="info-pill">{storeOwners.length} owners available</span>
            <span className="info-pill">Sorting and filters enabled</span>
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
              Review store listings
            </h2>
            <p>Search by name, email, or address, then sort by the detail that matters most to you.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className={showCreateForm ? 'button-secondary' : 'button-primary'}
          >
            {showCreateForm ? 'Hide Create Form' : 'Create New Store'}
          </button>
        </div>

        <div className="control-grid">
          <div className="field-stack">
            <label htmlFor="store-filter-name" className="field-label">
              Store name
            </label>
            <input
              id="store-filter-name"
              type="text"
              name="name"
              placeholder="Search by store name"
              value={filters.name ?? ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="store-filter-email" className="field-label">
              Email
            </label>
            <input
              id="store-filter-email"
              type="email"
              name="email"
              placeholder="Search by email"
              value={filters.email ?? ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="store-filter-address" className="field-label">
              Address
            </label>
            <input
              id="store-filter-address"
              type="text"
              name="address"
              placeholder="Search by address"
              value={filters.address ?? ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="store-sort-by" className="field-label">
              Sort field
            </label>
            <select id="store-sort-by" name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
              <option value={'name' as StoreSortField}>Name</option>
              <option value={'email' as StoreSortField}>Email</option>
              <option value={'address' as StoreSortField}>Address</option>
              <option value={'averageRating' as StoreSortField}>Average Rating</option>
              <option value={'createdAt' as StoreSortField}>Created Date</option>
            </select>
          </div>

          <div className="field-stack">
            <label htmlFor="store-sort-order" className="field-label">
              Sort order
            </label>
            <select
              id="store-sort-order"
              name="sortOrder"
              onChange={handleFilterChange}
              value={filters.sortOrder}
            >
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
              <div className="eyebrow">New storefront</div>
              <h2 className="page-title" style={{ fontSize: '2rem' }}>
                Create and assign a store
              </h2>
              <p>Pick a store owner during creation so the account can immediately access owner dashboards.</p>
            </div>
          </div>

          <form onSubmit={handleCreateStore} className="auth-form">
            <div className="form-grid">
              <div className="field-stack">
                <label htmlFor="new-store-name" className="field-label">
                  Store name
                </label>
                <input
                  id="new-store-name"
                  type="text"
                  name="name"
                  placeholder="Store name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={100}
                />
              </div>

              <div className="field-stack">
                <label htmlFor="new-store-email" className="field-label">
                  Store email
                </label>
                <input
                  id="new-store-email"
                  type="email"
                  name="email"
                  placeholder="store@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="field-stack">
                <label htmlFor="store-owner" className="field-label">
                  Store owner
                </label>
                <select
                  id="store-owner"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: Number(e.target.value) })}
                  required
                  disabled={storeOwners.length === 0}
                >
                  {storeOwners.length === 0 ? (
                    <option value="">No store owners available</option>
                  ) : (
                    storeOwners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="field-stack">
              <label htmlFor="new-store-address" className="field-label">
                Address
              </label>
              <textarea
                id="new-store-address"
                name="address"
                placeholder="Store address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={4}
                maxLength={400}
                required
              />
            </div>

            {storeOwners.length === 0 && (
              <p className="helper-copy">
                Create a store owner in the Users page before creating a store.
              </p>
            )}

            <div className="button-row">
              <button type="submit" disabled={storeOwners.length === 0} className="button-primary">
                Create Store
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="button-secondary">
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {stores.length === 0 ? (
        <section className="surface-card empty-card">
          <p className="helper-copy">No stores matched the current filters.</p>
        </section>
      ) : (
        <section className="store-grid">
          {stores.map((store) => (
            <article key={store.id} className="surface-card store-card">
              <div className="store-card__header">
                <div>
                  <div className="eyebrow">Store profile</div>
                  <h3 className="action-card__title">{store.name}</h3>
                  <p className="muted-copy">{store.address}</p>
                </div>
                <span className="badge badge--sun">
                  {typeof store.averageRating === 'number' && store.averageRating > 0
                    ? `${store.averageRating.toFixed(1)}/5`
                    : 'No ratings'}
                </span>
              </div>

              <div className="record-card__meta">
                <span>{store.email}</span>
                <span>Owner: {store.owner?.name ?? 'Unassigned'}</span>
              </div>

              <div className="store-card__ratings">
                <div className="mini-stat">
                  <p className="mini-stat__label">Average Rating</p>
                  <p className="mini-stat__value">
                    {typeof store.averageRating === 'number' && store.averageRating > 0
                      ? `${store.averageRating.toFixed(1)}/5`
                      : 'Awaiting ratings'}
                  </p>
                </div>
                <div className="mini-stat">
                  <p className="mini-stat__label">Assigned Owner</p>
                  <p className="mini-stat__value">{store.owner?.name ?? 'Pending assignment'}</p>
                </div>
              </div>

              <div className="record-actions">
                <button
                  type="button"
                  onClick={() => void handleDeleteStore(store.id)}
                  className="button-danger button-small"
                >
                  Delete Store
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default AdminStores;
