'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CLAMSLogo } from './clams-logo'
import { Menu, X, LogOut } from 'lucide-react'

interface SidebarProps {
  userRole?: 'Admin' | 'Instructor'
  userName?: string
  labName?: string
}

export function Sidebar({ userRole = 'Admin', userName = 'User', labName = '' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobile) setIsOpen(false)
  }, [isMobile])

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  const adminNavigation = [
    {
      label: 'OVERVIEW',
      items: [{ name: 'Dashboard', path: '/dashboard', icon: '📊' }],
    },
    {
      label: 'MANAGEMENT',
      items: [
        { name: 'Laboratories', path: '/laboratories', icon: '🏢' },
        { name: 'Equipment', path: '/equipment', icon: '⚙️' },
        { name: 'Peripherals', path: '/peripherals', icon: '🖱️' },
        { name: 'Users', path: '/users', icon: '👥' },
      ],
    },
    {
      label: 'RECORDS',
      items: [
        { name: 'Reports', path: '/reports', icon: '📈' },
        { name: 'Activity Logs', path: '/activity-logs', icon: '📋' },
      ],
    },
  ]

  const instructorNavigation = [
    {
      label: 'MY LAB',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Inventory', path: '/inventory', icon: '📦' },
        { name: 'Equipment', path: '/equipment', icon: '⚙️' },
        { name: 'Peripherals', path: '/peripherals', icon: '🖱️' },
      ],
    },
    {
      label: 'TRANSACTIONS',
      items: [
        { name: 'Borrow / Return', path: '/borrow-return', icon: '📤' },
        { name: 'Damage Reports', path: '/damage-reports', icon: '⚠️' },
      ],
    },
  ]

  const navigation = userRole === 'Admin' ? adminNavigation : instructorNavigation

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-10 h-10 rounded-lg border-2 border-teal-500 flex items-center justify-center bg-slate-800">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-teal-400"
            >
              <rect x="2" y="7" width="20" height="5" rx="1" />
              <rect x="2" y="14" width="20" height="5" rx="1" />
              <circle cx="6" cy="9.5" r="1" fill="currentColor" />
              <circle cx="10" cy="9.5" r="1" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm">CLAMS</p>
            <p className="text-xs text-slate-400">CCS · REST</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        {navigation.map((section) => (
          <div key={section.label} className="mb-8">
            <p className="px-6 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              {section.label}
            </p>
            <ul className="space-y-2 px-3">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => isMobile && setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                      isActive(item.path)
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-700 p-6 space-y-3">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold truncate">{userName}</p>
          <p className="text-xs text-slate-400">
            {userRole} {labName && `• ${labName}`}
          </p>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-md transition-all">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 transform transition-transform duration-300 z-40 ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        } md:relative md:translate-x-0 md:z-auto`}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for desktop */}
      {!isMobile && <div className="hidden md:block w-64 flex-shrink-0" />}
    </>
  )
}

export default Sidebar
