import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, TrendingUp, Target } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  weeklyTarget: number;
  dateCreated: string;
  targetDate: string;
  category: string;
}

export function FinancialGoals() {
  const goals: Goal[] = [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 3000.00,
      currentAmount: 1500.00,
      weeklyTarget: 75.00,
      dateCreated: 'Aug 15, 2025',
      targetDate: 'Feb 15, 2026',
      category: 'Savings',
    },
    {
      id: '2',
      name: 'Spring Break Trip',
      targetAmount: 1200.00,
      currentAmount: 850.00,
      weeklyTarget: 50.00,
      dateCreated: 'Sep 1, 2025',
      targetDate: 'Mar 1, 2026',
      category: 'Travel',
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 1500.00,
      currentAmount: 600.00,
      weeklyTarget: 60.00,
      dateCreated: 'Oct 1, 2025',
      targetDate: 'Jan 1, 2026',
      category: 'Technology',
    },
    {
      id: '4',
      name: 'Summer Internship Fund',
      targetAmount: 2000.00,
      currentAmount: 500.00,
      weeklyTarget: 40.00,
      dateCreated: 'Sep 15, 2025',
      targetDate: 'May 1, 2026',
      category: 'Career',
    },
  ];

  const calculateProgress = (goal: Goal): { percentage: number; isOnTrack: boolean } => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    
    // Calculate if on track
    const startDate = new Date(goal.dateCreated);
    const endDate = new Date(goal.targetDate);
    const today = new Date();
    
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const expectedPercentage = (daysPassed / totalDays) * 100;
    
    const isOnTrack = percentage >= expectedPercentage - 5; // 5% tolerance
    
    return { percentage, isOnTrack };
  };

  const getWeeksRemaining = (targetDate: string): number => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const getGoalImage = (goalName: string): string => {
    const imageMap: Record<string, string> = {
      'Emergency Fund': 'https://images.unsplash.com/photo-1691302174401-5350410a3179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWdneSUyMGJhbmslMjBzYXZpbmdzfGVufDF8fHx8MTc2MjI5NTIwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'Spring Break Trip': 'https://images.unsplash.com/photo-1736524972348-85c310d7815b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwdmFjYXRpb258ZW58MXx8fHwxNzYyMzEyMTE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'New Laptop': 'https://images.unsplash.com/photo-1571973947322-612e31b82c08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBkZXNrfGVufDF8fHx8MTc2MjM3MTkyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'Summer Internship Fund': 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYyMzAzNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    };
    return imageMap[goalName] || imageMap['Emergency Fund'];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Financial Goals</h2>
          <p className="text-muted-foreground">Track your progress towards your savings goals</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const { percentage, isOnTrack } = calculateProgress(goal);
          const weeksRemaining = getWeeksRemaining(goal.targetDate);
          const amountRemaining = goal.targetAmount - goal.currentAmount;

          return (
            <Card key={goal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{goal.name}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {goal.category}
                    </Badge>
                  </div>
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={getGoalImage(goal.name)}
                      alt={goal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                {/* Amount Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className="font-semibold">${goal.currentAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Target</p>
                    <p className="font-semibold">${goal.targetAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <Badge 
                    className={isOnTrack ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-600'}
                  >
                    {isOnTrack ? '✓ On Track' : '⚠ Behind Schedule'}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{goal.dateCreated}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Target Date:</span>
                    <span>{goal.targetDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Weekly Target:</span>
                    <span>${goal.weeklyTarget.toFixed(2)}/week</span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`p-3 rounded-lg text-sm ${isOnTrack ? 'bg-teal-50' : 'bg-orange-50'}`}>
                  {isOnTrack ? (
                    <p>
                      Great progress! Keep saving ${goal.weeklyTarget}/week for {weeksRemaining} more weeks.
                    </p>
                  ) : (
                    <p>
                      To get back on track, try saving ${(amountRemaining / weeksRemaining).toFixed(2)}/week instead of ${goal.weeklyTarget}/week.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
