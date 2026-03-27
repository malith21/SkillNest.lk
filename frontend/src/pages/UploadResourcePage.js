import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const SUBJECTS = ['Data Structures', 'Networking', 'Database Management', 'Web Development',
  'Operating Systems', 'Software Engineering', 'Algorithms', 'Mathematics', 'Machine Learning'];
const SEMESTERS = ['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'];

export default function UploadResourcePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', subject: '', semester: '',
    resourceType: 'pdf', externalLink: '', tags: []
  });
  const [file, setFile] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') data.append(k, JSON.stringify(v));
        else data.append(k, v);
      });
      if (file) data.append('file', file);
      await axios.post('/api/resources', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Resource uploaded! Pending admin approval.');
      setTimeout(() => navigate('/resources'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="breadcrumb">Dashboard &gt; <span onClick={() => navigate('/resources')} style={{ cursor: 'pointer' }}>Resources</span> &gt; Upload</div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>⬆️ Upload Resource</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Share academic materials with students.</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-control" required placeholder="Resource title"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3} placeholder="Brief description..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <select className="form-control" required value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                <option value="">Select Subject</option>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester *</label>
              <select className="form-control" required value={form.semester}
                onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}>
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Resource Type</label>
            <select className="form-control" value={form.resourceType}
              onChange={e => setForm(f => ({ ...f, resourceType: e.target.value }))}>
              {['pdf','link','notes','video','other'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          {form.resourceType === 'pdf' || form.resourceType === 'notes' ? (
            <div className="form-group">
              <label className="form-label">Upload File (max 10MB)</label>
              <input type="file" className="form-control" accept=".pdf,.doc,.docx,.txt"
                onChange={e => setFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">External Link</label>
              <input className="form-control" type="url" placeholder="https://..."
                value={form.externalLink} onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input className="form-control" placeholder="Add tag..."
                value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
              <button type="button" className="btn btn-outline btn-sm" onClick={addTag}>Add</button>
            </div>
            {form.tags.map(t => (
              <span key={t} className="tag">{t}
                <span className="tag-remove" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}>×</span>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/resources')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : '⬆️ Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
