import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

export function BudgetPlanner() {
  const { theme } = useTheme();
  const [monthlyIncome, setMonthlyIncome] = useState(1650);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());

  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Housing', allocated: 800, spent: 800, color: 'bg-teal-300' },
    { id: '2', name: 'Food & Dining', allocated: 300, spent: 267.53, color: 'bg-orange-300' },
    { id: '3', name: 'Transportation', allocated: 150, spent: 95.50, color: 'bg-blue-300' },
    { id: '4', name: 'Shopping', allocated: 200, spent: 140.30, color: 'bg-purple-300' },
    { id: '5', name: 'Entertainment', allocated: 50, spent: 26.98, color: 'bg-pink-300' },
    { id: '6', name: 'Education', allocated: 100, spent: 89.99, color: 'bg-indigo-300' },
  ]);

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingIncome = monthlyIncome - totalAllocated;

  const saveIncome = () => {
    const newIncome = parseFloat(tempIncome);
    if (!isNaN(newIncome) && newIncome > 0) {
      setMonthlyIncome(newIncome);
    }
    setIsEditingIncome(false);
  };

  const cancelIncome = () => {
    setTempIncome(monthlyIncome.toString());
    setIsEditingIncome(false);
  };

  return (
    <div className="space-y-6">
      {/* Income Section */}
      <Card 
        className="text-white border-0"
        style={{
          background: `linear-gradient(to bottom right, ${theme.accentPrimary}, ${theme.accentSecondary})`
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Monthly Income</span>
            {!isEditingIncome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingIncome(true)}
                className="text-white hover:bg-white/20"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingIncome ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tempIncome}
                onChange={(e) => setTempIncome(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={saveIncome}
                className="text-white hover:bg-white/20"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelIncome}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-4xl mb-4">${monthlyIncome.toFixed(2)}</div>
          )}
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="opacity-90 text-sm">Allocated</p>
              <p className="text-xl">${totalAllocated.toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90 text-sm">Spent</p>
              <p className="text-xl">${totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90 text-sm">Remaining</p>
              <p className="text-xl">${remainingIncome.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Allocation - 50/30/20 Rule */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Budget (50/30/20 Rule)</CardTitle>
          <p className="text-sm text-muted-foreground">
            A guideline for smart money management
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold">Needs (50%)</p>
                <p className="text-sm text-muted-foreground">Housing, food, utilities, transportation</p>
              </div>
              <p className="text-xl">${(monthlyIncome * 0.5).toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold">Wants (30%)</p>
                <p className="text-sm text-muted-foreground">Entertainment, dining out, hobbies</p>
              </div>
              <p className="text-xl">${(monthlyIncome * 0.3).toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold">Savings (20%)</p>
                <p className="text-sm text-muted-foreground">Emergency fund, investments, goals</p>
              </div>
              <p className="text-xl">${(monthlyIncome * 0.2).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <Card>
        <CardHeader>
          <CardTitle>Your Budget by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const percentage = (category.spent / category.allocated) * 100;
            const isOverBudget = percentage > 100;

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <Label>{category.name}</Label>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      <span className={isOverBudget ? 'text-red-400' : ''}>
                        ${category.spent.toFixed(2)}
                      </span>
                      {' / '}
                      <span className="text-muted-foreground">
                        ${category.allocated.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 ${isOverBudget ? '[&>div]:bg-red-400' : ''}`}
                />
                <p className="text-xs text-muted-foreground">
                  {isOverBudget ? (
                    <span className="text-red-400">
                      Over budget by ${(category.spent - category.allocated).toFixed(2)}
                    </span>
                  ) : (
                    <>
                      ${(category.allocated - category.spent).toFixed(2)} remaining ({(100 - percentage).toFixed(0)}%)
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Health Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {remainingIncome > 0 ? (
            <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
              <div className="w-2 h-2 rounded-full bg-teal-400 mt-2"></div>
              <div>
                <p className="font-semibold text-teal-800">Great job!</p>
                <p className="text-sm text-teal-700">
                  You have ${remainingIncome.toFixed(2)} unallocated. Consider adding this to your savings or emergency fund.
                </p>
              </div>
            </div>
          ) : remainingIncome < 0 ? (
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-2 h-2 rounded-full bg-orange-400 mt-2"></div>
              <div>
                <p className="font-semibold text-orange-800">Budget Alert!</p>
                <p className="text-sm text-orange-700">
                  You've allocated ${Math.abs(remainingIncome).toFixed(2)} more than your income. Consider reducing some categories.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-300 mt-2"></div>
              <div>
                <p className="font-semibold text-blue-800">Perfectly Balanced</p>
                <p className="text-sm text-blue-700">
                  Your budget is fully allocated with no excess or deficit.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-2 h-2 rounded-full bg-purple-300 mt-2"></div>
            <div>
              <p className="text-sm">
                Overall spending: {((totalSpent / totalAllocated) * 100).toFixed(0)}% of your budget used this month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
