import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Input, Logo } from '@/components/ui';
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
    <div style={{ padding: 'var(--pad-section) var(--space-6)', display: 'flex', justifyContent: 'center', fontFamily: 'var(--font-sans)', background: 'var(--surface-subtle)', minHeight: '60vh' }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: 'center' }}>
        <Link to="/">
          <Logo variant="full" tone="light" height={40} />
        </Link>

        <Card style={{ width: '100%' }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <h1 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>
                Sign In
              </h1>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                Welcome back — sign in to your account.
              </p>
            </div>

            {serverError && (
              <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--danger-50)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-sm)', color: 'var(--danger-500)' }}>
                {serverError}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={form.email}
              error={errors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              error={errors.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Button type="submit" variant="product" fullWidth disabled={submitting}>
              {submitting ? 'Signing In…' : 'Sign In'}
            </Button>

            <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link to="/register" state={location.state} style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-semibold)' }}>
                Create one
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
