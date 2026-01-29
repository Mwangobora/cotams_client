/**
 * Forgot Password Form Component
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForgotPasswordMutation } from '../mutations';
import { validateForgotPasswordForm } from '../validators';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateForgotPasswordForm(email);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    forgotPasswordMutation.mutate({ email });
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            If an account exists with this email, you will receive password reset
            instructions shortly.
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Link to="/login" className="text-sm text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {forgotPasswordMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{forgotPasswordMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your-email@cotams.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={forgotPasswordMutation.isPending}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Send Reset Link
      </Button>

      <div className="text-center text-sm">
        Remember your password?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
