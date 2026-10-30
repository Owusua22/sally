// src/components/orders/OrderStatus.tsx
import { cn } from '@/lib/utils';
import type { OrderStatus as OrderStatusType } from '@/types';

const STATUS_CONFIG: Record<OrderStatusType, { label: string; className: string; step: number }> = {
  pending: { label: 'Pending', className: 'bg-warning-soft text-warning', step: 1 },
  confirmed: { label: 'Confirmed', className: 'bg-card text-ink', step: 2 },
  processing: { label: 'Processing', className: 'bg-danger-soft text-danger', step: 3 },
  shipped: { label: 'Shipped', className: 'bg-danger-soft text-warning', step: 4 },
  delivered: { label: 'Delivered', className: 'bg-success-soft text-success', step: 5 },
  cancelled: { label: 'Cancelled', className: 'bg-danger-soft text-danger', step: 0 },
  refunded: { label: 'Refunded', className: 'bg-surface-soft text-ink', step: 0 },
};

interface OrderStatusProps {
  status: OrderStatusType;
  showBadge?: boolean;
  showTimeline?: boolean;
}

export function OrderStatus({ status, showBadge = true, showTimeline = false }: OrderStatusProps) {
  const config = STATUS_CONFIG[status];
  const timelineStatuses: OrderStatusType[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

  return (
    <div>
      {showBadge && (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
          {config.label}
        </span>
      )}

      {showTimeline && !['cancelled', 'refunded'].includes(status) && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            {timelineStatuses.map((s, i) => {
              const sConfig = STATUS_CONFIG[s];
              const isCompleted = config.step > sConfig.step;
              const isCurrent = status === s;

              return (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div className="relative flex items-center justify-center w-full">
                    {i > 0 && (
                      <div
                        className={cn(
                          'absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2',
                          isCompleted || isCurrent ? 'bg-danger' : 'bg-card'
                        )}
                      />
                    )}
                    {i < timelineStatuses.length - 1 && (
                      <div
                        className={cn(
                          'absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2',
                          isCompleted ? 'bg-danger' : 'bg-card'
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                        isCompleted ? 'bg-danger text-white' :
                        isCurrent ? 'bg-danger text-white ring-4 ring-primary-soft' :
                        'bg-card text-muted'
                      )}
                    >
                      {isCompleted ? '✓' : i + 1}
                    </div>
                  </div>
                  <p className={cn(
                    'mt-2 text-xs text-center',
                    isCurrent ? 'text-danger font-medium' : 'text-muted'
                  )}>
                    {sConfig.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}