"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AccountsOverview } from "@/components/AccountsOverview";
import { TransactionsList } from "@/components/TransactionsList";
import { SpendingCategories } from "@/components/SpendingCategories";
import { FinancialGoals } from "@/components/FinancialGoals";
import { BudgetPlanner } from "@/components/BudgetPlanner";
import { FinancialChatbot } from "@/components/FinancialChatbot";
import { PrivacyConsentModal } from "@/components/PrivacyConsentModal";
import { ThemeProvider, useTheme } from "@/components/ThemeContext";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Receipt,
  PieChart,
  Target,
  Calculator,
  MessageCircle,
  Palette,
} from "lucide-react";

function AppContent() {
  const [activeTab, setActiveTab] = useState("accounts");
  const [themeCustomizerOpen, setThemeCustomizerOpen] =
    useState(false);
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(${theme.bgGradientDirection}, ${theme.bgGradientStart}, ${theme.bgGradientMiddle}, ${theme.bgGradientEnd})`,
      }}
    >
      {/* Privacy Consent Modal */}
      <PrivacyConsentModal />

      {/* Theme Customizer */}
      <ThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      />

      {/* Header */}
      <div
        className="text-white p-6 shadow-lg"
        style={{
          background: `linear-gradient(${theme.headerGradientDirection}, ${theme.headerGradientStart}, ${theme.headerGradientMiddle}, ${theme.headerGradientEnd})`,
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Welcome back, Alex</h1>
            <p className="opacity-90">Chase Bank - Student Account</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setThemeCustomizerOpen(true)}
            className="flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Customize Theme
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 pb-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Accounts</span>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="spending" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Spending</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Budget</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Ask Numina</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="mt-0">
            <AccountsOverview />
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <TransactionsList />
          </TabsContent>

          <TabsContent value="spending" className="mt-0">
            <SpendingCategories />
          </TabsContent>

          <TabsContent value="goals" className="mt-0">
            <FinancialGoals />
          </TabsContent>

          <TabsContent value="budget" className="mt-0">
            <BudgetPlanner />
          </TabsContent>

          <TabsContent value="chatbot" className="mt-0">
            <FinancialChatbot />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
