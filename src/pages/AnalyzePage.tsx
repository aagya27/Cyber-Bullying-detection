import { useState } from "react";
import { toxicityService } from "@/lib/toxicityModel";
import { useIncidents } from "@/hooks/use-incidents";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scan, AlertTriangle, CheckCircle, Shield, Brain, FileText, Copy, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  isBullying: boolean;
  severity: "none" | "low" | "medium" | "high" | "critical";
  categories: string[];
  confidence: number;
  explanation: string;
  keywords: string[];
}

const getExplanation = (categories: string[], confidence: number) => {
  if (categories.length === 0) {
    return "No harmful content detected. The text appears to be safe.";
  }

  const cats = categories.join(", ");
  return `This content has been flagged as ${cats} with ${(confidence).toFixed(1)}% confidence. The AI model has detected patterns consistent with toxic behavior.`;
};

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case "critical": return { color: "bg-destructive", textColor: "text-destructive", label: "Critical" };
    case "high": return { color: "bg-orange-500", textColor: "text-orange-400", label: "High" };
    case "medium": return { color: "bg-warning", textColor: "text-warning", label: "Medium" };
    case "low": return { color: "bg-blue-500", textColor: "text-blue-400", label: "Low" };
    default: return { color: "bg-success", textColor: "text-success", label: "Safe" };
  }
};

const mapSeverity = (categories: string[], probabilities: Record<string, number>): "none" | "low" | "medium" | "high" | "critical" => {
  if (categories.length === 0) return "none";

  if (categories.includes("threat")) return "critical";
  if (categories.includes("identity_attack") || categories.includes("severe_toxicity")) return "high";
  if (categories.includes("insult") || categories.includes("sexual_explicit") || categories.includes("obscene")) return "medium";

  return "low";
};

const AnalyzePage = () => {
  const { toast } = useToast();
  const { addIncident } = useIncidents();
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({ title: "Error", description: "Please enter content to analyze", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const evaluation = await toxicityService.analyze(content);

      const severity = mapSeverity(evaluation.categories, evaluation.probabilities);

      const analysisResult: AnalysisResult = {
        isBullying: evaluation.isToxic,
        severity: severity,
        categories: evaluation.categories,
        confidence: evaluation.confidence,
        explanation: getExplanation(evaluation.categories, evaluation.confidence),
        keywords: [] // TensorFlow model doesn't return specific keywords, it categorizes the whole text
      };

      setResult(analysisResult);

      // Save to incidents if it's bullying
      if (analysisResult.isBullying) {
        addIncident({
          type: evaluation.categories[0] || "Toxic Content",
          severity: severity,
          platform: platform || "Web Input",
          content: content,
          confidence: evaluation.confidence
        });
        toast({ title: "Incident Recorded", description: "The detected threat has been logged to incidents." });
      }

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({ title: "Error", description: "Failed to analyze content. Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Incident report has been created and is ready for download.",
    });
  };

  const handleCopyResult = () => {
    if (result) {
      const reportText = `
CyberGuard Detection Report
===========================
Severity: ${result.severity.toUpperCase()}
Categories: ${result.categories.join(", ")}
Confidence: ${result.confidence}%
Platform: ${platform || "Not specified"}
URL: ${url || "Not provided"}

Analysis:
${result.explanation}

Detected Keywords: ${result.keywords.join(", ") || "None"}

Content Analyzed:
"${content}"
      `.trim();
      navigator.clipboard.writeText(reportText);
      toast({ title: "Copied", description: "Report copied to clipboard" });
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Analysis</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Analyze Content
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Paste social media content to detect cyberbullying, harassment, hate speech, and other harmful content.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Scan className="w-5 h-5 text-primary" />
                    Content Input
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="content">Text to Analyze *</Label>
                      <Textarea
                        id="content"
                        placeholder="Paste the social media post, comment, or message here..."
                        className="mt-2 min-h-[200px] bg-muted/50 border-border focus:border-primary"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {content.length} characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="platform">Platform (Optional)</Label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="mt-2 bg-muted/50">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twitter">Twitter / X</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="reddit">Reddit</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="url">Content URL (Optional)</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://..."
                        className="mt-2 bg-muted/50"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>

                    <Button
                      variant="cyber"
                      className="w-full"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !content.trim()}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Scan className="w-5 h-5" />
                          Analyze Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {isAnalyzing && (
                  <div className="bg-card rounded-xl border border-border p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 gradient-cyber rounded-full flex items-center justify-center animate-pulse-glow">
                      <Brain className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      Analyzing Content...
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI is scanning for harmful patterns
                    </p>
                  </div>
                )}

                {result && !isAnalyzing && (
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {/* Result Header */}
                    <div className={`p-4 ${result.isBullying ? 'bg-destructive/10 border-b border-destructive/20' : 'bg-success/10 border-b border-success/20'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {result.isBullying ? (
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                          ) : (
                            <CheckCircle className="w-8 h-8 text-success" />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {result.isBullying ? "Cyberbullying Detected" : "No Threat Detected"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Confidence: {result.confidence}%
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityConfig(result.severity).color} text-primary-foreground`}>
                          {getSeverityConfig(result.severity).label}
                        </div>
                      </div>
                    </div>

                    {/* Result Details */}
                    <div className="p-6 space-y-4">
                      {result.categories.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Categories Detected:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.categories.map((cat, i) => (
                              <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm text-foreground">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.keywords.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Harmful Keywords:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.keywords.map((keyword, i) => (
                              <span key={i} className="px-3 py-1 bg-destructive/20 text-destructive rounded-full text-sm font-mono">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Analysis:</p>
                        <p className="text-sm text-foreground">{result.explanation}</p>
                      </div>

                      {result.isBullying && (
                        <div className="pt-4 border-t border-border flex gap-3">
                          <Button variant="default" size="sm" onClick={handleGenerateReport}>
                            <FileText className="w-4 h-4" />
                            Generate Report
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleCopyResult}>
                            <Copy className="w-4 h-4" />
                            Copy Results
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!result && !isAnalyzing && (
                  <div className="bg-card rounded-xl border border-border p-8 text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      Ready to Analyze
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enter content on the left and click "Analyze Content" to detect cyberbullying
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzePage;
