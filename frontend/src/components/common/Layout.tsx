import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
}

const formatRole = (role?: UserRole) =>
  role
    ? role
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : '';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [];
    }

    const baseItems = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Change Password', href: '/change-password' },
    ];

    if (user?.role === UserRole.ADMIN) {
      return [
        ...baseItems,
        { name: 'Users', href: '/admin/users' },
        { name: 'Stores', href: '/admin/stores' },
      ];
    }

    if (user?.role === UserRole.NORMAL_USER) {
      return [
        ...baseItems,
        { name: 'Stores', href: '/stores' },
        { name: 'My Ratings', href: '/my-ratings' },
      ];
    }

    if (user?.role === UserRole.STORE_OWNER) {
      return [...baseItems, { name: 'My Stores', href: '/my-stores' }];
    }

    return baseItems;
  };

  return (
    <div className="app-shell">
      {isAuthenticated && (
        <header className="topbar">
          <div className="topbar__inner">
            <div className="topbar__group">
              <div className="brand-lockup">
                <div className="brand-mark">RP</div>
                <div className="brand-copy">
                  <p className="brand-copy__eyebrow">Store Feedback Studio</p>
                  <h1 className="brand-copy__title">Rating Platform</h1>
                </div>
              </div>
            </div>

            <div className="nav-cluster">
              <div className="user-chip">
                <span>Signed in as</span>
                <strong>{user?.name}</strong>
                <span>{formatRole(user?.role)}</span>
              </div>

              <nav className="nav-links">
                {getNavigationItems().map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`.trim()}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>

              <button onClick={logout} className="button-danger" type="button">
                Logout
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="page-shell">{children}</main>
    </div>
  );
};

export default Layout;
