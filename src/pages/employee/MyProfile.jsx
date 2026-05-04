import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Briefcase, IndianRupee } from 'lucide-react';

const MyProfile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={24} color="var(--primary)" /> My Profile
                </h2>
                <p>Manage your personal information and account settings.</p>
            </div>

            <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                    <div style={{ 
                        width: '80px', height: '80px', 
                        borderRadius: '50%', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 'bold' 
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem' }}>{user?.name}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                            <Mail size={20} color="var(--primary)" />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email Address</p>
                            <p style={{ margin: 0, fontWeight: 500 }}>{user?.email}</p>
                        </div>
                    </div>

                    {user?.department && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                                <Briefcase size={20} color="var(--secondary)" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Department</p>
                                <p style={{ margin: 0, fontWeight: 500 }}>{user?.department?.name || 'Assigned Department'}</p>
                            </div>
                        </div>
                    )}
                    
                    {user?.salary && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                                <IndianRupee size={20} color="var(--warning)" />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Salary</p>
                                <p style={{ margin: 0, fontWeight: 500 }}>₹{user?.salary}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
