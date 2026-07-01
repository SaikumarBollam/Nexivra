"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultUser = {
  id: "mock_user_123",
  firstName: "Jane",
  lastName: "Doe",
  imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  username: "janedoe",
  emailAddresses: [{ emailAddress: "jane.doe@example.com" }]
};

const AuthContext = createContext<{
  user: any;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}>({
  user: null,
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {}
});

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mock_clerk_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(defaultUser);
      }
    } else {
      setUser(defaultUser);
      localStorage.setItem('mock_clerk_user', JSON.stringify(defaultUser));
    }
    setMounted(true);
  }, []);

  const signIn = () => {
    setUser(defaultUser);
    localStorage.setItem('mock_clerk_user', JSON.stringify(defaultUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('mock_clerk_user');
  };



  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const { user, isSignedIn } = useContext(AuthContext);
  return {
    isLoaded: true,
    isSignedIn,
    user: user ? {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`
    } : null
  };
};

export const useAuth = () => {
  const { user, isSignedIn } = useContext(AuthContext);
  return {
    isLoaded: true,
    isSignedIn,
    userId: user?.id || null
  };
};

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useContext(AuthContext);
  return isSignedIn ? <>{children}</> : null;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useContext(AuthContext);
  return !isSignedIn ? <>{children}</> : null;
};

export const SignInButton = ({ children }: { children?: React.ReactNode }) => {
  const { signIn } = useContext(AuthContext);
  
  if (children) {
    return <span onClick={signIn} className="cursor-pointer">{children}</span>;
  }
  
  return (
    <button 
      onClick={signIn}
      className="px-4 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-full border border-blue-600 transition cursor-pointer"
    >
      Sign In
    </button>
  );
};

export const UserButton = () => {
  const { user, signOut } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <img
        src={user.imageUrl}
        alt="Avatar"
        className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer object-cover"
        onClick={() => setShowDropdown(!showDropdown)}
      />
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
          <button
            onClick={() => {
              signOut();
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
