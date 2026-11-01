import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, FileText, Cpu, Download, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';
import ScoreCircle from '../components/ScoreCircle';

export default function LandingPage() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '3.5rem 2.5rem',
        boxShadow: 'var(--shadow-card)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'center'
      }}>
        <div>
          <div className="badge badge-brick" style={{ marginBottom: '1.25rem' }}>
            <ShieldCheck size={14} /> AI-Powered ATS Score & Resume Optimizer
          </div>
          
          <h1 style={{
            fontSize: '3rem',
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            color: 'var(--color-forest)'
          }}>
            Know how your resume performs <span style={{ color: 'var(--color-brick)', fontStyle: 'italic' }}>before</span> the recruiter does.
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--color-text-muted)',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Upload your resume, compare it against a target job description, and get an AI-powered ATS score with actionable improvement suggestions.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/analysis/new" className="btn btn-lg btn-primary">
              Analyze My Resume <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn btn-lg btn-secondary">
              How It Works
            </a>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            Sample Resume Analysis
          </div>

          <ScoreCircle score={84} size={150} matchRating="Strong Match" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginTop: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ backgroundColor: 'var(--color-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Skill Compatibility</div>
              <div style={{ fontWeight: 'bold', color: 'var(--color-forest)', fontSize: '1.1rem' }}>88%</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ATS Formatting</div>
              <div style={{ fontWeight: 'bold', color: 'var(--color-forest)', fontSize: '1.1rem' }}>92%</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Key Outcomes Section */}
      <section>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            Four Critical Resume Diagnostics
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Get instant clarity on why your resume gets passed over or shortlisted by modern corporate recruitment systems.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          <Card>
            <div style={{ color: 'var(--color-brick)', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>ATS Score</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Understand your resume's overall compatibility score with the target role before applying.
            </p>
          </Card>

          <Card>
            <div style={{ color: 'var(--color-brick)', marginBottom: '0.75rem' }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Skill Gaps</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Identify missing technical keywords, frameworks, and domain expertise required for the job.
            </p>
          </Card>

          <Card>
            <div style={{ color: 'var(--color-brick)', marginBottom: '0.75rem' }}>
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Formatting Issues</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Find structural problems, non-standard section titles, or layout elements that affect ATS parsing.
            </p>
          </Card>

          <Card>
            <div style={{ color: 'var(--color-brick)', marginBottom: '0.75rem' }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>AI Suggestions</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Get personalized, numbered improvement suggestions powered by advanced language models.
            </p>
          </Card>
        </div>
      </section>

      {/* 4-Step Workflow Section */}
      <section id="how-it-works" style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2.5rem'
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-brick)', letterSpacing: '0.08em' }}>
            GUIDED WORKFLOW
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>
            Simple 4-Step Analysis Process
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { step: '01', title: 'Upload Resume', desc: 'Drag and drop your resume in PDF or DOCX format.' },
            { step: '02', title: 'Add Job Description', desc: 'Paste the target job description text for comparison.' },
            { step: '03', title: 'AI Analysis', desc: 'Our engine parses syntax, skills, and section headers.' },
            { step: '04', title: 'Improve & Download', desc: 'Review detailed metrics and export a PDF audit report.' }
          ].map((item) => (
            <div key={item.step} style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem'
            }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                color: 'var(--color-brick)',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--color-forest)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Future Roadmap / Scope Note */}
      <section style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px border-dashed var(--color-border-dark)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontWeight: 600, color: 'var(--color-forest)', fontSize: '0.95rem' }}>
            Platform Scope & Roadmap
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Core MVP focuses on precision ATS Scoring and Resume Parsing. Future modules (Cover Letter Generator & Interview Preparation) are in active research.
          </p>
        </div>
        <div className="badge badge-gold">
          Future Scope Included
        </div>
      </section>

      {/* Bottom Compact CTA */}
      <section style={{
        backgroundColor: 'var(--color-forest)',
        color: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2.5rem',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--color-card)', fontSize: '2.2rem', marginBottom: '0.75rem' }}>
          Ready to test your resume's ATS score?
        </h2>
        <p style={{ color: '#D0D8D2', maxWidth: '560px', margin: '0 auto 1.75rem auto' }}>
          Create an account to save analysis history or run your first instant check now.
        </p>
        <Link to="/register" className="btn btn-lg btn-accent">
          Create Account & Start Analysis <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
