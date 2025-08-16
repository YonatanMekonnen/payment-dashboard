import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePaymentsStore } from '@/store/payments';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const paymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.enum(['ETB', 'KES', 'USD', 'EUR', 'GBP']).refine(val => val, {
    message: 'Please select a currency'
  }),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientAccount: z.string().min(1, 'Recipient account is required'),
  description: z.string().min(1, 'Description is required')
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export const PaymentForm = () => {
  const addPayment = usePaymentsStore((state) => state.addPayment);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema)
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      addPayment({
        id: data.paymentId,
        ...data,
        recipient: `${data.recipientName} (${data.recipientAccount})`,
        status: 'processing'
      });
      
      toast({
        title: 'Payment submitted',
        description: `Payment of ${data.amount} ${data.currency} to ${data.recipientName} has been queued for processing.`
      });
      
      reset();
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'Failed to submit payment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Submit Payment Order
        </CardTitle>
        <CardDescription>
          Create a new payment order for processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentId">Payment ID</Label>
            <Input
              id="paymentId"
              {...register('paymentId')}
              placeholder="Enter unique payment ID"
            />
            {errors.paymentId && (
              <p className="text-sm text-destructive">{errors.paymentId.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select onValueChange={(value) => setValue('currency', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETB">ETB - Ethiopian Birr</SelectItem>
                  <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                {...register('recipientName')}
                placeholder="Enter recipient name"
              />
              {errors.recipientName && (
                <p className="text-sm text-destructive">{errors.recipientName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientAccount">Recipient Account</Label>
              <Input
                id="recipientAccount"
                {...register('recipientAccount')}
                placeholder="Enter account number/IBAN"
              />
              {errors.recipientAccount && (
                <p className="text-sm text-destructive">{errors.recipientAccount.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter payment description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};