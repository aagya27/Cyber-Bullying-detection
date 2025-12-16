import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search, Filter, Eye, FileText, Clock, ExternalLink, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import { useIncidents } from "@/hooks/use-incidents";

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case "critical": return { bg: "bg-destructive/20", text: "text-destructive", border: "border-destructive/30" };
    case "high": return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" };
    case "medium": return { bg: "bg-warning/20", text: "text-warning", border: "border-warning/30" };
    default: return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "resolved": return { bg: "bg-success/20", text: "text-success", label: "Resolved" };
    case "reported": return { bg: "bg-primary/20", text: "text-primary", label: "Reported" };
    default: return { bg: "bg-muted", text: "text-muted-foreground", label: "Pending" };
  }
};

const IncidentsPage = () => {
  const { incidents } = useIncidents();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter;
    const matchesPlatform = platformFilter === "all" || incident.platform === platformFilter;
    return matchesSearch && matchesSeverity && matchesPlatform;
  });

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Detected Incidents
              </h1>
              <p className="text-muted-foreground">
                Review and manage detected cyberbullying incidents
              </p>
            </div>
            <Link to="/analyze">
              <Button variant="cyber">
                <AlertTriangle className="w-4 h-4" />
                Analyze New Content
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
                    className="pl-10 bg-muted/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[140px] bg-muted/50">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-[140px] bg-muted/50">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Reddit">Reddit</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{incidents.length}</div>
              <div className="text-sm text-muted-foreground">Total Incidents</div>
            </div>
            <div className="bg-card rounded-lg border border-destructive/30 p-4 text-center">
              <div className="text-2xl font-bold text-destructive">
                {incidents.filter(i => i.severity === "critical").length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="bg-card rounded-lg border border-primary/30 p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {incidents.filter(i => i.status === "reported").length}
              </div>
              <div className="text-sm text-muted-foreground">Reported</div>
            </div>
            <div className="bg-card rounded-lg border border-success/30 p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {incidents.filter(i => i.status === "resolved").length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>

          {/* Incidents List */}
          <div className="space-y-4">
            {filteredIncidents.map((incident) => {
              const severityConfig = getSeverityConfig(incident.severity);
              const statusConfig = getStatusConfig(incident.status);
              const isExpanded = expandedId === incident.id;

              return (
                <div
                  key={incident.id}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : incident.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg ${severityConfig.bg} flex items-center justify-center`}>
                          <AlertTriangle className={`w-6 h-6 ${severityConfig.text}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-sm text-muted-foreground">{incident.id}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityConfig.bg} ${severityConfig.text} border ${severityConfig.border}`}>
                              {incident.severity}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground">{incident.type}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{incident.content}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-foreground">{incident.platform}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {incident.detectedAt}
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/30">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full gradient-cyber rounded-full"
                                style={{ width: `${incident.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">{incident.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Content Preview</p>
                          <p className="text-sm text-foreground">{incident.content}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="default" size="sm">
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                          Generate Report
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                          View Source
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredIncidents.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold text-lg text-foreground mb-2">No incidents found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default IncidentsPage;
