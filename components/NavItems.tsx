'use client';

import { Activity, Bell, BriefcaseBusiness, Calendar, GraduationCap, Home, Rocket, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

interface NAVITEM {
    src: string;
    icon: React.ReactNode;
    text: string;
    tab: string;
}

const navItemsList: NAVITEM[] = [
    {
        src: "/?tab=home",
        icon: <Home size={19} />,
        text: "Home Feed",
        tab: "home",
    },
    {
        src: "/?tab=directory",
        icon: <Users size={19} />,
        text: "Directory",
        tab: "directory",
    },
    {
        src: "/?tab=jobs",
        icon: <BriefcaseBusiness size={19} />,
        text: "Jobs",
        tab: "jobs",
    },
    {
        src: "/?tab=mentorship",
        icon: <GraduationCap size={19} />,
        text: "Mentors",
        tab: "mentorship",
    },
    {
        src: "/?tab=events",
        icon: <Calendar size={19} />,
        text: "Events",
        tab: "events",
    },
    {
        src: "/?tab=startup",
        icon: <Rocket size={19} />,
        text: "Startups",
        tab: "startup",
    },
    {
        src: "/?tab=ai-coach",
        icon: <Sparkles size={19} className="text-indigo-500 animate-pulse" />,
        text: "AI Coach",
        tab: "ai-coach",
    },
    {
        src: "/?tab=performance",
        icon: <Activity size={19} className="text-emerald-500 animate-pulse" />,
        text: "Performance",
        tab: "performance",
    },
];

const NavItemsContent = () => {
    const searchParams = useSearchParams();
    const activeTab = searchParams?.get('tab') || 'home';

    return (
        <div className='flex gap-7 items-center'>
            {
                navItemsList.map((navItem, index) => {
                    const isActive = activeTab === navItem.tab;
                    return (
                        <Link 
                            key={index} 
                            href={navItem.src}
                            className={`flex flex-col items-center cursor-pointer transition-colors ${
                                isActive 
                                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 -mb-[5px]' 
                                    : 'text-[#666666] hover:text-black pb-1'
                            }`}
                        >
                            <span className={isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-800'}>
                                {navItem.icon}
                            </span>
                            <span className='text-[11px] mt-1 hidden lg:block'>{navItem.text}</span>
                        </Link>
                    )
                })
            }
        </div>
    );
};

const NavItems = () => {
    return (
        <Suspense fallback={<div className="text-xs text-gray-400">Loading navigation...</div>}>
            <NavItemsContent />
        </Suspense>
    );
};

export default NavItems;
