# Action Buttons Guide (Edit & Delete)

## Overview

This guide covers the implementation of polished Edit and Delete action buttons designed for both light and dark themes. The buttons follow enterprise-grade design principles with subtle styling, proper accessibility, and responsive behavior.

---

## Design Principles

### Edit Button
- **Purpose**: Safe, neutral action for modifying data
- **Styling**: Subtle gray colors that don't dominate the interface
- **Icon**: Pencil (✏️)
- **Behavior**: Immediately opens edit form/dialog

### Delete Button
- **Purpose**: Destructive action requiring confirmation
- **Styling**: Clear red/destructive colors to signal danger
- **Icon**: Trash (🗑️)
- **Behavior**: Opens confirmation dialog before executing

---

## Button Variants

### ghost-edit Variant

**Light Theme:**
```
Text/Icon: #64748B
Hover Background: #F1F5F9
Active Background: #E2E8F0
Focus Ring: #0AC4E0
```

**Dark Theme:**
```
Text/Icon: #94A3B8
Hover Background: #0B1220
Active Background: #0F172A
Focus Ring: #0AC4E0
```

### ghost-delete Variant

**Light Theme:**
```
Text/Icon: #DC2626
Hover Background: #FEE2E2
Active Background: #FECACA
Focus Ring: #DC2626
```

**Dark Theme:**
```
Text/Icon: #F87171
Hover Background: #450A0A
Active Background: #7F1D1D
Focus Ring: #F87171
```

---

## Component Usage

### 1. Icon-Only Buttons (Desktop)

Used in data tables where space is limited. Always include tooltips for accessibility.

```tsx
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Trash2 } from 'lucide-react';

function ActionsCell({ item, onEdit, onDelete }) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        {/* Edit Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost-edit" 
              size="icon"
              className="h-9 w-9"
              onClick={() => onEdit(item)}
              aria-label="Edit item"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>

        {/* Delete Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost-delete" 
              size="icon"
              className="h-9 w-9"
              onClick={() => onDelete(item)}
              aria-label="Delete item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
```

### 2. Icon + Label Buttons (Mobile/Cards)

Used on mobile devices or in card layouts where labels improve clarity.

```tsx
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

function MobileActions({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <Button 
        variant="ghost-edit" 
        size="sm"
        onClick={() => onEdit(item)}
        className="h-8 gap-1.5"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span>Edit</span>
      </Button>

      {/* Delete Button */}
      <Button 
        variant="ghost-delete" 
        size="sm"
        onClick={() => onDelete(item)}
        className="h-8 gap-1.5"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Delete</span>
      </Button>
    </div>
  );
}
```

### 3. Responsive Actions (Desktop + Mobile)

Automatically switches between icon-only (desktop) and icon+label (mobile).

```tsx
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Trash2 } from 'lucide-react';

function ResponsiveActions({ item, onEdit, onDelete }) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        {/* Desktop: Icon-only with tooltips */}
        <div className="hidden md:flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost-edit" 
                size="icon"
                className="h-9 w-9"
                onClick={() => onEdit(item)}
                aria-label="Edit item"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost-delete" 
                size="icon"
                className="h-9 w-9"
                onClick={() => onDelete(item)}
                aria-label="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Mobile: Icon + Label */}
        <div className="flex md:hidden items-center gap-2">
          <Button 
            variant="ghost-edit" 
            size="sm"
            onClick={() => onEdit(item)}
            className="h-8 gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Button>

          <Button 
            variant="ghost-delete" 
            size="sm"
            onClick={() => onDelete(item)}
            className="h-8 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
```

---

## Delete Confirmation Dialog

**Always** show a confirmation dialog before deleting data.

### Basic Usage

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { Trash2 } from 'lucide-react';

