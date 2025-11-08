import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { 
  ShoppingCart, 
  Utensils, 
  Car, 
  Home, 
  GraduationCap, 
  Smartphone
} from 'lucide-react';
import { useTheme } from './ThemeContext';

interface Category {
  name: string;
  amount: number;
  budget: number;
  icon: any;
  color: string;
}

export function SpendingCategories() {
  const { theme } = useTheme();
  const categories: Category[] = [
    {
      name: 'Housing',
      amount: 800.00,
      budget: 800.00,
      icon: Home,
      color: 'from-teal-300 to-cyan-400',
    },
    {
      name: 'Food & Dining',
      amount: 267.53,
      budget: 300.00,
      icon: Utensils,
      color: 'from-orange-300 to-pink-300',
    },
    {
      name: 'Shopping',
      amount: 140.30,
      budget: 200.00,
      icon: ShoppingCart,
      color: 'from-purple-300 to-pink-300',
    },
    {
      name: 'Transportation',
      amount: 95.50,
      budget: 150.00,
      icon: Car,
      color: 'from-blue-300 to-cyan-300',
    },
    {
      name: 'Education',
      amount: 89.99,
      budget: 100.00,
      icon: GraduationCap,
      color: 'from-indigo-300 to-purple-300',
    },
    {
      name: 'Entertainment',
      amount: 26.98,
      budget: 50.00,
      icon: Smartphone,
      color: 'from-pink-300 to-rose-300',
    },
  ];

  const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card 
        className="text-white border-0"
        style={{
          background: `linear-gradient(to bottom right, ${theme.accentPrimary}, ${theme.accentSecondary})`
        }}
      >
        <CardHeader>
          <CardTitle>October Spending Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="opacity-90 text-sm mb-1">Total Spent</p>
              <p className="text-3xl">${totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90 text-sm mb-1">Budget</p>
              <p className="text-3xl">${totalBudget.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Budget Usage</span>
              <span>{((totalSpent / totalBudget) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const percentage = (category.amount / category.budget) * 100;
          const isOverBudget = percentage > 100;

          return (
            <Card key={category.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ${category.amount.toFixed(2)} of ${category.budget.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 ${isOverBudget ? '[&>div]:bg-red-400' : ''}`}
                />
                <p className={`text-sm mt-2 ${isOverBudget ? 'text-red-400' : 'text-muted-foreground'}`}>
                  {isOverBudget ? (
                    <>Over budget by ${(category.amount - category.budget).toFixed(2)}</>
                  ) : (
                    <>{percentage.toFixed(0)}% of budget used</>
                  )}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
              <div className="w-2 h-2 rounded-full bg-teal-400 mt-2"></div>
              <div>
                <p className="text-sm">
                  Great job! You're staying within your budget in 5 out of 6 categories.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-300 mt-2"></div>
              <div>
                <p className="text-sm">
                  You've spent 89% of your Food & Dining budget. Consider meal prepping to save more.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-2 h-2 rounded-full bg-purple-300 mt-2"></div>
              <div>
                <p className="text-sm">
                  You have ${(totalBudget - totalSpent).toFixed(2)} remaining this month across all categories.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
