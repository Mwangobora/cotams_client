# Timetable Feature Documentation

## Overview

The timetable feature provides a comprehensive schedule management system for the COTAMS application. It supports role-based access control, responsive design, real-time updates via WebSockets, and follows the <150 line per file constraint.

## Architecture

### Directory Structure
```
src/features/timetable/
├── types.ts                          # TypeScript definitions aligned with Django backend
├── api/
│   └── TimetableApi.ts               # Class-based API client for scheduling endpoints
├── queries.ts                       # React Query hooks with WebSocket integration
└── components/
    ├── TimetablePage.tsx             # Main container component
    ├── TimetableGrid.tsx             # Desktop grid view component
    ├── TimetableDayView.tsx          # Mobile day view component
    ├── SessionCard.tsx               # Individual session display component
    ├── SessionDetailsModal.tsx       # Session details modal with motion animations
    ├── TimetableFilters.tsx          # Role-based filtering component
    ├── TimetableSkeleton.tsx         # Loading skeleton states
    └── EmptyState.tsx                # Empty state handling
```

### Core Dependencies
- **React Query**: For data fetching, caching, and synchronization
- **Framer Motion**: For smooth animations and transitions
- **shadcn/ui**: For consistent UI components
- **WebSocket**: For real-time updates
- **Zustand**: For authentication state management

## Features

### Role-Based Access Control

#### Admin
- Full timetable management capabilities
- Can view, create, edit, and delete sessions
- Access to all filters (streams, rooms, lecturers, time slots)
- Can manage resources (rooms, lecturers, streams)

#### Staff
- View and edit timetable sessions
- Access to most filters
- Can manage academic content

#### Lecturer
- View personal timetable
- Limited filtering (only their assigned sessions)
- Read-only access to session details

#### Student
- View their class timetable
- Basic filtering by stream/program
- Read-only access

### Responsive Design

#### Desktop (lg: 1024px+)
- **Grid View**: Full weekly grid layout
- **Sidebar Filters**: Right-side filter panel
- **Session Cards**: Rich information display
- **Time Slots**: 08:00-18:00 in 1-hour increments

#### Mobile (< 1024px)
- **Day View**: Single day with navigation
- **Day Tabs**: Horizontal scrollable day selector
- **Compact Cards**: Essential information only
- **Bottom Sheet**: Filters accessible via modal

### Real-Time Updates

WebSocket integration provides live updates for:
- Session creation/modification/deletion
- Room availability changes
- Lecturer assignments
- Stream scheduling updates

## API Integration

### Backend Compatibility

The frontend types are carefully aligned with Django backend models:

#### TimetableSession Model Fields
- `day_of_week`: String choices ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN')
- `start_time`: TimeField
- `end_time`: TimeField
- `stream`: ForeignKey to Stream
- `module`: ForeignKey to Module
- `lecturer`: ForeignKey to User
- `room`: ForeignKey to Room
- `session_type`: Choices (LECTURE, PRACTICAL, TUTORIAL)

#### API Endpoints
- `GET /api/scheduling/sessions/` - List sessions with filtering
- `POST /api/scheduling/sessions/` - Create new session
- `GET /api/scheduling/sessions/{id}/` - Get session details
- `PUT /api/scheduling/sessions/{id}/` - Update session
- `DELETE /api/scheduling/sessions/{id}/` - Delete session
- `GET /api/scheduling/streams/` - List streams
- `GET /api/scheduling/rooms/` - List rooms
- `GET /api/scheduling/lecturers/` - List lecturers

### Error Handling

Comprehensive error handling includes:
- Network connectivity issues
- Authentication errors
- Validation errors
- Server errors
- Rate limiting

## Components Documentation

### TimetablePage.tsx
**Purpose**: Main container component with role-based functionality
**Features**:
- User role detection and permission handling
- Filter state management
- Desktop/mobile view switching
- Real-time WebSocket connection management

### TimetableGrid.tsx
**Purpose**: Desktop grid layout displaying weekly schedule
**Features**:
- Time slot grid (08:00-18:00)
- Session positioning and sizing
- Drag-and-drop support (admin/staff only)
- Conflict detection and highlighting

### TimetableDayView.tsx
**Purpose**: Mobile-optimized single-day view
**Features**:
- Day navigation (previous/next/date picker)
- Day tab selector
- Chronological session listing
- Swipe gesture support

### SessionCard.tsx
**Purpose**: Individual session display component
**Features**:
- Role-based information display
- Status indicators (confirmed, tentative, cancelled)
- Interactive elements based on permissions
- Color coding by module/stream

### SessionDetailsModal.tsx
**Purpose**: Comprehensive session information popup
**Features**:
- Full session details display
- Edit functionality (role-dependent)
- Lecturer and room information
- Module details and prerequisites

