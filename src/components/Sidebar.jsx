import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    Users, 
    Building2, 
    Calendar, 
    CreditCard, 
    LogOut,
    UserCircle,
    CheckSquare,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { user, logout } = useContext(AuthContext);

    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
        { name: 'Employees', path: '/admin/employees', icon: <Users size={20} /> },
        { name: 'Departments', path: '/admin/departments', icon: <Building2 size={20} /> },
        { name: 'Leave Approvals', path: '/admin/leaves', icon: <CheckSquare size={20} /> },
    ];

    const employeeLinks = [
        { name: 'Dashboard', path: '/employee', icon: <LayoutDashboard size={20} />, exact: true },
        { name: 'My Profile', path: '/employee/profile', icon: <UserCircle size={20} /> },
        { name: 'Leave Requests', path: '/employee/leaves', icon: <Calendar size={20} /> },
        { name: 'Attendance', path: '/employee/attendance', icon: <CheckSquare size={20} /> },
        { name: 'Salary Details', path: '/employee/salary', icon: <CreditCard size={20} /> },
    ];

    const links = user?.role === 'admin' ? adminLinks : employeeLinks;

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{
            width: '260px',
            backgroundColor: 'var(--sidebar-bg)',
            color: 'var(--sidebar-text)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: 0
        }}>
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: 'var(--primary)',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        display: 'flex'
                    }}>
                        <Building2 size={24} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600, color: 'white' }}>HRMS Pro</h2>
                </div>
                
                <button className="sidebar-close-btn" onClick={closeSidebar}>
                    <X size={24} />
                </button>
            </div>

            <div style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
                {links.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        end={link.exact}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                            backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                            fontWeight: isActive ? 500 : 400,
                            transition: 'all 0.2s'
                        })}
                    >
                        {link.icon}
                        {link.name}
                    </NavLink>
                ))}
            </div>

            <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '1rem',
                    padding: '0 0.5rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem', color: 'white' }}>{user?.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{user?.role}</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        color: '#FCA5A5',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(252, 165, 165, 0.2)'
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
