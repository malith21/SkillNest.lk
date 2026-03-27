import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';

const TYPE_ICONS = { pdf: '📄', link: '🔗', notes: '📝', video: '🎥', other: '📁' };
const SUBJECTS = ['Data Structures', 'Networking', 'Database Management', 'Web Development',
  'Operating Systems', 'Software Engineering', 'Algorithms', 'Mathematics', 'Machine Learning'];
const SEMESTERS = ['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'];

function StarRating({ value, onRate, size = '1rem' }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.1rem' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onRate && onRate(s)}
          onMouseEnter={() => onRate && setHover(s)} onMouseLeave={() => setHover(0)}
          style={{ fontSize: size, cursor: onRate ? 'pointer' : 'default', color: s <= (hover || value) ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </div>
  );
}

function AIModal({ resource, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(resource.aiProcessed ? { aiSummary: resource.aiSummary, keyPoints: resource.keyPoints } : null);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/resources/${resource._id}/ai-summary`);
      setResult(res.data);
    } catch (e) { alert('AI processing failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>🤖</div>
        <h2 className="modal-title">AI Notes Summary</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', textAlign: 'center', marginBottom: '1rem' }}>
          {resource.title}
        </p>
        {!result ? (
          <>
            <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
              Our AI will generate a short summary and key points from this resource to help you study faster.
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={generate} disabled={loading}>
              {loading ? '⏳ Generating Summary...' : '✨ Generate AI Summary'}
            </button>
          </>
        ) : (
          <>
            <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>📋 Summary</strong>
              <p style={{ fontSize: '0.83rem', marginTop: '0.5rem', lineHeight: 1.6 }}>{result.aiSummary}</p>
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>🔑 Key Points</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                {result.keyPoints?.map((p, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', marginBottom: '0.3rem', lineHeight: 1.5 }}>{p}</li>
                ))}
              </ul>
            </div>
          </>
        )}
        <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [type, setType] = useState('');
  const [showAI, setShowAI] = useState(null);
  const [bookmarked, setBookmarked] = useState({});

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (subject) params.set('subject', subject);
      if (semester) params.set('semester', semester);
      if (type) params.set('type', type);
      const res = await axios.get(`/api/resources?${params}`);
      setResources(res.data);
      const bm = {};
      res.data.forEach(r => { bm[r._id] = r.bookmarks?.includes(user?._id); });
      setBookmarked(bm);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, [subject, semester, type]);

  const handleBookmark = async (id) => {
    const res = await axios.post(`/api/resources/${id}/bookmark`);
    setBookmarked(b => ({ ...b, [id]: res.data.bookmarked }));
  };

  const handleRate = async (id, rating) => {
    await axios.post(`/api/resources/${id}/rate`, { rating });
    fetchResources();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    await axios.delete(`/api/resources/${id}`);
    fetchResources();
  };

  return (
    <Layout>
      {showAI && <AIModal resource={showAI} onClose={() => { setShowAI(null); fetchResources(); }} />}

      <div className="breadcrumb">Dashboard &gt; <span>Study Resources & Notes Sharing</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>📚 Study Resources</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Browse, upload and share academic materials.</p>
        </div>
        {(user?.role === 'tutor' || user?.role === 'admin') && (
          <button className="btn btn-primary" onClick={() => navigate('/resources/upload')}>⬆️ Upload</button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input className="form-control" style={{ flex: 2, minWidth: 180 }} placeholder="🔍 Search resources..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchResources()} />
          <select className="form-control" style={{ flex: 1, minWidth: 140 }} value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="form-control" style={{ flex: 1, minWidth: 130 }} value={semester} onChange={e => setSemester(e.target.value)}>
            <option value="">All Semesters</option>
            {SEMESTERS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="form-control" style={{ flex: 1, minWidth: 120 }} value={type} onChange={e => setType(e.target.value)}>
            <option value="">All Types</option>
            {Object.keys(TYPE_ICONS).map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="btn btn-primary" onClick={fetchResources}>Search</button>
        </div>
      </div>

      {loading ? <div className="spinner" /> : (
        <>
          <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
            {resources.length} resource{resources.length !== 1 ? 's' : ''} found
          </div>
          <div className="grid-auto">
            {resources.map(r => (
              <div key={r._id} className="resource-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '2rem' }}>{TYPE_ICONS[r.resourceType] || '📁'}</div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span className={`badge ${r.status === 'approved' ? 'badge-green' : r.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                      {r.status}
                    </span>
                    <button onClick={() => handleBookmark(r._id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                      {bookmarked[r._id] ? '🔖' : '🏳'}
                    </button>
                  </div>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--primary)' }}>{r.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.75rem', flexGrow: 1 }}>
                  {r.description?.slice(0, 80)}{r.description?.length > 80 ? '...' : ''}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  📚 {r.subject} · 📅 {r.semester}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <StarRating value={Math.round(r.averageRating || 0)} onRate={(val) => handleRate(r._id, val)} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {r.averageRating?.toFixed(1) || 'No ratings'} ({r.ratings?.length || 0})
                  </span>
                </div>
                {r.tags?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    {r.tags.map(t => <span key={t} className="tag" style={{ fontSize: '0.7rem' }}>{t}</span>)}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAI(r)}>
                    🤖 AI Summary
                  </button>
                  {r.fileUrl && (
                    <a href={r.fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      ⬇ Download
                    </a>
                  )}
                  {r.externalLink && (
                    <a href={r.externalLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      🔗 Open
                    </a>
                  )}
                  {(user?.role === 'admin' || r.uploadedBy?._id === user?._id) && (
                    <>
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/resources/edit/${r._id}`)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>🗑</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {resources.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              <div style={{ fontSize: '3rem' }}>📚</div>
              <p>No resources found. Try a different search.</p>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
