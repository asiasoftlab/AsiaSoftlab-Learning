import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function Loading({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className="animate-spin text-brand-600" size={size} />
    </div>
  );
}
