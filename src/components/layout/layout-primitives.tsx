import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Main page container with responsive max-width and padding
 * Mobile-first responsive design
 */
export function PageContainer({ 
  children, 
  className,
  maxWidth = '2xl'
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div 
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Section wrapper with consistent vertical spacing
 */
export function Section({ 
  children, 
  className,
  spacing = 'md'
}: SectionProps) {
  const spacingClasses = {
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8 lg:py-12',
    lg: 'py-8 sm:py-12 lg:py-16',
    xl: 'py-12 sm:py-16 lg:py-20',
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * Responsive grid layout
 * Mobile-first with customizable breakpoint columns
 */
export function Grid({ 
  children, 
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md'
}: GridProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const colClasses = [];
  if (cols.default) colClasses.push(`grid-cols-${cols.default}`);
  if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`);

  return (
    <div className={cn('grid', gapClasses[gap], ...colClasses, className)}>
      {children}
    </div>
  );
}

interface StackProps {
  children: ReactNode;
  className?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'vertical' | 'horizontal';
}

/**
 * Stack layout for consistent spacing between elements
 */
export function Stack({ 
  children, 
  className,
  spacing = 'md',
  direction = 'vertical'
}: StackProps) {
  const spacingClasses = {
    xs: direction === 'vertical' ? 'space-y-1' : 'space-x-1',
    sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
    xl: direction === 'vertical' ? 'space-y-8' : 'space-x-8',
  };

  const directionClass = direction === 'horizontal' ? 'flex flex-row items-center' : 'flex flex-col';

  return (
    <div className={cn(directionClass, spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}

interface FlexProps {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'row' | 'col';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * Flexible box layout with responsive utilities
 */
export function Flex({ 
  children, 
  className,
  align = 'center',
  justify = 'start',
  direction = 'row',
  wrap = false,
  gap = 'md'
}: FlexProps) {
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div 
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