### TimetableFilters.tsx
**Purpose**: Role-based filtering interface
**Features**:
- Dynamic filter options based on user role
- Stream/program filtering
- Lecturer filtering (admin/staff only)
- Room availability filtering
- Date range selection

## State Management

### React Query Keys
```typescript
TIMETABLE_QUERY_KEYS = {
  all: ['timetable']
  sessions: (filters) => ['timetable', 'sessions', filters]
  session: (id) => ['timetable', 'session', id]
  streams: () => ['timetable', 'streams']
  rooms: () => ['timetable', 'rooms']
  lecturers: () => ['timetable', 'lecturers']
}
```

### Cache Management
- **Stale Time**: 5 minutes for session data
- **Background Refetch**: Enabled for real-time accuracy
- **Optimistic Updates**: For immediate UI feedback
- **Error Retry**: 3 attempts with exponential backoff

### WebSocket Event Handling
```typescript
// Event types handled
- 'timetable_update': General timetable changes
- 'session_created': New session added
- 'session_updated': Session modified
- 'session_deleted': Session removed
```

## Styling and Animations

### Tailwind CSS Classes
- **Responsive Grid**: `grid grid-cols-1 lg:grid-cols-8`
- **Card Variants**: `bg-blue-50 border-blue-200` (by session type)
- **Status Indicators**: Color-coded borders and backgrounds
- **Interactive States**: Hover, focus, and active states

### Framer Motion Animations
- **Modal Entry**: Scale and fade animations
- **Card Hover**: Subtle lift effects
- **Loading States**: Skeleton shimmer animations
- **Page Transitions**: Smooth navigation effects

## Performance Optimization

### Code Splitting
- Lazy loading of timetable components
- Route-based code splitting
- Dynamic imports for heavy dependencies

### Memory Management
- Query cleanup on component unmount
- WebSocket connection cleanup
- Event listener removal
- Cache size limits

### Bundle Size Optimization
- Tree shaking for unused exports
- Selective import of utility libraries
- Compressed image assets
- Efficient re-renders with React.memo

## Error Handling

### Network Errors
- Automatic retry with exponential backoff
- Offline state detection
- Connection restoration handling
- User-friendly error messages

### Validation Errors
- Real-time form validation
- Server-side validation display
- Field-level error highlighting
- Clear error message formatting

### Permission Errors
- Role-based error messages
- Graceful feature degradation
- Redirect to appropriate pages
- Clear permission requirements

## Testing Strategy

### Unit Tests
- Component rendering tests
- Hook behavior validation
- API function testing
- Utility function coverage

### Integration Tests
- Role-based access testing
- WebSocket connection testing
- Form submission flows
- Error handling scenarios

### E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Mobile responsive testing
- Performance benchmarks

## Deployment Considerations

### Environment Variables
```env
VITE_API_URL=https://api.cotams.edu  # Backend API base URL
VITE_WS_URL=wss://api.cotams.edu/ws  # WebSocket URL
```

### Build Configuration
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Husky for pre-commit hooks

### Performance Monitoring
- Bundle size tracking
- Runtime error monitoring
- User interaction analytics
- Performance metrics collection

## Future Enhancements

### Planned Features
1. **Offline Support**: Service worker implementation
2. **Push Notifications**: Real-time alerts for schedule changes
3. **Calendar Integration**: Export to Google Calendar/Outlook
4. **Conflict Resolution**: Automatic scheduling suggestions
5. **Bulk Operations**: Mass session creation/modification
6. **Analytics Dashboard**: Usage patterns and insights

### Scalability Considerations
- Virtualized scrolling for large datasets
- Incremental data loading
- Client-side caching strategies
- CDN optimization for assets

## Troubleshooting

### Common Issues

#### WebSocket Connection Failures
- Check network connectivity
- Verify WebSocket URL configuration
- Review browser WebSocket support
- Check for proxy/firewall blocking

#### Performance Issues
- Monitor bundle size
- Check for memory leaks
- Review query invalidation patterns
- Optimize re-render frequency

#### Authentication Problems
- Verify token expiration handling
- Check role assignments
- Review protected route configuration
- Validate API permissions

## Contributing

### Code Standards
- Follow TypeScript strict typing
- Use ESLint recommended rules
- Maintain <150 lines per file
- Write comprehensive JSDoc comments
- Follow React best practices

### Pull Request Process
1. Create feature branch from main
2. Implement feature with tests
3. Update documentation
4. Run linting and formatting
5. Submit PR with detailed description

## Support

### Development Team
- **Frontend Lead**: React/TypeScript specialist
- **Backend Integration**: Django API specialist
- **UI/UX Designer**: Component design and user experience
- **QA Engineer**: Testing and quality assurance

### Documentation
- **API Reference**: Backend endpoint documentation
- **Component Library**: shadcn/ui component documentation
- **Style Guide**: Design system and branding guidelines
- **Deployment Guide**: Infrastructure and deployment procedures