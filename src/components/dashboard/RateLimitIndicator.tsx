import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePaymentsStore } from '@/store/payments';
import { AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RateLimitIndicator = () => {
  const currentTPS = usePaymentsStore((state) => state.currentTPS);
  const rateLimit = usePaymentsStore((state) => state.rateLimit);

  const percentage = (currentTPS / rateLimit.limit) * 100;
  const isWarning = percentage >= 90; // Warning at 90%
  const isCritical = percentage >= 95; // Critical at 95%

  return (
    <Card className={cn(
      "transition-colors",
      isCritical && "border-rate-limit-critical",
      isWarning && !isCritical && "border-rate-limit-warning"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {isCritical ? (
            <AlertTriangle className="h-4 w-4 text-rate-limit-critical" />
          ) : isWarning ? (
            <AlertTriangle className="h-4 w-4 text-rate-limit-warning" />
          ) : (
            <Activity className="h-4 w-4 text-muted-foreground" />
          )}
          Rate Limit Monitor
        </CardTitle>
        <CardDescription>
          Current transaction rate: {currentTPS.toFixed(2)} TPS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current</span>
            <span className={cn(
              "font-medium",
              isCritical && "text-rate-limit-critical",
              isWarning && !isCritical && "text-rate-limit-warning"
            )}>
              {currentTPS.toFixed(2)} / {rateLimit.limit.toFixed(1)} TPS
            </span>
          </div>
          <Progress 
            value={percentage} 
            className={cn(
              "h-2",
              isCritical && "[&>div]:bg-rate-limit-critical",
              isWarning && !isCritical && "[&>div]:bg-rate-limit-warning"
            )}
          />
          <div className="text-xs text-muted-foreground">
            {isCritical && (
              <span className="text-rate-limit-critical font-medium">
                ⚠️ Critical: Consider throttling new payments
              </span>
            )}
            {isWarning && !isCritical && (
              <span className="text-rate-limit-warning font-medium">
                ⚡ Warning: Approaching rate limit
              </span>
            )}
            {!isWarning && (
              <span>System operating normally</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};