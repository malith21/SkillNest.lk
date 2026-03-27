import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/tickets').then(r => setTickets(r.data)).catch(() => {});
    axios.get('/api/resources').then(r => setResources(r.data)).catch(() => {});
    if (user?.role === 'admin') axios.get('/api/users').then(r => setUsers(r.data)).catch(() => {});
  }, [user]);

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  const completion = user?.academicProfile?.profileCompletion || 0;

  return (
    <Layout>
      <div className="breadcrumb">Dashboard</div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Here's what's happening on SkillNest today.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: 'var(--secondary)' }}>
          <div className="stat-value">{tickets.length}</div>
          <div className="stat-label">Total Tickets</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value">{openTickets}</div>
          <div className="stat-label">Open Tickets</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value">{resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value">{resources.length}</div>
          <div className="stat-label">Resources</div>
        </div>
        {user?.role === 'admin' && (
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
        )}
      </div>

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Profile Completion */}
        <div className="card">
          <div className="card-title">📊 Profile Completion</div>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Academic Profile</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{completion}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completion}%` }} />
            </div>
          </div>
          {completion < 100 && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/profile')}>
              Complete Profile →
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-title">⚡ Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {user?.role === 'student' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/tickets/new')}>
                  🎫 Request Help
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/resources')}>
                  📚 Browse Resources
                </button>
              </>
            )}
            {user?.role === 'tutor' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/tickets')}>
                  🎫 View My Tickets
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/resources/upload')}>
                  ⬆️ Upload Resource
                </button>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/admin/users')}>
                  👥 Manage Users
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/admin/resources')}>
                  ✅ Approve Resources
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>🎫 Recent Tickets</div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/tickets')}>View All</button>
        </div>
        {tickets.length === 0 ? (
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
            No tickets yet.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Subject</th>
                  <th>Module</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 5).map(t => (
                  <tr key={t._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tickets/${t._id}`)}>
                    <td><span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{t.ticketNumber}</span></td>
                    <td>{t.subject}</td>
                    <td>{t.module}</td>
                    <td>
                      <span className={`badge badge-${t.status === 'open' ? 'yellow' : t.status === 'resolved' ? 'green' : t.status === 'in_progress' ? 'blue' : 'gray'}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
