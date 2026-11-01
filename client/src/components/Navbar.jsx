import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileSearch, PlusCircle, History, Shield, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'var(--color-card)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1140px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Typographic Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-forest)',
            color: 'var(--color-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            R
          </div>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            letterSpacing: '-0.02em',
            color: 'var(--color-forest)'
          }}>
            Resume<span style={{ color: 'var(--color-brick)' }}>IQ</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {user ? (
            <>
              <Link 
                to="/dashboard"
                style={{
                  fontWeight: isActive('/dashboard') ? '600' : '500',
                  color: isActive('/dashboard') ? 'var(--color-forest)' : 'var(--color-text-muted)',
                  borderBottom: isActive('/dashboard') ? '2px solid var(--color-brick)' : '2px solid transparent',
                  paddingBottom: '2px'
                }}
              >
                Dashboard
              </Link>
              
              <Link 
                to="/analysis/new" 
                className="btn btn-sm btn-primary"
                style={{ borderRadius: '20px', padding: '0.4rem 1rem' }}
              >
                <PlusCircle size={15} /> New Analysis
              </Link>

              <Link 
                to="/history"
                style={{
                  fontWeight: isActive('/history') ? '600' : '500',
                  color: isActive('/history') ? 'var(--color-forest)' : 'var(--color-text-muted)',
                  borderBottom: isActive('/history') ? '2px solid var(--color-brick)' : '2px solid transparent',
                  paddingBottom: '2px'
                }}
              >
                History
              </Link>

              {isAdmin && (
                <Link 
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontWeight: isActive('/admin') ? '600' : '500',
                    color: isActive('/admin') ? 'var(--color-brick)' : 'var(--color-text-muted)',
                    borderBottom: isActive('/admin') ? '2px solid var(--color-brick)' : '2px solid transparent',
                    paddingBottom: '2px'
                  }}
                >
                  <Shield size={14} /> Admin
                </Link>
              )}

              {/* User Dropdown / Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginLeft: '0.5rem',
                paddingLeft: '0.75rem',
                borderLeft: '1px solid var(--color-border)'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                  {user.fullName.split(' ')[0]}
                </span>

                <button 
                  onClick={() => { logout(); navigate('/login'); }}
                  className="btn btn-sm btn-secondary"
                  title="Logout"
                  style={{ padding: '0.35rem 0.6rem' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontWeight: 500, color: 'var(--color-forest)' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
