import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';

const Departments = () => {
    const { api } = useContext(AuthContext);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({ name: '', description: '' });

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/admin/departments');
            setDepartments(res.data.data);
        } catch (err) {
            console.error('Failed to fetch departments', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [api]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (dep) => {
        setEditingId(dep._id);
        setFormData({ name: dep.name, description: dep.description });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await api.delete(`/admin/departments/${id}`);
                fetchDepartments();
            } catch (err) {
                alert(err.response?.data?.error || 'Error deleting department');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/admin/departments/${editingId}`, formData);
            } else {
                await api.post('/admin/departments', formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', description: '' });
            fetchDepartments();
        } catch (err) {
            alert(err.response?.data?.error || 'Error saving department');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', description: '' });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={24} color="var(--primary)" /> Departments Management
                    </h2>
                    <p>View and manage company departments here.</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    if (showForm) {
                        handleCancel();
                    } else {
                        setShowForm(true);
                    }
                }}>
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Add Department'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Department' : 'Add New Department'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Department Name</label>
                            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Engineering" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Brief description of the department..." />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update Department' : 'Save Department'}</button>
                            {editingId && <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>}
                        </div>
                    </form>
                </div>
            )}

            <div className="grid-cards">
                {departments.map(dep => (
                    <div key={dep._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEdit(dep)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }} title="Edit">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(dep._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }} title="Delete">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                                <Building2 size={24} color="var(--secondary)" />
                            </div>
                            <h3 style={{ margin: 0 }}>{dep.name}</h3>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            {dep.description || 'No description provided.'}
                        </p>
                    </div>
                ))}
                {departments.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1', background: 'white', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
                        <Building2 size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                        <p>No departments found. Add one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Departments;
