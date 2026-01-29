# Authentication Module - Frontend Documentation

## Overview

The COTAMS authentication module implements a secure, cookie-based authentication system with role-based access control. The backend manages JWT tokens via httpOnly cookies, eliminating the need for client-side token storage.

## Architecture

### Cookie-Based Authentication

**Why cookies?**
- httpOnly cookies prevent XSS attacks
- Automatic cookie transmission by browser
- Backend controls token refresh transparently
- No manual token management needed

**Flow:**
1. User submits credentials → Backend validates
2. Backend sets auth cookies (httpOnly, secure)
3. Browser automatically sends cookies with requests
4. Backend validates cookies on each request
5. On 401, axios redirects to login (token expired/invalid)

### File Structure

```
src/
├── features/auth/
│   ├── api/
│   │   └── AuthApi.ts           # Class-based API client (144 lines)
│   ├── components/
│   │   ├── AuthLayout.tsx       # Centered auth layout (47 lines)
│   │   ├── LoginForm.tsx        # Login form (89 lines)
│   │   ├── RegisterStudentForm.tsx  # Student registration (145 lines)
│   │   ├── RegisterStaffForm.tsx    # Staff registration (148 lines)
│   │   ├── ForgotPasswordForm.tsx   # Password reset request (78 lines)
│   │   └── ResetPasswordForm.tsx    # Password reset confirm (116 lines)
│   ├── mutations.ts             # React Query mutations (121 lines)
│   ├── types.ts                 # TypeScript types (90 lines)
│   ├── validators.ts            # Form validation (108 lines)
│   └── errors.ts                # Custom error classes (116 lines)
├── routes/
│   ├── index.tsx                # Main router (75 lines)
│   ├── ProtectedRoute.tsx       # Auth guard (53 lines)
│   └── auth.routes.tsx          # Auth route definitions (17 lines)
├── pages/
│   ├── auth/                    # Auth pages (5-15 lines each)
│   └── dashboards/              # Role dashboards (35 lines each)
├── api/
│   └── axios.ts                 # Axios instance (40 lines)
└── store/
    └── auth.store.ts            # Auth state (37 lines)
```

## API Endpoints

### Backend Endpoints Used

```typescript
// Authentication
POST   /api/auth/login/                 // Login
POST   /api/auth/logout/                // Logout
GET    /api/auth/me/                    // Get current user

// Registration
POST   /api/auth/register/student/     // Student registration
POST   /api/auth/register/staff/       // Staff registration (may need approval)

// Password Management
POST   /api/auth/password/reset/request/    // Request reset email
POST   /api/auth/password/reset/confirm/    // Confirm reset with token
POST   /api/auth/password/change/           // Change password (authenticated)
```

### Changing Endpoints

If your backend uses different endpoints, update `src/features/auth/api/AuthApi.ts`:

```typescript
export class AuthApi {
  private basePath = '/auth';  // Change this
  
  async login(data: LoginRequest): Promise<LoginResponse> {
    // Change endpoint path here
    const response = await axios.post<LoginResponse>(`${this.basePath}/login/`, data);
    return response.data;
  }
}
```

## Axios Configuration

**Location:** `src/api/axios.ts`

**Critical Settings:**
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // MUST BE TRUE for cookies
});
```

**Error Handling:**
- All errors normalized to `ApiError` format
- Automatic redirect to /login on 401
- Consistent error shape for UI display

## Authentication State

**Store:** `src/store/auth.store.ts` (Zustand)

```typescript
interface AuthState {
  user: User | null;          // Current user or null
  isLoading: boolean;         // Loading state
  setUser: (user) => void;    // Set user after login/fetch
  setLoading: (bool) => void; // Set loading state
  logout: () => void;         // Clear user state
}
```

**Usage:**
```typescript
import { useAuthStore } from '@/store/auth.store';

const { user, isLoading, setUser, logout } = useAuthStore();
```

## Role-Based Routing

### Roles

```typescript
type RoleCode = 'ADMIN' | 'STAFF' | 'LECTURER' | 'STUDENT';
```

### Dashboard Routes

```
/admin     → Admin Dashboard (ADMIN only)
/staff     → Staff Dashboard (STAFF only)
/lecturer  → Lecturer Dashboard (LECTURER only)
/student   → Student Dashboard (STUDENT only)
```

### Adding New Roles

**Step 1:** Update role types in `src/features/auth/types.ts`

**Step 2:** Add dashboard component in `src/pages/dashboards/`

**Step 3:** Add route in `src/routes/index.tsx`:

```typescript
<Route
  path="/newrole/*"
  element={
    <ProtectedRoute allowedRoles={['NEWROLE']}>
      <AppShell>
        <Routes>
          <Route index element={<NewRoleDashboard />} />
        </Routes>
      </AppShell>
    </ProtectedRoute>
  }
