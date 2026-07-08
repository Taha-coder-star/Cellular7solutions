import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell, AuthHead, Button, Icon, Input } from '@/components/ui';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setSent(true);
  }

  return (
    <AuthShell>
      <button
        type="button"
        onClick={() => navigate('/login')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', cursor: 'pointer' }}
      >
        <Icon name="chevron-left" size={16} />
        Back to login
      </button>

      <AuthHead title="Forgot password?" subtitle="No problem. We'll email you a reset link." />

      {sent ? (
        <p style={{ margin: 0, textAlign: 'center', fontSize: '14px', color: 'var(--text-body)' }}>
          Check your inbox — we've sent a reset link to <strong>{email}</strong>.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={<Icon name="mail" size={18} />}
            value={email}
            error={error}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="product" fullWidth>
            Send Reset Link
          </Button>
        </form>
      )}

      <p style={{ margin: '2px 0 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link to="/login" style={{ color: 'var(--graphite-900)', fontWeight: 600 }}>
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
