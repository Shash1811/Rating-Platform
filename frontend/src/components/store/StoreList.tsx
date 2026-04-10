import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { FilterStoresDto, Rating, Store, StoreSortField } from '../../types';
import ShowcaseArt from '../common/ShowcaseArt';

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterStoresDto>({
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [userRatings, setUserRatings] = useState<{ [storeId: number]: Rating | null }>({});

  useEffect(() => {
    void fetchStores();
  }, [filters]);

  useEffect(() => {
    void fetchMyRatings();
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

  const fetchMyRatings = async () => {
    try {
      const myRatings = await apiService.getMyRatings();
      const ratingsMap: { [storeId: number]: Rating | null } = {};
      myRatings.forEach((rating) => {
        ratingsMap[rating.store.id] = rating;
      });
      setUserRatings(ratingsMap);
    } catch (err) {
      console.error('Failed to fetch user ratings:', err);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleRatingSubmit = async (storeId: number, rating: number) => {
    try {
      await apiService.createRating(storeId, { rating });
      await fetchStores();
      await fetchMyRatings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handleRatingUpdate = async (storeId: number, rating: number) => {
    try {
      await apiService.updateRating(storeId, { rating });
      await fetchStores();
      await fetchMyRatings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update rating');
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
          <div className="eyebrow">Community stores</div>
          <h1 className="page-title">Browse stores, compare scores, and leave feedback in a more vibrant space.</h1>
          <p className="page-subtitle">
            Search by name or address, watch the overall rating update, and submit or change your own rating in just one tap.
          </p>
          <div className="hero-badges">
            <span className="info-pill">{stores.length} stores available</span>
            <span className="info-pill">
              {Object.values(userRatings).filter(Boolean).length} stores already rated by you
            </span>
            <span className="info-pill">1 to 5 rating scale</span>
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
            <div className="eyebrow">Search and sort</div>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>
              Find the right store fast
            </h2>
            <p>Refine the results by name or address, then reorder the list by rating, recency, or location.</p>
          </div>
        </div>

        <div className="control-grid">
          <div className="field-stack">
            <label htmlFor="browse-name" className="field-label">
              Store name
            </label>
            <input
              id="browse-name"
              type="text"
              name="name"
              placeholder="Search by store name"
              value={filters.name ?? ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="browse-address" className="field-label">
              Address
            </label>
            <input
              id="browse-address"
              type="text"
              name="address"
              placeholder="Search by address"
              value={filters.address ?? ''}
              onChange={handleFilterChange}
            />
          </div>

          <div className="field-stack">
            <label htmlFor="browse-sort-by" className="field-label">
              Sort field
            </label>
            <select id="browse-sort-by" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value={'name' as StoreSortField}>Name</option>
              <option value={'address' as StoreSortField}>Address</option>
              <option value={'averageRating' as StoreSortField}>Overall Rating</option>
              <option value={'createdAt' as StoreSortField}>Created Date</option>
            </select>
          </div>

          <div className="field-stack">
            <label htmlFor="browse-sort-order" className="field-label">
              Sort order
            </label>
            <select
              id="browse-sort-order"
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </section>

      {stores.length === 0 ? (
        <section className="surface-card empty-card">
          <p className="helper-copy">No stores found matching your search criteria.</p>
        </section>
      ) : (
        <section className="store-grid">
          {stores.map((store) => {
            const userRating = userRatings[store.id];

            return (
              <article key={store.id} className="surface-card store-card">
                <div className="store-card__header">
                  <div>
                    <div className="eyebrow">Storefront</div>
                    <h3 className="action-card__title">{store.name}</h3>
                    <p className="muted-copy">{store.address}</p>
                  </div>
                  <span className={userRating ? 'badge badge--sky' : 'badge badge--teal'}>
                    {userRating ? 'Rated' : 'Ready to Rate'}
                  </span>
                </div>

                <div className="record-card__meta">
                  <span>{store.email}</span>
                </div>

                <div className="store-card__ratings">
                  <div className="mini-stat">
                    <p className="mini-stat__label">Overall Rating</p>
                    <p className="mini-stat__value">
                      {typeof store.averageRating === 'number' && store.averageRating > 0
                        ? `${store.averageRating.toFixed(1)}/5`
                        : 'No ratings yet'}
                    </p>
                  </div>
                  <div className="mini-stat">
                    <p className="mini-stat__label">Your Rating</p>
                    <p className="mini-stat__value">
                      {userRating ? `${userRating.rating}/5` : 'Not rated yet'}
                    </p>
                  </div>
                </div>

                <div className="field-stack">
                  <label className="field-label" htmlFor={`rating-${store.id}`}>
                    {userRating ? 'Update your rating' : 'Choose your rating'}
                  </label>
                  <p className="helper-copy">
                    Pick any number from 1 to 5. You can change it later whenever your opinion changes.
                  </p>
                  <div id={`rating-${store.id}`} className="rating-picker">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          if (userRating) {
                            void handleRatingUpdate(store.id, value);
                          } else {
                            void handleRatingSubmit(store.id, value);
                          }
                        }}
                        className={`rating-pill ${userRating?.rating === value ? 'rating-pill--active' : ''}`.trim()}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default StoreList;
