import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { EducationalTooltip } from './EducationalTooltip';
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
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Download,
  Lightbulb
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

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
}

interface AccountDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountName: string;
  accountType: string;
  accountBalance: number;
  accountNumber: string;
}

export function AccountDetailsDialog({
  open,
  onOpenChange,
  accountName,
  accountType,
  accountBalance,
  accountNumber,
}: AccountDetailsDialogProps) {
  // All transactions data
  const allTransactions: Transaction[] = [
    // Checking Account Transactions
    {
      id: '1',
      date: 'Nov 4, 2025',
      description: 'Part-time Job - Campus Library',
      category: 'Income',
      amount: 450.00,
      type: 'credit',
      account: 'Checking Account',
    },
    {
      id: '2',
      date: 'Nov 3, 2025',
      description: 'Amazon - Textbooks',
      category: 'Education',
      amount: 89.99,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '3',
      date: 'Nov 2, 2025',
      description: 'Starbucks',
      category: 'Food & Dining',
      amount: 6.75,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '4',
      date: 'Nov 1, 2025',
      description: 'Target - Groceries',
      category: 'Shopping',
      amount: 45.32,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '5',
      date: 'Nov 1, 2025',
      description: 'Uber - Ride to Campus',
      category: 'Transportation',
      amount: 12.50,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '6',
      date: 'Oct 31, 2025',
      description: 'Netflix Subscription',
      category: 'Entertainment',
      amount: 15.99,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '7',
      date: 'Oct 30, 2025',
      description: 'Chipotle',
      category: 'Food & Dining',
      amount: 13.45,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '8',
      date: 'Oct 29, 2025',
      description: 'Rent Payment',
      category: 'Housing',
      amount: 800.00,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '9',
      date: 'Oct 28, 2025',
      description: 'Scholarship Deposit',
      category: 'Income',
      amount: 1200.00,
      type: 'credit',
      account: 'Checking Account',
    },
    {
      id: '10',
      date: 'Oct 27, 2025',
      description: 'Spotify Premium',
      category: 'Entertainment',
      amount: 10.99,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '11',
      date: 'Oct 26, 2025',
      description: 'Gas Station',
      category: 'Transportation',
      amount: 35.00,
      type: 'debit',
      account: 'Checking Account',
    },
    {
      id: '12',
      date: 'Oct 25, 2025',
      description: 'Apple - App Store',
      category: 'Shopping',
      amount: 4.99,
      type: 'debit',
      account: 'Checking Account',
    },
    // Savings Account Transactions
    {
      id: '13',
      date: 'Nov 1, 2025',
      description: 'Transfer from Checking',
      category: 'Transfer',
      amount: 200.00,
      type: 'credit',
      account: 'Savings Account',
    },
    {
      id: '14',
      date: 'Oct 25, 2025',
      description: 'Transfer from Checking',
      category: 'Transfer',
      amount: 150.00,
      type: 'credit',
      account: 'Savings Account',
    },
    {
      id: '15',
      date: 'Oct 18, 2025',
      description: 'Transfer from Checking',
      category: 'Transfer',
      amount: 200.00,
      type: 'credit',
      account: 'Savings Account',
    },
    {
      id: '16',
      date: 'Oct 15, 2025',
      description: 'Interest Payment',
      category: 'Income',
      amount: 12.50,
      type: 'credit',
      account: 'Savings Account',
    },
    {
      id: '17',
      date: 'Oct 11, 2025',
      description: 'Transfer from Checking',
      category: 'Transfer',
      amount: 175.00,
      type: 'credit',
      account: 'Savings Account',
    },
    {
      id: '18',
      date: 'Oct 4, 2025',
      description: 'Transfer from Checking',
      category: 'Transfer',
      amount: 200.00,
      type: 'credit',
      account: 'Savings Account',
    },
    // Emergency Fund Transactions
    {
      id: '19',
      date: 'Oct 29, 2025',
      description: 'Monthly Contribution',
      category: 'Transfer',
      amount: 75.00,
      type: 'credit',
      account: 'Emergency Fund',
    },
    {
      id: '20',
      date: 'Oct 22, 2025',
      description: 'Weekly Contribution',
      category: 'Transfer',
      amount: 75.00,
      type: 'credit',
      account: 'Emergency Fund',
    },
    {
      id: '21',
      date: 'Oct 15, 2025',
      description: 'Weekly Contribution',
      category: 'Transfer',
      amount: 75.00,
      type: 'credit',
      account: 'Emergency Fund',
    },
    {
      id: '22',
      date: 'Oct 8, 2025',
      description: 'Weekly Contribution',
      category: 'Transfer',
      amount: 75.00,
      type: 'credit',
      account: 'Emergency Fund',
    },
    {
      id: '23',
      date: 'Oct 1, 2025',
      description: 'Weekly Contribution',
      category: 'Transfer',
      amount: 75.00,
      type: 'credit',
      account: 'Emergency Fund',
    },
  ];

  // Goals data (same as FinancialGoals component)
  const goals: Goal[] = [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 3000.00,
      currentAmount: 1500.00,
      category: 'Savings',
    },
    {
      id: '2',
      name: 'Spring Break Trip',
      targetAmount: 1200.00,
      currentAmount: 850.00,
      category: 'Travel',
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 1500.00,
      currentAmount: 600.00,
      category: 'Technology',
    },
    {
      id: '4',
      name: 'Summer Internship Fund',
      targetAmount: 2000.00,
      currentAmount: 500.00,
      category: 'Career',
    },
  ];

  // Filter transactions for this account
  const accountTransactions = allTransactions.filter(
    (t) => t.account === accountName
  );

  // Calculate total allocated to goals from savings
  const totalAllocatedToGoals = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const unallocatedSavings = accountBalance - totalAllocatedToGoals;

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
        return ArrowDownRight;
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
      'Transfer': 'bg-green-100 text-green-600',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Function to download transaction history (FINRA Rule 3110 - Auditability)
  const handleDownloadHistory = () => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Type'].join(','),
      ...accountTransactions.map(t => 
        [t.date, `"${t.description}"`, t.category, t.amount.toFixed(2), t.type].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${accountName.replace(/\s+/g, '_')}_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{accountName}</DialogTitle>
          <DialogDescription>
            {accountType} • {accountNumber}
          </DialogDescription>
          
          {/* Regulatory Disclosure Banner (SEC/FINRA/CFP Compliance) */}
          <Alert className="mt-3 bg-orange-50 border-orange-200">
            <Info className="h-4 w-4 text-orange-600" aria-label="Information" />
            <AlertDescription className="text-xs">
              ⚠️ <strong>Disclosure:</strong> This app provides automated financial insights for educational purposes only. 
              It does not constitute personalized investment advice or replace consultation 
              with a licensed financial advisor (CFP®), tax professional (CPA), or attorney.
            </AlertDescription>
          </Alert>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pb-4">
            {/* Account Balance */}
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-0">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                <p className="text-4xl">${accountBalance.toFixed(2)}</p>
              </CardContent>
            </Card>

            {/* Goals Breakdown for Savings Account */}
            {accountName === 'Savings Account' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Goals Breakdown</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        How your savings are allocated
                      </p>
                    </div>
                    <EducationalTooltip topic="high-yield-savings" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.map((goal) => {
                    const percentage = (goal.currentAmount / accountBalance) * 100;
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span>{goal.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {goal.category}
                            </Badge>
                          </div>
                          <span className="font-semibold">${goal.currentAmount.toFixed(2)}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% of total savings • ${goal.targetAmount.toFixed(2)} goal
                        </p>
                      </div>
                    );
                  })}
                  
                  {/* Unallocated Savings */}
                  {unallocatedSavings > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>Unallocated Savings</span>
                          <Badge variant="outline" className="text-xs bg-gray-100">
                            Available
                          </Badge>
                        </div>
                        <span className="font-semibold">${unallocatedSavings.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={(unallocatedSavings / accountBalance) * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {((unallocatedSavings / accountBalance) * 100).toFixed(1)}% of total savings
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* AI Insight Card - Why This Suggestion? (CFP Transparency Requirement) */}
            {accountName === 'Savings Account' && (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-white" aria-label="Insight" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">💡 Why This Insight?</p>
                        <Badge variant="outline" className="text-xs bg-white">
                          AI-Generated
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Transparency Notice:</strong> Based on your recent transfers ($150-$200 monthly) 
                        and current savings balance (${accountBalance.toFixed(2)}), our algorithm identified 
                        that your Emergency Fund has reached 50% of its $3,000 target. 
                        
                        <br /><br />
                        
                        <strong>General Recommendation:</strong> Financial experts typically suggest maintaining 
                        consistent contributions. Increasing your weekly contribution by $15 (from $75 to $90) 
                        could help you reach your emergency fund goal approximately 6 weeks earlier, by late 
                        January 2026 instead of mid-March.
                        
                        <br /><br />
                        
                        <em>Note: This is educational guidance based on general financial principles and your 
                        account data patterns. For personalized financial planning, consult a CFP®.</em>
                      </p>
                      <div className="pt-2 flex gap-2">
                        <EducationalTooltip topic="compound-interest" />
                        <EducationalTooltip topic="budget-allocation" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {accountName === 'Emergency Fund' && (
              <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-white" aria-label="Insight" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">💡 Why This Insight?</p>
                        <EducationalTooltip topic="emergency-fund">
                          <span className="flex items-center gap-1 text-xs">
                            What's an emergency fund? 📚
                          </span>
                        </EducationalTooltip>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Progress Analysis:</strong> You've contributed $75 weekly consistently for the 
                        past month. At this rate, you're on track to reach your $3,000 emergency fund goal 
                        in approximately 20 weeks (mid-March 2026).
                        
                        <br /><br />
                        
                        <strong>General Principle:</strong> Financial advisors typically recommend emergency 
                        funds covering 3-6 months of essential expenses. Your $3,000 target appears aligned 
                        with approximately 3-4 months of basic living costs based on your transaction patterns.
                        
                        <br /><br />
                        
                        <em>This is educational information. Consult a CFP® for personalized emergency fund 
                        recommendations based on your complete financial situation.</em>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Recent Transactions</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadHistory}
                  className="text-xs"
                  aria-label="Download transaction history as CSV file"
                >
                  <Download className="h-4 w-4 mr-1" aria-hidden="true" />
                  Download History
                </Button>
              </div>
              {accountTransactions.length > 0 ? (
                <div className="space-y-3">
                  {accountTransactions.map((transaction) => {
                    const Icon = getCategoryIcon(transaction.category);
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(transaction.category)}`}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No transactions found for this account
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
