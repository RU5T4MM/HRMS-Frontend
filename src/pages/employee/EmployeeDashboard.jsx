import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const EmployeeDashboard = () => {
    const { user, api } = useContext(AuthContext);
    const [attendance, setAttendance] = useState([]);
    const [markedToday, setMarkedToday] = useState(false);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await api.get('/employee/attendance');
                setAttendance(res.data.data);
                
                const today = new Date().toDateString();
                const hasMarked = res.data.data.some(record => new Date(record.date).toDateString() === today);
                setMarkedToday(hasMarked);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAttendance();
    }, [api]);

    const handleMarkAttendance = async () => {
        try {
            await api.post('/employee/attendance', { status: 'Present' });
            setMarkedToday(true);
            // Refresh
            const res = await api.get('/employee/attendance');
            setAttendance(res.data.data);
        } catch (err) {
            alert('Failed to mark attendance or already marked');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Hello, {user?.name}</h2>
                    <p>Welcome to your employee portal.</p>
                </div>
                <div>
                    <button 
                        className={`btn ${markedToday ? 'btn-outline' : 'btn-primary'}`} 
                        onClick={handleMarkAttendance}
                        disabled={markedToday}
                    >
                        {markedToday ? <><CheckCircle size={18}/> Attendance Marked</> : <><Clock size={18}/> Mark Attendance</>}
                    </button>
                </div>
            </div>

            <div className="grid-cards">
                <div className="card">
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} color="var(--primary)"/> Recent Attendance
                    </h3>
                    <div style={{ marginTop: '1rem' }}>
                        {attendance.slice(0, 5).map(record => (
                            <div key={record._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span>{new Date(record.date).toLocaleDateString()}</span>
                                <span className="badge badge-success">{record.status}</span>
                            </div>
                        ))}
                        {attendance.length === 0 && <p>No records found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
