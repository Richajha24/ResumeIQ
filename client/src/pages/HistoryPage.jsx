import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Search, Download, ExternalLink, Trash2, Calendar, FileText, PlusCircle } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/analysis');
      if (res.data.success) {
        setAnalyses(res.data.analyses || []);
      }
    } catch (err) {
      console.warn('History fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis entry?')) return;

    try {
      await API.delete(`/api/analysis/${id}`);
      setAnalyses(analyses.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete analysis: ' + err.message);
    }
  };

  const handleDownload = async (id, jobTitle, e) => {
    e.stopPropagation();
    try {
      const response = await API.get(`/api/reports/${id}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = (jobTitle || 'Report').replace(/[^a-z0-9]/gi, '_');
      link.setAttribute('download', `ResumeIQ_Report_${safeTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Report download failed: ' + err.message);
    }
  };

  const filtered = analyses.filter(a =>
    (a.jobTitle || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.resumeFileName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>
            Analysis History
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Track and compare your past ATS resume evaluations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search by job title or resume..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => navigate('/analysis/new')}
            className="btn btn-primary"
          >
            <PlusCircle size={16} /> Start New Analysis
          </button>
        </div>
      </div>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            Loading analysis history...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)'
          }}>
            <FileText size={44} style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>No analyses yet</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your completed resume checks will be stored here for easy reference.
            </p>
            <button onClick={() => navigate('/analysis/new')} className="btn btn-primary">
              Start Your First Analysis
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-forest)', fontWeight: 600 }}>
                  <th style={{ padding: '0.85rem 1rem' }}>JOB TITLE</th>
                  <th style={{ padding: '0.85rem 1rem' }}>RESUME FILE</th>
                  <th style={{ padding: '0.85rem 1rem' }}>ATS SCORE</th>
                  <th style={{ padding: '0.85rem 1rem' }}>DATE</th>
                  <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item._id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/analysis/${item._id}`)}
                  >
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                      {item.jobTitle}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-main)' }}>
                      📄 {item.resumeFileName}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        marginRight: '0.5rem',
                        color: item.atsScore >= 75 ? 'var(--color-forest)' : (item.atsScore >= 60 ? 'var(--color-gold)' : 'var(--color-brick)')
                      }}>
                        {item.atsScore}%
                      </span>
                      <Badge variant={item.atsScore >= 75 ? 'forest' : (item.atsScore >= 60 ? 'gold' : 'brick')}>
                        {item.matchRating}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: 'var(--color-forest)', fontWeight: 600, fontSize: '0.85rem' }}>
                        Completed ✓
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => handleDownload(item._id, item.jobTitle, e)}
                          className="btn btn-sm btn-secondary"
                          title="Download PDF Report"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item._id, e)}
                          className="btn btn-sm btn-secondary"
                          title="Delete Record"
                        >
                          <Trash2 size={14} style={{ color: 'var(--color-brick)' }} />
                        </button>
                      </div>
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
