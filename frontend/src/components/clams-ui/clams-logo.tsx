'use client'

import React, { useEffect, useRef } from 'react'

interface CLAMSLogoProps {
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function CLAMSLogo({ size = 'md', animated = true, className = '' }: CLAMSLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animated || !containerRef.current) return

    // Add animation class on mount
    containerRef.current.classList.add('animate-bloom')
  }, [animated])

  const sizeMap = {
    sm: { container: 'w-12 h-12', icon: 'w-8 h-8', text: 'text-lg' },
    md: { container: 'w-16 h-16', icon: 'w-12 h-12', text: 'text-2xl' },
    lg: { container: 'w-24 h-24', icon: 'w-20 h-20', text: 'text-4xl' },
  }

  const sizes = sizeMap[size]

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <style>{`
        @keyframes bloom {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(14, 149, 148, 0.3), 0 0 20px rgba(14, 149, 148, 0.1);
          }
          50% {
            box-shadow: 0 0 20px rgba(14, 149, 148, 0.6), 0 0 40px rgba(14, 149, 148, 0.3);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-bloom {
          animation: bloom 1.2s ease-out;
        }

        .logo-container {
          animation: glow 3s ease-in-out infinite, float 4s ease-in-out infinite;
        }

        .logo-icon {
          position: relative;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, rgba(14, 149, 148, 0.2), rgba(26, 58, 82, 0.1));
          border-radius: 12px;
          animation: spin-slow 8s linear infinite;
          z-index: -1;
        }

        .hover\:animate-pulse:hover {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>

      <div
        ref={containerRef}
        className={`${sizes.container} logo-container relative flex items-center justify-center rounded-lg border-2 border-teal-600 bg-gradient-to-br from-slate-50 to-blue-50 cursor-pointer transition-all hover:animate-pulse hover:border-teal-500`}
      >
        <div className={`${sizes.icon} logo-icon flex items-center justify-center`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-full h-full text-teal-600"
          >
            {/* Server/Equipment Icon */}
            <rect x="2" y="7" width="20" height="5" rx="1" />
            <rect x="2" y="14" width="20" height="5" rx="1" />
            <circle cx="6" cy="9.5" r="1" fill="currentColor" />
            <circle cx="10" cy="9.5" r="1" fill="currentColor" />
            <circle cx="6" cy="16.5" r="1" fill="currentColor" />
            <circle cx="10" cy="16.5" r="1" fill="currentColor" />
            <path d="M4 3v2M20 3v2M4 21v-2M20 21v-2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <h1 className={`${sizes.text} font-bold text-slate-900`}>CLAMS</h1>
        <p className="text-xs text-slate-600 tracking-wide">CCS · ASSET MGMT</p>
      </div>
    </div>
  )
}

export default CLAMSLogo
