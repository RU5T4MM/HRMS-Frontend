import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, Plus } from 'lucide-react';

const LeaveRequests = () => {
    const { api } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/employee/leave');
            setLeaves(res.data.data);
        } catch (err) {
            console.error('Failed to fetch leaves', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [api]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/employee/leave', formData);
            setShowForm(false);
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.error || 'Error applying for leave');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' };
            case 'Rejected': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' };
            default: return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' };
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={24} color="var(--primary)" /> Leave Requests
                    </h2>
                    <p>Submit and track your leave applications.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Apply for Leave'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Apply for Leave</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input type="date" className="form-input" name="startDate" value={formData.startDate} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input type="date" className="form-input" name="endDate" value={formData.endDate} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Reason</label>
                            <textarea className="form-input" name="reason" value={formData.reason} onChange={handleChange} rows="3" required placeholder="Reason for leave..."></textarea>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Submit Application</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Start Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>End Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Reason</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map(leave => (
                            <tr key={leave._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem 1.5rem', maxWidth: '300px' }}>{leave.reason}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ 
                                        background: getStatusColor(leave.status).bg, 
                                        color: getStatusColor(leave.status).color, 
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '1rem', 
                                        fontSize: '0.875rem', 
                                        fontWeight: 500 
                                    }}>
                                        {leave.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {leaves.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                                    No leave requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveRequests;
