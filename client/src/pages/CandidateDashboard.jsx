import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Search, FileText, BarChart3, Award, ArrowUpRight, Calendar, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [anlRes, resRes] = await Promise.all([
        axios.get('/api/analysis'),
        axios.get('/api/resumes')
      ]);

      if (anlRes.data.success) {
        setAnalyses(anlRes.data.analyses || []);
      }
      if (resRes.data.success) {
        setResumes(resRes.data.resumes || []);
      }
    } catch (err) {
      console.warn('Dashboard data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered analyses list
  const filteredAnalyses = analyses.filter((item) =>
    (item.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.resumeFileName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats Calculations
  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.atsScore, 0) / totalAnalyses)
    : 0;
  const bestScore = totalAnalyses > 0
    ? Math.max(...analyses.map(a => a.atsScore))
    : 0;
  const totalResumes = resumes.length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 2.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>
            Good to see you back, {user?.fullName.split(' ')[0]}.
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            Analyze your resume against a target role and find where you can improve.
          </p>
        </div>

        <Link to="/analysis/new" className="btn btn-lg btn-primary" style={{ borderRadius: '30px' }}>
          <PlusCircle size={18} /> + New Analysis
        </Link>
      </div>

      {/* Stats Summary Cards */}
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
            <BarChart3 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              TOTAL ANALYSES
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
              {totalAnalyses}
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
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              AVERAGE ATS SCORE
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
              {avgScore} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>/ 100</span>
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
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              BEST SCORE
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
              {bestScore} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>/ 100</span>
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
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              RESUMES ANALYZED
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
              {totalResumes}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Analyses Area */}
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
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-forest)' }}>Recent Analyses</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Review past resume score cards and download detailed PDF reports.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
              placeholder="Search by job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            Loading dashboard data...
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px border-dashed var(--color-border)'
          }}>
            <FileText size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>No analyses yet</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Start your first AI resume analysis to get an ATS compatibility score.
            </p>
            <Link to="/analysis/new" className="btn btn-primary">
              Start Your First Analysis
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredAnalyses.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem 1.25rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-forest)', marginBottom: '0.2rem' }}>
                    {item.jobTitle}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                    <span>📄 {item.resumeFileName}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{
                      fontSize: '1.35rem',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-serif)',
                      lineHeight: 1,
                      color: item.atsScore >= 75 ? 'var(--color-forest)' : (item.atsScore >= 60 ? 'var(--color-gold)' : 'var(--color-brick)')
                    }}>
                      {item.atsScore}%
                    </span>
                    <Badge variant={item.atsScore >= 75 ? 'forest' : (item.atsScore >= 60 ? 'gold' : 'brick')}>
                      {item.matchRating}
                    </Badge>
                  </div>

                  <button
                    onClick={() => navigate(`/analysis/${item._id}`)}
                    className="btn btn-sm btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    View Results <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
