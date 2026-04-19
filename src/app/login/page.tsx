'use client';
import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        router.replace('/admin/dashboard');
      }
    });
    return unsubscribe;
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const defaultAdminEmail = 'admin@baps.com';
    const defaultAdminPassword = 'admin123';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      const code = firebaseError?.code || '';
      const shouldSeedAdmin = email === defaultAdminEmail && password === defaultAdminPassword;

      if ((code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') && shouldSeedAdmin) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          router.push('/admin/dashboard');
          return;
        } catch (createErr: unknown) {
          const createMessage = createErr instanceof Error ? createErr.message : 'Unable to create admin user';
          setError(createMessage.replace('Firebase: ', '').replace('(auth/', '').replace(').', ''));
          return;
        }
      }

      const message = firebaseError?.message || 'Login failed';
      setError(message.replace('Firebase: ', '').replace('(auth/', '').replace(').', ''));
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #312E81 70%, #1E3A5F 100%)',
      fontFamily: "'Inter', -apple-system, sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated mesh blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[
          { w: 600, h: 600, top: '-10%', left: '-5%', color: 'rgba(99,102,241,0.15)' },
          { w: 500, h: 500, top: '50%', right: '-8%', color: 'rgba(139,92,246,0.12)' },
          { w: 400, h: 400, bottom: '10%', left: '30%', color: 'rgba(59,130,246,0.1)' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: b.w, height: b.h,
            top: b.top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
            borderRadius: '50%', background: b.color, filter: 'blur(80px)',
            animation: `blobPulse ${3 + i}s ease-in-out infinite alternate`,
          }} />
        ))}
        {/* Grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <style>{`
        @keyframes blobPulse { from { transform: scale(1); } to { transform: scale(1.15); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes logoIn { from { opacity:0; transform:scale(0.7) translateY(-20px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes spinAnim { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .login-input {
          width: 100%; padding: 14px 16px;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          color: white; font-size: 15px; outline: none;
          transition: all 0.2s; box-sizing: border-box;
          font-family: inherit;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.35); }
        .login-input:focus {
          border-color: rgba(99,102,241,0.8);
          background: rgba(99,102,241,0.1);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
        }
        .btn-login {
          width: 100%; padding: 15px; border: none;
          border-radius: 12px; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
          font-family: inherit;
        }
        .btn-login:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.45) !important;
        }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .demo-btn:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 440, animation: 'fadeUp 0.6s ease-out' }}>

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, animation: 'logoIn 0.7s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 0 0 4px rgba(99,102,241,0.2), 0 0 0 8px rgba(99,102,241,0.1), 0 20px 40px rgba(99,102,241,0.4)',
            }}>
              <Image
                src="/assets/logo.svg"
                alt="BAPS Offline Shopping"
                width={60}
                height={60}
                style={{ borderRadius: 8, objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24, padding: '40px 36px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase' }}>Secure Access</span>
              </div>
              <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                BAPS Admin Panel
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: '8px 0 0', lineHeight: 1.5 }}>
                Sign in to manage shops, cashbacks &amp; rewards platform
              </p>
            </div>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, letterSpacing: 0.3 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.5 }}>📧</span>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@baps.com" required
                    className="login-input" style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, letterSpacing: 0.3 }}>Password</label>
                  <button type="button" style={{ background: 'none', border: 'none', color: '#A5B4FC', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.5 }}>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password" required
                    className="login-input" style={{ paddingLeft: 42, paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.6,
                  }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#FCA5A5', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-login" style={{
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
              }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{
                      width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block',
                      animation: 'spinAnim 0.7s linear infinite',
                    }} />
                    Authenticating...
                  </span>
                ) : 'Get Access →'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>QUICK ACCESS</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Demo fill */}
            <button
              type="button"
              className="demo-btn"
              onClick={() => { setEmail('admin@baps.com'); setPassword('admin123'); }}
              style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)', fontSize: 13,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}>
              🧪 Fill demo credentials
            </button>
          </div>

          {/* Security badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 28, flexWrap: 'wrap' }}>
            {['🔐 256-bit SSL', '🛡️ 2FA Ready', '⚡ Real-time'].map(b => (
              <span key={b} style={{
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500,
              }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '16px 24px', position: 'relative', zIndex: 1 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, margin: 0 }}>
          Bapsoffline.com &nbsp;·&nbsp; All Rights Reserved &nbsp;·&nbsp; India &nbsp;·&nbsp; 2026 &nbsp;·&nbsp;
          <span style={{ color: 'rgba(99,102,241,0.6)' }}>Voltoro.Studio</span>
        </p>
      </div>
    </div>
  );
}
