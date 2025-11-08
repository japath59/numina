import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowUpRight, ArrowDownRight, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AccountDetailsDialog } from './AccountDetailsDialog';
import { useTheme } from './ThemeContext';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber: string;
}

export function AccountsOverview() {
  const { theme } = useTheme();
  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const accounts: Account[] = [
    {
      id: '1',
      name: 'Checking Account',
      type: 'Student Checking',
      balance: 2847.32,
      accountNumber: '****4891',
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'High Yield Savings',
      balance: 5234.50,
      accountNumber: '****7623',
    },
    {
      id: '3',
      name: 'Emergency Fund',
      type: 'Savings',
      balance: 1500.00,
      accountNumber: '****9012',
    },
  ];

  const recentActivity = [
    { type: 'credit', description: 'Part-time Job Deposit', amount: 450.00, date: '2 days ago' },
    { type: 'debit', description: 'Starbucks', amount: 6.75, date: '3 days ago' },
    { type: 'credit', description: 'Scholarship Payment', amount: 1200.00, date: '1 week ago' },
  ];

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <Card 
        className="text-white border-0"
        style={{
          background: `linear-gradient(to bottom right, ${theme.accentPrimary}, ${theme.accentSecondary})`
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Balance</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalances(!showBalances)}
            className="text-white hover:bg-white/20"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-4xl mb-2">
            {showBalances ? `$${totalBalance.toFixed(2)}` : '••••••'}
          </div>
          <p className="opacity-90 text-sm">Across {accounts.length} accounts</p>
        </CardContent>
      </Card>

      {/* Individual Accounts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card 
            key={account.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedAccount(account);
              setDialogOpen(true);
            }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{account.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{account.type}</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl mb-2">
                {showBalances ? `$${account.balance.toFixed(2)}` : '••••••'}
              </div>
              <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'credit'
                        ? 'bg-teal-100 text-teal-600'
                        : 'bg-coral-100 text-red-400'
                    }`}
                  >
                    {activity.type === 'credit' ? (
                      <ArrowDownRight className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p>{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                <div
                  className={`${
                    activity.type === 'credit' ? 'text-teal-600' : 'text-red-400'
                  }`}
                >
                  {activity.type === 'credit' ? '+' : '-'}${activity.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Details Dialog */}
      {selectedAccount && (
        <AccountDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          accountName={selectedAccount.name}
          accountType={selectedAccount.type}
          accountBalance={selectedAccount.balance}
          accountNumber={selectedAccount.accountNumber}
        />
      )}
    </div>
  );
}
