import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/shared/Layout';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/resources?status=${filter}`);
      setResources(res.data);
    } catch (e) { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filter]);

  const approve = async (id, status) => {
    await axios.post(`/api/resources/${id}/approve`, { status });
    fetch();
  };

  const del = async (id) => {
    if (!window.confirm('Delete resource?')) return;
    await axios.delete(`/api/resources/${id}`);
    fetch();
  };

  return (
    <Layout>
      <div className="breadcrumb">Dashboard &gt; Admin &gt; <span>Approve Resources</span></div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>✅ Resource Approval</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Review and approve submitted resources.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Title</th><th>Subject</th><th>Semester</th><th>Type</th><th>Uploaded By</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {resources.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td style={{ fontSize: '0.82rem' }}>{r.subject}</td>
                    <td style={{ fontSize: '0.82rem' }}>{r.semester}</td>
                    <td><span className="badge badge-blue">{r.resourceType}</span></td>
                    <td style={{ fontSize: '0.82rem' }}>{r.uploadedBy?.name}</td>
                    <td>
                      <span className={`badge ${r.status === 'approved' ? 'badge-green' : r.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {r.status !== 'approved' && (
                          <button className="btn btn-success btn-sm" onClick={() => approve(r._id, 'approved')}>✅ Approve</button>
                        )}
                        {r.status !== 'rejected' && (
                          <button className="btn btn-outline btn-sm" onClick={() => approve(r._id, 'rejected')}>❌ Reject</button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => del(r._id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {resources.length === 0 && (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                No {filter} resources.
              </p>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
