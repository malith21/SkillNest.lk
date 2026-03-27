import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';

const STATUS_COLORS = {
  open: 'badge-yellow', in_progress: 'badge-blue', resolved: 'badge-green', closed: 'badge-gray'
};
const PRIORITY_COLORS = { low: 'badge-green', medium: 'badge-yellow', high: 'badge-red' };

export default function TicketsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/tickets').then(r => { setTickets(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <Layout>
      <div className="breadcrumb">Dashboard &gt; <span>Support Tickets</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>🎫 Support Tickets</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
            {user?.role === 'student' ? 'Your help requests' : 'Tickets assigned to you'}
          </p>
        </div>
        {user?.role === 'student' && (
          <button className="btn btn-primary" onClick={() => navigate('/tickets/new')}>
            ➕ New Request
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
            {s === 'all' ? `All (${tickets.length})` : `${s.replace('_', ' ')} (${tickets.filter(t => t.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
          <h3 style={{ color: 'var(--text-light)' }}>No tickets found</h3>
          {user?.role === 'student' && (
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/tickets/new')}>
              Submit Your First Request
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(ticket => (
            <div key={ticket._id} className="ticket-card" onClick={() => navigate(`/tickets/${ticket._id}`)}>
              <div className="ticket-header">
                <div>
                  <span className="ticket-number">{ticket.ticketNumber}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.2rem' }}>{ticket.subject}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    {ticket.module} · {ticket.helpType?.replace('_', ' ')}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
                  <span className={`badge ${STATUS_COLORS[ticket.status]}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className={`badge ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority} priority
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {ticket.student && (
                    <span>👤 {user?.role !== 'student' ? ticket.student?.name : ticket.tutor?.name}</span>
                  )}
                </div>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
