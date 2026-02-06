/**
 * Login Form Component
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '../mutations';
import { validateEmail, validateLoginForm } from '../validators';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setTouched({ email: true, password: true });
      return;
    }

    loginMutation.mutate({ email, password });
  };

  const emailError = validateEmail(email);
  const passwordError = !password ? 'Password is required' : null;
  const showEmailError = touched.email && emailError;
  const showEmailOk = touched.email && !emailError;
  const showPasswordError = touched.password && passwordError;
  const showPasswordOk = touched.password && !passwordError;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="student@cotams.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          disabled={loginMutation.isPending}
          className="h-11 text-base"
        />
        {showEmailError && <p className="text-sm text-destructive">{emailError}</p>}
        {showEmailOk && <p className="text-sm text-emerald-600 dark:text-emerald-400">Email looks good.</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            disabled={loginMutation.isPending}
            className="h-11 pr-10 text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={loginMutation.isPending}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {showPasswordError && <p className="text-sm text-destructive">{passwordError}</p>}
        {showPasswordOk && <p className="text-sm text-emerald-600 dark:text-emerald-400">Password looks good.</p>}
      </div>

      <Button
        type="submit"
        className="h-11 w-full text-base"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign in
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/auth/register/student" className="text-primary hover:underline">
          Register as Student
        </Link>
        {' or '}
        <Link to="/auth/register/staff" className="text-primary hover:underline">
          Staff
        </Link>
      </div>
    </form>
  );
}
