import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const studentNav = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/profile', icon: '👤', label: 'My Profile' },
  { to: '/tickets', icon: '🎫', label: 'My Tickets' },
  { to: '/tickets/new', icon: '➕', label: 'Request Help' },
  { to: '/resources', icon: '📚', label: 'Study Resources' },
];

const tutorNav = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/profile', icon: '👤', label: 'My Profile' },
  { to: '/tickets', icon: '🎫', label: 'Support Tickets' },
  { to: '/resources', icon: '📚', label: 'Resources' },
  { to: '/resources/upload', icon: '⬆️', label: 'Upload Resource' },
];

const adminNav = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/admin/users', icon: '👥', label: 'Manage Users' },
  { to: '/tickets', icon: '🎫', label: 'All Tickets' },
  { to: '/resources', icon: '📚', label: 'Resources' },
  { to: '/admin/resources', icon: '✅', label: 'Approve Resources' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'tutor' ? tutorNav : studentNav;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🌟 SkillNest.lk</h2>
        <p>Nurturing Skills & Empowering Futures</p>
      </div>

      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="avatar avatar-sm" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button className="btn btn-outline" style={{ width: '100%', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          onClick={() => { logout(); navigate('/login'); }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
