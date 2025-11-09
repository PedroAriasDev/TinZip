"use client"

import Header from "@/app/components/upload/Header"
import MainUploadCard from "@/app/components/upload/MainUploadCard"
import SecurityInfoCards from "@/app/components/upload/SecurityInfoCards"

export default function FileUploadPage() {
  
  return (
<div className="
  min-h-screen w-full p-4 md:p-12 flex flex-col items-center 
  bg-gradient-to-b from-primary/20 via-background to-green-100 
  dark:bg-gradient-to-b dark:from-background dark:to-primary/20
">   
  <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Header />
        <MainUploadCard />
        <SecurityInfoCards />
      </div>
    </div>
  )
}
