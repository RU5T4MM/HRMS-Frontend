import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, Building, ArrowRight, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', department: ''
    });
    const [departments, setDepartments] = useState([]);
    const { register, error, api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [localError, setLocalError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await api.get('/auth/departments');
                setDepartments(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch departments for registration', err);
            }
        };
        fetchDepartments();
    }, [api]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setIsLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.department);
            navigate('/employee');
        } catch (err) {
            setLocalError('Registration failed. Please check your details.');
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
            
            {/* Left Panel - Branding */}
            <div style={{
                flex: '1.2',
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4rem',
                background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }} className="auth-left-panel">
                
                {/* Abstract Decorative Elements */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'rgba(16, 185, 129, 0.4)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                        <div style={{ background: 'white', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building size={28} color="#10B981" />
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'white', letterSpacing: '-0.5px' }}>HRMS Workspace</h1>
                    </div>
                    
                    <div style={{ marginTop: '10vh' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'white', letterSpacing: '-1px' }}>
                            Join the team.<br />Start growing<br />with us.
                        </h2>
                        <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '450px', lineHeight: 1.6 }}>
                            Register now to access your personalized employee dashboard, manage leaves, view attendance, and track your salary.
                        </p>
                    </div>
                </div>
                
                <div style={{ position: 'relative', zIndex: 1, marginTop: '4rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '20px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>
                        <div style={{ width: '40px', height: '4px', background: 'white', borderRadius: '2px' }}></div>
                        <div style={{ width: '20px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>© 2026 HRMS Inc. All rights reserved.</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '2rem',
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%',
                backgroundColor: '#ffffff'
            }}>
                <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Create Account</h2>
                        <p style={{ color: '#6B7280', fontSize: '1rem' }}>Enter your details to register as an employee.</p>
                    </div>

                    {(error || localError) && (
                        <div style={{ 
                            background: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#991B1B', 
                            padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem',
                            display: 'flex', alignItems: 'center'
                        }}>
                            {error || localError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#9CA3AF', display: 'flex' }}>
                                    <User size={20} strokeWidth={2} />
                                </div>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    style={{
                                        width: '100%', padding: '0.875rem 1rem 0.875rem 3rem',
                                        border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '1rem',
                                        outline: 'none', transition: 'all 0.2s', background: '#FFFFFF',
                                        color: '#111827'
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#9CA3AF', display: 'flex' }}>
                                    <Mail size={20} strokeWidth={2} />
                                </div>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@company.com"
                                    required
                                    style={{
                                        width: '100%', padding: '0.875rem 1rem 0.875rem 3rem',
                                        border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '1rem',
                                        outline: 'none', transition: 'all 0.2s', background: '#FFFFFF',
                                        color: '#111827'
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#9CA3AF', display: 'flex' }}>
                                    <Lock size={20} strokeWidth={2} />
                                </div>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    minLength="6"
                                    style={{
                                        width: '100%', padding: '0.875rem 1rem 0.875rem 3rem',
                                        border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '1rem',
                                        outline: 'none', transition: 'all 0.2s', background: '#FFFFFF',
                                        color: '#111827'
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Department</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#9CA3AF', display: 'flex' }}>
                                    <Building size={20} strokeWidth={2} />
                                </div>
                                <select 
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%', padding: '0.875rem 1rem 0.875rem 3rem',
                                        border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '1rem',
                                        outline: 'none', transition: 'all 0.2s', background: '#FFFFFF',
                                        color: formData.department ? '#111827' : '#9CA3AF',
                                        appearance: 'none'
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                                >
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(d => (
                                        <option key={d._id} value={d._id} style={{ color: '#111827' }}>{d.name}</option>
                                    ))}
                                </select>
                                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: '#9CA3AF', pointerEvents: 'none' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{ 
                                width: '100%', padding: '0.875rem', marginTop: '1rem',
                                background: '#10B981', color: 'white', border: 'none', borderRadius: '0.5rem',
                                fontSize: '1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                                cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3), 0 2px 4px -1px rgba(16, 185, 129, 0.1)'
                            }}
                            onMouseEnter={(e) => !isLoading && (e.target.style.background = '#059669', e.target.style.transform = 'translateY(-1px)')}
                            onMouseLeave={(e) => !isLoading && (e.target.style.background = '#10B981', e.target.style.transform = 'translateY(0)')}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
                        </button>
                    </form>
                    
                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                            Already have an account? <Link to="/" style={{ color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>Sign In here</Link>
                        </p>
                    </div>
                </div>
            </div>
            
            <style>
                {`
                @media (min-width: 1024px) {
                    .auth-left-panel {
                        display: flex !important;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Register;
