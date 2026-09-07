import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthShell, AuthHead, Button, Icon, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <AuthHead title="Admin sign in" subtitle="Cellular Solutions admin panel." />

      {serverError && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--danger-50)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-sm)', color: 'var(--danger-700)' }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Icon name="mail" size={18} />}
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={<Icon name="lock" size={18} />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              style={{ background: 'none', border: 'none', padding: '4px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex' }}
            >
              <Icon name={showPw ? 'eye-off' : 'eye'} size={18} />
            </button>
          }
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button type="submit" variant="product" fullWidth disabled={submitting}>
          {submitting ? 'Signing In…' : 'Sign In'}
        </Button>
      </form>
    </AuthShell>
  );
}
