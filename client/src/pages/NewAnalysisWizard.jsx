import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, ArrowRight, ArrowLeft, Play } from 'lucide-react';
import Card from '../components/Card';
import StepIndicator from '../components/StepIndicator';
import LoadingState from '../components/LoadingState';

export default function NewAnalysisWizard() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeRecord, setResumeRecord] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jdText, setJdText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Handle File Selection & Upload via Multer API
  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext)) {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setError('');
    setFile(selectedFile);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const res = await API.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setResumeRecord(res.data.resume);
      } else {
        setError(res.data.error || 'Failed to parse resume');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Step 3 -> 4: Trigger AI Analysis
  const handleStartAnalysis = async () => {
    if (!resumeRecord || !jdText) {
      setError('Missing resume or job description input');
      return;
    }

    setError('');
    setAnalyzing(true);
    setStep(4); // Show Loading State

    try {
      const res = await API.post('/api/analysis/create', {
        resumeId: resumeRecord.id,
        jobTitle: jobTitle || 'Target Role',
        jdText
      });

      if (res.data.success) {
        // Wait briefly for loading animation to complete smoothly
        setTimeout(() => {
          navigate(`/analysis/${res.data.analysis._id}`);
        }, 3200);
      } else {
        setError(res.data.error || 'Analysis failed');
        setStep(3);
        setAnalyzing(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'AI Analysis failed');
      setStep(3);
      setAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>
          New Resume Analysis
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Evaluate your resume against your target role in 4 easy steps.
        </p>
      </div>

      {/* Step Progress Indicator */}
      <StepIndicator currentStep={step} />

      {error && (
        <div style={{
          backgroundColor: 'var(--color-brick-light)',
          border: '1px solid rgba(164, 61, 53, 0.3)',
          color: 'var(--color-brick)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* STEP 1 — UPLOAD RESUME */}
      {step === 1 && (
        <Card style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--color-forest)' }}>
            Step 1 — Upload Resume
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Select or drag your latest CV/Resume file. PDF or DOCX format required (Max 5MB).
          </p>

          {!resumeRecord ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: '2px dashed var(--color-border-dark)',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
              onClick={() => document.getElementById('resumeFileInput').click()}
            >
              <input
                id="resumeFileInput"
                type="file"
                accept=".pdf,.docx,.doc"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
              />
              <Upload size={44} style={{ color: 'var(--color-forest)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>
                {uploading ? 'Processing Resume...' : 'Click to browse or drag & drop'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                PDF or DOCX • Maximum file size 5MB
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-forest)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-forest)', margin: 0 }}>
                    {resumeRecord.fileName}
                  </h4>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                    <span>Size: {(resumeRecord.fileSize / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span style={{ color: 'var(--color-forest)', fontWeight: 600 }}>Extracted Successfully ✓</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setFile(null); setResumeRecord(null); }}
                className="btn btn-sm btn-secondary"
                title="Remove File"
              >
                <Trash2 size={15} /> Remove
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              disabled={!resumeRecord || uploading}
              onClick={() => setStep(2)}
              className="btn btn-primary"
            >
              Continue to Job Description <ArrowRight size={16} />
            </button>
          </div>
        </Card>
      )}

      {/* STEP 2 — JOB DESCRIPTION INPUT */}
      {step === 2 && (
        <Card style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--color-forest)' }}>
            Tell us about the role
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Provide the target job title and paste the complete job description text.
          </p>

          <div className="form-group">
            <label className="form-label">Job Title (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Senior Frontend Engineer / Product Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Target Job Description *</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {jdText.length} characters
              </span>
            </div>
            <textarea
              className="form-textarea"
              placeholder="Paste the target job description, key responsibilities, and required qualifications here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={8}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setStep(1)}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              disabled={!jdText.trim() || jdText.trim().length < 20}
              onClick={() => setStep(3)}
              className="btn btn-primary"
            >
              Continue to Confirmation <ArrowRight size={16} />
            </button>
          </div>
        </Card>
      )}

      {/* STEP 3 — ANALYSIS CONFIRMATION */}
      {step === 3 && (
        <Card style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--color-forest)' }}>
            Confirm Analysis Input
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Review your inputs before initializing the AI ATS scoring engine.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'var(--color-bg)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>Resume Document:</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{resumeRecord?.fileName} ✓</span>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>Target Role:</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--color-brick)' }}>{jobTitle || 'Target Role'}</span>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

            <div>
              <span style={{ fontWeight: 600, color: 'var(--color-forest)', display: 'block', marginBottom: '0.4rem' }}>
                Job Description Snippet:
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                "{jdText.substring(0, 220)}..."
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setStep(2)}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} /> Edit Inputs
            </button>
            <button
              onClick={handleStartAnalysis}
              className="btn btn-accent btn-lg"
            >
              <Play size={18} /> Analyze Resume Now
            </button>
          </div>
        </Card>
      )}

      {/* STEP 4 — AI ANALYSIS LOADING STATE */}
      {step === 4 && (
        <LoadingState />
      )}
    </div>
  );
}
