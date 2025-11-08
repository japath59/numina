import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Badge } from './ui/badge';
import { BookOpen } from 'lucide-react';

interface EducationalTooltipProps {
  topic: string;
  children?: React.ReactNode;
}

export function EducationalTooltip({ topic, children }: EducationalTooltipProps) {
  const educationalContent: { [key: string]: { title: string; description: string; tips?: string[] } } = {
    'emergency-fund': {
      title: 'What is an Emergency Fund?',
      description: 'An emergency fund is money set aside to cover unexpected expenses like medical bills, car repairs, or job loss.',
      tips: [
        'Aim for 3-6 months of living expenses',
        'Keep it in a high-yield savings account',
        'Only use for true emergencies',
      ],
    },
    'high-yield-savings': {
      title: 'High-Yield Savings Account',
      description: 'A savings account that offers a higher interest rate than traditional savings accounts, helping your money grow faster.',
      tips: [
        'Typically offers 4-5% APY (as of 2025)',
        'FDIC insured up to $250,000',
        'Great for short to medium-term goals',
      ],
    },
    'compound-interest': {
      title: 'Compound Interest',
      description: 'Interest earned on both your initial deposit and the accumulated interest over time. Einstein called it the "eighth wonder of the world."',
      tips: [
        'The earlier you start, the more you benefit',
        'Small regular contributions grow significantly',
        'Time is your greatest advantage',
      ],
    },
    'budget-allocation': {
      title: '50/30/20 Budgeting Rule',
      description: 'A simple budgeting framework: 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
      tips: [
        'Needs: rent, groceries, utilities, insurance',
        'Wants: dining out, entertainment, hobbies',
        'Savings: emergency fund, retirement, goals',
      ],
    },
    'credit-utilization': {
      title: 'Credit Utilization Ratio',
      description: 'The percentage of your available credit that you\'re currently using. It\'s a major factor in your credit score.',
      tips: [
        'Keep it below 30% for good credit',
        'Under 10% is ideal for excellent credit',
        'Pay down balances before statement dates',
      ],
    },
    'index-fund': {
      title: 'Index Funds (Educational)',
      description: 'A type of investment fund that tracks a market index (like the S&P 500), providing instant diversification across many companies.',
      tips: [
        'Low fees compared to actively managed funds',
        'Historically strong long-term returns',
        'Consult a CFP® before investing',
      ],
    },
  };

  const content = educationalContent[topic];

  if (!content) {
    return children || <Badge variant="secondary">Learn more</Badge>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge 
          variant="secondary" 
          className="cursor-help hover:bg-purple-100 transition-colors"
          aria-label={`Learn about ${content.title}`}
        >
          {children || (
            <>
              <BookOpen className="h-3 w-3 mr-1" />
              Learn more
            </>
          )}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top">
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-600" aria-hidden="true" />
            {content.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {content.description}
          </p>
          {content.tips && content.tips.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs font-medium mb-2">Key Points:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                {content.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
