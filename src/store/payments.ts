import { create } from 'zustand';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  description: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  processingTime?: number; // in milliseconds
  failureReason?: string;
}

interface PaymentsState {
  payments: Payment[];
  currentTPS: number;
  rateLimit: {
    current: number;
    limit: number;
  };
  addPayment: (payment: Omit<Payment, 'createdAt' | 'updatedAt'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  retryPayment: (id: string) => void;
  setCurrentTPS: (tps: number) => void;
}

// Mock data generator
const generateMockPayments = (): Payment[] => {
  const statuses: Payment['status'][] = ['success', 'processing', 'pending', 'failed'];
  const recipients = ['Abebe Kebede', 'Tigist Mekonen', 'Dawit Haile', 'Hanan Trading PLC', 'Addis Construction Ltd', 'Meron Bekele', 'Yonas Tesfaye', 'Ethio Telecom', 'Commercial Bank of Ethiopia', 'Dashen Bank'];
  const currencies = ['ETB', 'KES', 'USD', 'EUR', 'GBP'];
  
  return Array.from({ length: 20 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.random() * 86400000 * 7); // Last 7 days
    
    return {
      id: `payment-${i + 1}`,
      amount: Math.floor(Math.random() * 10000) + 100,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      recipient: recipients[Math.floor(Math.random() * recipients.length)],
      description: `Payment for services #${i + 1}`,
      status,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 3600000),
      processingTime: status === 'success' ? Math.floor(Math.random() * 5000) + 1000 : undefined,
      failureReason: status === 'failed' ? 'Insufficient funds' : undefined
    };
  });
};

export const usePaymentsStore = create<PaymentsState>((set, get) => ({
  payments: generateMockPayments(),
  currentTPS: 1.2,
  rateLimit: {
    current: 1.2,
    limit: 2.0
  },
  addPayment: (paymentData) => {
    const payment: Payment = {
      ...paymentData,
      id: paymentData.id || `payment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      payments: [payment, ...state.payments]
    }));
    
    // Simulate payment processing
    setTimeout(() => {
      const statuses: Payment['status'][] = ['success', 'failed'];
      const finalStatus = Math.random() > 0.1 ? 'success' : 'failed';
      
      set((state) => ({
        payments: state.payments.map(p => 
          p.id === payment.id 
            ? { 
                ...p, 
                status: finalStatus,
                updatedAt: new Date(),
                processingTime: finalStatus === 'success' ? Math.floor(Math.random() * 3000) + 500 : undefined,
                failureReason: finalStatus === 'failed' ? 'Payment declined' : undefined
              }
            : p
        )
      }));
    }, 2000 + Math.random() * 3000);
  },
  updatePayment: (id, updates) => {
    set((state) => ({
      payments: state.payments.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      )
    }));
  },
  retryPayment: (id) => {
    set((state) => ({
      payments: state.payments.map(p => 
        p.id === id ? { ...p, status: 'processing', updatedAt: new Date() } : p
      )
    }));
    
    // Simulate retry processing
    setTimeout(() => {
      const success = Math.random() > 0.3;
      
      set((state) => ({
        payments: state.payments.map(p => 
          p.id === id 
            ? { 
                ...p, 
                status: success ? 'success' : 'failed',
                updatedAt: new Date(),
                processingTime: success ? Math.floor(Math.random() * 2000) + 500 : undefined,
                failureReason: !success ? 'Retry failed - contact support' : undefined
              }
            : p
        )
      }));
    }, 1000 + Math.random() * 2000);
  },
  setCurrentTPS: (tps) => {
    set({
      currentTPS: tps,
      rateLimit: {
        current: tps,
        limit: 2.0
      }
    });
  }
}));