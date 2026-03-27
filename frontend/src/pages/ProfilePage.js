import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';

const DEGREES = ['BSc Computer Science', 'BSc Software Engineering', 'BSc Information Technology',
  'BSc Data Science', 'BSc Cybersecurity', 'BEng Computer Engineering', 'Other'];
const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
  'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
const SKILL_NAMES = ['Programming', 'Data Analysis', 'Mathematics', 'Web Development',
  'Database Management', 'Networking', 'AI & Machine Learning', 'Problem Solving'];

const MODULES = ['Data Structures', 'Networking', 'Database Management', 'Web Development',
  'Operating Systems', 'Software Engineering', 'Algorithms', 'Mathematics',
  'Machine Learning', 'Computer Architecture'];

const steps = ['Basic Info', 'Academic Details', 'Skills Assessment', 'Review & Save'];

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`star ${s <= (hover || value) ? 'filled' : ''}`}
          onClick={() => onChange(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>★</span>
      ))}
    </div>
  );
}

function CircleProgress({ value }) {
  const r = 40, circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="circle-progress">
      <svg width="100" height="100">
        <circle className="circle-bg" cx="50" cy="50" r={r} strokeWidth="10" />
        <circle className="circle-fill" cx="50" cy="50" r={r} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="circle-text">
        <span>{value}%</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-light)' }}>Complete</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    tutorModules: [],
    academicProfile: {
      degreeProgram: '', currentSemester: '', subjects: [],
      gpa: 0, semesterGpa: 0, skills: []
    }
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        tutorModules: user.tutorModules || [],
        academicProfile: {
          degreeProgram: user.academicProfile?.degreeProgram || '',
          currentSemester: user.academicProfile?.currentSemester || '',
          subjects: user.academicProfile?.subjects || [],
          gpa: user.academicProfile?.gpa || 0,
          semesterGpa: user.academicProfile?.semesterGpa || 0,
          skills: user.academicProfile?.skills?.length ? user.academicProfile.skills :
            SKILL_NAMES.map(n => ({ name: n, rating: 3, type: 'neutral' }))
        }
      });
    }
  }, [user]);

  const completion = user?.academicProfile?.profileCompletion || 0;

  const addSubject = () => {
    if (subjectInput.trim() && !profile.academicProfile.subjects.includes(subjectInput.trim())) {
      setProfile(p => ({ ...p, academicProfile: { ...p.academicProfile, subjects: [...p.academicProfile.subjects, subjectInput.trim()] } }));
      setSubjectInput('');
    }
  };

  const removeSubject = (s) => {
    setProfile(p => ({ ...p, academicProfile: { ...p.academicProfile, subjects: p.academicProfile.subjects.filter(x => x !== s) } }));
  };

  const updateSkill = (idx, field, val) => {
    const skills = [...profile.academicProfile.skills];
    skills[idx] = { ...skills[idx], [field]: val };
    setProfile(p => ({ ...p, academicProfile: { ...p.academicProfile, skills } }));
  };

  const handleSave = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.put(`/api/users/${user._id}`, profile);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) return setError('Passwords do not match');
    try {
      await axios.put('/api/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPw });
      setSuccess('Password changed!');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const toggleTutorModule = (mod) => {
    const arr = profile.tutorModules.includes(mod)
      ? profile.tutorModules.filter(m => m !== mod)
      : [...profile.tutorModules, mod];
    setProfile(p => ({ ...p, tutorModules: arr }));
  };

  return (
    <Layout>
      <div className="breadcrumb">
        Dashboard &gt; <span>User Management & Academic Profiling</span> &gt; User Profile
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>User Profile</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Manage and personalize your academic profile.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
          {editMode ? '👁 View Mode' : '✏️ Edit Profile'}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{user?.name}</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{user?.email}</p>
              <span className="badge badge-blue" style={{ marginTop: '0.3rem', textTransform: 'capitalize' }}>
                {user?.role} · {profile.academicProfile.degreeProgram || 'Basic Profile'}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              Profile Completion: <strong>{completion}%</strong>
            </div>
            <div className="progress-bar" style={{ width: 200 }}>
              <div className="progress-fill" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{
              padding: '0.5rem 1.2rem', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: step === i ? 'var(--secondary)' : i < step ? '#d1fae5' : '#f1f5f9',
              color: step === i ? 'white' : i < step ? '#065f46' : 'var(--text-light)',
              fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '0.3rem'
            }}>
            {i < step ? '✔' : i + 1}. {s}
          </button>
        ))}
      </div>

      {/* Step 0: Basic Info */}
      {step === 0 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">👤 Basic Information</div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" value={profile.name} disabled={!editMode}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" value={profile.email} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input className="form-control" value={user?.role} disabled />
            </div>
            {editMode && (
              <button className="btn btn-primary" onClick={() => setStep(1)}>
                Next: Academic Details →
              </button>
            )}
          </div>

          {/* Key Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="card-title">📈 Profile Metrics</div>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {profile.academicProfile.gpa || '—'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Current GPA</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    {profile.academicProfile.semesterGpa || '—'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Semester GPA</div>
                </div>
                <CircleProgress value={completion} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-title">🕐 Recent Activity</div>
              <table>
                <thead><tr><th>Activity</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Profile viewed</td><td><span className="badge badge-green">✔ Active</span></td></tr>
                  <tr><td>Last login</td><td><span className="badge badge-blue">Logged In</span></td></tr>
                  <tr><td>Account created</td><td><span className="badge badge-gray">Completed</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Academic Details */}
      {step === 1 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">🎓 Academic Details</div>
            <div className="form-group">
              <label className="form-label">Degree Program</label>
              <select className="form-control" disabled={!editMode}
                value={profile.academicProfile.degreeProgram}
                onChange={e => setProfile(p => ({ ...p, academicProfile: { ...p.academicProfile, degreeProgram: e.target.value } }))}>
                <option value="">Select Degree</option>
                {DEGREES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Current Semester</label>
              <select className="form-control" disabled={!editMode}
                value={profile.academicProfile.currentSemester}
                onChange={e => setProfile(p => ({ ...p, academicProfile: { ...p.academicProfile, currentSemester: e.target.value } }))}>
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">GPA</label>
              <input className="form-control" type="number" step="0.1" min="0" max="4" disabled={!editMode}
                value={profile.academicProfile.gpa}
                onChange={e => setProfile(p => ({ ...p, academicProfile: { ...p.academicProfile, gpa: parseFloat(e.target.value) } }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Subjects</label>
              {profile.academicProfile.subjects.map(s => (
                <span key={s} className="tag">{s}
                  {editMode && <span className="tag-remove" onClick={() => removeSubject(s)}>×</span>}
                </span>
              ))}
              {editMode && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input className="form-control" placeholder="Add subject..." value={subjectInput}
                    onChange={e => setSubjectInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSubject()} />
                  <button className="btn btn-outline btn-sm" onClick={addSubject}>Add</button>
                </div>
              )}
            </div>
            {user?.role === 'tutor' && editMode && (
              <div className="form-group">
                <label className="form-label">Teaching Modules</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {MODULES.map(m => (
                    <span key={m} onClick={() => toggleTutorModule(m)}
                      className={`badge ${profile.tutorModules.includes(m) ? 'badge-blue' : 'badge-gray'}`}
                      style={{ cursor: 'pointer' }}>{m}</span>
                  ))}
                </div>
              </div>
            )}
            {editMode && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setStep(0)}>← Previous</button>
                <button className="btn btn-primary btn-sm" onClick={() => setStep(2)}>Next →</button>
              </div>
            )}
          </div>

          {/* Profile Summary */}
          <div className="card">
            <div className="card-title">📋 Profile Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              {[
                ['🎓 Degree', profile.academicProfile.degreeProgram || 'Not set'],
                ['📅 Semester', profile.academicProfile.currentSemester || 'Not set'],
                ['📊 GPA', profile.academicProfile.gpa || 'Not set'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-light)' }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div>
                <span style={{ color: 'var(--text-light)' }}>📚 Subjects</span>
                <div style={{ marginTop: '0.4rem' }}>
                  {profile.academicProfile.subjects.length > 0
                    ? profile.academicProfile.subjects.map(s => <span key={s} className="tag">{s}</span>)
                    : <span style={{ color: 'var(--text-light)' }}>None added</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <div className="card">
          <div className="card-title">💡 Skills Assessment</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {profile.academicProfile.skills.map((skill, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>{skill.name}</div>
                <StarRating value={skill.rating} onChange={v => editMode && updateSkill(i, 'rating', v)} />
                {editMode && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                    {['strength', 'neutral', 'weakness'].map(t => (
                      <button key={t} onClick={() => updateSkill(i, 'type', t)}
                        style={{
                          padding: '0.2rem 0.5rem', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.7rem',
                          background: skill.type === t ? (t === 'strength' ? '#d1fae5' : t === 'weakness' ? '#fee2e2' : '#dbeafe') : '#f1f5f9',
                          color: skill.type === t ? (t === 'strength' ? '#065f46' : t === 'weakness' ? '#991b1b' : 'var(--primary)') : 'var(--text-light)'
                        }}>
                        {t === 'strength' ? '💚 Strength' : t === 'weakness' ? '🟠 Weakness' : '⚪ Neutral'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {editMode && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setStep(1)}>← Previous</button>
              <button className="btn btn-primary btn-sm" onClick={() => setStep(3)}>Next →</button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Review & Save */}
      {step === 3 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">✅ Review & Save</div>
            {[
              ['Full Name', profile.name],
              ['Degree Program', profile.academicProfile.degreeProgram || 'Not set'],
              ['Semester', profile.academicProfile.currentSemester || 'Not set'],
              ['GPA', profile.academicProfile.gpa || 'Not set'],
              ['Subjects', profile.academicProfile.subjects.join(', ') || 'None'],
              ['Strengths', profile.academicProfile.skills.filter(s => s.type === 'strength').map(s => s.name).join(', ') || 'None'],
              ['Weaknesses', profile.academicProfile.skills.filter(s => s.type === 'weakness').map(s => s.name).join(', ') || 'None'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>{k}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 500, maxWidth: 200, textAlign: 'right' }}>{v}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>← Edit Skills</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card">
              <div className="card-title">⚙️ Account Settings</div>
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input className="form-control" type="password" value={pwForm.current}
                    onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-control" type="password" value={pwForm.newPw}
                    onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-control" type="password" value={pwForm.confirm}
                    onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">🔒 Change Password</button>
              </form>
            </div>

            <div className="card">
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ flex: 1, padding: '1rem', background: 'var(--bg)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>🔔</div>
                  <div style={{ fontWeight: 600 }}>Notifications</div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Manage email alerts</div>
                </div>
                <div style={{ flex: 1, padding: '1rem', background: 'var(--bg)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                  <div style={{ fontWeight: 600 }}>Login Activity</div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Last login: Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