/>
```

**Step 4:** Update redirect logic in `src/features/auth/mutations.ts`:

```typescript
const dashboardMap: Record<string, string> = {
  ADMIN: '/admin',
  STAFF: '/staff',
  LECTURER: '/lecturer',
  STUDENT: '/student',
  NEWROLE: '/newrole',  // Add here
};
```

## React Query Mutations

**Location:** `src/features/auth/mutations.ts`

All mutations follow this pattern:
```typescript
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Login successful');
      // Role-based redirect
      navigate(dashboardMap[role]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
```

**Available Mutations:**
- `useLoginMutation`
- `useLogoutMutation`
- `useRegisterStudentMutation`
- `useRegisterStaffMutation`
- `useForgotPasswordMutation`
- `useResetPasswordMutation`
- `useChangePasswordMutation`

## Error Handling

### Custom Error Classes

```typescript
// Base error
class ApiError extends Error {
  status: number;
  code: string;
  details?: ApiErrorDetails[];
}

// Specific errors
UnauthorizedError  // 401
ForbiddenError     // 403
ValidationError    // 400 with field errors
NetworkError       // No response
ServerError        // 500+
```

### Error Normalization

```typescript
import { normalizeAxiosError } from '@/features/auth/errors';

try {
  await api.post('/endpoint', data);
} catch (error) {
  const apiError = normalizeAxiosError(error);
  console.log(apiError.message);
  console.log(apiError.details);  // Field errors
}
```

### Displaying Errors

**General Error:**
```typescript
{mutation.isError && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{mutation.error.message}</AlertDescription>
  </Alert>
)}
```

**Field Errors:**
```typescript
{errors.email && (
  <p className="text-sm text-destructive">{errors.email}</p>
)}
```

## Form Validation

**Location:** `src/features/auth/validators.ts`

**Client-side Validation:**
- Email format
- Password length (min 8 chars)
- Password confirmation match
- Required fields

**Usage:**
```typescript
import { validateLoginForm } from '@/features/auth/validators';

const validation = validateLoginForm(email, password);
if (!validation.isValid) {
  setErrors(validation.errors);
  return;
}
```

## Protected Routes

**Component:** `src/routes/ProtectedRoute.tsx`

**Features:**
- Checks if user is authenticated
- Validates user role against allowed roles
- Redirects to login if not authenticated
- Redirects to correct dashboard if wrong role
- Shows loading state during auth check

**Usage:**
```typescript
<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
  <YourComponent />
</ProtectedRoute>
```

## Environment Variables

Required in `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

## Security Best Practices

1. **Cookies Only:** Never store tokens in localStorage
2. **withCredentials:** Always true in axios config
3. **httpOnly:** Backend must set httpOnly flag on cookies
4. **HTTPS:** Use HTTPS in production
5. **CORS:** Backend must allow credentials from frontend domain
6. **Error Messages:** Never expose sensitive info in errors

## Common Issues & Solutions

### Issue: Login succeeds but user not redirected

**Solution:** Check if backend is setting cookies correctly
```bash
# Check response headers in browser DevTools
Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict
```

### Issue: 401 on every request after login

**Solution:** Ensure `withCredentials: true` in axios config

### Issue: Wrong dashboard after login

**Solution:** Check user.roles array and dashboardMap in mutations.ts

### Issue: Token expired but no refresh

**Solution:** Backend should handle refresh transparently via cookies. Frontend doesn't manage tokens.

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials → redirects to correct dashboard
- [ ] Login with invalid credentials → shows error
- [ ] Logout → redirects to login and clears state
- [ ] Student registration → success message → redirects to login
- [ ] Staff registration → approval message (if configured)
- [ ] Forgot password → sends email message
- [ ] Reset password with token → success → redirects to login
- [ ] Protected route without auth → redirects to login
- [ ] Protected route with wrong role → redirects to correct dashboard

## Next Steps

1. **User Profile:** Add `/profile` page for editing user info
2. **2FA:** Implement two-factor authentication
3. **Session Management:** Show active sessions, remote logout
4. **Password Strength:** Add password strength meter
5. **Email Verification:** Require email verification after registration

## Support

For issues or questions, refer to:
- Backend API documentation: `/cotams_backend/API_REFERENCE.md`
- Frontend README: `/cotams_client/README.md`
- This file: `/docs/auth-frontend.md`
