import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CheckSquare, CheckCircle, Clock } from 'lucide-react';

const Attendance = () => {
    const { api } = useContext(AuthContext);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/employee/attendance');
            setAttendance(res.data.data);
        } catch (err) {
            console.error('Failed to fetch attendance', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [api]);

    const markAttendance = async (status) => {
        try {
            await api.post('/employee/attendance', { status });
            alert(`Attendance marked as ${status} successfully!`);
            fetchAttendance();
        } catch (err) {
            alert(err.response?.data?.error || 'Error marking attendance');
        }
    };

    if (loading) return <div>Loading...</div>;

    const todayAttendance = attendance.find(a => new Date(a.date).toDateString() === new Date().toDateString());

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckSquare size={24} color="var(--primary)" /> Attendance Record
                </h2>
                <p>View your daily attendance and work hours.</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={20} color="var(--text-muted)" /> Today's Status
                    </h3>
                    {todayAttendance ? (
                        <p style={{ margin: 0, fontWeight: 500, color: 'var(--secondary)' }}>
                            Marked as: {todayAttendance.status}
                        </p>
                    ) : (
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Not marked yet.</p>
                    )}
                </div>
                {!todayAttendance && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => markAttendance('Present')}>
                            <CheckCircle size={18} /> Mark Present
                        </button>
                    </div>
                )}
            </div>

            <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map(record => (
                            <tr key={record._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ 
                                        background: record.status === 'Present' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                        color: record.status === 'Present' ? 'var(--secondary)' : 'var(--danger)', 
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '1rem', 
                                        fontSize: '0.875rem', 
                                        fontWeight: 500 
                                    }}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {attendance.length === 0 && (
                            <tr>
                                <td colSpan="2" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <CheckSquare size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                                    No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;
