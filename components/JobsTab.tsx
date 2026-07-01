'use client';

import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Search, Plus, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedBy: string;
  alumniClass: string;
  description: string;
  requirements: string[];
}

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Software Engineer - frontend",
    company: "Stripe",
    location: "Remote (India)",
    salary: "₹18L - ₹24L per annum",
    type: "Full-time",
    postedBy: "Vikram Singh",
    alumniClass: "Class of 2017",
    description: "We are looking for a Senior Frontend Engineer to build the next generation of global payment infrastructures. You will design, implement, and maintain high-fidelity merchant user interfaces.",
    requirements: ["3+ years with React & TypeScript", "Strong understanding of web vitals and bundle optimization", "Experience with Tailwind CSS & Next.js"]
  },
  {
    id: "2",
    title: "Associate Product Manager",
    company: "Google",
    location: "Bangalore, India",
    salary: "₹25L - ₹32L per annum",
    type: "Full-time",
    postedBy: "Siddharth Roy",
    alumniClass: "Class of 2018",
    description: "Our APM program is world-renowned. In this role, you will lead a cross-functional squad of engineers and designers to launch and iterate on essential workspace collaboration tools.",
    requirements: ["Excellent analytical and problem-solving skills", "Background in Computer Science or Business", "Previous tech product internship experience"]
  },
  {
    id: "3",
    title: "ML Eng / AI Researcher",
    company: "OpenAI",
    location: "San Francisco, USA (Hybrid)",
    salary: "$180K - $240K per annum",
    type: "Full-time",
    postedBy: "Aditya Patel",
    alumniClass: "Class of 2022",
    description: "Help train and align advanced foundation models. You will design synthetic data generation pipelines, optimize RLHF processes, and deploy safe agentic systems.",
    requirements: ["Deep familiarity with PyTorch or JAX", "Published research in NLP or Computer Vision is a plus", "Solid distributed systems engineering skills"]
  },
  {
    id: "4",
    title: "Product Design Intern",
    company: "Apple",
    location: "Cupertino, USA",
    salary: "$8K - $10K per month",
    type: "Internship",
    postedBy: "Ananya Rao",
    alumniClass: "Class of 2021",
    description: "Join the Apple Design Team for a 6-month internship. Work alongside world-class designers to detail the future of interactive computing systems.",
    requirements: ["Outstanding portfolio of digital product designs", "Figma wizardry and prototyping expertise", "Enrolled in or graduated from a top-tier Design program"]
  }
];

export default function JobsTab() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newType, setNewType] = useState("Full-time");
  const [newDesc, setNewDesc] = useState("");
  const [newReqs, setNewReqs] = useState("");

  const handleApply = (jobTitle: string, jobId: string) => {
    if (appliedIds.includes(jobId)) return;
    setAppliedIds([...appliedIds, jobId]);
    toast.success(`Application for "${jobTitle}" submitted successfully!`);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany || !newLocation || !newDesc) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const jobToAdd: Job = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTitle,
      company: newCompany,
      location: newLocation,
      salary: newSalary || "Not specified",
      type: newType,
      postedBy: "You (Alumni)",
      alumniClass: "Class of 2026",
      description: newDesc,
      requirements: newReqs ? newReqs.split(",").map(r => r.trim()).filter(Boolean) : ["Relevant industry experience"]
    };

    setJobs([jobToAdd, ...jobs]);
    toast.success(`Job post for "${newTitle}" created successfully!`);
    
    // Reset form
    setNewTitle("");
    setNewCompany("");
    setNewLocation("");
    setNewSalary("");
    setNewType("Full-time");
    setNewDesc("");
    setNewReqs("");
    setShowAddForm(false);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-indigo-600" size={24} />
            Alumni Job Portal
          </h2>
          <p className="text-sm text-gray-500 mt-1">Exclusive career opportunities posted directly by your alumni network.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus size={16} />
          Post a Job
        </button>
      </div>

      {/* Add Job Form Modal/Section */}
      {showAddForm && (
        <form onSubmit={handleAddJob} className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 mb-6 animate-fadeIn">
          <h3 className="font-bold text-sm text-indigo-900 mb-4 flex items-center gap-1">
            <Plus size={16} />
            Add New Alumni Opportunity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Lead React Developer"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Company Name *</label>
              <input
                type="text"
                placeholder="e.g. Google India"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Location *</label>
              <input
                type="text"
                placeholder="e.g. Bangalore, India (Remote)"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Salary Range (Optional)</label>
              <input
                type="text"
                placeholder="e.g. ₹12L - ₹15L per annum"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Employment Type</label>
              <select
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Requirements (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Redux, 2 years experience"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newReqs}
                onChange={(e) => setNewReqs(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Job Description *</label>
            <textarea
              placeholder="Describe the responsibilities, project scope, and culture..."
              className="w-full text-xs p-2.5 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 bg-white"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 font-semibold flex items-center gap-1 shadow-sm"
            >
              <Send size={13} />
              Publish Listing
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs by keyword, company, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">Job Type (All)</option>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-base font-medium">No open positions matching your filters.</p>
            <p className="text-xs mt-1">Be the first to post an opportunity for the community!</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = appliedIds.includes(job.id);
            return (
              <div 
                key={job.id} 
                className="border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 pb-4 mb-4">
                  <div>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {job.type}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-1 hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      {job.company} — {job.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600 flex items-center gap-0.5 md:justify-end">
                      <DollarSign size={15} />
                      {job.salary}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Referral by: <span className="font-bold text-gray-600">{job.postedBy}</span> ({job.alumniClass})
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {job.description}
                  </p>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-800 mb-1.5">Requirements:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleApply(job.title, job.id)}
                    disabled={isApplied}
                    className={`text-xs font-semibold px-5 py-2 rounded-lg flex items-center gap-1 transition-all ${
                      isApplied 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check size={14} />
                        Applied
                      </>
                    ) : (
                      <>
                        Apply Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
