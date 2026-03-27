import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/shared/Layout';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/users').then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/api/users/${id}`);
    setUsers(u => u.filter(x => x._id !== id));
  };

  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || u.role === filter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <Layout>
      <div className="breadcrumb">Dashboard &gt; <span>Admin</span> &gt; Manage Users</div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>👥 Manage Users</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {['all', 'student', 'tutor', 'admin'].map(role => (
          <div key={role} className="stat-card" style={{ cursor: 'pointer', borderLeftColor: filter === role ? 'var(--secondary)' : 'var(--border)' }}
            onClick={() => setFilter(role)}>
            <div className="stat-value">{role === 'all' ? users.length : users.filter(u => u.role === role).length}</div>
            <div className="stat-label" style={{ textTransform: 'capitalize' }}>{role === 'all' ? 'Total Users' : `${role}s`}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <input className="form-control" placeholder="🔍 Search users..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <div className="spinner" /> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th><th>Role</th><th>Degree</th><th>Semester</th><th>Joined</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar avatar-sm" style={{ background: 'var(--secondary)', fontSize: '0.75rem' }}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{u.name}</div>
                          <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-red' : u.role === 'tutor' ? 'badge-blue' : 'badge-green'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{u.academicProfile?.degreeProgram || '—'}</td>
                    <td style={{ fontSize: '0.82rem' }}>{u.academicProfile?.currentSemester || '—'}</td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No users found.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
