import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function PrivacyConsentModal() {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('financialAppConsent');
    if (!hasConsented) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (agreed) {
      localStorage.setItem('financialAppConsent', 'true');
      localStorage.setItem('consentDate', new Date().toISOString());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Data Privacy & Consent</DialogTitle>
              <p className="text-sm text-muted-foreground">Required under GLBA & NIST Privacy Standards</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <DialogDescription className="text-base leading-relaxed">
            Welcome to your AI-powered financial education platform. Before you continue, 
            please review how we handle your financial information.
          </DialogDescription>

          <div className="space-y-3">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" aria-label="Security icon" />
                  <div>
                    <p className="font-medium text-sm mb-1">Data Security</p>
                    <p className="text-xs text-muted-foreground">
                      All financial data is encrypted using industry-standard AES-256 encryption 
                      and stored securely. We comply with banking security standards and 
                      SOC 2 Type II certification requirements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Eye className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-label="Privacy icon" />
                  <div>
                    <p className="font-medium text-sm mb-1">How We Use Your Data</p>
                    <p className="text-xs text-muted-foreground">
                      We analyze your spending, savings, and account activity to generate 
                      personalized educational insights and budgeting recommendations. 
                      This analysis happens locally in your browser when possible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Database className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" aria-label="Data sharing icon" />
                  <div>
                    <p className="font-medium text-sm mb-1">What We Don't Do</p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>We never sell your financial data to third parties</li>
                      <li>We don't share your information with advertisers</li>
                      <li>We don't use your data for marketing purposes</li>
                      <li>We don't provide your data to external AI training models</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm mb-2">
              <span className="font-medium">⚠️ Educational Purpose Only:</span>
            </p>
            <p className="text-xs text-muted-foreground">
              This application provides automated financial insights for educational purposes 
              only. It does not constitute personalized investment advice or replace 
              consultation with a licensed financial advisor, tax professional, or attorney.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium">Your Rights:</p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Request a copy of your data at any time</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of data analytics (limits app functionality)</li>
              <li>Export your transaction history</li>
            </ul>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Checkbox 
              id="consent-checkbox" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              aria-label="I agree to the privacy policy and terms"
            />
            <label htmlFor="consent-checkbox" className="text-sm leading-relaxed cursor-pointer">
              I have read and agree to the{' '}
              <a href="/privacy" className="underline text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              {' '}and{' '}
              <a href="/terms" className="underline text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
              . I understand this app is for educational purposes and consent to the 
              analysis of my financial data to provide personalized insights.
            </label>
          </div>
        </div>

        <DialogFooter className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              // Redirect to home or show limited functionality
              alert('You must accept to use this application');
            }}
          >
            Decline
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!agreed}
            className="bg-gradient-to-r from-blue-500 to-indigo-500"
          >
            I Agree & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
