import { Shield, Scan, AlertTriangle, TrendingUp, BarChart3, Activity, Eye, FileWarning, ArrowRight, Zap, Brain, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useIncidents } from "@/hooks/use-incidents";

const Index = () => {
  const { incidents } = useIncidents();

  // Calculate real stats
  const totalAnalyzed = "2.4M+"; // Keeping this as "global" static for now or can make it incidents.length * 10 if desired
  const threatsDetected = incidents.length;
  // Mock accuracy or derive from some other metric if possible, keeping static for now
  const accuracyRate = "94.7%";
  const reportsGenerated = incidents.filter(i => i.status === "reported").length;

  const stats = [
    { label: "Texts Analyzed", value: totalAnalyzed, icon: Scan, color: "text-primary" },
    { label: "Threats Detected", value: threatsDetected.toString(), icon: AlertTriangle, color: "text-destructive" },
    { label: "Accuracy Rate", value: accuracyRate, icon: TrendingUp, color: "text-success" },
    { label: "Reports Generated", value: reportsGenerated.toString(), icon: FileWarning, color: "text-secondary" },
  ];

  const recentDetections = incidents.slice(0, 4).map(incident => ({
    type: incident.type,
    severity: incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1),
    platform: incident.platform,
    time: incident.detectedAt.split(',')[1]?.trim() || "Just now" // extracting time part roughly
  }));

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced NLP models trained to identify harassment, threats, hate speech, and toxic content in real-time."
    },
    {
      icon: Zap,
      title: "Real-Time Analysis",
      description: "Instant analysis of social media posts, comments, and messages with millisecond response times."
    },
    {
      icon: BarChart3,
      title: "Severity Classification",
      description: "Multi-level severity scoring from mild to critical, helping prioritize responses effectively."
    },
    {
      icon: Lock,
      title: "Secure Reporting",
      description: "Generate detailed incident reports with evidence for submission to authorities or platforms."
    },
  ];



  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-destructive/20 text-destructive border-destructive/30";
      case "High": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Medium": return "bg-warning/20 text-warning border-warning/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };


  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">AI-Powered Protection</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
              Detect & Report
              <span className="block text-gradient mt-2">Cyberbullying in Real-Time</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Advanced AI system that analyzes social media content, detects harassment, hate speech, and threats, then generates official reports for authorities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/analyze">
                <Button variant="cyber" size="xl">
                  <Scan className="w-5 h-5" />
                  Start Analysis
                </Button>
              </Link>
              <Link to="/incidents">
                <Button variant="cyberOutline" size="xl">
                  <Eye className="w-5 h-5" />
                  View Incidents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI system uses state-of-the-art natural language processing to identify and classify harmful content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-all"
              >
                <div className="w-14 h-14 gradient-cyber rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow-cyan transition-shadow">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Section */}
      <section className="py-20 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Real-Time Detection Feed
              </h2>
              <p className="text-muted-foreground mb-6">
                Monitor detected incidents as they happen. Our AI continuously scans and classifies content across multiple platforms.
              </p>
              <Link to="/incidents">
                <Button variant="cyberOutline" size="lg">
                  View All Incidents
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">Live Feed</span>
              </div>
              <div className="divide-y divide-border">
                {recentDetections.map((detection, index) => (
                  <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{detection.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(detection.severity)}`}>
                        {detection.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{detection.platform}</span>
                      <span>•</span>
                      <span>{detection.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 md:p-12">
            <Shield className="w-16 h-16 mx-auto mb-6 text-primary animate-float" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Protect Your Digital Space?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Start analyzing content now. Our AI will help you detect cyberbullying and generate reports for appropriate action.
            </p>
            <Link to="/analyze">
              <Button variant="cyber" size="lg">
                <Scan className="w-5 h-5" />
                Analyze Content Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
