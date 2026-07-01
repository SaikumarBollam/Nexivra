'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Send, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AlumniEvent {
  id: string;
  title: string;
  host: string;
  alumniClass: string;
  date: string;
  time: string;
  location: string;
  type: 'Virtual' | 'In-Person';
  description: string;
  attendeesCount: number;
  meetingLink?: string;
}

const initialEvents: AlumniEvent[] = [
  {
    id: "1",
    title: "AI & Large Language Models in Production",
    host: "Aditya Patel (Research Scientist, OpenAI)",
    alumniClass: "Class of 2022",
    date: "July 24, 2026",
    time: "7:00 PM - 8:30 PM IST",
    location: "Google Meet",
    type: 'Virtual',
    description: "Join Aditya as he discusses the engineering challenges of fine-tuning, serving, and alignment for billions-parameter LLMs. Perfect for backend engineers and AI enthusiasts.",
    attendeesCount: 145,
    meetingLink: "https://meet.google.com/abc-defg-hij"
  },
  {
    id: "2",
    title: "Annual Alumni Networking Mixer 2026",
    host: "Priyanka Sen (Incubator Lead)",
    alumniClass: "Class of 2019",
    date: "August 15, 2026",
    time: "6:00 PM - 9:00 PM IST",
    location: "The Grand Ballroom, Bangalore",
    type: 'In-Person',
    description: "The biggest social mixer of the year! Connect with founders, venture capitalists, senior engineers, and current graduating students over delicious dinner and drinks.",
    attendeesCount: 312
  },
  {
    id: "3",
    title: "How to Transition from Engineering to PM",
    host: "Neha Sharma (Product Manager, Microsoft)",
    alumniClass: "Class of 2020",
    date: "September 02, 2026",
    time: "5:30 PM - 6:30 PM IST",
    location: "Zoom Video",
    type: 'Virtual',
    description: "An interactive masterclass outlining the concrete steps, resume strategies, and presentation frameworks required to transition from SDE to Product Management.",
    attendeesCount: 88,
    meetingLink: "https://zoom.us/j/123456789"
  }
];

export default function EventsTab() {
  const [events, setEvents] = useState<AlumniEvent[]>(initialEvents);
  const [showHostForm, setShowHostForm] = useState(false);
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);

  // Host Event Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newType, setNewType] = useState<'Virtual' | 'In-Person'>('Virtual');
  const [newDesc, setNewDesc] = useState("");

  const handleRsvp = (eventTitle: string, eventId: string) => {
    if (rsvpedIds.includes(eventId)) {
      setRsvpedIds(rsvpedIds.filter(id => id !== eventId));
      toast.info(`RSVP cancelled for "${eventTitle}".`);
    } else {
      setRsvpedIds([...rsvpedIds, eventId]);
      toast.success(`RSVP confirmed for "${eventTitle}"! A calendar invite has been sent.`);
    }
  };

  const handleHostEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newTime || !newLocation || !newDesc) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const eventToAdd: AlumniEvent = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTitle,
      host: "You (Alumni Organizer)",
      alumniClass: "Class of 2026",
      date: newDate,
      time: newTime,
      location: newLocation,
      type: newType,
      description: newDesc,
      attendeesCount: 1
    };

    setEvents([eventToAdd, ...events]);
    toast.success(`Event "${newTitle}" created successfully!`);
    
    // Reset Form
    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setNewLocation("");
    setNewType("Virtual");
    setNewDesc("");
    setShowHostForm(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-indigo-600" size={24} />
            Alumni Events Hub
          </h2>
          <p className="text-sm text-gray-500 mt-1">Join technical webinars, panels, and regional network mixers.</p>
        </div>
        <button
          onClick={() => setShowHostForm(!showHostForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus size={16} />
          Host an Event
        </button>
      </div>

      {/* Host Event Form Panel */}
      {showHostForm && (
        <form onSubmit={handleHostEvent} className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 mb-6 animate-fadeIn">
          <h3 className="font-bold text-sm text-indigo-900 mb-4 flex items-center gap-1">
            <Plus size={16} />
            Create an Alumni Event
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Event Title *</label>
              <input
                type="text"
                placeholder="e.g. Masterclass on System Design"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Event Type</label>
              <select
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
              >
                <option value="Virtual">Virtual (Online Link)</option>
                <option value="In-Person">In-Person (Physical Venue)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Event Date *</label>
              <input
                type="text"
                placeholder="e.g. August 20, 2026"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Event Time *</label>
              <input
                type="text"
                placeholder="e.g. 6:00 PM - 7:30 PM IST"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Location / Meeting URL *</label>
              <input
                type="text"
                placeholder="e.g. Zoom Video Link or Tech Park Auditorium, Mumbai"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Event Description *</label>
            <textarea
              placeholder="Provide agenda, key takeaways, and background on speakers..."
              className="w-full text-xs p-2.5 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 bg-white"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowHostForm(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 font-semibold flex items-center gap-1 shadow-sm"
            >
              <Send size={13} />
              Host Event
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-6">
        {events.map((event) => {
          const isRegistered = rsvpedIds.includes(event.id);
          const totalAttendees = isRegistered ? event.attendeesCount + 1 : event.attendeesCount;

          return (
            <div 
              key={event.id} 
              className="border border-gray-100 rounded-xl p-5 hover:border-indigo-150 hover:shadow-sm transition-all flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    event.type === 'Virtual' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    {event.type}
                  </span>
                  <p className="text-xs text-gray-400 font-medium">Hosted by <span className="font-bold text-gray-600">{event.host}</span></p>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-2 hover:text-indigo-600 transition-colors">
                  {event.title}
                </h3>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed font-medium">
                  {event.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-500 border-t border-gray-50 pt-3">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-indigo-500" />
                    {event.date}
                  </p>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-indigo-500" />
                    {event.time}
                  </p>
                  <p className="flex items-center gap-1.5 font-medium truncate">
                    <MapPin size={14} className="text-indigo-500" />
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-between items-center md:justify-center gap-4 border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                <div className="text-left md:text-center">
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1 md:justify-center">
                    <Users size={13} /> Attendees
                  </p>
                  <p className="text-lg font-black text-gray-800 mt-0.5">{totalAttendees}</p>
                </div>

                <button
                  onClick={() => handleRsvp(event.title, event.id)}
                  className={`w-full py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    isRegistered
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <Check size={14} />
                      RSVP&apos;d (Meet Link Sent)
                    </>
                  ) : (
                    <>
                      RSVP to Join
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
