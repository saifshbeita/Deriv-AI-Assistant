import React from 'react';
import { RiskReport } from '../types';
import { ShieldAlert, TrendingUp, TrendingDown, Minus, Activity, Lock, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface AnalysisReportProps {
  report: RiskReport;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  const getRegimeColor = (regime: string) => {
    const r = regime.toLowerCase();
    // In Deriv style, we keep semantic colors but frame them in the dark theme
    if (r.includes('risk-on')) return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5';
    if (r.includes('risk-off') || r.includes('bear')) return 'text-brand-red border-brand-red/30 bg-brand-red/5';
    return 'text-white border-white/20 bg-white/5';
  };

  const getPressureColor = (val: number) => {
    if (val > 70) return '#ff444f'; // Brand Red
    if (val > 40) return '#fb923c'; // Orange
    return '#ffffff'; // White for safe/low pressure in this dark theme
  };

  const chartData = report.assetAnalysis.map(a => ({
    name: a.asset,
    pressure: a.shortTermPressure,
    sentiment: a.sentiment
  }));

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Market Regime */}
        <div className={`p-6 rounded-lg border ${getRegimeColor(report.marketRegime)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Market Regime</span>
            <Activity size={18} />
          </div>
          <div className="text-3xl font-black tracking-tighter uppercase">{report.marketRegime}</div>
        </div>

        {/* Risk Score */}
        <div className="p-6 rounded-lg border border-brand-surfaceHighlight bg-brand-surface">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-brand-gray uppercase tracking-widest">Risk Index</span>
            <ShieldAlert size={18} className={report.riskScore > 75 ? 'text-brand-red' : 'text-white'} />
          </div>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-black text-white">{report.riskScore}<span className="text-xl text-brand-gray font-normal">/100</span></div>
            <div className="h-3 flex-1 bg-brand-surfaceHighlight rounded-full mb-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${report.riskScore > 75 ? 'bg-brand-red' : report.riskScore > 40 ? 'bg-orange-500' : 'bg-white'}`}
                style={{ width: `${report.riskScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Asset Analysis & Drivers */}
        <div className="lg:col-span-2 space-y-6">
           {/* Key Drivers */}
           <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-lg p-6">
            <h3 className="text-xs font-bold text-brand-red uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full"></span>
              Key Market Drivers
            </h3>
            <ul className="space-y-3">
              {report.keyDrivers.map((driver, idx) => (
                <li key={idx} className="flex gap-4 text-white text-sm">
                  <span className="font-mono text-brand-gray">0{idx + 1}</span>
                  <span className="leading-relaxed">{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Asset Breakdown */}
          <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-lg overflow-hidden">
            <div className="bg-brand-surfaceHighlight/50 px-6 py-4 border-b border-brand-surfaceHighlight">
               <h3 className="text-xs font-bold text-white uppercase tracking-widest">Asset Impact Matrix</h3>
            </div>
            <div className="divide-y divide-brand-surfaceHighlight">
              {report.assetAnalysis.map((asset) => (
                <div key={asset.asset} className="p-6 hover:bg-brand-surfaceHighlight/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-white text-black px-2 py-0.5 rounded text-sm font-black font-mono">
                        {asset.asset}
                      </span>
                      {asset.sentiment === 'positive' && <span className="flex items-center text-xs font-bold text-emerald-500"><TrendingUp size={14} className="mr-1"/> BULLISH</span>}
                      {asset.sentiment === 'negative' && <span className="flex items-center text-xs font-bold text-brand-red"><TrendingDown size={14} className="mr-1"/> BEARISH</span>}
                      {asset.sentiment === 'neutral' && <span className="flex items-center text-xs font-bold text-brand-gray"><Minus size={14} className="mr-1"/> NEUTRAL</span>}
                    </div>
                    <div className="text-xs text-brand-gray font-mono uppercase">
                      Pressure: <span className={asset.shortTermPressure > 60 ? 'text-brand-red font-bold' : 'text-white'}>{asset.shortTermPressure}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {asset.impactDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Strategy & Visuals */}
        <div className="space-y-6">
          {/* Pressure Chart */}
          <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-lg p-6 h-64">
            <h3 className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-4 text-center">Sell Pressure Gauge</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fill: '#999', fontSize: 10, fontWeight: 'bold'}} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.1)'}}
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#ccc' }}
                />
                <ReferenceLine y={50} stroke="#333" strokeDasharray="3 3" />
                <Bar dataKey="pressure" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getPressureColor(entry.pressure)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Strategy Card */}
          <div className="bg-brand-black border border-brand-red/30 rounded-lg p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-red"></div>
            
            <h3 className="text-xs font-bold text-brand-red uppercase tracking-widest mb-4 flex items-center gap-2">
              <Lock size={14} />
              AI Strategy Suggestion
            </h3>
            <p className="text-sm text-white leading-relaxed font-light pl-2">
              {report.institutionalStrategy}
            </p>
          </div>

          {/* Sources Section */}
          {report.sources && report.sources.length > 0 && (
            <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-lg p-4">
              <h3 className="text-[10px] font-bold text-brand-gray uppercase tracking-widest mb-3">Intelligence Sources</h3>
              <ul className="space-y-2">
                {report.sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group flex items-center justify-between text-xs text-brand-gray hover:text-white hover:bg-brand-surfaceHighlight/50 p-2 rounded transition-all"
                    >
                      <span className="truncate max-w-[200px]">{source.title}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

           {/* Disclaimer */}
           <div className="text-[10px] text-brand-gray leading-tight border-t border-brand-surfaceHighlight pt-4">
            <strong className="block mb-1 text-white">DISCLAIMER</strong>
            {report.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};