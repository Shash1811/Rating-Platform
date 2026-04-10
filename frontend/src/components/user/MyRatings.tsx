import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { MyRatingsSortField, Rating, SortOrder } from '../../types';
import ShowcaseArt from '../common/ShowcaseArt';

const MyRatings: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<MyRatingsSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    void fetchMyRatings();
  }, []);

  const fetchMyRatings = async () => {
    try {
      const myRatings = await apiService.getMyRatings();
      setRatings(myRatings);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch your ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (storeId: number) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      try {
        await apiService.deleteRating(storeId);
        await fetchMyRatings();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete rating');
      }
    }
  };

  if (loading) {
    return (
      <section className="surface-card status-card">
        <h1 className="page-title" style={{ fontSize: '2rem' }}>
          Loading your ratings...
        </h1>
      </section>
    );
  }

  const sortedRatings = [...ratings].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'storeName') {
      comparison = a.store.name.localeCompare(b.store.name);
    } else if (sortBy === 'storeEmail') {
      comparison = a.store.email.localeCompare(b.store.email);
    } else if (sortBy === 'rating') {
      comparison = a.rating - b.rating;
    } else {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((total, rating) => total + rating.rating, 0) / ratings.length).toFixed(1)
      : '0.0';

  return (
    <div className="page-stack">
      <section className="surface-card hero-panel">
        <div className="hero-panel__content">
          <div className="eyebrow">Your feedback</div>
          <h1 className="page-title">Every rating you have submitted, organized beautifully.</h1>
          <p className="page-subtitle">
            Revisit stores you have reviewed, reorder the list by different fields, and remove ratings you no longer want to keep.
          </p>
          <div className="hero-badges">
            <span className="info-pill">{ratings.length} submitted ratings</span>
            <span className="info-pill">Average score {averageRating}/5</span>
            <span className="info-pill">Sortable history</span>
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
              Reorder your rating history
            </h2>
            <p>Sort by store name, store email, your score, or the date you submitted the rating.</p>
          </div>
        </div>

        <div className="control-grid">
          <div className="field-stack">
            <label htmlFor="my-ratings-sort-by" className="field-label">
              Sort field
            </label>
            <select
              id="my-ratings-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MyRatingsSortField)}
            >
              <option value="createdAt">Rated Date</option>
              <option value="storeName">Store Name</option>
              <option value="storeEmail">Store Email</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="field-stack">
            <label htmlFor="my-ratings-sort-order" className="field-label">
              Sort order
            </label>
            <select
              id="my-ratings-sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </section>

      <section className="surface-card list-panel">
        {ratings.length === 0 ? (
          <div className="empty-card">
            <p className="helper-copy">
              You have not rated any stores yet. Start exploring and leave your first review.
            </p>
            <div className="button-row">
              <Link to="/stores" className="button-ghost">
                Browse Stores
              </Link>
            </div>
          </div>
        ) : (
          <div className="list-stack">
            {sortedRatings.map((rating) => (
              <article key={rating.id} className="record-card">
                <div className="record-card__body">
                  <div className="record-card__meta">
                    <span className="badge badge--sun">Rating {rating.rating}/5</span>
                    <span>{rating.store.email}</span>
                    <span>Rated on {new Date(rating.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="record-card__title">{rating.store.name}</h3>
                  <p className="record-card__copy">{rating.store.address}</p>
                </div>

                <div className="record-actions">
                  <button
                    type="button"
                    onClick={() => void handleDeleteRating(rating.store.id)}
                    className="button-danger button-small"
                  >
                    Delete Rating
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

export default MyRatings;
