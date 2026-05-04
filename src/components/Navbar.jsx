import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title }) => {
    const { user, api } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    
    const notifRef = useRef(null);
    const searchRef = useRef(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Notifications
    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [api]);

    const handleMarkAsRead = async (id, link) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setShowNotifications(false);
            if (link) navigate(link);
        } catch (err) {
            console.error('Failed to mark read', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Search Logic
    const searchLinks = user?.role === 'admin' 
        ? [
            { label: 'Employees', path: '/admin/employees' },
            { label: 'Departments', path: '/admin/departments' },
            { label: 'Leave Approvals', path: '/admin/leaves' },
          ]
        : [
            { label: 'My Profile', path: '/employee' },
            { label: 'Leave Requests', path: '/employee/leaves' },
            { label: 'Attendance', path: '/employee/attendance' },
            { label: 'Salary Details', path: '/employee/salary' },
          ];

    const filteredSearch = searchLinks.filter(link => 
        link.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 2rem',
            backgroundColor: 'var(--card-bg)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{title || 'Dashboard'}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                
                {/* Search Bar */}
                <div ref={searchRef} style={{ position: 'relative' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        backgroundColor: 'var(--bg-color)',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <Search size={18} color="var(--text-muted)" />
                        <input 
                            type="text" 
                            placeholder="Quick Search..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSearch(true);
                            }}
                            onFocus={() => setShowSearch(true)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                                marginLeft: '0.5rem',
                                fontSize: '0.875rem',
                                width: '200px'
                            }}
                        />
                    </div>
                    {showSearch && searchQuery && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, width: '100%',
                            marginTop: '0.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 100, overflow: 'hidden'
                        }}>
                            {filteredSearch.length > 0 ? filteredSearch.map((item, idx) => (
                                <div key={idx} onClick={() => { navigate(item.path); setShowSearch(false); setSearchQuery(''); }}
                                     style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                                     onMouseEnter={(e) => e.target.style.background = 'var(--bg-color)'}
                                     onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    {item.label}
                                </div>
                            )) : (
                                <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No results found</div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Notifications */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                    <button onClick={() => setShowNotifications(!showNotifications)} style={{ position: 'relative', background: 'transparent', padding: '0.5rem', cursor: 'pointer', border: 'none' }}>
                        <Bell size={20} color="var(--text-muted)" />
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px',
                                backgroundColor: 'var(--danger)', borderRadius: '50%'
                            }}></span>
                        )}
                    </button>
                    
                    {showNotifications && (
                        <div style={{
                            position: 'absolute', top: '100%', right: 0, width: '320px',
                            marginTop: '0.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 100,
                            maxHeight: '400px', overflowY: 'auto'
                        }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Notifications {unreadCount > 0 && <span style={{ background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{unreadCount} New</span>}
                            </div>
                            {notifications.length > 0 ? notifications.map(n => (
                                <div key={n._id} onClick={() => handleMarkAsRead(n._id, n.link)}
                                     style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', background: n.isRead ? 'transparent' : 'rgba(79, 70, 229, 0.05)' }}
                                     onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                                     onMouseLeave={(e) => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(79, 70, 229, 0.05)'}
                                >
                                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: n.isRead ? 'var(--text-muted)' : 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', lineHeight: '1.4' }}>
                                        <span style={{ fontWeight: n.isRead ? 400 : 600 }}>{n.message}</span>
                                        {!n.isRead && <span style={{ minWidth: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block', marginTop: '4px' }}></span>}
                                    </p>
                                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(n.createdAt).toLocaleString()}</small>
                                </div>
                            )) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No new notifications</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
