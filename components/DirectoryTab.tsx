'use client';

import React, { useState } from 'react';
import { Search, UserPlus, MessageSquare, Check, Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface Alumnus {
  id: string;
  name: string;
  degree: string;
  year: string;
  company: string;
  role: string;
  location: string;
  image: string;
  skills: string[];
}

const dummyAlumni: Alumnus[] = [
  {
    id: "1",
    name: "Siddharth Roy",
    degree: "B.Tech Computer Science",
    year: "2018",
    company: "Google",
    role: "Senior Software Engineer",
    location: "Bangalore, India",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    skills: ["System Design", "Go", "Kubernetes", "AI/ML"]
  },
  {
    id: "2",
    name: "Neha Sharma",
    degree: "B.Tech Electronics & Communication",
    year: "2020",
    company: "Microsoft",
    role: "Product Manager",
    location: "Hyderabad, India",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    skills: ["Product Strategy", "Agile", "User Research", "Python"]
  },
  {
    id: "3",
    name: "Aditya Patel",
    degree: "M.Tech Data Science",
    year: "2022",
    company: "OpenAI",
    role: "AI Research Scientist",
    location: "San Francisco, USA",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    skills: ["PyTorch", "LLMs", "NLP", "Reinforcement Learning"]
  },
  {
    id: "4",
    name: "Priyanka Sen",
    degree: "MBA Finance",
    year: "2019",
    company: "FinTech AI",
    role: "Co-Founder & CEO",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    skills: ["Venture Capital", "Business Strategy", "Fintech", "Product Management"]
  },
  {
    id: "5",
    name: "Vikram Singh",
    degree: "B.Tech Computer Science",
    year: "2017",
    company: "Stripe",
    role: "Engineering Manager",
    location: "Singapore",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    skills: ["Engineering Leadership", "Ruby on Rails", "Distributed Systems"]
  },
  {
    id: "6",
    name: "Ananya Rao",
    degree: "B.Des Product Design",
    year: "2021",
    company: "Apple",
    role: "Senior UX Designer",
    location: "Cupertino, USA",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    skills: ["UI/UX Design", "Figma", "User Psychology", "Interaction Design"]
  }
];

export default function DirectoryTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  const handleConnect = (alumniName: string, id: string) => {
    if (connectedIds.includes(id)) return;
    setConnectedIds([...connectedIds, id]);
    toast.success(`Connection invitation sent to ${alumniName}!`);
  };

  const filteredAlumni = dummyAlumni.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alumni.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesYear = selectedYear === "all" || alumni.year === selectedYear;
    
    const matchesDept = selectedDepartment === "all" || 
      (selectedDepartment === "cs" && alumni.degree.toLowerCase().includes("computer")) ||
      (selectedDepartment === "ec" && alumni.degree.toLowerCase().includes("electronics")) ||
      (selectedDepartment === "business" && alumni.degree.toLowerCase().includes("mba")) ||
      (selectedDepartment === "design" && alumni.degree.toLowerCase().includes("des"));

    return matchesSearch && matchesYear && matchesDept;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="text-indigo-600" size={24} />
          Alumni Directory
        </h2>
        <p className="text-sm text-gray-500 mt-1">Discover and connect with graduates of Rooman University worldwide.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, company, role, or skills..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="all">Graduation Year (All)</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
        </select>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="all">Department (All)</option>
          <option value="cs">Computer Science</option>
          <option value="ec">Electronics</option>
          <option value="business">Business School</option>
          <option value="design">Design</option>
        </select>
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-base font-medium">No alumni matching your filters.</p>
          <p className="text-xs mt-1">Try resetting search keywords or selecting other departments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlumni.map((alumni) => {
            const isConnected = connectedIds.includes(alumni.id);
            return (
              <div 
                key={alumni.id} 
                className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-100 transition-all flex gap-4"
              >
                <img
                  src={alumni.image}
                  alt={alumni.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 hover:text-indigo-600 transition-colors truncate">
                        {alumni.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                        <GraduationCap size={13} />
                        {alumni.degree} ({alumni.year})
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 font-semibold flex items-center gap-1 mt-2">
                    <Briefcase size={13} className="text-gray-400" />
                    {alumni.role} at {alumni.company}
                  </p>

                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={13} />
                    {alumni.location}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {alumni.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Connection Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleConnect(alumni.name, alumni.id)}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        isConnected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <Check size={14} />
                          Connected
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} />
                          Connect
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => toast.success(`Chat session with ${alumni.name} initiated!`)}
                      className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <MessageSquare size={14} />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
