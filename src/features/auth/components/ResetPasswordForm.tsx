/**
 * Reset Password Form Component
 */

import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useResetPasswordMutation } from '../mutations';
import { validateResetPasswordForm } from '../validators';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetPasswordMutation = useResetPasswordMutation();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      setErrors({ token: 'Invalid or missing reset token' });
      return;
    }

    const validation = validateResetPasswordForm(
      formData.password,
      formData.password_confirm
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    resetPasswordMutation.mutate({
      token,
      password: formData.password,
      password_confirm: formData.password_confirm,
    });
  };

  if (resetPasswordMutation.isSuccess) {
    return (
      <div className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your password has been reset successfully. You can now log in with your new
            password.
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Link to="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid or missing reset token. Please request a new password reset link.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {resetPasswordMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{resetPasswordMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          disabled={resetPasswordMutation.isPending}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirm">Confirm New Password</Label>
        <Input
          id="password_confirm"
          type="password"
          value={formData.password_confirm}
          onChange={handleChange('password_confirm')}
          disabled={resetPasswordMutation.isPending}
        />
        {errors.password_confirm && (
          <p className="text-sm text-destructive">{errors.password_confirm}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={resetPasswordMutation.isPending}
      >
        {resetPasswordMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Reset Password
      </Button>
    </form>
  );
}
