import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Bell, Shield, Key, Globe, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground">
              Configure your detection preferences and notification settings
            </p>
          </div>

          <div className="max-w-3xl">
            <Tabs defaultValue="detection" className="space-y-6">
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="detection" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Shield className="w-4 h-4 mr-2" />
                  Detection
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="api" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Key className="w-4 h-4 mr-2" />
                  API
                </TabsTrigger>
              </TabsList>

              {/* Detection Settings */}
              <TabsContent value="detection">
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-4">Detection Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Enable Hate Speech Detection</p>
                          <p className="text-sm text-muted-foreground">Detect discriminatory and hateful language</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Enable Threat Detection</p>
                          <p className="text-sm text-muted-foreground">Identify violent threats and intimidation</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Enable Harassment Detection</p>
                          <p className="text-sm text-muted-foreground">Detect targeted harassment and bullying</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Enable Toxic Content Detection</p>
                          <p className="text-sm text-muted-foreground">Identify generally toxic and harmful content</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-4">Sensitivity Level</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Low</span>
                        <span className="text-muted-foreground">High</span>
                      </div>
                      <input 
                        type="range" 
                        className="w-full accent-primary" 
                        min="1" 
                        max="5" 
                        defaultValue="3"
                      />
                      <p className="text-xs text-muted-foreground">
                        Higher sensitivity may result in more false positives but catches subtle cases
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications">
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-4">Notification Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Critical Alerts</p>
                          <p className="text-sm text-muted-foreground">Immediate notifications for critical threats</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Daily Summary</p>
                          <p className="text-sm text-muted-foreground">Receive daily digest of detected incidents</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Send incident reports to email</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Label htmlFor="email">Notification Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      className="mt-2 bg-muted/50"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* API Settings */}
              <TabsContent value="api">
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-4">API Configuration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect external AI services for enhanced detection capabilities
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="openai">OpenAI API Key (Optional)</Label>
                        <Input 
                          id="openai" 
                          type="password" 
                          placeholder="sk-..." 
                          className="mt-2 bg-muted/50 font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Used for advanced GPT-powered analysis
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="perspective">Perspective API Key (Optional)</Label>
                        <Input 
                          id="perspective" 
                          type="password" 
                          placeholder="AIza..." 
                          className="mt-2 bg-muted/50 font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Google's Perspective API for toxicity scoring
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Use Local AI Model</p>
                        <p className="text-sm text-muted-foreground">Run detection locally without external APIs</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button variant="cyber" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
