import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const LeaveApprovals = () => {
    const { api } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/admin/leaves');
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

    const handleUpdateStatus = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this leave request?`)) {
            try {
                await api.put(`/admin/leaves/${id}`, { status });
                fetchLeaves(); // refresh
            } catch (err) {
                alert(err.response?.data?.error || 'Error updating status');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' };
            case 'Rejected': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' };
            default: return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' };
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={24} color="var(--primary)" /> Leave Approvals
                </h2>
                <p>Review and approve employee leave requests here.</p>
            </div>

            <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Employee</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Dates</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Reason</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map(leave => (
                            <tr key={leave._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                                    {leave.employee?.name}
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leave.employee?.email}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', maxWidth: '200px' }}>{leave.reason}</td>
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
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    {leave.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleUpdateStatus(leave._id, 'Approved')} style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: 'var(--secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }} title="Approve">
                                                <CheckCircle size={18} />
                                            </button>
                                            <button onClick={() => handleUpdateStatus(leave._id, 'Rejected')} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }} title="Reject">
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {leaves.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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

export default LeaveApprovals;
