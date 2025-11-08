import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  ShoppingCart, 
  Coffee, 
  Utensils, 
  Car, 
  Home, 
  GraduationCap, 
  Smartphone,
  TrendingUp,
  DollarSign,
  ArrowRightLeft
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  account: string;
}

export function TransactionsList() {
  const transactions: Transaction[] = [
    {
      id: '1',
      date: 'Oct 12, 2025',
      description: 'Part-time Job - Campus Library',
      category: 'Income',
      amount: 450.00,
      type: 'credit',
      account: 'Checking',
    },
    {
      id: '2',
      date: 'Oct 11, 2025',
      description: 'Transfer to Savings',
      category: 'Transfer',
      amount: 200.00,
      type: 'debit',
      account: 'Checking → Savings',
    },
    {
      id: '3',
      date: 'Oct 11, 2025',
      description: 'Amazon - Textbooks',
      category: 'Education',
      amount: 89.99,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '4',
      date: 'Oct 10, 2025',
      description: 'Starbucks',
      category: 'Food & Dining',
      amount: 6.75,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '5',
      date: 'Oct 9, 2025',
      description: 'Target - Groceries',
      category: 'Shopping',
      amount: 45.32,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '6',
      date: 'Oct 9, 2025',
      description: 'Uber - Ride to Campus',
      category: 'Transportation',
      amount: 12.50,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '7',
      date: 'Oct 8, 2025',
      description: 'Netflix Subscription',
      category: 'Entertainment',
      amount: 15.99,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '8',
      date: 'Oct 7, 2025',
      description: 'Chipotle',
      category: 'Food & Dining',
      amount: 13.45,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '9',
      date: 'Oct 6, 2025',
      description: 'Rent Payment',
      category: 'Housing',
      amount: 800.00,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '10',
      date: 'Oct 5, 2025',
      description: 'Scholarship Deposit',
      category: 'Income',
      amount: 1200.00,
      type: 'credit',
      account: 'Checking',
    },
    {
      id: '11',
      date: 'Oct 5, 2025',
      description: 'Transfer to Emergency Fund',
      category: 'Transfer',
      amount: 300.00,
      type: 'debit',
      account: 'Checking → Savings',
    },
    {
      id: '12',
      date: 'Oct 4, 2025',
      description: 'Spotify Premium',
      category: 'Entertainment',
      amount: 10.99,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '13',
      date: 'Oct 3, 2025',
      description: 'Gas Station',
      category: 'Transportation',
      amount: 35.00,
      type: 'debit',
      account: 'Checking',
    },
    {
      id: '14',
      date: 'Oct 3, 2025',
      description: 'Transfer from Savings',
      category: 'Transfer',
      amount: 50.00,
      type: 'credit',
      account: 'Savings → Checking',
    },
    {
      id: '15',
      date: 'Oct 2, 2025',
      description: 'Apple - App Store',
      category: 'Shopping',
      amount: 4.99,
      type: 'debit',
      account: 'Checking',
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Shopping':
        return ShoppingCart;
      case 'Food & Dining':
        return Utensils;
      case 'Transportation':
        return Car;
      case 'Housing':
        return Home;
      case 'Education':
        return GraduationCap;
      case 'Entertainment':
        return Smartphone;
      case 'Income':
        return TrendingUp;
      case 'Transfer':
        return ArrowRightLeft;
      default:
        return DollarSign;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Shopping': 'bg-purple-100 text-purple-600',
      'Food & Dining': 'bg-orange-100 text-orange-600',
      'Transportation': 'bg-blue-100 text-blue-600',
      'Housing': 'bg-teal-100 text-teal-600',
      'Education': 'bg-indigo-100 text-indigo-600',
      'Entertainment': 'bg-pink-100 text-pink-600',
      'Income': 'bg-cyan-100 text-cyan-600',
      'Transfer': 'bg-emerald-100 text-emerald-600',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <p className="text-sm text-muted-foreground">
          All transactions from the past 30 days
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(transaction.category)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-teal-600' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}$
                      {transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">{transaction.account}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
