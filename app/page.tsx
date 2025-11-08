"use client"

import Header from "@/app/components/upload/Header"
import MainUploadCard from "@/app/components/upload/MainUploadCard"
import SecurityInfoCards from "@/app/components/upload/SecurityInfoCards"

export default function FileUploadPage() {
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Header />
        <MainUploadCard />
        <SecurityInfoCards />
      </div>
    </div>
  )
}
