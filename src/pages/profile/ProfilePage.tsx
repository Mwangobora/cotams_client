import { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/apis/AuthApi';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [changeLoading, setChangeLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [resetEmail, setResetEmail] = useState(user?.email || '');

  useEffect(() => {
    if (!avatarPreview) return;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  useEffect(() => {
    if (user?.email) setResetEmail(user.email);
  }, [user?.email]);

  const roles = user?.roles || [];
  const initials = useMemo(() => {
    const name = user?.full_name || '';
    const parts = name.split(' ').filter(Boolean);
    if (!parts.length) return 'U';
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
  }, [user?.full_name]);

  const profileDetails = useMemo(() => {
    if (user?.staff_profile) {
      return [
        { label: 'Profile Type', value: 'Staff' },
        { label: 'Employee ID', value: user.staff_profile.employee_id || '—' },
        { label: 'Department', value: user.staff_profile.department_name || user.staff_profile.department || '—' },
        { label: 'Title', value: user.staff_profile.title || '—' },
        { label: 'Office Location', value: user.staff_profile.office_location || '—' },
        { label: 'Phone', value: user.staff_profile.phone_number || '—' },
        { label: 'Active', value: user.staff_profile.is_active ? 'Yes' : 'No' },
      ];
    }
    if (user?.lecturer_profile) {
      return [
        { label: 'Profile Type', value: 'Lecturer' },
        { label: 'Employee ID', value: user.lecturer_profile.employee_id || '—' },
        { label: 'Department', value: user.lecturer_profile.department_name || user.lecturer_profile.department || '—' },
        { label: 'Title', value: user.lecturer_profile.title || '—' },
        { label: 'Office Location', value: user.lecturer_profile.office_location || '—' },
        { label: 'Phone', value: user.lecturer_profile.phone_number || '—' },
        { label: 'Active', value: user.lecturer_profile.is_active ? 'Yes' : 'No' },
      ];
    }
    return [
      { label: 'Profile Type', value: roles.length ? roles.map((role) => role.name || role.code).join(', ') : 'User' },
      { label: 'Status', value: user?.is_active ? 'Active' : 'Inactive' },
    ];
  }, [roles, user]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleChangePassword = async () => {
    if (!passwordForm.old_password || !passwordForm.new_password || !passwordForm.new_password_confirm) {
      toast.error('Fill all password fields.');
      return;
    }
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    try {
      setChangeLoading(true);
      await authApi.changePassword(passwordForm);
      toast.success('Password changed successfully.');
      setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to change password.');
    } finally {
      setChangeLoading(false);
    }
  };

  const handleSaveImage = () => {
    if (!avatarPreview) {
      toast.error('Select an image to upload.');
      return;
    }
    toast.success('Image selected. Backend upload will be enabled soon.');
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error('Enter your email address.');
      return;
    }
    try {
      setResetLoading(true);
      await authApi.forgotPassword({ email: resetEmail });
      toast.success('Reset instructions sent to your email.');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details, security, and profile preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
              <CardDescription>Your account snapshot and roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarPreview || ''} alt={user?.full_name || 'User'} />
                  <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold text-foreground">{user?.full_name || '—'}</div>
                  <div className="text-sm text-muted-foreground">{user?.email || '—'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {roles.length ? (
                  roles.map((role) => (
                    <Badge key={role.id} variant="secondary" className="bg-accent text-accent-foreground">
                      {role.name || role.code}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">User</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Upload a profile photo for your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label htmlFor="profile-image">Select image</Label>
              <Input id="profile-image" type="file" accept="image/*" onChange={handleAvatarChange} />
              <p className="text-xs text-muted-foreground">
                Image preview only. Backend upload will be enabled when available.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" type="button" onClick={handleSaveImage}>
                Save Image
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Details pulled from your assigned profile.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {profileDetails.map((item) => (
                <div key={item.label}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="text-sm text-foreground">{item.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Use a strong password you do not reuse elsewhere.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="old-password">Current password</Label>
                <Input
                  id="old-password"
                  type="password"
                  value={passwordForm.old_password}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, old_password: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, new_password: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.new_password_confirm}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, new_password_confirm: event.target.value }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword} disabled={changeLoading}>
                {changeLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Send a reset link to your email address.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Label htmlFor="reset-email">Email address</Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={handleResetPassword} disabled={resetLoading}>
                {resetLoading ? 'Sending...' : 'Send Reset Email'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
