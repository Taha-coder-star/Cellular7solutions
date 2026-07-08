import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthShell, AuthHead, AuthDivider, GoogleIcon, Button, Checkbox, Icon, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(true);
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
      <AuthHead title="Sign in" subtitle="Welcome back to Cellular Solutions." />

      {serverError && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--danger-50)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-sm)', color: 'var(--danger-500)' }}>
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
              style={{ background: 'none', border: 'none', padding: '4px', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex' }}
            >
              <Icon name={showPw ? 'eye-off' : 'eye'} size={18} />
            </button>
          }
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <Link to="/forgot-password" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--graphite-900)' }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="product" fullWidth disabled={submitting}>
          {submitting ? 'Signing In…' : 'Sign In'}
        </Button>

        <AuthDivider />

        <Button type="button" variant="secondary" fullWidth iconLeft={<GoogleIcon />}>
          Continue with Google
        </Button>

        <p style={{ margin: '2px 0 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          New here?{' '}
          <Link to="/register" state={location.state} style={{ color: 'var(--graphite-900)', fontWeight: 600 }}>
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
