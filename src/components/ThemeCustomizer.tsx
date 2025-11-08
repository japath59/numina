import { useState } from 'react';
import { useTheme } from './ThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Palette, Sparkles, RotateCcw } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ open, onOpenChange }) => {
  const { theme, updateTheme, resetTheme, applyPreset } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== 'custom') {
      applyPreset(preset);
    }
  };

  const handleColorChange = (key: keyof typeof theme, value: string) => {
    updateTheme({ [key]: value });
    setSelectedPreset('custom');
  };

  const gradientDirections = [
    { value: 'to right', label: 'Left to Right' },
    { value: 'to left', label: 'Right to Left' },
    { value: 'to bottom', label: 'Top to Bottom' },
    { value: 'to top', label: 'Bottom to Top' },
    { value: 'to bottom right', label: 'Top Left to Bottom Right' },
    { value: 'to bottom left', label: 'Top Right to Bottom Left' },
    { value: 'to top right', label: 'Bottom Left to Top Right' },
    { value: 'to top left', label: 'Bottom Right to Top Left' },
  ];

  const presets = [
    { value: 'default', label: 'Default Pastel', colors: ['#faf5ff', '#f9a8d4', '#93c5fd'] },
    { value: 'ocean', label: 'Ocean Breeze', colors: ['#e0f2fe', '#3b82f6', '#6366f1'] },
    { value: 'sunset', label: 'Sunset Glow', colors: ['#fff7ed', '#fb923c', '#f87171'] },
    { value: 'forest', label: 'Forest Fresh', colors: ['#f0fdf4', '#22c55e', '#14b8a6'] },
    { value: 'lavender', label: 'Lavender Dream', colors: ['#faf5ff', '#9333ea', '#7c3aed'] },
    { value: 'midnight', label: 'Midnight Sky', colors: ['#1e1b4b', '#5b21b6', '#6366f1'] },
    { value: 'coral', label: 'Coral Reef', colors: ['#fff1f2', '#f472b6', '#e879f9'] },
    { value: 'mint', label: 'Mint Splash', colors: ['#ecfdf5', '#14b8a6', '#06b6d4'] },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Customizer
          </DialogTitle>
          <DialogDescription>
            Personalize your banking app with custom colors and gradients
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">
              <Sparkles className="h-4 w-4 mr-2" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Palette className="h-4 w-4 mr-2" />
              Custom
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[450px] mt-4">
            <TabsContent value="presets" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <Card
                    key={preset.value}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPreset === preset.value ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handlePresetChange(preset.value)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">{preset.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-24 rounded-lg" style={{
                        background: `linear-gradient(to right, ${preset.colors[0]}, ${preset.colors[1]}, ${preset.colors[2]})`
                      }} />
                      <div className="flex gap-2 mt-3">
                        {preset.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-0 space-y-6">
              {/* Background Gradient */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Background Gradient</CardTitle>
                  <CardDescription>Customize the main background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Start Color</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.bgGradientStart}
                          onChange={(e) => handleColorChange('bgGradientStart', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.bgGradientStart}
                          onChange={(e) => handleColorChange('bgGradientStart', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Middle Color</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.bgGradientMiddle}
                          onChange={(e) => handleColorChange('bgGradientMiddle', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.bgGradientMiddle}
                          onChange={(e) => handleColorChange('bgGradientMiddle', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>End Color</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.bgGradientEnd}
                          onChange={(e) => handleColorChange('bgGradientEnd', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.bgGradientEnd}
                          onChange={(e) => handleColorChange('bgGradientEnd', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gradient Direction</Label>
                    <Select
                      value={theme.bgGradientDirection}
                      onValueChange={(value) => handleColorChange('bgGradientDirection', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gradientDirections.map((dir) => (
                          <SelectItem key={dir.value} value={dir.value}>
                            {dir.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div
                    className="h-20 rounded-lg border"
                    style={{
                      background: `linear-gradient(${theme.bgGradientDirection}, ${theme.bgGradientStart}, ${theme.bgGradientMiddle}, ${theme.bgGradientEnd})`
                    }}
                  />
                </CardContent>
              </Card>

              {/* Header Gradient */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Header Gradient</CardTitle>
                  <CardDescription>Customize the header appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Start Color</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.headerGradientStart}
                          onChange={(e) => handleColorChange('headerGradientStart', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.headerGradientStart}
                          onChange={(e) => handleColorChange('headerGradientStart', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Middle Color</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.headerGradientMiddle}
                          onChange={(e) => handleColorChange('headerGradientMiddle', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.headerGradientMiddle}
                          onChange={(e) => handleColorChange('headerGradientMiddle', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>End Color</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.headerGradientEnd}
                          onChange={(e) => handleColorChange('headerGradientEnd', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.headerGradientEnd}
                          onChange={(e) => handleColorChange('headerGradientEnd', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gradient Direction</Label>
                    <Select
                      value={theme.headerGradientDirection}
                      onValueChange={(value) => handleColorChange('headerGradientDirection', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gradientDirections.map((dir) => (
                          <SelectItem key={dir.value} value={dir.value}>
                            {dir.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div
                    className="h-20 rounded-lg border"
                    style={{
                      background: `linear-gradient(${theme.headerGradientDirection}, ${theme.headerGradientStart}, ${theme.headerGradientMiddle}, ${theme.headerGradientEnd})`
                    }}
                  />
                </CardContent>
              </Card>

              {/* Accent Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Accent Colors</CardTitle>
                  <CardDescription>Set primary and secondary accent colors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Accent</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.accentPrimary}
                          onChange={(e) => handleColorChange('accentPrimary', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.accentPrimary}
                          onChange={(e) => handleColorChange('accentPrimary', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Accent</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.accentSecondary}
                          onChange={(e) => handleColorChange('accentSecondary', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.accentSecondary}
                          onChange={(e) => handleColorChange('accentSecondary', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Styling */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Card Styling</CardTitle>
                  <CardDescription>Customize card appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Background</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={theme.cardBackground}
                          onChange={(e) => handleColorChange('cardBackground', e.target.value)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme.cardBackground}
                          onChange={(e) => handleColorChange('cardBackground', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Border Color</Label>
                      <input
                        type="text"
                        value={theme.cardBorder}
                        onChange={(e) => handleColorChange('cardBorder', e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm"
                        placeholder="rgba(0, 0, 0, 0.1)"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={resetTheme}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
