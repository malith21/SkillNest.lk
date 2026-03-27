import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';

const STATUS_COLORS = {
  open: 'badge-yellow', in_progress: 'badge-blue', resolved: 'badge-green', closed: 'badge-gray'
};

export default function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/tickets/${id}`).then(r => { setTicket(r.data); setLoading(false); }).catch(() => setLoading(false));
    axios.get(`/api/messages/${id}`).then(r => setMessages(r.data)).catch(() => {});

    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('joinTicket', id);
    socketRef.current.on('newMessage', msg => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socketRef.current?.disconnect();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!msgInput.trim()) return;
    try {
      const res = await axios.post('/api/messages', { ticketId: id, content: msgInput });
      socketRef.current.emit('sendMessage', { ...res.data, ticketId: id });
      setMsgInput('');
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(`/api/tickets/${id}`, { status });
      setTicket(res.data);
    } catch (err) { console.error(err); }
  };

  const deleteTicket = async () => {
    if (!window.confirm('Delete this ticket?')) return;
    await axios.delete(`/api/tickets/${id}`);
    navigate('/tickets');
  };

  if (loading) return <Layout><div className="spinner" /></Layout>;
  if (!ticket) return <Layout><div className="alert alert-error">Ticket not found</div></Layout>;

  const isStudent = user?.role === 'student';
  const isTutor = user?.role === 'tutor' || user?.role === 'admin';

  return (
    <Layout>
      <div className="breadcrumb">
        Dashboard &gt; <span onClick={() => navigate('/tickets')} style={{ cursor: 'pointer' }}>Tickets</span> &gt; {ticket.ticketNumber}
      </div>

      {/* Ticket Header */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{ticket.ticketNumber}</span>
              <span className={`badge ${STATUS_COLORS[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
              <span className={`badge badge-${ticket.priority === 'high' ? 'red' : ticket.priority === 'medium' ? 'yellow' : 'green'}`}>
                {ticket.priority}
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>{ticket.subject}</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              📚 {ticket.module} · 🏷️ {ticket.helpType?.replace('_', ' ')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {isTutor && ticket.status === 'open' && (
              <button className="btn btn-primary btn-sm" onClick={() => updateStatus('in_progress')}>
                ▶ Start Progress
              </button>
            )}
            {isTutor && ticket.status === 'in_progress' && (
              <button className="btn btn-success btn-sm" onClick={() => updateStatus('resolved')}>
                ✅ Mark Resolved
              </button>
            )}
            {isStudent && ticket.status === 'resolved' && (
              <button className="btn btn-outline btn-sm" onClick={() => updateStatus('closed')}>
                🔒 Close Ticket
              </button>
            )}
            {(user?._id === ticket.student?._id || user?.role === 'admin') && (
              <button className="btn btn-danger btn-sm" onClick={deleteTicket}>🗑 Delete</button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: 8, fontSize: '0.85rem' }}>
          <strong>Description:</strong>
          <p style={{ marginTop: '0.4rem', lineHeight: 1.6 }}>{ticket.description}</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-light)' }}>
          <div>👤 Student: <strong style={{ color: 'var(--text)' }}>{ticket.student?.name}</strong></div>
          <div>👨‍🏫 Tutor: <strong style={{ color: 'var(--text)' }}>{ticket.tutor?.name || 'Pending'}</strong></div>
          <div>📅 Created: <strong style={{ color: 'var(--text)' }}>{new Date(ticket.createdAt).toLocaleDateString()}</strong></div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="card">
        <div className="card-title">💬 Ticket Chat</div>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem', fontSize: '0.85rem' }}>
                No messages yet. Start the conversation!
              </div>
            )}
            {messages.map(msg => {
              const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
              return (
                <div key={msg._id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  {!isMine && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <div className="avatar avatar-sm" style={{ background: 'var(--secondary)', fontSize: '0.7rem' }}>
                        {msg.sender?.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{msg.sender?.name}</span>
                    </div>
                  )}
                  <div className={`message-bubble ${isMine ? 'message-mine' : 'message-other'}`}>
                    {msg.content}
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input className="form-control" placeholder="Type your message..."
              value={msgInput} onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()} />
            <button className="btn btn-primary" onClick={sendMessage}>Send ✈</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
