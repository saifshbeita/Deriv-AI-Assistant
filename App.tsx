import React, { useState } from 'react';
import { Terminal, RefreshCcw, FileText, Play, ArrowLeft, TrendingUp, Bitcoin, Gem, DollarSign, Activity, Globe, Search } from 'lucide-react';
import { AssetInput } from './components/AssetInput';
import { AnalysisReport } from './components/AnalysisReport';
import { AnalysisState } from './types';
import { analyzePortfolioRisk } from './services/geminiService';

type Step = 'category-selection' | 'analysis';
type AssetCategory = 'Forex' | 'Cryptocurrencies' | 'Commodities' | 'Stocks & Indices' | 'Synthetic Indices';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('category-selection');
  const [category, setCategory] = useState<AssetCategory | null>(null);
  
  const [assets, setAssets] = useState<string[]>([]);
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    report: null
  });

  const handleCategorySelect = (cat: AssetCategory) => {
    setCategory(cat);
    
    // Pre-fill some examples based on category for UX
    let examples: string[] = [];
    if (cat === 'Forex') examples = ['EURUSD', 'GBPUSD'];
    if (cat === 'Cryptocurrencies') examples = ['BTC', 'ETH'];
    if (cat === 'Commodities') examples = ['XAUUSD', 'OIL'];
    if (cat === 'Stocks & Indices') examples = ['SPX500', 'US100'];
    if (cat === 'Synthetic Indices') examples = ['Volatility 100', 'Boom 500'];
    
    setAssets(examples);
    setStep('analysis');
  };

  const handleAnalyze = async () => {
    if (assets.length === 0) {
      setState(prev => ({ ...prev, error: "Please add at least one asset." }));
      return;
    }

    setState({ isLoading: true, error: null, report: null });

    try {
      if (!category) throw new Error("Category not selected");
      const report = await analyzePortfolioRisk(assets, category);
      setState({ isLoading: false, error: null, report });
    } catch (err: any) {
      setState({
        isLoading: false,
        error: "Analysis failed. Please try again.",
        report: null
      });
    }
  };

  const renderCategorySelection = () => (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
         <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">SELECT ASSET TYPE</h2>
         <p className="text-brand-gray">Choose a market to initialize the Deriv AI Assistant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'Forex', icon: DollarSign, desc: 'Major & Minor Pairs' },
          { id: 'Cryptocurrencies', icon: Bitcoin, desc: 'Digital Assets' },
          { id: 'Commodities', icon: Gem, desc: 'Gold, Oil, Silver' },
          { id: 'Stocks & Indices', icon: TrendingUp, desc: 'Global Equities' },
          { id: 'Synthetic Indices', icon: Activity, desc: 'Simulated Markets' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleCategorySelect(item.id as AssetCategory)}
            className="group relative overflow-hidden bg-brand-surface border border-brand-surfaceHighlight hover:border-brand-red p-8 rounded-xl text-left transition-all duration-300 hover:transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/5 rounded-bl-full group-hover:bg-brand-red/10 transition-colors"></div>
            <item.icon size={32} className="text-brand-red mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-1">{item.id}</h3>
            <p className="text-xs text-brand-gray">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-red/30">
      
      {/* Navbar */}
      <header className="border-b border-brand-surfaceHighlight bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-red w-10 h-10 rounded-lg flex items-center justify-center transform rotate-3">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white leading-none">
                DERIV <span className="text-brand-red">AI</span>
              </h1>
              <p className="text-[10px] text-brand-gray font-bold tracking-widest uppercase mt-0.5">Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {category && (
               <span className="hidden md:inline-block px-3 py-1 rounded-full border border-brand-surfaceHighlight text-xs font-mono text-brand-gray">
                 MODE: {category.toUpperCase()}
               </span>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {step === 'category-selection' ? (
          renderCategorySelection()
        ) : (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-surfaceHighlight">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-brand-red" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Analysis Setup</h2>
                  </div>
                  <button onClick={() => setStep('category-selection')} className="text-brand-gray hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <AssetInput assets={assets} setAssets={setAssets} disabled={state.isLoading} />
                  
                  {/* Web Search Indicator */}
                  <div className="bg-brand-black border border-brand-surfaceHighlight rounded-lg p-4 flex items-start gap-3">
                    <div className="bg-brand-surfaceHighlight p-2 rounded-full">
                       <Globe size={16} className="text-brand-red" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Live Market Intelligence</h4>
                      <p className="text-xs text-brand-gray leading-relaxed">
                        The AI will automatically search for real-time news, sentiment, and fundamental data for the selected assets.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={state.isLoading}
                    className={`w-full py-4 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                      state.isLoading 
                        ? 'bg-brand-surfaceHighlight text-brand-gray cursor-not-allowed'
                        : 'bg-brand-red hover:bg-brand-darkRed text-white shadow-lg shadow-brand-red/20'
                    }`}
                  >
                    {state.isLoading ? (
                      <>
                        <RefreshCcw size={18} className="animate-spin" />
                        Scanning Market...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        Run Live Analysis
                      </>
                    )}
                  </button>
                  
                  {state.error && (
                     <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded text-brand-red text-xs mt-4 font-mono">
                       > Error: {state.error}
                     </div>
                  )}
                </div>
              </div>
            </div>

            {/* Report Panel */}
            <div className="lg:col-span-8">
              {state.report ? (
                <AnalysisReport report={state.report} />
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-brand-surfaceHighlight rounded-xl bg-brand-surface/30">
                  <div className="w-20 h-20 bg-brand-surfaceHighlight rounded-full flex items-center justify-center mb-6">
                    <Activity size={40} className="text-brand-gray" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Ready to Analyze</h3>
                  <p className="text-brand-gray text-sm max-w-xs text-center">
                    Enter your specific {category} assets to initiate a real-time web scan and risk assessment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;