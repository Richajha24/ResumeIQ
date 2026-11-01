import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, RefreshCw, AlertTriangle, CheckCircle2, Sparkles, FileText, ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';
import Card from '../components/Card';
import ScoreCircle from '../components/ScoreCircle';
import Badge from '../components/Badge';

export default function AnalysisResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/analysis/${id}`);
      if (res.data.success) {
        setAnalysis(res.data.analysis);
      } else {
        setError('Analysis record not found');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const response = await axios.get(`/api/reports/${id}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = (analysis?.jobTitle || 'Analysis').replace(/[^a-z0-9]/gi, '_');
      link.setAttribute('download', `ResumeIQ_Report_${safeTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF report: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
        Loading your analysis report...
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <Card style={{ maxWidth: '540px', margin: '3rem auto', textAlign: 'center', padding: '2.5rem' }}>
        <AlertTriangle size={48} style={{ color: 'var(--color-brick)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
          Report Not Found
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          {error || 'Unable to retrieve analysis metrics for this ID.'}
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
      </Card>
    );
  }

  const { atsScore, matchRating, breakdown, missingSkills, formattingIssues, suggestions, matchSummary, jobTitle, resumeFileName } = analysis;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      {/* Top Title Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TARGET ROLE:</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-forest)' }}>{jobTitle}</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-forest)', margin: 0 }}>
            Your Resume Analysis
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Here's how your resume matches the target role ({resumeFileName}).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="btn btn-accent"
          >
            <Download size={16} /> {downloading ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
          <Link to="/analysis/new" className="btn btn-secondary">
            <RefreshCw size={16} /> Analyze Again
          </Link>
        </div>
      </div>

      {/* Hero Score Showcase Card */}
      <Card style={{
        padding: '2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            OVERALL COMPATIBILITY SCORE
          </div>
          <ScoreCircle score={atsScore} size={180} matchRating={matchRating} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', color: 'var(--color-forest)' }}>
            ATS Compatibility Rating
          </h2>
          <p style={{ color: 'var(--color-text-main)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {matchSummary || 'Your resume demonstrates a solid baseline match with the specified job requirements. Addressing highlighted skill gaps will maximize recruiter visibility.'}
          </p>

          {/* 4 Metric Breakdown Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ATS SCORE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
                {atsScore}%
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>SKILL MATCH</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
                {breakdown?.skillMatch || 75}%
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>FORMATTING</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
                {breakdown?.formattingScore || 80}%
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>KEYWORD DENSITY</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-forest)', fontFamily: 'var(--font-serif)' }}>
                {breakdown?.keywordMatch || 70}%
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2 — MISSING SKILLS */}
      <Card style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <AlertTriangle size={22} style={{ color: 'var(--color-brick)' }} />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-forest)' }}>
            Skill & Keyword Gaps
          </h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          These skills appear in the job description but are missing or underrepresented in your resume.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {missingSkills && missingSkills.length > 0 ? (
            missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="badge badge-brick"
                style={{ fontSize: '0.9rem', padding: '0.45rem 0.95rem' }}
              >
                + {skill}
              </span>
            ))
          ) : (
            <p style={{ color: 'var(--color-forest)', fontSize: '0.9rem' }}>
              ✓ No critical missing skills detected for this role!
            </p>
          )}
        </div>
      </Card>

      {/* SECTION 3 — FORMATTING ISSUES */}
      <Card style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <FileText size={22} style={{ color: 'var(--color-forest)' }} />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-forest)' }}>
            Formatting & ATS Readability
          </h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Structural factors affecting automated resume parsing tools.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {formattingIssues && formattingIssues.length > 0 ? (
            formattingIssues.map((issue, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                backgroundColor: 'var(--color-bg)',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)'
              }}>
                <span style={{ color: 'var(--color-brick)', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 1 }}>•</span>
                <span style={{ fontSize: '0.925rem', color: 'var(--color-text-main)' }}>{issue}</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--color-forest)', fontSize: '0.9rem' }}>
              ✓ Formatting adheres strictly to standard single-column ATS layouts.
            </p>
          )}
        </div>
      </Card>

      {/* SECTION 4 — AI SUGGESTIONS */}
      <Card style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Sparkles size={22} style={{ color: 'var(--color-gold)' }} />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-forest)' }}>
            Personalized Improvements
          </h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Actionable recommendations generated specifically for your resume and target role.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((sug, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '1.25rem',
                backgroundColor: 'var(--color-bg)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'var(--color-brick)',
                  lineHeight: 1
                }}>
                  0{idx + 1}
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                  {sug}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No suggestions available.</p>
          )}
        </div>
      </Card>

      {/* Bottom Summary Bar */}
      <div style={{
        backgroundColor: 'var(--color-forest)',
        color: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div>
          <h3 style={{ color: 'var(--color-card)', fontSize: '1.6rem', marginBottom: '0.25rem' }}>
            Ready to improve your resume?
          </h3>
          <p style={{ color: '#D0D8D2', fontSize: '0.9rem' }}>
            Download the official PDF diagnostic report or run another check with an updated resume.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="btn btn-accent btn-lg"
          >
            <Download size={18} /> {downloading ? 'Downloading...' : 'Download PDF Report'}
          </button>

          <Link to="/analysis/new" className="btn btn-secondary btn-lg" style={{ color: 'var(--color-card)', borderColor: '#5C7363' }}>
            <RefreshCw size={18} /> Analyze Again
          </Link>
        </div>
      </div>
    </div>
  );
}
