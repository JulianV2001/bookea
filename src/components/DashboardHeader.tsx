'use client'

import Logo from './Logo'

export default function DashboardHeader() {
  return (
    <header className="w-full h-[57.81px] bg-white shadow-sm">
      <div className=" h-full flex items-center justify-between pl-[20px]">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center pr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path d="M11.5 10.9056C13.617 10.9056 15.3333 9.11477 15.3333 6.90563C15.3333 4.6965 13.617 2.90564 11.5 2.90564C9.38287 2.90564 7.66663 4.6965 7.66663 6.90563C7.66663 9.11477 9.38287 10.9056 11.5 10.9056Z" fill="#006AFC"/>
            <path d="M19.1667 18.4056C19.1667 20.8906 19.1667 22.9056 11.5 22.9056C3.83337 22.9056 3.83337 20.8906 3.83337 18.4056C3.83337 15.9206 7.26612 13.9056 11.5 13.9056C15.734 13.9056 19.1667 15.9206 19.1667 18.4056Z" fill="#006AFC"/>
          </svg>
        </div>
      </div>
    </header>
  )
} 