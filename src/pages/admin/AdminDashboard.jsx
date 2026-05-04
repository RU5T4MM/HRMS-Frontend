import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Users, Building2, Calendar, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, api } = useContext(AuthContext);
    const [stats, setStats] = useState({ employees: 0, departments: 0, leaves: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [empRes, depRes, leaveRes] = await Promise.all([
                    api.get('/admin/employees'),
                    api.get('/admin/departments'),
                    api.get('/admin/leaves')
                ]);
                setStats({
                    employees: empRes.data.count,
                    departments: depRes.data.count,
                    leaves: leaveRes.data.data.filter(l => l.status === 'Pending').length
                });
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };
        fetchStats();
    }, [api]);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome back, {user?.name} 👋</h2>
                <p>Here's what's happening in your organization today.</p>
            </div>

            <div className="grid-cards">
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Users size={28} color="var(--primary)" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Total Employees</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.employees}</h3>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Building2 size={28} color="var(--secondary)" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Departments</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.departments}</h3>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Calendar size={28} color="var(--warning)" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Pending Leaves</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.leaves}</h3>
                    </div>
                </div>
            </div>
            
        <div className="card">
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={() => navigate('/admin/employees')}><Users size={16}/> View Employees</button>
                <button className="btn btn-outline" onClick={() => navigate('/admin/departments')}><Building2 size={16}/> View Departments</button>
            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;
