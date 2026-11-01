import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, BarChart3, FileCheck, Award, Lock, Search } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalAnalyses: 0,
    totalResumes: 0,
    averageAtsScore: 0,
    reportsGenerated: 0
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        API.get('/api/admin/stats'),
        API.get('/api/admin/users')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', padding: '3rem' }}>
        <Lock size={44} style={{ color: 'var(--color-brick)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
          Access Restricted
        </h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          You must be logged in with Administrator privileges to view platform statistics and manage user accounts.
        </p>
      </Card>
    );
  }

  const filteredUsers = users.filter(u =>
    (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Admin Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 2.5rem'
      }}>
        <div>
          <div className="badge badge-brick" style={{ marginBottom: '0.5rem' }}>
            <Shield size={14} /> Platform Administrator Area
          </div>
          <h1 style={{ fontSize: '2.2rem', margin: 0 }}>
            System Monitoring & User Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Aggregate statistics and candidate user account governance.
          </p>
        </div>
      </div>

      {/* Admin Metric Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              TOTAL USERS
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
              {stats.totalUsers}
            </div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-brick)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              TOTAL ANALYSES
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
              {stats.totalAnalyses}
            </div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              AVG ATS SCORE
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
              {stats.averageAtsScore}%
            </div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              REPORTS GENERATED
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
              {stats.reportsGenerated}
            </div>
          </div>
        </Card>
      </div>

      {/* User Governance Table */}
      <Card>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-forest)' }}>Candidate Accounts</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Privacy-respecting account management. Candidate resume texts remain private.
            </p>
          </div>

          <div style={{ position: 'relative', minWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            Loading platform accounts...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-forest)', fontWeight: 600 }}>
                  <th style={{ padding: '0.85rem 1rem' }}>NAME</th>
                  <th style={{ padding: '0.85rem 1rem' }}>EMAIL ADDRESS</th>
                  <th style={{ padding: '0.85rem 1rem' }}>ROLE</th>
                  <th style={{ padding: '0.85rem 1rem' }}>JOINED DATE</th>
                  <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                      {u.fullName}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-main)' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Badge variant={u.role === 'admin' ? 'brick' : 'forest'}>
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>
                      {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: 'var(--color-forest)', fontWeight: 600, fontSize: '0.85rem' }}>
                        Active ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
