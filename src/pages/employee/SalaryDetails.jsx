import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { IndianRupee, FileText } from 'lucide-react';

const SalaryDetails = () => {
    const { api, user } = useContext(AuthContext);
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const res = await api.get('/employee/salary');
                setSalary(res.data.data.salary);
            } catch (err) {
                console.error('Failed to fetch salary', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSalary();
    }, [api]);

    const handleDownload = () => {
        if (!salary) return;
        
        const payslipContent = `
            <html>
                <head>
                    <title>Payslip - ${user?.name}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                        .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
                        .details { margin-bottom: 30px; line-height: 1.8; font-size: 16px; }
                        .salary-box { background: #f9fafb; border: 1px solid #e5e7eb; padding: 30px; text-align: center; border-radius: 8px; }
                        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                        strong { color: #111827; display: inline-block; width: 150px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 style="color: #4f46e5; margin: 0 0 10px 0;">HRMS Portal</h1>
                        <h2 style="margin: 0; color: #4b5563; font-weight: 500;">Official Payslip</h2>
                    </div>
                    <div class="details">
                        <p><strong>Employee Name:</strong> ${user?.name}</p>
                        <p><strong>Email Address:</strong> ${user?.email}</p>
                        <p><strong>Department:</strong> ${user?.department?.name || 'N/A'}</p>
                        <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="salary-box">
                        <h3 style="margin: 0 0 10px 0; color: #4b5563;">Total Net Salary</h3>
                        <h1 style="color: #10b981; font-size: 3rem; margin: 0;">₹${salary.toLocaleString('en-IN')}</h1>
                    </div>
                    <div class="footer">
                        <p>This is a computer-generated document. No physical signature is required.</p>
                    </div>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(payslipContent);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IndianRupee size={24} color="var(--primary)" /> Salary Details
                </h2>
                <p>View your current salary information.</p>
            </div>

            <div className="card" style={{ maxWidth: '600px', textAlign: 'center', padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 5vw, 2rem)' }}>
                <div style={{ 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    width: 'clamp(60px, 10vw, 80px)', height: 'clamp(60px, 10vw, 80px)', 
                    borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 1.5rem' 
                }}>
                    <IndianRupee size={32} color="var(--secondary)" />
                </div>
                
                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)' }}>Your Current Salary</h3>
                <h1 style={{ margin: '0 0 2rem', fontSize: 'clamp(2rem, 8vw, 3rem)', color: 'var(--text)' }}>
                    {salary ? `₹${salary.toLocaleString('en-IN')}` : 'Not Assigned'}
                </h1>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={handleDownload} disabled={!salary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: !salary ? 0.5 : 1 }}>
                        <FileText size={18} /> Download Payslip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalaryDetails;
