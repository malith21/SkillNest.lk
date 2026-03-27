import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { key: 'student', icon: '🎓', label: 'Student', desc: 'Access courses & resources' },
  { key: 'tutor', icon: '👨‍🏫', label: 'Tutor', desc: 'Support & guide students' },
  { key: 'admin', icon: '🛡️', label: 'Admin', desc: 'Manage the platform' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState('login'); // login | register | forgot
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setMode('login');
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register({ ...form, role: selectedRole.key });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌟</div>
          <h1 className="auth-title">SkillNest.lk</h1>
          <p className="auth-subtitle">Nurturing Skills & Empowering Futures</p>
        </div>

        <div className="role-cards">
          {ROLES.map(role => (
            <div
              key={role.key}
              className={`role-card ${selectedRole?.key === role.key ? 'selected' : ''}`}
              onClick={() => handleRoleClick(role)}
            >
              <div className="role-icon">{role.icon}</div>
              <h3>{role.label}</h3>
              <p>{role.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '1.5rem', fontSize: '0.8rem' }}>
          Select your role to continue
        </p>
      </div>

      {/* Modal */}
      {selectedRole && (
        <div className="modal-overlay" onClick={() => setSelectedRole(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{selectedRole.icon}</span>
              <h2 className="modal-title">
                {mode === 'login' ? `${selectedRole.label} Login` : `Create ${selectedRole.label} Account`}
              </h2>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {mode === 'forgot' ? (
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                  Enter your email and we'll send a reset link.
                </p>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" placeholder="your@email.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>Send Reset Link</button>
                <p className="forgot-link" onClick={() => setMode('login')}>← Back to Login</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" type="text" placeholder="Your name" required
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" placeholder="your@email.com" required
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-control" type="password" placeholder="••••••••" required
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }}
                    onClick={() => setSelectedRole(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                    {loading ? '...' : mode === 'login' ? 'Login' : 'Register'}
                  </button>
                </div>
                <p className="forgot-link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                  {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
                </p>
                {mode === 'login' && (
                  <p className="forgot-link" onClick={() => setMode('forgot')}>Forgot password?</p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
