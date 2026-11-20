'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DEMO_CREDENTIALS } from '@/lib/auth-session';

export function ModuleLogin() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get('error') === 'invalid';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="module-login-screen">
      <section className="module-login-visual" aria-label="Pharmacy illustration">
        <Image
          alt="Pharmacy shelves"
          className="module-login-visual-image"
          fill
          priority
          sizes="330px"
          src="/auth/pharmacy-shelf.png"
        />
      </section>

      <section className="module-login-brand">
        <div style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}>
          <Image
            src="/rayyan-logo.png"
            alt="Rayyan Trading Logo"
            width={90}
            height={90}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <h1>
          <span className="brand-name-solution">Rayyan</span>{' '}
          <span className="brand-name-pos">Trading</span>
        </h1>

        <p className="module-brand-tagline">Sales, Inventory &amp; Point of Sale Management</p>
        <p className="module-brand-desc">Point of sale, stock tracking, billing, and customer management for Rayyan Trading.</p>
      </section>

      <section className="module-login-card">
        <div className="module-login-title">
          <h2>Welcome Back!</h2>
          <p>Login to your account</p>
        </div>

        <form action="/api/demo-login" className="module-login-form" method="post">
          <input name="from" type="hidden" value="modules" />

          <label>
            <span>Email</span>
            <div className="module-input">
              <Mail />
              <input
                autoComplete="username"
                defaultValue="rayyantrading"
                name="email"
                placeholder="Enter username or email"
                required
                type="text"
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="module-input">
              <KeyRound />
              <input
                autoComplete="current-password"
                defaultValue="rayyantrading12"
                name="password"
                placeholder="Enter your password"
                required
                type={showPassword ? 'text' : 'password'}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                }}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </label>

          {hasError ? (
            <p className="module-auth-error" role="alert">
              Invalid email or password.
            </p>
          ) : null}

          <div className="module-login-row">
            <label>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link href="/modules/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit">Sign In</button>
        </form>

        <div className="module-login-quick" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          <a
            className="module-login-quick-button"
            href="/api/demo-login?role=rayyan"
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              background: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            One-Click Login (Rayyan Trading Admin)
          </a>
        </div>


      </section>
    </main>
  );
}
