import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { Send, Sparkles, Shield, AlertCircle, UserCheck, X, History, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'disclaimer' | 'referral';
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  requiresAdvisor?: boolean;
}

interface QuickReply {
  label: string;
  value: string;
}

interface ConversationHistory {
  id: string;
  messages: Message[];
  startDate: Date;
  lastUpdated: Date;
}

export function FinancialChatbot() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [userGoal, setUserGoal] = useState<string>('');
  const [knowledgeLevel, setKnowledgeLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [consecutiveUnknowns, setConsecutiveUnknowns] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('current');
  const [historyFilter, setHistoryFilter] = useState<'week' | '2weeks' | 'month' | '6months' | 'year'>('month');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'disclaimer',
      type: 'disclaimer',
      content: "⚠️ IMPORTANT DISCLOSURE\n\nI'm Numina, an AI-powered educational tool designed to help you understand financial concepts. I am NOT a licensed financial advisor, tax professional, or legal expert.\n\n📋 What I can do:\n• Provide general financial education\n• Help you understand your account data\n• Explain financial concepts in simple terms\n• Suggest topics to discuss with professionals\n\n🚫 What I cannot do:\n• Provide personalized investment advice\n• Offer tax or legal guidance\n• Make specific financial recommendations\n• Replace professional financial advisors\n\n🔒 Privacy: Your data is used only to provide educational context and is never shared.\n\nFor complex financial decisions, I'll recommend consulting with a Certified Financial Planner® (CFP®) or other licensed professional.",
      timestamp: new Date(),
    },
    {
      id: '1',
      type: 'bot',
      content: "Hey there! 👋 I'm here to help you learn about personal finance and understand your account activity.\n\n💡 I can help you explore:\n• 📊 Basic budgeting concepts\n• 💰 General saving strategies\n• 📈 Investing fundamentals (educational only)\n• 💳 Credit score basics\n• 🎯 Goal-tracking insights\n• 📱 Your account activity overview\n\nWhat would you like to learn about today?",
      timestamp: new Date(),
      quickReplies: [
        { label: '📚 Learn budgeting basics', value: 'Learn budgeting basics' },
        { label: '💰 Understand saving strategies', value: 'Understand saving strategies' },
        { label: '📊 View my account summary', value: 'View my account summary' },
        { label: '🎯 Explore financial goals', value: 'Explore financial goals' },
        { label: '👤 When should I see an advisor?', value: 'When should I see an advisor?' },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Save conversation to history when messages change
  useEffect(() => {
    if (messages.length > 2) { // Only save if there are messages beyond initial ones
      const currentConversation: ConversationHistory = {
        id: currentConversationId,
        messages: [...messages],
        startDate: messages[0].timestamp,
        lastUpdated: new Date(),
      };
      
      setConversationHistory(prev => {
        const existingIndex = prev.findIndex(conv => conv.id === currentConversationId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = currentConversation;
          return updated;
        }
        return [...prev, currentConversation];
      });
    }
  }, [messages, currentConversationId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleOnboardingResponse = (response: string): Message => {
    // Step 0: User just shared their goal
    if (onboardingStep === 0) {
      setUserGoal(response);
      setOnboardingStep(1);
      return {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `That's awesome! ${response} is a great goal to work towards. 🎯\n\nNow, which financial topics are you most interested in learning about? (You can pick more than one!)`,
        timestamp: new Date(),
        quickReplies: [
          { label: '💰 Budgeting', value: 'budgeting' },
          { label: '📈 Investing', value: 'investing' },
          { label: '💳 Credit & Debt', value: 'credit' },
          { label: '🎯 Goal Setting', value: 'goals' },
          { label: '💸 Saving Money', value: 'saving' },
        ],
      };
    }
    
    // Step 1: User is selecting interests
    if (onboardingStep === 1) {
      const newInterests = [...userInterests];
      if (!newInterests.includes(response)) {
        newInterests.push(response);
        setUserInterests(newInterests);
      }
      
      // Check if they want to continue selecting or move on
      if (newInterests.length >= 1) {
        // Show a completion option
        return {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: `Perfect! I'll focus on helping you with ${newInterests.join(', ')}. ${newInterests.length > 1 ? 'Great choices!' : ''}\n\nWant to select more topics, or shall we get started?`,
          timestamp: new Date(),
          quickReplies: [
            { label: '✅ Let\'s get started!', value: 'start' },
            { label: '➕ Add more topics', value: 'more' },
          ],
        };
      }
    }
    
    // Step 2: Ask about knowledge level
    if (onboardingStep === 1 && response === 'start') {
      setOnboardingStep(2);
      return {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `One last thing! How comfortable are you with financial terms and concepts?\n\nThis helps me explain things in a way that makes sense for you. 😊`,
        timestamp: new Date(),
        quickReplies: [
          { label: '🌱 Beginner - Just starting out', value: 'beginner' },
          { label: '📚 Intermediate - Know the basics', value: 'intermediate' },
          { label: '🎓 Advanced - Pretty comfortable', value: 'advanced' },
        ],
      };
    }
    
    // Step 3: Set knowledge level and finish onboarding
    if (onboardingStep === 2 && (response === 'beginner' || response === 'intermediate' || response === 'advanced')) {
      setKnowledgeLevel(response as 'beginner' | 'intermediate' | 'advanced');
      setIsFirstVisit(false);
      setOnboardingStep(3);
      
      let levelMessage = '';
      if (response === 'beginner') {
        levelMessage = "Perfect! I'll explain things step by step and avoid jargon. Don't hesitate to ask if anything is unclear!";
      } else if (response === 'intermediate') {
        levelMessage = "Great! I'll use common financial terms but still provide context when needed.";
      } else {
        levelMessage = "Awesome! I'll dive right into the details and use industry terminology.";
      }
      
      let personalizedTip = '';
      if (userInterests.includes('budgeting')) {
        personalizedTip = "\n\n💡 Quick tip: Looking at your accounts, you're doing great! You've spent 89% of your monthly budget with some time left. Keep an eye on Food & Dining expenses to stay on track.";
      } else if (userInterests.includes('investing')) {
        personalizedTip = "\n\n💡 Quick tip: With your savings of $5,234.50, you could start small with investing. Even $50-100/month in a low-cost index fund can grow significantly over time!";
      } else if (userInterests.includes('saving')) {
        personalizedTip = "\n\n💡 Quick tip: Your Emergency Fund is 50% complete - amazing progress! Keep up those $75 weekly contributions to hit your goal by February.";
      }
      
      return {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `${levelMessage}\n\nBased on your goal of "${userGoal}" and your interest in ${userInterests.join(', ')}, I'll provide personalized advice to help you succeed.${personalizedTip}\n\nFeel free to ask me anything - I'm analyzing your account data to give you the most relevant insights. What would you like to know first?`,
        timestamp: new Date(),
        quickReplies: [
          { label: '💰 Tell me about budgeting', value: 'tell me about budgeting' },
          { label: '📈 Tell me about investing', value: 'tell me about investing' },
          { label: '💳 Tell me about credit', value: 'tell me about credit' },
          { label: '📊 Show my account summary', value: "what's my account balance?" },
        ],
      };
    }
    
    // If user wants to add more interests
    if (response === 'more') {
      return {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Great! Pick another topic you\'d like to learn about:',
        timestamp: new Date(),
        quickReplies: [
          { label: '💰 Budgeting', value: 'budgeting' },
          { label: '📈 Investing', value: 'investing' },
          { label: '💳 Credit & Debt', value: 'credit' },
          { label: '🎯 Goal Setting', value: 'goals' },
          { label: '💸 Saving Money', value: 'saving' },
          { label: '✅ Done selecting', value: 'start' },
        ],
      };
    }
    
    return {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: '',
      timestamp: new Date(),
    };
  };

  // Helper function to identify topics requiring professional advisor
  const requiresProfessionalAdvisor = (topic: string): boolean => {
    const advisorTopics = [
      'specific investment',
      'stock pick',
      'which stock',
      'buy stock',
      'sell stock',
      'tax advice',
      'tax return',
      'retirement plan',
      '401k rollover',
      'estate plan',
      'will',
      'trust',
      'insurance policy',
      'which insurance',
      'debt consolidation',
      'bankruptcy',
      'mortgage',
      'loan approval',
      'credit repair',
      'financial plan',
    ];
    
    return advisorTopics.some(advisorTopic => topic.toLowerCase().includes(advisorTopic));
  };

  const getAdvisorReferralMessage = (topic: string): Message => {
    return {
      id: (Date.now() + 1).toString(),
      type: 'referral',
      content: `📋 Professional Guidance Recommended\n\nThe topic you're asking about (${topic}) involves personalized financial decisions that require expertise beyond my educational scope.\n\n👤 I recommend consulting with:\n• Certified Financial Planner® (CFP®) - For investment and financial planning\n• Tax Professional (CPA/EA) - For tax-related questions\n• Estate Attorney - For wills, trusts, and estate planning\n• Licensed Insurance Agent - For insurance policy recommendations\n\n💡 What I can do instead:\n• Explain general concepts about this topic\n• Help you prepare questions to ask a professional\n• Provide educational resources\n\nWould you like me to explain the general concepts, or would you prefer help preparing for a professional consultation?`,
      timestamp: new Date(),
      requiresAdvisor: true,
      quickReplies: [
        { label: '📚 Explain general concepts', value: 'explain general concepts' },
        { label: '❓ Help me prepare questions', value: 'help prepare questions' },
        { label: '🔍 Find more resources', value: 'find resources' },
      ],
    };
  };

  const getKnowledgeBasedExplanation = (topic: string): string => {
    const explanations: Record<string, Record<string, string>> = {
      'budgeting_intro': {
        'beginner': "📊 General Budgeting Education:\n\nBudgeting means creating a spending plan for your money. Common approaches include:\n• 50/30/20 rule: 50% needs, 30% wants, 20% savings\n• Zero-based budgeting: Every dollar has a purpose\n• Envelope method: Cash for each category\n\nLooking at your account data, you've spent $1,420 of $1,600 this month (89%). This is just an observation - not financial advice. For personalized budgeting strategies, consider consulting a CFP®.",
        'intermediate': "📊 Budgeting Fundamentals:\n\nBudgeting allocates income across expense categories. Common frameworks include the 50/30/20 rule and zero-based budgeting.\n\nYour data shows: $1,420.30 spent of $1,600 budget (89%). Top categories: Housing ($800), Food & Dining ($267.53).\n\nNote: This is educational information only. For personalized budget optimization strategies, consult with a financial professional.",
        'advanced': "📊 Budget Analysis Framework:\n\nCurrent utilization: 89% ($1,420.30/$1,600). Distribution: Housing (50%), Food & Dining (16.7%).\n\nGeneral strategies to explore:\n• Zero-based budgeting for surplus optimization\n• Automated savings transfers\n• Spending tracking apps\n\nDisclaimer: This is educational information based on general financial principles, not personalized advice."
      },
      'investing_intro': {
        'beginner': "📈 Investing Education (General Information Only):\n\nInvesting involves putting money into assets that may grow in value over time. Common beginner-friendly options include:\n• Index funds (diversified stock collections)\n• Target-date funds (automatic allocation)\n• Bonds (lower risk, lower return)\n\n⚠️ Important: I cannot provide personalized investment recommendations. Factors like risk tolerance, time horizon, and financial goals require professional assessment.\n\n👤 For specific investment guidance, consult a CFP® or licensed investment advisor.",
        'intermediate': "📈 Investment Fundamentals (Educational):\n\nKey concepts:\n• Diversification reduces risk\n• Compound growth over time\n• Tax-advantaged accounts (IRA, 401k)\n• Asset allocation based on goals\n\n⚠️ Important Disclaimer: This is general education only. Investment decisions should be made with a licensed financial advisor who understands your complete financial picture, risk tolerance, and goals.\n\nYour savings: $5,234.50 - but whether/how to invest requires professional guidance.",
        'advanced': "📈 Investment Principles (Educational Framework):\n\nGeneral concepts:\n• Index fund diversification (low expense ratios)\n• Tax-advantaged accounts (Roth IRA, 401k)\n• Dollar-cost averaging strategies\n• Asset allocation models\n\n⚠️ Regulatory Compliance Notice: Under CFP Board and SEC guidelines, I cannot provide specific investment recommendations. This includes:\n❌ Specific securities to buy/sell\n❌ Asset allocation percentages for you\n❌ Timing recommendations\n\n✅ Consult a licensed investment advisor for personalized guidance."
      },
      'credit_intro': {
        'beginner': "💳 Credit Basics (General Education):\n\nCredit scores (300-850) affect loan approvals and rates. The FICO score considers:\n1. Payment history (35%) - Pay on time!\n2. Credit utilization (30%) - Use <30% of limits\n3. Credit history length (15%)\n4. Credit mix (10%)\n5. New credit (10%)\n\nGeneral tips:\n• Start with a secured or student card\n• Pay full balance monthly\n• Monitor credit reports (free annually)\n\nNote: This is educational information. For credit repair or specific strategies, consult a certified credit counselor.",
        'intermediate': "💳 Credit Building Framework:\n\nFICO score factors:\n• Payment history (35%)\n• Utilization (30%) - Keep below 30%, ideal <10%\n• Credit age (15%)\n• Credit mix (10%)\n• New credit (10%)\n\nGeneral strategies:\n• No-fee student cards\n• Automated payments\n• Regular credit monitoring\n\nDisclaimer: For credit repair, debt management, or specific credit product recommendations, consult a licensed professional or non-profit credit counselor.",
        'advanced': "💳 Credit Optimization Principles:\n\nFICO scoring model components and general optimization strategies:\n• Payment history: Automated payments for 100% on-time record\n• Utilization: <10% optimal for score maximization\n• Credit age: Maintain old accounts\n• Mix: Consider diverse account types\n• New credit: Minimize hard inquiries\n\nNote: This is general information. Credit repair services, debt restructuring, and specific product selection require consultation with licensed professionals or certified credit counselors."
      }
    };
    
    return explanations[topic]?.[knowledgeLevel] || '';
  };

  const generateBotResponse = (userMessage: string): Message => {
    // Handle onboarding flow
    if (isFirstVisit || onboardingStep < 3) {
      return handleOnboardingResponse(userMessage);
    }
    
    const messageLower = userMessage.toLowerCase();
    let content = '';
    let quickReplies: QuickReply[] | undefined = undefined;
    let isUnknown = false;

    // Check if topic requires professional advisor referral
    if (requiresProfessionalAdvisor(userMessage)) {
      return getAdvisorReferralMessage(userMessage);
    }

    // When should I see an advisor
    if (messageLower.includes('when') && (messageLower.includes('advisor') || messageLower.includes('professional') || messageLower.includes('cfp'))) {
      content = "👤 When to Consult a Professional Advisor:\n\nYou should consider consulting a licensed financial professional when:\n\n📋 Complex Decisions:\n• Investment strategy and asset allocation\n• Retirement planning (401k, IRA, pension)\n• Tax optimization strategies\n• Estate planning (wills, trusts)\n• Insurance needs assessment\n• Debt consolidation or restructuring\n\n💼 Major Life Events:\n• Getting married or divorced\n• Having children\n• Buying a home\n• Starting a business\n• Receiving inheritance\n• Changing careers\n\n🎯 Financial Goals:\n• Creating a comprehensive financial plan\n• Planning for college expenses\n• Early retirement strategies\n\n💡 Look for:\n• CFP® (Certified Financial Planner)\n• CPA (for tax matters)\n• Fee-only advisors (fiduciary duty)\n\nRemember: I provide education only. Real financial advice comes from licensed professionals who understand your complete financial picture.";
      setConsecutiveUnknowns(0);
    }

    // Handle "tell me about" requests with knowledge-based responses
    else if (messageLower.includes('tell me about budgeting') || messageLower.includes('learn budgeting') || (messageLower.includes('about') && messageLower.includes('budget'))) {
      content = getKnowledgeBasedExplanation('budgeting_intro');
      setConsecutiveUnknowns(0);
    }
    else if (messageLower.includes('tell me about investing') || (messageLower.includes('about') && messageLower.includes('invest'))) {
      content = getKnowledgeBasedExplanation('investing_intro');
      quickReplies = [
        { label: '👤 Talk to an advisor about investing', value: 'When should I see an advisor?' },
        { label: '📚 More general concepts', value: 'explain general concepts' },
      ];
      setConsecutiveUnknowns(0);
    }
    else if (messageLower.includes('tell me about credit') || (messageLower.includes('about') && messageLower.includes('credit'))) {
      content = getKnowledgeBasedExplanation('credit_intro');
      setConsecutiveUnknowns(0);
    }

    // Account balance questions
    else if (messageLower.includes('balance') || messageLower.includes('how much money') || messageLower.includes('account summary') || messageLower.includes('view my account')) {
      content = "📊 Account Summary (As of " + new Date().toLocaleDateString() + "):\n\n💰 Total Balance: $9,581.82\n\nBreakdown:\n• Checking Account: $2,847.32\n• Savings Account: $5,234.50\n• Emergency Fund: $1,500.00\n\nNote: This is informational data from your accounts, not financial advice.";
      setConsecutiveUnknowns(0);
    }

    // Budget-related responses
    else if (messageLower.includes('budget') || messageLower.includes('spending')) {
      if (knowledgeLevel === 'beginner') {
        content = "Looking at your budget, you're doing well! 📊 You've spent $1,420.30 out of your $1,600 monthly budget. That's about 89% - like getting a B+! Your biggest expenses are Housing ($800) and Food & Dining ($267.53). You still have $179.70 left this month. Would you like tips on reducing expenses?";
      } else {
        content = "Looking at your budget, you're doing well! 📊 You've spent $1,420.30 out of your $1,600 monthly budget (89%). Your biggest expenses are Housing ($800) and Food & Dining ($267.53). You still have $179.70 remaining this month. Would you like tips on optimizing your spending?";
      }
      setConsecutiveUnknowns(0);
    }

    // Saving-related responses
    else if (messageLower.includes('save') || messageLower.includes('saving') || messageLower.includes('emergency')) {
      content = "You're making great progress on savings! 💪 Your Emergency Fund currently has $1,500 of your $3,000 goal - that's 50% there! I recommend continuing to save $75/week to reach your goal by February. Also, your high-yield savings account has $5,234.50 earning interest. Keep it up!";
      setConsecutiveUnknowns(0);
    }

    // Goals-related responses
    else if (messageLower.includes('goal') || messageLower.includes('progress') || messageLower.includes('on track')) {
      content = "You have 4 active financial goals! 🎯 Your Emergency Fund (50% complete) and Spring Break Trip (71% complete) are on track. However, your New Laptop and Summer Internship Fund goals are slightly behind schedule. Consider increasing your weekly contributions by $10-15 to get back on track. Need help adjusting your budget to accommodate this?";
      setConsecutiveUnknowns(0);
    }

    // Investing-related responses
    else if (messageLower.includes('invest') || messageLower.includes('stock') || messageLower.includes('retirement')) {
      if (knowledgeLevel === 'beginner') {
        content = "Great question about investing! 📈 Investing is when you put money somewhere it can grow over time. As a student with $5,234.50 saved, you could start small - maybe $50-100/month in something called an 'index fund' (it's like buying a tiny piece of many companies). Important: Keep your emergency fund safe first! Starting early gives you a huge advantage. 🚀";
      } else {
        content = "Great question about investing! 📈 As a student, consider starting with a Roth IRA or low-cost index funds. With your current savings of $5,234.50, you could allocate a small portion (like $100-200/month) to start investing. Remember to keep your emergency fund intact first! Starting early gives you a huge advantage thanks to compound interest. 🚀";
      }
      setConsecutiveUnknowns(0);
    }

    // Transaction questions
    else if (messageLower.includes('transaction') || messageLower.includes('spent') || messageLower.includes('purchase')) {
      content = "Your recent transactions show you earned $450 from your part-time job 2 days ago, spent $6.75 at Starbucks 3 days ago, and received a $1,200 scholarship payment last week. Your biggest recent expense was your $800 rent payment on Oct 6th. Would you like to see a breakdown by category? 💳";
      setConsecutiveUnknowns(0);
    }

    // Credit-related responses
    else if (messageLower.includes('credit') || messageLower.includes('card') || messageLower.includes('debt')) {
      if (knowledgeLevel === 'beginner') {
        content = "Building good credit is super important! 💳 Think of credit as your financial report card. Here's what to do:\n\n1. Pay bills on time (most important!)\n2. Don't use more than 30% of your credit limit\n3. Get a student credit card with no fees\n4. Pay it off in full every month\n\nYour good savings habits show you're responsible - that's perfect for building credit! ✨";
      } else {
        content = "Building good credit is crucial! 💳 Pay your credit card in full each month to avoid interest. Keep utilization under 30% of your limit and always pay on time. As a student, consider a student credit card with no annual fee. Your consistent savings habits show you're financially responsible - that's a great foundation for credit building! ✨";
      }
      setConsecutiveUnknowns(0);
    }

    // Income/money making responses
    else if (messageLower.includes('income') || messageLower.includes('more money') || messageLower.includes('earn') || messageLower.includes('job')) {
      content = "Your current monthly income is $1,650. Looking for ways to increase it? 💼 Consider: tutoring other students (leverages your academic strengths), freelancing online, campus work-study programs, or flexible gig work like food delivery. Even an extra $200/month would help you reach your financial goals faster!";
      setConsecutiveUnknowns(0);
    }

    // Tips and advice
    else if (messageLower.includes('tip') || messageLower.includes('advice') || messageLower.includes('help') || messageLower.includes('learn')) {
      content = "Here are my top tips for you: 💡\n\n1) You're doing great with the 50/30/20 rule!\n2) Consider automating your savings transfers to reach goals faster\n3) Review your Food & Dining budget - you're at 89% with time left in the month\n4) Your emergency fund is halfway there - excellent progress!\n5) Take advantage of student discounts to stretch your entertainment budget further 🎓";
      setConsecutiveUnknowns(0);
    }

    // Fallback - unknown query
    else {
      isUnknown = true;
      const newUnknownCount = consecutiveUnknowns + 1;
      setConsecutiveUnknowns(newUnknownCount);
      
      if (newUnknownCount === 1) {
        content = "I'm sorry, I didn't quite understand that. 🤔 Could you try rephrasing your question?\n\nOr I can help you with:";
        quickReplies = [
          { label: '💰 Budgeting tips', value: 'tell me about budgeting' },
          { label: '📈 Investing basics', value: 'tell me about investing' },
          { label: '💳 Credit building', value: 'tell me about credit' },
          { label: '📊 My account summary', value: "what's my account balance?" },
        ];
      } else if (newUnknownCount === 2) {
        content = "I'm still having trouble understanding. 😅 Let me help by showing you what I can do!\n\n📚 Here are some helpful articles:\n• Budgeting 101: How to track your spending\n• Investing Basics: Getting started as a student\n• Credit Scores: What you need to know\n• Emergency Funds: Why they matter\n\nOr try one of these:";
        quickReplies = [
          { label: '💰 Tell me about budgeting', value: 'tell me about budgeting' },
          { label: '📈 Tell me about investing', value: 'tell me about investing' },
          { label: '💳 Tell me about credit', value: 'tell me about credit' },
          { label: '📊 Show my finances', value: "what's my account balance?" },
        ];
      } else {
        content = "I want to make sure I'm helpful! 😊 Here's what I'm best at:\n\n✅ Account balances & transactions\n✅ Budget analysis & spending tips\n✅ Savings goals & progress tracking\n✅ Financial education (budgeting, investing, credit)\n✅ Personalized money advice\n\n📚 Learning Resources:\n• \"Student Budgeting Guide\" - Managing money in college\n• \"Investing 101\" - Starting your investment journey\n• \"Credit Score Basics\" - Building credit from scratch\n• \"Emergency Fund Guide\" - Financial safety nets\n\nWhat would you like to explore?";
        quickReplies = [
          { label: '💰 Budgeting', value: 'tell me about budgeting' },
          { label: '📈 Investing', value: 'tell me about investing' },
          { label: '💳 Credit', value: 'tell me about credit' },
          { label: '🎯 My goals', value: 'how are my goals?' },
        ];
        setConsecutiveUnknowns(0); // Reset after showing comprehensive help
      }
    }
    
    return {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: content,
      timestamp: new Date(),
      quickReplies: quickReplies,
    };
  };

  const handleQuickReply = (value: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: value,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(value);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  const [watsonSessionId, setWatsonSessionId] = useState<string | null>(null);

const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: "user",
    content: inputValue,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  const messageToSend = inputValue;
  setInputValue("");
  setIsTyping(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messageToSend,
        session_id: watsonSessionId,
      }),
    });

    const data = await res.json();

    // Store session ID (so conversation persists)
    if (data.session_id && !watsonSessionId) {
      setWatsonSessionId(data.session_id);
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: data.reply || "Sorry, I didn’t get that.",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Chat error:", error);
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "⚠️ Connection issue with Watson Assistant.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};




  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadConversation = (conversationId: string) => {
    const conversation = conversationHistory.find(conv => conv.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
    }
  };

  const startNewConversation = () => {
    const newId = `conversation-${Date.now()}`;
    setCurrentConversationId(newId);
    setMessages([
      {
        id: 'disclaimer',
        type: 'disclaimer',
        content: "⚠️ IMPORTANT DISCLOSURE\n\nI'm Numina, an AI-powered educational tool designed to help you understand financial concepts. I am NOT a licensed financial advisor, tax professional, or legal expert.\n\n📋 What I can do:\n• Provide general financial education\n• Help you understand your account data\n• Explain financial concepts in simple terms\n• Suggest topics to discuss with professionals\n\n🚫 What I cannot do:\n• Provide personalized investment advice\n• Offer tax or legal guidance\n• Make specific financial recommendations\n• Replace professional financial advisors\n\n🔒 Privacy: Your data is used only to provide educational context and is never shared.\n\nFor complex financial decisions, I'll recommend consulting with a Certified Financial Planner® (CFP®) or other licensed professional.",
        timestamp: new Date(),
      },
      {
        id: '1',
        type: 'bot',
        content: "Hey there! 👋 I'm here to help you learn about personal finance and understand your account activity.\n\n💡 I can help you explore:\n• 📊 Basic budgeting concepts\n• 💰 General saving strategies\n• 📈 Investing fundamentals (educational only)\n• 💳 Credit score basics\n• 🎯 Goal-tracking insights\n• 📱 Your account activity overview\n\nWhat would you like to learn about today?",
        timestamp: new Date(),
        quickReplies: [
          { label: '📚 Learn budgeting basics', value: 'Learn budgeting basics' },
          { label: '💰 Understand saving strategies', value: 'Understand saving strategies' },
          { label: '📊 View my account summary', value: 'View my account summary' },
          { label: '🎯 Explore financial goals', value: 'Explore financial goals' },
          { label: '👤 When should I see an advisor?', value: 'When should I see an advisor?' },
        ],
      },
    ]);
    setShowDisclaimer(true);
  };

  const getFilteredConversations = () => {
    const now = new Date();
    const filterMap = {
      'week': 7,
      '2weeks': 14,
      'month': 30,
      '6months': 180,
      'year': 365,
    };
    
    const daysToFilter = filterMap[historyFilter];
    const cutoffDate = new Date(now.getTime() - daysToFilter * 24 * 60 * 60 * 1000);
    
    return conversationHistory.filter(conv => conv.lastUpdated >= cutoffDate);
  };

  const quickQuestions = [
    "What's my account balance?",
    "How am I doing on my budget?",
    "Am I on track with my goals?",
    "Tips for saving more money",
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Numina - AI Financial Education</CardTitle>
                <p className="text-sm opacity-90">Educational guidance • Not a licensed advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[600px]">
                  <DialogHeader>
                    <DialogTitle>Conversation History</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Select value={historyFilter} onValueChange={(value: any) => setHistoryFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Past Week</SelectItem>
                          <SelectItem value="2weeks">Past 2 Weeks</SelectItem>
                          <SelectItem value="month">Past Month</SelectItem>
                          <SelectItem value="6months">Past 6 Months</SelectItem>
                          <SelectItem value="year">Past Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={startNewConversation} size="sm">
                        New Conversation
                      </Button>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {getFilteredConversations().length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No conversations found in this time period
                          </p>
                        ) : (
                          getFilteredConversations().map((conv) => (
                            <Card
                              key={conv.id}
                              className="cursor-pointer hover:bg-accent transition-colors"
                              onClick={() => {
                                loadConversation(conv.id);
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <p className="text-sm">
                                      {conv.messages[2]?.content.substring(0, 60) || 'New conversation'}...
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {conv.lastUpdated.toLocaleDateString()} • {conv.messages.length} messages
                                    </p>
                                  </div>
                                  <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90" />
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <div className="flex items-center gap-2 px-2">
                      <Shield className="h-4 w-4" />
                      <span className="text-xs">Secure & Private</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Your Privacy is Protected</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      🔒 All your financial data and conversations are encrypted and stored securely.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      🚫 We never share your personal information with third parties.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ✅ Your data is used only to provide you with personalized educational insights.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="h-[600px] flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isBot = message.type === 'bot';
              const isUser = message.type === 'user';
              const isDisclaimer = message.type === 'disclaimer';
              const isReferral = message.type === 'referral';
              const isLastBotMessage = (isBot || isReferral) && index === messages.length - 1;
              
              // Special styling for disclaimer messages
              if (isDisclaimer && showDisclaimer) {
                return (
                  <div key={message.id}>
                    <Alert className="border-orange-200 bg-orange-50 relative">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-orange-100"
                        onClick={() => setShowDisclaimer(false)}
                      >
                        <X className="h-4 w-4 text-orange-600" />
                      </Button>
                      <AlertDescription className="whitespace-pre-wrap text-sm pr-8">
                        {message.content}
                      </AlertDescription>
                    </Alert>
                  </div>
                );
              }

              if (isDisclaimer && !showDisclaimer) {
                return null;
              }

              // Special styling for referral messages
              if (isReferral) {
                return (
                  <div key={message.id}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-400 text-white flex-shrink-0">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div className="flex-1 max-w-[80%] min-w-0">
                        <Alert className="border-blue-200 bg-blue-50">
                          <AlertDescription className="whitespace-pre-wrap text-sm break-words">
                            {message.content}
                          </AlertDescription>
                        </Alert>
                        
                        {message.quickReplies && isLastBotMessage && !isTyping && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.quickReplies.map((reply, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(reply.value)}
                                className="text-xs bg-white hover:bg-blue-50 border-blue-200"
                              >
                                {reply.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={message.id}>
                  <div
                    className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                        isBot
                          ? 'bg-gradient-to-br from-purple-400 to-pink-400'
                          : 'bg-gradient-to-br from-teal-400 to-cyan-400'
                      }`}
                    >
                      {isBot ? 'N' : 'A'}
                    </div>
                    <div className="flex-1 max-w-[80%] min-w-0 overflow-hidden">
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isBot
                            ? 'bg-purple-50 rounded-tl-sm'
                            : 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                      </div>
                      
                      {/* Quick reply buttons */}
                      {isBot && message.quickReplies && isLastBotMessage && !isTyping && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.quickReplies.map((reply, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickReply(reply.value)}
                              className="text-xs bg-white hover:bg-purple-50 border-purple-200"
                            >
                              {reply.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white flex-shrink-0">
                  N
                </div>
                <div className="bg-purple-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50">
          {!isFirstVisit && onboardingStep >= 3 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("what's my account balance?")}
                  className="text-xs"
                >
                  💰 Account Balance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("how am I doing on my budget?")}
                  className="text-xs"
                >
                  📊 Budget Status
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("am I on track with my goals?")}
                  className="text-xs"
                >
                  🎯 Goals Progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("tell me about budgeting")}
                  className="text-xs"
                >
                  📚 Learn About Budgeting
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply("tell me about investing")}
                  className="text-xs"
                >
                  📈 Learn About Investing
                </Button>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isFirstVisit || onboardingStep < 3 ? "Type your response..." : "Ask about your finances..."}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
