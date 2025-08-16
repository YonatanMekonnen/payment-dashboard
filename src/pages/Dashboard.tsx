import { useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { PaymentsList } from '@/components/payments/PaymentsList';
import { RateLimitIndicator } from '@/components/dashboard/RateLimitIndicator';
import { Analytics } from '@/components/dashboard/Analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaymentsStore } from '@/store/payments';

export const Dashboard = () => {
  const setCurrentTPS = usePaymentsStore((state) => state.setCurrentTPS);

  // Simulate TPS fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      const newTPS = 0.8 + Math.random() * 1.4; // Random between 0.8 and 2.2 TPS
      setCurrentTPS(newTPS);
    }, 5000);

    return () => clearInterval(interval);
  }, [setCurrentTPS]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Rate Limit Indicator */}
          <RateLimitIndicator />
          
          {/* Main Content Tabs */}
          <Tabs defaultValue="operations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="operations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Payment Form */}
                <div className="lg:col-span-2">
                  <PaymentForm />
                </div>
                
                {/* Payments List */}
                <div className="lg:col-span-3">
                  <PaymentsList />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};