/**
 * Student Registration Form Component
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRegisterStudentMutation } from '../mutations';
import { validateRegisterForm } from '../validators';
import { ApiError } from '../errors';
import { AlertCircle, Loader2 } from 'lucide-react';

export function RegisterStudentForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    registration_number: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useRegisterStudentMutation();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateRegisterForm(
      formData.email,
      formData.password,
      formData.password_confirm,
      formData.first_name,
      formData.last_name
    );

    if (!formData.registration_number.trim()) {
      validation.isValid = false;
      validation.errors.registration_number = 'Registration number is required';
    }

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    registerMutation.mutate(formData);
  };

  const apiError = registerMutation.error as ApiError | null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {registerMutation.isError && apiError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {apiError.details?.length
              ? apiError.details.map((d, i) => (
                  <div key={i}>{d.field ? `${d.field}: ${d.message}` : d.message}</div>
                ))
              : apiError.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={handleChange('first_name')}
            disabled={registerMutation.isPending}
          />
          {errors.first_name && (
            <p className="text-sm text-destructive">{errors.first_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={handleChange('last_name')}
            disabled={registerMutation.isPending}
          />
          {errors.last_name && (
            <p className="text-sm text-destructive">{errors.last_name}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          disabled={registerMutation.isPending}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registration_number">Registration Number</Label>
        <Input
          id="registration_number"
          placeholder="e.g., REG/2024/001"
          value={formData.registration_number}
          onChange={handleChange('registration_number')}
          disabled={registerMutation.isPending}
        />
        {errors.registration_number && (
          <p className="text-sm text-destructive">{errors.registration_number}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          disabled={registerMutation.isPending}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirm">Confirm Password</Label>
        <Input
          id="password_confirm"
          type="password"
          value={formData.password_confirm}
          onChange={handleChange('password_confirm')}
          disabled={registerMutation.isPending}
        />
        {errors.password_confirm && (
          <p className="text-sm text-destructive">{errors.password_confirm}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Register
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
