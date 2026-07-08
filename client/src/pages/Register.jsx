import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Input, Logo } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create your account. Please try again.');
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
                Create Account
              </h1>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                Join Cellular Solutions to track orders and requests.
              </p>
            </div>

            {serverError && (
              <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--danger-50)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-sm)', color: 'var(--danger-500)' }}>
                {serverError}
              </div>
            )}

            <Input
              label="Full Name"
              autoComplete="name"
              value={form.name}
              error={errors.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
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
              autoComplete="new-password"
              value={form.password}
              error={errors.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              error={errors.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />

            <Button type="submit" variant="product" fullWidth disabled={submitting}>
              {submitting ? 'Creating Account…' : 'Create Account'}
            </Button>

            <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', textAlign: 'center' }}>
              Already have an account?{' '}
              <Link to="/login" state={location.state} style={{ color: 'var(--text-strong)', fontWeight: 'var(--fw-semibold)' }}>
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
