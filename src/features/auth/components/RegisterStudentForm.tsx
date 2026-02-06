/**
 * Student Registration Form Component
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterStudentMutation } from '../mutations';
import { validateEmail, validatePassword, validatePasswordConfirm, validateRegisterForm, validateRequired } from '../validators';
import { Loader2 } from 'lucide-react';
export function RegisterStudentForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    registration_number: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const registerMutation = useRegisterStudentMutation();
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      setTouched({ email: true, password: true, password_confirm: true, first_name: true, last_name: true, registration_number: true });
      return;
    }
    registerMutation.mutate(formData);
  };
  const firstNameError = validateRequired(formData.first_name, 'First name');
  const lastNameError = validateRequired(formData.last_name, 'Last name');
  const emailError = validateEmail(formData.email);
  const regError = validateRequired(formData.registration_number, 'Registration number');
  const passwordError = validatePassword(formData.password);
  const confirmError = validatePasswordConfirm(formData.password, formData.password_confirm);
  const ok = (name: string, err: string | null) => touched[name] && !err;
  const bad = (name: string, err: string | null) => touched[name] && err;
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={handleChange('first_name')}
            onBlur={() => setTouched((p) => ({ ...p, first_name: true }))}
            disabled={registerMutation.isPending}
            className="h-11 text-base"
          />
          {bad('first_name', firstNameError) && <p className="text-sm text-destructive">{firstNameError}</p>}
          {ok('first_name', firstNameError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Looks good.</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={handleChange('last_name')}
            onBlur={() => setTouched((p) => ({ ...p, last_name: true }))}
            disabled={registerMutation.isPending}
            className="h-11 text-base"
          />
          {bad('last_name', lastNameError) && <p className="text-sm text-destructive">{lastNameError}</p>}
          {ok('last_name', lastNameError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Looks good.</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          disabled={registerMutation.isPending}
          className="h-11 text-base"
        />
        {bad('email', emailError) && <p className="text-sm text-destructive">{emailError}</p>}
        {ok('email', emailError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Email looks good.</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="registration_number">Registration Number</Label>
        <Input
          id="registration_number"
          placeholder="e.g., REG/2024/001"
          value={formData.registration_number}
          onChange={handleChange('registration_number')}
          onBlur={() => setTouched((p) => ({ ...p, registration_number: true }))}
          disabled={registerMutation.isPending}
          className="h-11 text-base"
        />
        {bad('registration_number', regError) && <p className="text-sm text-destructive">{regError}</p>}
        {ok('registration_number', regError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Looks good.</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={() => setTouched((p) => ({ ...p, password: true }))}
          disabled={registerMutation.isPending}
          className="h-11 text-base"
        />
        {bad('password', passwordError) && <p className="text-sm text-destructive">{passwordError}</p>}
        {ok('password', passwordError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Strong password.</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password_confirm">Confirm Password</Label>
        <Input
          id="password_confirm"
          type="password"
          value={formData.password_confirm}
          onChange={handleChange('password_confirm')}
          onBlur={() => setTouched((p) => ({ ...p, password_confirm: true }))}
          disabled={registerMutation.isPending}
          className="h-11 text-base"
        />
        {bad('password_confirm', confirmError) && <p className="text-sm text-destructive">{confirmError}</p>}
        {ok('password_confirm', confirmError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Passwords match.</p>}
      </div>
      <Button type="submit" className="h-11 w-full text-base" disabled={registerMutation.isPending}>
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
