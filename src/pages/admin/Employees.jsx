import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Users, Plus, Trash2, Edit2 } from 'lucide-react';

const Employees = () => {
    const { api } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', department: '', salary: ''
    });

    const fetchData = async () => {
        try {
            const [empRes, depRes] = await Promise.all([
                api.get('/admin/employees'),
                api.get('/admin/departments')
            ]);
            setEmployees(empRes.data.data);
            setDepartments(depRes.data.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [api]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (emp) => {
        setEditingId(emp._id);
        setFormData({
            name: emp.name,
            email: emp.email,
            password: '', // don't show password, leave blank unless changing
            department: emp.department?._id || '',
            salary: emp.salary || ''
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', email: '', password: '', department: '', salary: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remove password from payload if it's empty during edit
            const payload = { ...formData };
            if (editingId && !payload.password) {
                delete payload.password;
            }

            if (editingId) {
                await api.put(`/admin/employees/${editingId}`, payload);
            } else {
                await api.post('/admin/employees', payload);
            }
            handleCancel();
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Error saving employee');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`/admin/employees/${id}`);
                fetchData();
            } catch (err) {
                alert('Error deleting employee');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={24} color="var(--primary)" /> Employees Management
                    </h2>
                    <p>View and manage all employees here.</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    if (showForm) {
                        handleCancel();
                    } else {
                        setShowForm(true);
                    }
                }}>
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Add Employee'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Employee Details' : 'Add New Employee'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password {editingId && <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>(Leave blank to keep current)</span>}</label>
                            <input type="password" className="form-input" name="password" value={formData.password} onChange={handleChange} required={!editingId} minLength="6" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select className="form-input" name="department" value={formData.department} onChange={handleChange} required>
                                <option value="">Select Department</option>
                                {departments.map(d => (
                                    <option key={d._id} value={d._id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Salary</label>
                            <input type="number" className="form-input" name="salary" value={formData.salary} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update Employee' : 'Save Employee'}</button>
                            {editingId && <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>}
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Department</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Salary</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{emp.name}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{emp.email}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                        {emp.department?.name || 'N/A'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>₹{emp.salary || 0}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(emp)} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit Employee">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(emp._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Employee">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                                    No employees found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employees;
