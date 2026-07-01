import Image from 'next/image'
import React from 'react'
import SearchInput from './SearchInput'
import NavItems from './NavItems'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@/lib/mock-clerk-client'
import { Button } from './ui/button'
import Logo from './Logo'

const Navbar = () => {
    return (
        <div className='fixed w-full bg-white z-50 shadow-sm'>
            <div className=' flex items-center max-w-6xl justify-between h-14 mx-auto px-3'>
                <div className='flex items-center gap-3'>
                    <Logo className="w-9 h-9 cursor-pointer" />
                    <div className='flex flex-col'>
                        <span className='font-bold text-lg tracking-tight text-gray-900 leading-none'>
                            Nexi<span className='text-indigo-600 font-extrabold'>vra</span>
                        </span>
                        <span className='text-[10px] text-indigo-500 font-medium tracking-wide mt-0.5'>
                            Alumni Portal
                        </span>
                    </div>
                    <div className='md:block hidden ml-2'>
                        <SearchInput />
                    </div>
                </div>
                <div className='flex items-center gap-5'>
                    <div className='md:block hidden'>
                        <NavItems />
                    </div>
                    <div>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton>
                                <Button className='rounded-full' variant={'secondary'}>
                                    Sign In
                                </Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar