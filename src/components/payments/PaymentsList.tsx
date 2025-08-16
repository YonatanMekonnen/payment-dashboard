import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaymentsStore, Payment } from '@/store/payments';
import { PaymentDetail } from './PaymentDetail';
import { Search, Filter, Activity, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PaymentsList = () => {
  const payments = usePaymentsStore((state) => state.payments);
  const retryPayment = usePaymentsStore((state) => state.retryPayment);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(payments);

  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Sort by most recent first
    filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter]);

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Payment Feed
          </CardTitle>
          <CardDescription>
            Real-time view of payment processing ({filteredPayments.length} payments)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by payment ID, recipient, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payments List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payments found matching your criteria
                </div>
              ) : (
                filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-sm">
                          {formatAmount(payment.amount, payment.currency)}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          to {payment.recipient}
                        </span>
                        {getStatusBadge(payment.status)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payment.description} • {formatDate(payment.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {payment.status === 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            retryPayment(payment.id);
                          }}
                          className="h-8 px-2"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPayment && (
        <PaymentDetail
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </>
  );
};