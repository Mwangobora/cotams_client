/**
 * Login Form Component
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLoginMutation } from '../mutations';
import { validateLoginForm } from '../validators';
import { AlertCircle, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="student@cotams.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loginMutation.isPending}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
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
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loginMutation.isPending}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign in
      </Button>

      <div className="text-center text-sm">
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
