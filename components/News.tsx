import { Info } from 'lucide-react'
import React from 'react'

interface NAVITEMS {
  heading: string,
  subHeading: string
}
const newsItems: NAVITEMS[] = [
  {
    heading: "E-retailer retag health drinks",
    subHeading: "4h ago · 345 readers"
  },
  {
    heading: "Lets transport raises $22 million",
    subHeading: "4h ago · 323 readers"
  },
  {
    heading: "Casual wear is in at India Inc",
    subHeading: "4h ago · 234 readers"
  },
  {
    heading: "Smaller cities go on loans",
    subHeading: "4h ago · 112 readers"
  },
]

const News = () => {
  return (
    <div className='hidden lg:block w-full bg-white h-fit rounded-xl border border-gray-200 shadow-sm p-4 space-y-3.5'>
      <div className='flex items-center justify-between border-b border-gray-50 pb-2.5'>
        <h2 className='font-bold text-gray-900 text-sm tracking-tight'>Nexivra News</h2>
        <Info size={15} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
      </div>
      
      <div className='space-y-3'>
        {newsItems.map((item, index) => (
          <div 
            key={index} 
            className='group flex gap-2.5 cursor-pointer rounded-lg p-1.5 -mx-1.5 hover:bg-gray-50 transition-all'
          >
            {/* Dynamic visual indicator dot */}
            <div className='w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 group-hover:scale-125 group-hover:bg-indigo-600 transition-all' />
            <div className='min-w-0 flex-1'>
              <h3 className='text-xs font-semibold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2'>
                {item.heading}
              </h3>
              <p className='text-[10px] text-gray-400 mt-0.5 font-medium'>
                {item.subHeading}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default News