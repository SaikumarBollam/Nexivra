import Image from 'next/image'
import React from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'

const ProfilePhoto = ({ src, className }: { src: string; className?: string }) => {
    return (
        <div>
            <Avatar className={`cursor-pointer ${className || ''}`}>
                <AvatarImage src={src} alt="banner" />
            </Avatar>
        </div>
    )
}

export default ProfilePhoto