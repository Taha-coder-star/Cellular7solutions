import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthShell, AuthHead, AuthDivider, GoogleIcon, Button, Checkbox, Icon, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (!agree) next.agree = 'You must agree to the Terms & Privacy Policy';
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
    <AuthShell>
      <AuthHead title="Create account" subtitle="Join Cellular Solutions in seconds." />

      {serverError && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--danger-50)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-sm)', color: 'var(--danger-500)' }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Input
          label="Full name"
          placeholder="Alex Morgan"
          autoComplete="name"
          icon={<Icon name="user" size={18} />}
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
          placeholder="Create a password"
          autoComplete="new-password"
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
          hint={errors.password ? undefined : 'At least 8 characters.'}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Checkbox
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          style={{ alignItems: 'flex-start' }}
          label={
            <span>
              I agree to the{' '}
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--graphite-900)', fontWeight: 600 }}>
                Terms
              </a>{' '}
              &amp;{' '}
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--graphite-900)', fontWeight: 600 }}>
                Privacy Policy
              </a>
              .
            </span>
          }
        />
        {errors.agree && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--danger-500)', marginTop: '-10px' }}>{errors.agree}</span>}

        <Button type="submit" variant="product" fullWidth disabled={submitting}>
          {submitting ? 'Creating Account…' : 'Create Account'}
        </Button>

        <AuthDivider />

        <Button type="button" variant="secondary" fullWidth iconLeft={<GoogleIcon />}>
          Sign up with Google
        </Button>

        <p style={{ margin: '2px 0 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <Link to="/login" state={location.state} style={{ color: 'var(--graphite-900)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
