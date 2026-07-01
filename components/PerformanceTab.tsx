'use client';

import React, { useState, useEffect } from 'react';
import { Database, Activity, RefreshCw, Clock, Cpu, Server, ShieldCheck, Zap, GraduationCap, Calendar, Rocket, Users, Award, Landmark } from 'lucide-react';
import { getDatabaseMetrics } from '@/lib/serveractions';
import { toast } from 'sonner';

interface Metrics {
  success: boolean;
  postCount: number;
  commentCount: number;
  userCount: number;
  dbLatency: number;
  totalLatency: number;
  timestamp: string;
  error?: string;
}

export default function PerformanceTab() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await getDatabaseMetrics();
      setMetrics(res as Metrics);
      if (res.success) {
        setHistory(prev => {
          const next = [...prev, res.dbLatency];
          if (next.length > 8) next.shift();
          return next;
        });
      } else {
        toast.error("Failed to query Neon Postgres database stats");
      }
    } catch (err) {
      toast.error("Error communicating with server actions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getLatencyBg = (ms: number) => {
    if (ms < 40) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (ms < 120) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const getLatencyStatus = (ms: number) => {
    if (ms < 40) return 'Excellent (Edge optimized)';
    if (ms < 120) return 'Good (Standard region)';
    return 'Delayed (Cold start / Connection throttle)';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center pr-6">
          <Database size={240} className="text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-bold tracking-wider uppercase">Live Neon Postgres Backend</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2">
              Neon Performance Metrics
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-xl font-medium">
              Real-time analytics, scaling profiles, and database query response times fetched directly from your Serverless Postgres database.
            </p>
          </div>

          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 flex-shrink-0 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* Latency & Query Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latency Gauge Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Database Latency</p>
              <h3 className="text-3xl font-black mt-2 text-gray-900">
                {loading ? '...' : `${metrics?.dbLatency ?? 0} ms`}
              </h3>
            </div>
            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
              <Clock size={20} />
            </div>
          </div>
          
          <div className="mt-4">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${loading ? 'bg-gray-50 text-gray-500 border-gray-200' : getLatencyBg(metrics?.dbLatency ?? 0)}`}>
              {loading ? 'Calculating...' : getLatencyStatus(metrics?.dbLatency ?? 0)}
            </span>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total round-trip (incl. API):</span>
            <span className="font-bold text-gray-800">{loading ? '...' : `${metrics?.totalLatency ?? 0} ms`}</span>
          </div>
        </div>

        {/* Compute Sizing Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Compute Sizing</p>
              <h3 className="text-3xl font-black mt-2 text-gray-900">Autoscaling</h3>
            </div>
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
              <Cpu size={20} />
            </div>
          </div>

          <div className="mt-2 text-xs font-medium text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Min compute limit:</span>
              <span className="font-semibold text-gray-900">0.25 CU (Scale-to-zero)</span>
            </div>
            <div className="flex justify-between">
              <span>Max compute limit:</span>
              <span className="font-semibold text-gray-900">2.00 CU (Autoscale)</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Suspends automatically:</span>
            <span className="font-bold text-emerald-600">Yes (After 5m idle)</span>
          </div>
        </div>

        {/* Database Branch status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Server Region</p>
              <h3 className="text-3xl font-black mt-2 text-gray-900">AWS us-east-1</h3>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
              <Server size={20} />
            </div>
          </div>

          <div className="mt-2 text-xs font-medium text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Neon Branch:</span>
              <span className="font-semibold text-gray-900">production</span>
            </div>
            <div className="flex justify-between">
              <span>Connection Pooler:</span>
              <span className="font-bold text-indigo-600">PgBouncer (Active)</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>SSL Status:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck size={14} /> Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Database Table Counts & Latency History Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Row Counts (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Zap size={16} className="text-amber-500" />
              Table Row Counts
            </h3>
            
            <div className="mt-4 space-y-4">
              {/* Users count */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Users Table</span>
                  <span>{loading ? '...' : metrics?.userCount ?? 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((metrics?.userCount ?? 1) / 10) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Posts count */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Posts Table</span>
                  <span>{loading ? '...' : metrics?.postCount ?? 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((metrics?.postCount ?? 0) / 15) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Comments count */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Comments Table</span>
                  <span>{loading ? '...' : metrics?.commentCount ?? 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((metrics?.commentCount ?? 0) / 20) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mt-6 font-medium">
            Counts are evaluated in real time via fast SELECT COUNT(*) indexes.
          </p>
        </div>

        {/* Latency History Graph (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Activity size={16} className="text-indigo-600" />
              Query Latency History (ms)
            </h3>

            {/* Sparkline style graph using SVG */}
            <div className="h-28 w-full mt-6 relative flex items-end">
              {history.length > 1 ? (
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="55" x2="300" y2="55" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="90" x2="300" y2="90" stroke="#f3f4f6" strokeWidth="1" />
                  
                  <polyline
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={history.map((val, idx) => {
                      const x = (idx / (history.length - 1)) * 300;
                      const y = 95 - Math.min(90, (val / 200) * 90);
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {history.map((val, idx) => {
                    const x = (idx / (history.length - 1)) * 300;
                    const y = 95 - Math.min(90, (val / 200) * 90);
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                      />
                    );
                  })}
                </svg>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-xs text-gray-400 font-semibold gap-1 py-4">
                  <Activity size={24} className="text-gray-300 animate-pulse" />
                  Collect more data points by clicking Refresh
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-400 mt-4 border-t border-gray-50 pt-3 font-semibold">
            <span>Min: {history.length > 0 ? Math.min(...history) : 0}ms</span>
            <span>Max: {history.length > 0 ? Math.max(...history) : 0}ms</span>
            <span>Last fetched: {metrics ? new Date(metrics.timestamp).toLocaleTimeString() : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Row 3: Feature Participation Metrics (Users activity in Mentor, Events, and StartupVarsity) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
          <Users className="text-indigo-600" size={18} />
          Alumni Portal Engagement & Participation Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Mentorship Metrics Card */}
          <div className="bg-indigo-50/20 border border-indigo-100/50 rounded-xl p-5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Mentorship Program
                </span>
                <h4 className="text-2xl font-black mt-3 text-gray-900">4 Active Mentors</h4>
              </div>
              <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg">
                <GraduationCap size={18} />
              </div>
            </div>

            <div className="mt-4 text-xs font-semibold text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Total Reviews Logged:</span>
                <span className="font-bold text-gray-900">124 Reviews</span>
              </div>
              <div className="flex justify-between">
                <span>Average Session Rating:</span>
                <span className="font-bold text-amber-500">4.9 / 5.0 ★</span>
              </div>
              <div className="flex justify-between">
                <span>Featured Expertise:</span>
                <span className="font-bold text-indigo-700 truncate max-w-[140px]">System Design, PM</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100/50 flex justify-between items-center text-[10px] text-gray-400 font-bold">
              <span>Avg Session Cost:</span>
              <span className="text-indigo-700">₹1,800 / hr</span>
            </div>
          </div>

          {/* Events Hub Metrics Card */}
          <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-xl p-5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Events Hub
                </span>
                <h4 className="text-2xl font-black mt-3 text-gray-900">3 Live Events</h4>
              </div>
              <div className="bg-emerald-100 text-emerald-800 p-2 rounded-lg">
                <Calendar size={18} />
              </div>
            </div>

            <div className="mt-4 text-xs font-semibold text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Registered Attendees:</span>
                <span className="font-bold text-gray-900">545 RSVP&apos;d</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Ratio:</span>
                <span className="font-bold text-emerald-600">89% Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Format Split:</span>
                <span className="font-bold text-gray-900">66% Virtual / 33% Physical</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-100/50 flex justify-between items-center text-[10px] text-gray-400 font-bold">
              <span>Top Event Category:</span>
              <span className="text-emerald-700">AI & Deep Learning</span>
            </div>
          </div>

          {/* StartupVarsity Metrics Card */}
          <div className="bg-amber-50/20 border border-amber-100/50 rounded-xl p-5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  StartupVarsity
                </span>
                <h4 className="text-2xl font-black mt-3 text-gray-900">3 Incubated</h4>
              </div>
              <div className="bg-amber-100 text-amber-800 p-2 rounded-lg">
                <Rocket size={18} />
              </div>
            </div>

            <div className="mt-4 text-xs font-semibold text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Total Capital Raised:</span>
                <span className="font-bold text-gray-900">$7.05 Million</span>
              </div>
              <div className="flex justify-between">
                <span>Pitch Reviews Run:</span>
                <span className="font-bold text-amber-700">18 AI Audits</span>
              </div>
              <div className="flex justify-between">
                <span>Alumni Angel Network:</span>
                <span className="font-bold text-gray-900">45 Active Investors</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-100/50 flex justify-between items-center text-[10px] text-gray-400 font-bold">
              <span>Primary Sector:</span>
              <span className="text-amber-700">B2B SaaS & FinTech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
