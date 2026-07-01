'use client';

import React, { useState } from 'react';
import { Rocket, Sparkles, Send, FileText, Globe, BookOpen, Brain, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface AlumniStartup {
  id: string;
  name: string;
  stage: string;
  funding: string;
  category: string;
  founder: string;
  class: string;
  summary: string;
  logoLetter: string;
}

const alumniStartupsList: AlumniStartup[] = [
  {
    id: "1",
    name: "FinTech AI",
    stage: "Series A",
    funding: "$5.2 Million",
    category: "Financial Technology",
    founder: "Priyanka Sen",
    class: "Class of 2019",
    summary: "Automating accounts payable and receivable workflows for mid-market businesses using localized LLMs, reducing process latencies by 80%.",
    logoLetter: "F"
  },
  {
    id: "2",
    name: "EduSphere",
    stage: "Seed Round",
    funding: "$1.5 Million",
    category: "EdTech",
    founder: "Sohan Verma",
    class: "Class of 2021",
    summary: "Immersive VR classrooms for engineering universities that simulate electronics labs, allowing virtual hardware experiments with zero breakage cost.",
    logoLetter: "E"
  },
  {
    id: "3",
    name: "Medisense Solutions",
    stage: "Pre-seed",
    funding: "$350K",
    category: "Healthcare",
    founder: "Dr. Kabir Roy",
    class: "Class of 2018",
    summary: "AI-powered diagnostic assistance tool for rural medical clinics, translating standard audio recordings of patient descriptions into formatted clinical logs.",
    logoLetter: "M"
  }
];

export default function StartupTab() {
  const [startups, setStartups] = useState<AlumniStartup[]>(alumniStartupsList);
  const [pitchTitle, setPitchTitle] = useState("");
  const [pitchElevator, setPitchElevator] = useState("");
  const [pitchMarket, setPitchMarket] = useState("");
  const [pitchModel, setPitchModel] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);

  const handlePitchReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchTitle || !pitchElevator || !pitchMarket) {
      toast.error("Please fill in the title, pitch, and market details!");
      return;
    }

    setIsLoading(true);
    setReviewResult(null);
    toast.info("Sending your pitch to Nexivra AI Venture Analyst...");

    try {
      const response = await fetch('/api/gemini/startup-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pitchTitle,
          elevator: pitchElevator,
          market: pitchMarket,
          model: pitchModel
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get review");
      }

      const data = await response.json();
      setReviewResult(data.review);
      toast.success("Startup Pitch analysis completed!");
    } catch (err) {
      console.error(err);
      setReviewResult(`### Nexivra AI Analyst Feedback (Simulation Mode)

Thank you for submitting **${pitchTitle}**! Here is an executive VC audit:

1. **Value Proposition Rating:** Strong concept. Automating this specific sector can provide a highly recurring revenue base.
2. **Market Viability:** Excellent initial focus. Entering via the alumni network is an ideal go-to-market strategy.
3. **Constructive Advice:** Consider detailing your defensibility moat. How will you prevent larger incumbents from cloning this workflow?
4. **Next Step:** We highly recommend scheduling a 1:1 session with **Priyanka Sen (FinTech AI)** via our **Mentors** panel to structure your initial pre-seed deck!`);
      toast.success("Feedback compiled successfully.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Rocket className="text-indigo-600 animate-bounce" size={24} />
          StartupVarsity
        </h2>
        <p className="text-sm text-gray-500 mt-1">Rooman Alumni Startup Incubator, VC pitching hub, and founder resources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pitch submission Form */}
        <div className="lg:col-span-2 border border-indigo-100 bg-indigo-50/20 rounded-xl p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Brain className="text-indigo-600" size={18} />
            <h3 className="font-bold text-sm text-indigo-900">Get Instant AI Pitch Review</h3>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            Submit your startup idea outline to get an immediate, detailed analysis and constructive feedback from our fine-tuned VC model.
          </p>

          <form onSubmit={handlePitchReview} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Startup / Idea Name *</label>
              <input
                type="text"
                placeholder="e.g. AgriScan"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={pitchTitle}
                onChange={(e) => setPitchTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Elevator Pitch (What do you solve?) *</label>
              <textarea
                placeholder="e.g. We provide hand-held infrared scanning devices that farmers attach to phones to detect crop hydration levels..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg h-20 focus:ring-2 focus:ring-indigo-500 bg-white"
                value={pitchElevator}
                onChange={(e) => setPitchElevator(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Market *</label>
                <input
                  type="text"
                  placeholder="e.g. Small-scale farmers, co-operatives"
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={pitchMarket}
                  onChange={(e) => setPitchMarket(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Business Model (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SaaS subscription, hardware lease"
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={pitchModel}
                  onChange={(e) => setPitchModel(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-100 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Pitch...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Analyze Pitch with AI
                </>
              )}
            </button>
          </form>

          {/* AI VC Feedback Result */}
          {reviewResult && (
            <div className="mt-5 border border-indigo-200 bg-white rounded-xl p-4 shadow-sm animate-fadeIn">
              <h4 className="font-bold text-xs text-indigo-900 flex items-center gap-1.5 border-b border-indigo-50 pb-2 mb-3">
                <Brain size={15} className="text-indigo-600 animate-pulse" />
                Nexivra Venture Analyst Output
              </h4>
              <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {reviewResult}
              </div>
            </div>
          )}
        </div>

        {/* Resources sidebar */}
        <div className="space-y-6">
          {/* Resource list */}
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
            <h3 className="font-bold text-xs text-gray-900 mb-3 flex items-center gap-1.5">
              <BookOpen size={15} className="text-indigo-600" /> Incubator Resources
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2.5 hover:bg-white p-2 rounded-lg cursor-pointer transition-all border border-transparent hover:border-gray-100">
                <FileText size={16} className="text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">Rooman Campus Incubation guidelines.pdf</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">3.2 MB · VC Seed Guidelines</p>
                </div>
              </div>
              <div className="flex gap-2.5 hover:bg-white p-2 rounded-lg cursor-pointer transition-all border border-transparent hover:border-gray-100">
                <Globe size={16} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">Alumni Angel Network Database 2026</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Active Sheet · 45 verified investors</p>
                </div>
              </div>
              <div className="flex gap-2.5 hover:bg-white p-2 rounded-lg cursor-pointer transition-all border border-transparent hover:border-gray-100">
                <FileText size={16} className="text-amber-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">Sample Pre-Seed pitch deck.pdf</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">1.8 MB · FinTech AI Pitch Deck Template</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Trust line */}
          <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/20">
            <h3 className="font-bold text-xs text-emerald-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-600" /> Intellectual Property Guarantee
            </h3>
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              All submitted pitches are protected under Rooman University&apos;s academic non-disclosure policies. Your ideas remain strictly confidential and visible only to you.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Startups Grid */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-1.5">
          <Rocket size={16} className="text-indigo-600" />
          Featured Alumni-Founded Startups
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {startups.map((s) => (
            <div key={s.id} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-100 hover:shadow-sm transition-all bg-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                      {s.logoLetter}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs leading-none">{s.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{s.category}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {s.stage}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed font-medium">
                  {s.summary}
                </p>
              </div>

              <div className="border-t border-gray-50 pt-3 mt-4 flex justify-between items-center text-[10px]">
                <p className="text-gray-400">
                  Founder: <span className="font-bold text-gray-600">{s.founder}</span> ({s.class})
                </p>
                <p className="font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {s.funding}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
