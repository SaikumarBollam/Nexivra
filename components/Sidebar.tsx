import Image from "next/image";
import React from "react";
import ProfilePhoto from "./shared/ProfilePhoto";
import { getAllPosts } from "@/lib/serveractions";

const Sidebar = async ({ user }: { user: any }) => {
  const posts = await getAllPosts();
  return (
    <div className="hidden md:block w-full h-fit border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex relative flex-col items-center">
        {/* Top Banner Background */}
        <div className="w-full h-14 overflow-hidden relative">
          <Image
            src={"/banner.jpg"}
            alt="Banner"
            width={240}
            height={60}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Absolutely Centered Profile Photo */}
        <div className="absolute top-6 flex justify-center w-full">
          <div className="ring-4 ring-white rounded-full overflow-hidden shadow-md bg-white">
            <ProfilePhoto 
              src={user ? user?.imageUrl! : "/default-avator.png"} 
              className="h-16 w-16"
            />
          </div>
        </div>

        {/* User Info Details */}
        <div className="w-full border-b border-gray-100 text-center pb-4 pt-12 px-4">
          <h1 className="font-bold text-gray-900 hover:text-indigo-600 hover:underline cursor-pointer text-sm transition-colors">
            {user
              ? `${user?.firstName} ${user?.lastName}`
              : "Nexivra Member"}
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5">@{user?.username || "guest"}</p>
        </div>
      </div>

      {/* Impression Stats Panel */}
      <div className="text-xs py-2 divide-y divide-gray-50">
        <div className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
          <p className="text-gray-500 font-medium">Post Impressions</p>
          <p className="text-indigo-600 font-bold">142</p>
        </div>
        <div className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
          <p className="text-gray-500 font-medium">Your Posts</p>
          <p className="text-indigo-600 font-bold">{posts?.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
