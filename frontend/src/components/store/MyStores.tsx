import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { OwnerRatingSortField, OwnerStoreSortField, SortOrder, Store } from '../../types';
import ShowcaseArt from '../common/ShowcaseArt';

const MyStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storeSortBy, setStoreSortBy] = useState<OwnerStoreSortField>('name');
  const [storeSortOrder, setStoreSortOrder] = useState<SortOrder>('asc');
  const [ratingSortBy, setRatingSortBy] = useState<OwnerRatingSortField>('createdAt');
  const [ratingSortOrder, setRatingSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    void fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      const myStores = await apiService.getMyStores();
      setStores(myStores);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch your stores');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="surface-card status-card">
        <h1 className="page-title" style={{ fontSize: '2rem' }}>
          Loading your stores...
        </h1>
      </section>
    );
  }

  const sortedStores = [...stores].sort((a, b) => {
    let comparison = 0;

    if (storeSortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (storeSortBy === 'averageRating') {
      comparison = (a.averageRating ?? 0) - (b.averageRating ?? 0);
    } else {
      comparison = (a.ratingUsers?.length ?? 0) - (b.ratingUsers?.length ?? 0);
    }

    return storeSortOrder === 'asc' ? comparison : -comparison;
  });

  const sortRatingUsers = (store: Store) => {
    const ratingUsers = [...(store.ratingUsers ?? [])];

    ratingUsers.sort((a, b) => {
      let comparison = 0;

      if (ratingSortBy === 'name') {
        comparison = a.user.name.localeCompare(b.user.name);
      } else if (ratingSortBy === 'email') {
        comparison = a.user.email.localeCompare(b.user.email);
      } else if (ratingSortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return ratingSortOrder === 'asc' ? comparison : -comparison;
    });

    return ratingUsers;
  };

  return (
    <div className="page-stack">
      <section className="surface-card hero-panel">
        <div className="hero-panel__content">
          <div className="eyebrow">Owner workspace</div>
          <h1 className="page-title">A brighter command center for your stores and customer feedback.</h1>
          <p className="page-subtitle">
            Review average ratings, count customer responses, and sort both your stores and incoming feedback from one owner-friendly screen.
          </p>
          <div className="hero-badges">
            <span className="info-pill">{stores.length} assigned stores</span>
            <span className="info-pill">
              {stores.reduce((total, store) => total + (store.ratingUsers?.length ?? 0), 0)} total customer ratings
            </span>
            <span className="info-pill">Live owner insights</span>
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
            <div className="eyebrow">Sorting controls</div>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>
              Reorder stores and customer ratings
            </h2>
            <p>Change how your store cards are ordered and how customer feedback appears inside each store.</p>
          </div>
        </div>

        <div className="control-grid">
          <div className="field-stack">
            <label htmlFor="owner-store-sort-by" className="field-label">
              Store sort field
            </label>
            <select
              id="owner-store-sort-by"
              value={storeSortBy}
              onChange={(e) => setStoreSortBy(e.target.value as OwnerStoreSortField)}
            >
              <option value="name">Name</option>
              <option value="averageRating">Average Rating</option>
              <option value="totalRatings">Total Ratings</option>
            </select>
          </div>

          <div className="field-stack">
            <label htmlFor="owner-store-sort-order" className="field-label">
              Store sort order
            </label>
            <select
              id="owner-store-sort-order"
              value={storeSortOrder}
              onChange={(e) => setStoreSortOrder(e.target.value as SortOrder)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="field-stack">
            <label htmlFor="owner-rating-sort-by" className="field-label">
              Rating sort field
            </label>
            <select
              id="owner-rating-sort-by"
              value={ratingSortBy}
              onChange={(e) => setRatingSortBy(e.target.value as OwnerRatingSortField)}
            >
              <option value="createdAt">Date</option>
              <option value="name">Customer Name</option>
              <option value="email">Customer Email</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="field-stack">
            <label htmlFor="owner-rating-sort-order" className="field-label">
              Rating sort order
            </label>
            <select
              id="owner-rating-sort-order"
              value={ratingSortOrder}
              onChange={(e) => setRatingSortOrder(e.target.value as SortOrder)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </section>

      {stores.length === 0 ? (
        <section className="surface-card empty-card">
          <p className="helper-copy">
            You do not have any stores yet. Please contact an administrator to create stores for your account.
          </p>
        </section>
      ) : (
        <section className="record-grid">
          {sortedStores.map((store) => {
            const sortedRatingUsers = sortRatingUsers(store);

            return (
              <article key={store.id} className="surface-card store-card">
                <div className="store-card__header">
                  <div>
                    <div className="eyebrow">Assigned store</div>
                    <h3 className="action-card__title">{store.name}</h3>
                    <p className="muted-copy">{store.address}</p>
                  </div>
                  <span className="badge badge--teal">Owner View</span>
                </div>

                <div className="record-card__meta">
                  <span>{store.email}</span>
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
                  <p className="field-label">Customer ratings</p>
                  {sortedRatingUsers.length > 0 ? (
                    sortedRatingUsers.map((ratingUser, index) => (
                      <div key={index} className="record-card">
                        <div className="record-card__body">
                          <p className="record-card__title">{ratingUser.user.name}</p>
                          <div className="record-card__meta">
                            <span>{ratingUser.user.email}</span>
                            <span>{new Date(ratingUser.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="record-actions">
                          <span className="badge badge--sun">Rating {ratingUser.rating}/5</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="record-card">
                      <div className="record-card__body">
                        <p className="record-card__copy">
                          No customer ratings yet. This section will fill in as soon as users start submitting feedback.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default MyStores;