function DeleteExample() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Perform delete operation
    console.log('Deleting:', itemToDelete);
    // Reset state
    setItemToDelete(null);
  };

  return (
    <>
      <Button 
        variant="ghost-delete" 
        size="icon"
        onClick={() => handleDeleteClick(item)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <DeleteConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
```

### Customized Dialog

```tsx
<DeleteConfirmDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  onConfirm={handleDeleteConfirm}
  title="Delete Module?"
  description="This will permanently remove the module from all programs. This action cannot be undone."
  confirmText="Delete Module"
  cancelText="Keep Module"
  isLoading={isDeleting}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controls dialog visibility |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when dialog opens/closes |
| `onConfirm` | `() => void` | - | Callback when delete is confirmed |
| `title` | `string` | "Delete item?" | Dialog title |
| `description` | `string` | "This action cannot be undone." | Warning message |
| `confirmText` | `string` | "Delete" | Confirm button label |
| `cancelText` | `string` | "Cancel" | Cancel button label |
| `isLoading` | `boolean` | `false` | Shows loading state |

---

## DataTable Integration

The `DataTable` component automatically includes these action buttons with proper responsive behavior and delete confirmation.

### Example

```tsx
import { DataTable } from '@/components/shared/DataTable';
import { useState } from 'react';

interface Module {
  id: string;
  name: string;
  code: string;
  credits: number;
}

function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Code', accessor: 'code' as const },
    { header: 'Credits', accessor: 'credits' as const },
  ];

  const handleEdit = (module: Module) => {
    setSelectedModule(module);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (module: Module) => {
    // Delete mutation called automatically after confirmation
    deleteMutation.mutate(module.id);
  };

  return (
    <DataTable
      title="Modules"
      columns={columns}
      data={modules}
      onEdit={handleEdit}
      onDelete={handleDelete}
      editButtonText="Edit"
      deleteButtonText="Delete"
      actions={true}
    />
  );
}
```

---

## Card Actions

For detail pages or card layouts:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';

function ModuleCard({ module, onEdit, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{module.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost-edit" 
              size="sm"
              onClick={() => onEdit(module)}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button 
              variant="ghost-delete" 
              size="sm"
              onClick={() => onDelete(module)}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </CardContent>
    </Card>
  );
}
```

---

## Accessibility

### ARIA Labels

Always include `aria-label` for icon-only buttons:

```tsx
<Button 
  variant="ghost-edit" 
  size="icon"
  aria-label="Edit module"
  onClick={handleEdit}
>
  <Pencil className="h-4 w-4" />
</Button>
```

### Keyboard Navigation

- **Tab**: Navigate between action buttons
- **Enter/Space**: Activate button
- **Escape**: Close dialogs

### Focus Indicators

Both variants have visible focus rings:
- Edit: `#0AC4E0` (accent color)
- Delete: `#DC2626` (destructive) in light, `#F87171` in dark

### Tooltips

Tooltips provide additional context for icon-only buttons:
- Appear on hover after 400ms delay
- Dismissed on click or keyboard activation
- Never obscure the target button

---

## Disabled States

Both variants support disabled states with reduced opacity:

```tsx
<Button 
  variant="ghost-edit" 
  size="icon"
  disabled={isLoading}
  onClick={handleEdit}
>
  <Pencil className="h-4 w-4" />
</Button>

<Button 
  variant="ghost-delete" 
  size="icon"
  disabled={!canDelete}
  onClick={handleDelete}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

---

## Best Practices

### Do's ✅

- **Always confirm delete actions** with the `DeleteConfirmDialog`
- **Use icon-only on desktop** to save space in tables
- **Include tooltips** for all icon-only buttons
- **Maintain 8-12px gap** between Edit and Delete buttons
- **Use aria-label** for screen reader support
- **Keep button heights consistent** (h-9 for icon, h-8 for sm)
- **Show loading states** during async operations

### Don'ts ❌

- **Don't use primary brand color** (#0992C2) for delete actions
- **Don't skip delete confirmation** dialogs
- **Don't use flashy animations** - keep transitions subtle (150-200ms)
- **Don't place delete button first** - always Edit before Delete
- **Don't remove focus indicators** - essential for accessibility
- **Don't use icon-only on mobile** without labels

---

## Theme Testing

### Light Theme Checklist

- [ ] Edit button text is readable (#64748B)
- [ ] Delete button stands out in red (#DC2626)
- [ ] Hover states are visible (gray and light red backgrounds)
- [ ] Focus rings are clear and visible
- [ ] Tooltips have proper contrast

### Dark Theme Checklist

- [ ] Edit button text is readable (#94A3B8)
- [ ] Delete button is clearly destructive (#F87171)
- [ ] Hover states don't blend with background
- [ ] Focus rings are visible on dark surfaces
- [ ] Button states maintain hierarchy

---

## Migration from Old Buttons

### Before (Hardcoded Colors)

```tsx
<Button 
  variant="outline" 
  size="sm"
  className="border-yellow-500/40 text-yellow-700 hover:bg-yellow-500/10"
  onClick={handleEdit}
>
  Edit
</Button>

<Button 
  variant="outline" 
  size="sm"
  className="border-red-500/40 text-red-600 hover:bg-red-500/10"
  onClick={handleDelete}
>
  Delete
</Button>
```

### After (Theme-Aware Variants)

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button 
        variant="ghost-edit" 
        size="icon"
        className="h-9 w-9"
        onClick={handleEdit}
        aria-label="Edit"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Edit</p>
    </TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button 
        variant="ghost-delete" 
        size="icon"
        className="h-9 w-9"
        onClick={handleDeleteClick}
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Delete</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

<DeleteConfirmDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  onConfirm={handleDeleteConfirm}
/>
```

---

## Troubleshooting

### Icons Not Showing

Ensure lucide-react is installed:
```bash
npm install lucide-react
```

### Tooltips Not Appearing

Wrap your component tree with `TooltipProvider`:
```tsx
import { TooltipProvider } from '@/components/ui/tooltip';

function App() {
  return (
    <TooltipProvider>
      {/* Your app content */}
    </TooltipProvider>
  );
}
```

### Delete Confirmation Not Showing

Check that dialog state is properly managed:
```tsx
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

// Open dialog
const handleDeleteClick = (item) => {
  setItemToDelete(item);
  setDeleteDialogOpen(true); // ✅ Set to true
};

// Pass to component
<DeleteConfirmDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  onConfirm={handleDeleteConfirm}
/>
```

### Colors Don't Match Theme

Ensure you're using the variant names exactly:
- `variant="ghost-edit"` ✅
- `variant="ghostEdit"` ❌
- `variant="edit"` ❌

---

## Component Files Reference

- **Button Variants**: `src/components/ui/button.tsx`
- **Tooltip**: `src/components/ui/tooltip.tsx`
- **Delete Dialog**: `src/components/ui/delete-confirm-dialog.tsx`
- **DataTable**: `src/components/shared/DataTable.tsx`
- **Alert Dialog**: `src/components/ui/alert-dialog.tsx`

---

## Resources

- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Radix UI Tooltip**: [Documentation](https://www.radix-ui.com/primitives/docs/components/tooltip)
- **Radix UI AlertDialog**: [Documentation](https://www.radix-ui.com/primitives/docs/components/alert-dialog)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: February 9, 2026  
**Version**: 1.0.0
