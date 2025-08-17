'use client';

import { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Mail,
  Database,
  Globe,
  Bell,
  Palette,
  Key,
  Server,
  AlertTriangle,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

// Mock settings data
const initialSettings = {
  general: {
    siteName: 'FMT Software Solutions',
    siteDescription: 'Professional software solutions for modern businesses',
    adminEmail: 'admin@fmt-software.com',
    supportEmail: 'support@fmt-software.com',
    timezone: 'UTC-5',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    loginAttempts: 5,
    lockoutDuration: 15,
    apiRateLimit: 1000,
    allowedDomains: ['fmt-software.com', 'company.com'],
  },
  email: {
    provider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@fmt-software.com',
    smtpPassword: '••••••••',
    fromName: 'FMT Software Solutions',
    fromEmail: 'noreply@fmt-software.com',
    enableNotifications: true,
    enableMarketing: false,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    slackIntegration: true,
    webhookUrl: 'https://hooks.slack.com/services/...',
    notifyOnNewUser: true,
    notifyOnSale: true,
    notifyOnError: true,
    notifyOnRelease: false,
  },
  appearance: {
    theme: 'system',
    primaryColor: '#3b82f6',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    customCSS: '',
    showBranding: true,
  },
  integrations: {
    googleAnalytics: 'GA-XXXXXXXXX',
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: '••••••••',
    supabaseUrl: 'https://xxx.supabase.co',
    supabaseKey: '••••••••',
    awsAccessKey: '••••••••',
    awsSecretKey: '••••••••',
    awsRegion: 'us-east-1',
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setHasUnsavedChanges(false);
    // Here you would typically make an API call to save the settings
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setHasUnsavedChanges(false);
    setResetDialogOpen(false);
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setBackupDialogOpen(false);
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Settings"
        description="Configure system settings and preferences"
        action={{
          label: hasUnsavedChanges ? 'Save Changes' : 'Settings Saved',
          onClick: handleSave,
          icon: Save,
        }}
      />

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">You have unsaved changes</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => updateSetting('general', 'timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.general.language} onValueChange={(value) => updateSetting('general', 'language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.general.dateFormat} onValueChange={(value) => updateSetting('general', 'dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.general.currency} onValueChange={(value) => updateSetting('general', 'currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Special Characters</Label>
                  <p className="text-sm text-muted-foreground">Passwords must contain special characters</p>
                </div>
                <Switch
                  checked={settings.security.passwordRequireSpecial}
                  onCheckedChange={(checked) => updateSetting('security', 'passwordRequireSpecial', checked)}
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => updateSetting('security', 'lockoutDuration', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.email.smtpUsername}
                    onChange={(e) => updateSetting('email', 'smtpUsername', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showPasswords.smtp ? 'text' : 'password'}
                      value={settings.email.smtpPassword}
                      onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('smtp')}
                    >
                      {showPasswords.smtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send system notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.email.enableNotifications}
                    onCheckedChange={(checked) => updateSetting('email', 'enableNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Send promotional and marketing emails</p>
                  </div>
                  <Switch
                    checked={settings.email.enableMarketing}
                    onCheckedChange={(checked) => updateSetting('email', 'enableMarketing', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to Slack</p>
                  </div>
                  <Switch
                    checked={settings.notifications.slackIntegration}
                    onCheckedChange={(checked) => updateSetting('notifications', 'slackIntegration', checked)}
                  />
                </div>
              </div>

              {settings.notifications.slackIntegration && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Slack Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={settings.notifications.webhookUrl}
                    onChange={(e) => updateSetting('notifications', 'webhookUrl', e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Events</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>New User Registration</Label>
                    <Switch
                      checked={settings.notifications.notifyOnNewUser}
                      onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnNewUser', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>New Sale</Label>
                    <Switch
                      checked={settings.notifications.notifyOnSale}
                      onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnSale', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>System Errors</Label>
                    <Switch
                      checked={settings.notifications.notifyOnError}
                      onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnError', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>App Releases</Label>
                    <Switch
                      checked={settings.notifications.notifyOnRelease}
                      onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnRelease', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your admin dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.appearance.theme} onValueChange={(value) => updateSetting('appearance', 'theme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={settings.appearance.logoUrl}
                    onChange={(e) => updateSetting('appearance', 'logoUrl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    value={settings.appearance.faviconUrl}
                    onChange={(e) => updateSetting('appearance', 'faviconUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  value={settings.appearance.customCSS}
                  onChange={(e) => updateSetting('appearance', 'customCSS', e.target.value)}
                  placeholder="/* Add your custom CSS here */"
                  rows={6}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Branding</Label>
                  <p className="text-sm text-muted-foreground">Display company branding in the admin panel</p>
                </div>
                <Switch
                  checked={settings.appearance.showBranding}
                  onCheckedChange={(checked) => updateSetting('appearance', 'showBranding', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Configure external service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Analytics
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                  <Input
                    id="googleAnalytics"
                    value={settings.integrations.googleAnalytics}
                    onChange={(e) => updateSetting('integrations', 'googleAnalytics', e.target.value)}
                    placeholder="GA-XXXXXXXXX"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Payment Processing
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                    <Input
                      id="stripePublicKey"
                      value={settings.integrations.stripePublicKey}
                      onChange={(e) => updateSetting('integrations', 'stripePublicKey', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                    <div className="relative">
                      <Input
                        id="stripeSecretKey"
                        type={showPasswords.stripe ? 'text' : 'password'}
                        value={settings.integrations.stripeSecretKey}
                        onChange={(e) => updateSetting('integrations', 'stripeSecretKey', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('stripe')}
                      >
                        {showPasswords.stripe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supabaseUrl">Supabase URL</Label>
                    <Input
                      id="supabaseUrl"
                      value={settings.integrations.supabaseUrl}
                      onChange={(e) => updateSetting('integrations', 'supabaseUrl', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supabaseKey">Supabase Key</Label>
                    <div className="relative">
                      <Input
                        id="supabaseKey"
                        type={showPasswords.supabase ? 'text' : 'password'}
                        value={settings.integrations.supabaseKey}
                        onChange={(e) => updateSetting('integrations', 'supabaseKey', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('supabase')}
                      >
                        {showPasswords.supabase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Cloud Storage
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="awsAccessKey">AWS Access Key</Label>
                    <div className="relative">
                      <Input
                        id="awsAccessKey"
                        type={showPasswords.aws ? 'text' : 'password'}
                        value={settings.integrations.awsAccessKey}
                        onChange={(e) => updateSetting('integrations', 'awsAccessKey', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('aws')}
                      >
                        {showPasswords.aws ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="awsSecretKey">AWS Secret Key</Label>
                    <div className="relative">
                      <Input
                        id="awsSecretKey"
                        type={showPasswords.awsSecret ? 'text' : 'password'}
                        value={settings.integrations.awsSecretKey}
                        onChange={(e) => updateSetting('integrations', 'awsSecretKey', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('awsSecret')}
                      >
                        {showPasswords.awsSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="awsRegion">AWS Region</Label>
                    <Select value={settings.integrations.awsRegion} onValueChange={(value) => updateSetting('integrations', 'awsRegion', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
          <CardDescription>Backup, restore, and reset system settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Dialog open={backupDialogOpen} onOpenChange={setBackupDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Backup Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Backup Settings</DialogTitle>
                  <DialogDescription>
                    Download a backup of all your current settings. This file can be used to restore your configuration later.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBackupDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBackup}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Backup
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Restore Settings
            </Button>

            <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all settings to their default values. This action cannot be undone.
                    Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                    Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}