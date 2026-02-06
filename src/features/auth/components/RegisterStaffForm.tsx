/**
 * Staff Registration Form Component
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRegisterStaffMutation } from '../mutations';
import { validateEmail, validatePassword, validatePasswordConfirm, validateRegisterForm, validateRequired } from '../validators';
import { Loader2, Info } from 'lucide-react';

export function RegisterStaffForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    employee_id: '',
    title: '',
    phone_number: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const registerMutation = useRegisterStaffMutation();

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

    if (!formData.employee_id.trim()) {
      validation.isValid = false;
      validation.errors.employee_id = 'Employee ID is required';
    }

    if (!validation.isValid) {
      setTouched({
        email: true,
        password: true,
        password_confirm: true,
        first_name: true,
        last_name: true,
        employee_id: true,
      });
      return;
    }

    registerMutation.mutate(formData);
  };

  const firstNameError = validateRequired(formData.first_name, 'First name');
  const lastNameError = validateRequired(formData.last_name, 'Last name');
  const emailError = validateEmail(formData.email);
  const empError = validateRequired(formData.employee_id, 'Employee ID');
  const passwordError = validatePassword(formData.password);
  const confirmError = validatePasswordConfirm(formData.password, formData.password_confirm);
  const ok = (name: string, err: string | null) => touched[name] && !err;
  const bad = (name: string, err: string | null) => touched[name] && err;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>Staff registration may require admin approval or a secret key.</AlertDescription>
      </Alert>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" value={formData.first_name} onChange={handleChange('first_name')} onBlur={() => setTouched((p) => ({ ...p, first_name: true }))} disabled={registerMutation.isPending} className="h-11 text-base" />
          {bad('first_name', firstNameError) && <p className="text-sm text-destructive">{firstNameError}</p>}
          {ok('first_name', firstNameError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Looks good.</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" value={formData.last_name} onChange={handleChange('last_name')} onBlur={() => setTouched((p) => ({ ...p, last_name: true }))} disabled={registerMutation.isPending} className="h-11 text-base" />
          {bad('last_name', lastNameError) && <p className="text-sm text-destructive">{lastNameError}</p>}
          {ok('last_name', lastNameError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Looks good.</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange('email')} onBlur={() => setTouched((p) => ({ ...p, email: true }))} disabled={registerMutation.isPending} className="h-11 text-base" />
        {bad('email', emailError) && <p className="text-sm text-destructive">{emailError}</p>}
        {ok('email', emailError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Email looks good.</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee_id">Employee ID</Label>
        <Input id="employee_id" placeholder="e.g., EMP001" value={formData.employee_id} onChange={handleChange('employee_id')} onBlur={() => setTouched((p) => ({ ...p, employee_id: true }))} disabled={registerMutation.isPending} className="h-11 text-base" />
        {bad('employee_id', empError) && <p className="text-sm text-destructive">{empError}</p>}
        {ok('employee_id', empError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Looks good.</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title (Optional)</Label>
          <Input id="title" placeholder="e.g., Manager" value={formData.title} onChange={handleChange('title')} disabled={registerMutation.isPending} className="h-11 text-base" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone (Optional)</Label>
          <Input id="phone_number" placeholder="e.g., +255..." value={formData.phone_number} onChange={handleChange('phone_number')} disabled={registerMutation.isPending} className="h-11 text-base" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={formData.password} onChange={handleChange('password')} onBlur={() => setTouched((p) => ({ ...p, password: true }))} disabled={registerMutation.isPending} className="h-11 text-base" />
        {bad('password', passwordError) && <p className="text-sm text-destructive">{passwordError}</p>}
        {ok('password', passwordError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Strong password.</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirm">Confirm Password</Label>
        <Input id="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange('password_confirm')} onBlur={() => setTouched((p) => ({ ...p, password_confirm: true }))} disabled={registerMutation.isPending} className="h-11 text-base" />
        {bad('password_confirm', confirmError) && <p className="text-sm text-destructive">{confirmError}</p>}
        {ok('password_confirm', confirmError) && <p className="text-sm text-emerald-600 dark:text-emerald-400">Passwords match.</p>}
      </div>

      <Button type="submit" className="h-11 w-full text-base" disabled={registerMutation.isPending}>
        {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Register as Staff
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
