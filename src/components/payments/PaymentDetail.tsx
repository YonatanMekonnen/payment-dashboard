import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { usePaymentsStore, Payment } from '@/store/payments';
import { useToast } from '@/hooks/use-toast';
import { Copy, RotateCcw, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

interface PaymentDetailProps {
  payment: Payment;
  onClose: () => void;
}

export const PaymentDetail = ({ payment, onClose }: PaymentDetailProps) => {
  const retryPayment = usePaymentsStore((state) => state.retryPayment);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Payment ID copied to clipboard'
    });
  };

  const handleRetry = () => {
    retryPayment(payment.id);
    toast({
      title: 'Payment retry initiated',
      description: 'The payment is being reprocessed'
    });
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-status-success" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-status-failed" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-status-processing animate-spin" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-status-pending" />;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const statusStyles = {
      pending: 'bg-status-pending text-white',
      processing: 'bg-status-processing text-white',
      success: 'bg-status-success text-white',
      failed: 'bg-status-failed text-white'
    };

    return (
      <Badge className={statusStyles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(payment.status)}
            Payment Details
          </DialogTitle>
          <DialogDescription>
            Complete information for payment {payment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status and Amount */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {formatAmount(payment.amount, payment.currency)}
            </div>
            {getStatusBadge(payment.status)}
          </div>

          {/* Payment ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment ID</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted px-2 py-1 rounded">
                {payment.id}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(payment.id)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient</label>
            <div className="text-sm">{payment.recipient}</div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <div className="text-sm text-muted-foreground">{payment.description}</div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Created</label>
              <div className="text-xs text-muted-foreground">
                {formatDate(payment.createdAt)}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Updated</label>
              <div className="text-xs text-muted-foreground">
                {formatDate(payment.updatedAt)}
              </div>
            </div>
          </div>

          {/* Processing Time */}
          {payment.processingTime && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Processing Time</label>
              <div className="text-sm text-muted-foreground">
                {(payment.processingTime / 1000).toFixed(2)} seconds
              </div>
            </div>
          )}

          {/* Failure Reason */}
          {payment.failureReason && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-destructive">Failure Reason</label>
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {payment.failureReason}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {payment.status === 'failed' && (
              <Button onClick={handleRetry} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry Payment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};