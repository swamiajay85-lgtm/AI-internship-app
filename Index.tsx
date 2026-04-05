import { useState, useRef, useEffect } from "react";
import { AIEngine, type AnalysisResult } from "@/lib/aiEngine";
import SkillInput from "@/components/SkillInput";
import RecommendationCard from "@/components/RecommendationCard";
import DemandChart from "@/components/DemandChart";
import CompanyTierList from "@/components/CompanyTierList";
import ResumeBuilder from "@/components/ResumeBuilder";
import ResumeGuidance from "@/components/ResumeGuidance";
import { BrainCircuit, TrendingUp, Sparkles, FileText, BookOpen, Search } from "lucide-react";

const engine = new AIEngine();

type Tab = "analyze" | "resume" | "guidance";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (skills: string[]) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysis = engine.analyze(skills);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 800);
  };

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "analyze", label: "Skill Analysis", icon: <Search className="w-4 h-4" /> },
    { id: "resume", label: "Resume Builder", icon: <FileText className="w-4 h-4" /> },
    { id: "guidance", label: "Resume Guidance", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">AI Internship</h1>
            <p className="text-xs text-muted-foreground">Intelligent Internship Guidance System</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="container max-w-5xl mx-auto px-6">
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab Content */}
      {activeTab === "analyze" && (
        <>
          {/* Hero */}
          <section className="container max-w-5xl mx-auto px-6 pt-12 pb-10">
            <div className="animate-fade-in-up max-w-2xl">
              <p className="text-sm font-medium text-primary mb-3 font-mono tracking-wide uppercase">
                AI-Powered Career Analysis
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-[1.1] mb-4">
                Find the right internship<br />with machine learning
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">
                Enter your skills below. Our engine uses TF-IDF text classification and
                linear regression to recommend roles and forecast market demand.
              </p>
            </div>
            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <SkillInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
            </div>
          </section>

          {/* Results */}
          {result && (
            <div ref={resultsRef}>
              <section className="container max-w-5xl mx-auto px-6 pb-12">
                <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Recommended Roles</h3>
                  <span className="text-sm text-muted-foreground ml-2 font-mono">
                    {result.recommendations.length} matches
                  </span>
                </div>
                {result.recommendations.length === 0 ? (
                  <div className="animate-fade-in-up rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground">No strong matches found. Try adding more skills.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {result.recommendations.slice(0, 6).map((rec, i) => (
                      <div key={rec.role} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <RecommendationCard recommendation={rec} rank={i + 1} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="container max-w-5xl mx-auto px-6 pb-16">
                <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <h3 className="text-xl font-semibold">Demand Forecast (2025)</h3>
                  <span className="text-sm text-muted-foreground ml-2 font-mono">Linear Regression</span>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                  <DemandChart forecasts={result.forecasts} />
                </div>
              </section>

              <section className="container max-w-5xl mx-auto px-6 pb-16">
                <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  <CompanyTierList />
                </div>
              </section>
            </div>
          )}
        </>
      )}

      {activeTab === "resume" && (
        <section className="container max-w-5xl mx-auto px-6 py-12">
          <div className="animate-fade-in-up max-w-2xl mb-8">
            <p className="text-sm font-medium text-primary mb-3 font-mono tracking-wide uppercase">
              Resume Builder
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-[1.1] mb-3">
              Build your professional resume
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Fill in your details below and preview or download your resume instantly. 
              Tailored for internship applications.
            </p>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <ResumeBuilder />
          </div>
        </section>
      )}

      {activeTab === "guidance" && (
        <section className="container max-w-5xl mx-auto px-6 py-12">
          <div className="animate-fade-in-up max-w-2xl mb-8">
            <p className="text-sm font-medium text-primary mb-3 font-mono tracking-wide uppercase">
              Career Guidance
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-[1.1] mb-3">
              Resume tips for every career path
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Role-specific guidance with key skills, sample objectives, project ideas, 
              and expert tips to make your resume stand out.
            </p>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <ResumeGuidance />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/60 py-6">
        <div className="container max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>AI Internship — ML-powered career guidance</span>
          <span className="font-mono text-xs">TF-IDF · Naive Bayes · LinReg</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
