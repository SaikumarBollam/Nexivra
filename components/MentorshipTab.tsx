'use client';

import React, { useState } from 'react';
import { GraduationCap, Calendar, Clock, Star, DollarSign, Check, Video, Search, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  skills: string[];
  price: string;
  rating: number;
  image: string;
  reviews: number;
}

interface Booking {
  id: string;
  mentorName: string;
  topic: string;
  date: string;
  time: string;
}

const initialMentors: Mentor[] = [
  {
    id: "1",
    name: "Siddharth Roy",
    title: "Senior Software Engineer",
    company: "Google",
    bio: "Ex-Amazon, 8+ years experience in systems engineering and scalability. Passionate about helping students crack Tier 1 tech companies and design robust backend systems.",
    skills: ["System Design", "Backend Engineering", "Resume Review", "Mock Interviews"],
    price: "₹1,200",
    rating: 4.9,
    reviews: 48,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "2",
    name: "Neha Sharma",
    title: "Product Manager",
    company: "Microsoft",
    bio: "7 years of product lifecycle management in SaaS. I will guide you on transition from engineering to product management, product case interviews, and design questions.",
    skills: ["Product Management", "Product Strategy", "Case Studies", "Career Transition"],
    price: "₹1,500",
    rating: 4.8,
    reviews: 35,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: "3",
    name: "Aditya Patel",
    title: "AI Research Scientist",
    company: "OpenAI",
    bio: "Deep learning expert focusing on massive LLM alignment and agentic frameworks. Book with me for PhD guidance, publication reviews, and core Machine Learning roadmaps.",
    skills: ["Deep Learning", "Generative AI", "PhD / Research Guidance", "PyTorch"],
    price: "₹2,000",
    rating: 5.0,
    reviews: 22,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    id: "4",
    name: "Priyanka Sen",
    title: "Co-Founder & CEO",
    company: "FinTech AI",
    bio: "Raised $5M+ in venture capital. I help alumni startups with business model canvas, fundraising tactics, seed pitches, and finding the initial product-market fit.",
    skills: ["Pitch Deck Review", "Fundraising", "Product Market Fit", "B2B SaaS Strategy"],
    price: "₹2,500",
    rating: 4.9,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  }
];

export default function MentorshipTab() {
  const [mentors] = useState<Mentor[]>(initialMentors);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookingMentor, setActiveBookingMentor] = useState<Mentor | null>(null);

  // Booking Form State
  const [topic, setTopic] = useState("Mock Interview & Prep");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM - 10:45 AM");
  const [notes, setNotes] = useState("");

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookingMentor) return;
    if (!date) {
      toast.error("Please pick a session date!");
      return;
    }

    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 9),
      mentorName: activeBookingMentor.name,
      topic,
      date,
      time
    };

    setBookings([newBooking, ...bookings]);
    toast.success(`Session booked with ${activeBookingMentor.name} for ${date} at ${time}!`);
    
    // Reset
    setActiveBookingMentor(null);
    setTopic("Mock Interview & Prep");
    setDate("");
    setNotes("");
  };

  const filteredMentors = mentors.filter(mentor => {
    return mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
           mentor.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="text-indigo-600" size={24} />
          Paid Alumni Mentorship Program
        </h2>
        <p className="text-sm text-gray-500 mt-1">Book 1:1 private advisory sessions with top alumni working in leading global firms.</p>
      </div>

      {/* Bookings Overview Panel (Conditional) */}
      {bookings.length > 0 && (
        <div className="mb-8 border border-emerald-100 bg-emerald-50/30 rounded-xl p-5 animate-fadeIn">
          <h3 className="font-bold text-sm text-emerald-900 mb-3 flex items-center gap-1.5">
            <Video className="text-emerald-600 animate-pulse" size={17} />
            Your Scheduled Sessions ({bookings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white border border-emerald-100 rounded-lg p-3.5 flex gap-3 shadow-sm">
                <div className="bg-emerald-50 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {b.mentorName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900">{b.mentorName}</p>
                  <p className="text-[11px] text-gray-500 truncate">{b.topic}</p>
                  <p className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 mt-1.5">
                    <Calendar size={11} /> {b.date} | <Clock size={11} /> {b.time}
                  </p>
                </div>
                <span className="self-center bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search mentors by name, skill, domain, or company..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => (
          <div 
            key={mentor.id} 
            className="border border-gray-100 hover:border-indigo-100 rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex gap-4 mb-4">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-14 h-14 rounded-full object-cover border border-indigo-100"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-none">{mentor.name}</h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1.5">{mentor.title} at <span className="text-indigo-600">{mentor.company}</span></p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                      <Star size={13} fill="currentColor" />
                      {mentor.rating}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">({mentor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed italic mb-4 border-l-2 border-indigo-100 pl-2">
                &ldquo;{mentor.bio}&rdquo;
              </p>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {mentor.skills.map((skill, index) => (
                  <span key={index} className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none">Mentorship Fee</p>
                <p className="text-lg font-black text-indigo-600 mt-1 flex items-center">
                  <DollarSign size={16} />
                  {mentor.price} <span className="text-xs text-gray-500 font-normal ml-0.5">/ 45-min</span>
                </p>
              </div>
              <button
                onClick={() => setActiveBookingMentor(mentor)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-all shadow-sm"
              >
                <Calendar size={14} />
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Overlay / Modal */}
      {activeBookingMentor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-md w-full p-6 animate-scaleUp">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Schedule 1:1 Session</h3>
                <p className="text-xs text-indigo-600 font-semibold mt-0.5">With {activeBookingMentor.name}</p>
              </div>
              <button
                onClick={() => setActiveBookingMentor(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Session Focus *</label>
                <select
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="Mock Interview & Prep">Mock Interview & Prep</option>
                  <option value="System Design Deep-Dive">System Design Deep-Dive</option>
                  <option value="Resume Review & Critique">Resume Review & Critique</option>
                  <option value="Startup Pitch Advice">Startup Pitch Advice</option>
                  <option value="General Career Mentorship">General Career Mentorship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Pick Date *</label>
                <input
                  type="date"
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Time Slot (45-Mins) *</label>
                <select
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="09:00 AM - 09:45 AM">09:00 AM - 09:45 AM</option>
                  <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM</option>
                  <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM</option>
                  <option value="04:00 PM - 04:45 PM">04:00 PM - 04:45 PM</option>
                  <option value="06:30 PM - 07:15 PM">06:30 PM - 07:15 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Share your questions or goals (Optional)</label>
                <textarea
                  placeholder="Tell your mentor what you want to focus on to get the most out of your 45 minutes..."
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg h-20 focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg flex items-center justify-between mb-4">
                <span className="text-xs text-indigo-900 font-bold flex items-center gap-1">
                  <Sparkles size={14} className="text-indigo-600" /> Total Fee
                </span>
                <span className="text-sm font-black text-indigo-700">{activeBookingMentor.price}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBookingMentor(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
