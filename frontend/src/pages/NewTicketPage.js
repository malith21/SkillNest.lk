import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const MODULES = ['Data Structures', 'Networking', 'Database Management', 'Web Development',
  'Operating Systems', 'Software Engineering', 'Algorithms', 'Mathematics',
  'Machine Learning', 'Computer Architecture'];

const HELP_TYPES = [
  { key: 'peer_help', icon: '🤝', label: 'Peer Help', desc: 'Get help from a fellow student' },
  { key: 'tutor_support', icon: '👨‍🏫', label: 'Tutor Support', desc: 'One-on-one tutor session' },
  { key: 'quiz_help', icon: '📝', label: 'Quiz Help', desc: 'Prepare for upcoming quizzes' },
  { key: 'assignment_help', icon: '📋', label: 'Assignment Help', desc: 'Guidance on assignments' },
];

export default function NewTicketPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    helpType: '', module: '', subject: '', description: '',
    priority: 'medium', tutorId: ''
  });

  useEffect(() => {
    if (form.module) {
      axios.get(`/api/tutors?module=${form.module}`)
        .then(r => setTutors(r.data))
        .catch(() => setTutors([]));
    }
  }, [form.module]);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/tickets', {
        tutor: form.tutorId,
        module: form.module,
        subject: form.subject,
        description: form.description,
        helpType: form.helpType,
        priority: form.priority
      });
      navigate(`/tickets/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="breadcrumb">Dashboard &gt; <span>Tickets</span> &gt; New Request</div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>🎫 Request Help</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
          Submit a help request and get matched with a tutor or peer.
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '2rem' }}>
        {['Select Help Type', 'Module & Details', 'Choose Tutor', 'Confirm'].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', margin: '0 auto 0.4rem',
              background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--secondary)' : '#e2e8f0',
              color: step >= i + 1 ? 'white' : 'var(--text-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem', position: 'relative', zIndex: 1
            }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: '0.72rem', color: step === i + 1 ? 'var(--secondary)' : 'var(--text-light)' }}>{s}</div>
            {i < 3 && <div style={{ position: 'absolute', top: 16, left: '50%', right: '-50%', height: 2, background: step > i + 1 ? 'var(--success)' : '#e2e8f0', zIndex: 0 }} />}
          </div>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Step 1: Help Type */}
      {step === 1 && (
        <div className="card">
          <div className="card-title">What kind of help do you need?</div>
          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            {HELP_TYPES.map(t => (
              <div key={t.key} onClick={() => setForm(f => ({ ...f, helpType: t.key }))}
                style={{
                  padding: '1.25rem', borderRadius: 12, cursor: 'pointer', border: '2px solid',
                  borderColor: form.helpType === t.key ? 'var(--secondary)' : 'var(--border)',
                  background: form.helpType === t.key ? '#eff6ff' : 'white', transition: 'all 0.2s'
                }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
                <div style={{ fontWeight: 600 }}>{t.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>{t.desc}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" disabled={!form.helpType} onClick={() => setStep(2)}>
            Next →
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="card">
          <div className="card-title">📋 Provide Details</div>
          <div className="form-group">
            <label className="form-label">Module</label>
            <select className="form-control" value={form.module}
              onChange={e => setForm(f => ({ ...f, module: e.target.value, tutorId: '' }))}>
              <option value="">Select a module</option>
              {MODULES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subject / Topic</label>
            <input className="form-control" placeholder="e.g. Binary Trees, TCP/IP Protocol..."
              value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={4}
              placeholder="Describe your problem or question in detail..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-control" value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" disabled={!form.module || !form.subject || !form.description}
              onClick={() => setStep(3)}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Tutor */}
      {step === 3 && (
        <div className="card">
          <div className="card-title">👨‍🏫 Choose a Tutor / Peer</div>
          {tutors.length === 0 ? (
            <div className="alert alert-info">
              No tutors registered for <strong>{form.module}</strong> yet. Submit anyway and an admin will assign one.
              <br />
              <button className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}
                onClick={() => { setForm(f => ({ ...f, tutorId: 'pending' })); setStep(4); }}>
                Submit Without Tutor
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {tutors.map(t => (
                <div key={t._id} onClick={() => setForm(f => ({ ...f, tutorId: t._id }))}
                  style={{
                    padding: '1rem', borderRadius: 10, cursor: 'pointer', border: '2px solid',
                    borderColor: form.tutorId === t._id ? 'var(--secondary)' : 'var(--border)',
                    background: form.tutorId === t._id ? '#eff6ff' : 'white',
                    display: 'flex', alignItems: 'center', gap: '1rem'
                  }}>
                  <div className="avatar avatar-md" style={{ background: 'var(--secondary)', flexShrink: 0 }}>
                    {t.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{t.email}</div>
                    <div style={{ marginTop: '0.3rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {t.tutorModules?.map(m => <span key={m} className="badge badge-blue" style={{ fontSize: '0.68rem' }}>{m}</span>)}
                    </div>
                  </div>
                  {form.tutorId === t._id && <span style={{ marginLeft: 'auto', color: 'var(--secondary)', fontSize: '1.5rem' }}>✓</span>}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" disabled={!form.tutorId} onClick={() => setStep(4)}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="card">
          <div className="card-title">🔍 Confirm Your Request</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              ['Help Type', HELP_TYPES.find(h => h.key === form.helpType)?.label],
              ['Module', form.module],
              ['Subject', form.subject],
              ['Priority', form.priority],
              ['Description', form.description],
              ['Tutor', tutors.find(t => t._id === form.tutorId)?.name || 'Pending Assignment'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-light)', minWidth: 100 }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
            📌 After submission, a ticket will appear on your profile and the tutor's dashboard. You can chat directly on the ticket page.
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : '🚀 Submit Ticket'}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
