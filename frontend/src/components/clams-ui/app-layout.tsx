'use client'

import React from 'react'
import { Sidebar } from './sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  userRole?: 'Admin' | 'Instructor'
  userName?: string
  labName?: string
}

export function AppLayout({ children, userRole = 'Admin', userName = 'User', labName = '' }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar userRole={userRole} userName={userName} labName={labName} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex-1">
              <div className="text-sm text-slate-500 mb-1">CLAMS</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AppLayout
