import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  GraduationCap, 
  User, 
  X, 
  ExternalLink, 
  Link2,
  Users,
  BookOpen
} from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Denverneil Algooso",
    role: "Project Manager | System Analyst | UI/UX",
    course: "Bachelor of Science in Information Systems",
    year: "2ND Year",
    address: "Talisay Dapitan City",
    email: "martinezneil2005@gmail.com",
    facebook: "https://www.facebook.com/profile.php?id=61578349977989&rdid=GVyrZDjZxisWHf4w&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1TxwjHcDw2#",
    image: "/n.jpg",
    description: "Team leader responsible for project planning, system analysis, and UI/UX design. Ensures the project meets all requirements and deadlines."
  },
  {
    id: 2,
    name: "Johannes Leo Alolino",
    role: "Backend Developer | Database Administrator | Programmer",
    course: "Bachelor of Science in Information Systems",
    year: "2nd Year",
    address: "Sicayab Dapitan City",
    email: "johannes.leolino@jrmsu.edu.ph",
    facebook: "https://www.facebook.com/Leoalolino.1?rdid=fisJwnsfMThsd75E&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1bLFq1YehJ#",
    image: "/l.jpg",
    description: "Backend architect handling API development, database schema design, and server-side logic implementation."
  },
  {
    id: 3,
    name: "Cris Lawrence Danoy",
    role: "Frontend Developer",
    course: "Bachelor of Science in Information Systems",
    year: "2nd Year",
    address: "Mucipality of Piñan",
    email: "cris.danoy@jrmsu.edu.ph",
    facebook: "https://www.facebook.com/cris.danoy.7?rdid=YZoQFQixkGzSMSC7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1T27JdLntp#",
    image: "/d.jpg",
    description: "React UI implementation, frontend-to-backend API integration, and responsive design development."
  },
  {
    id: 4,
    name: "Al-Shamer Abao",
    role: "QA Tester | Debugger",
    course: "Bachelor of Science in Information Systems",
    year: "4th Year",
    address: "San Vicente Dapitan City",
    email: "alshamer.abao@jrmsu.edu.ph",
    facebook: "https://www.facebook.com/sha.mer.53838?rdid=aDNTgJeWoF7oGvDM&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GWuQitNAp#",
    image: "/s.jpg",
    description: "Quality assurance specialist responsible for system testing, bug identification, and validation of all features."
  }
];

const instructorInfo = {
  name: "Mr. Mark Mascardo",
  role: "Instructor",
  course: "Information Management",
  department: "College of Computing Studies",
  address: "Municipality of Calamba",
  email: "mark.mascardo@jrmsu.edu.ph",
  facebook: "https://www.facebook.com/kram.lm.2024",
  image: "/m.jpg",
  description: "Information Management instructor who guided the development of CLAMS and provided valuable feedback throughout the project."
};

function ProfileModal({ member, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
        {/* Header with Image */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl" />
          <div className="absolute -bottom-12 left-6">
            <img
              src={member.image}
              alt={member.name}
              className="w-28 h-28 rounded-2xl border-4 border-white dark:border-slate-900 object-cover bg-white shadow-lg"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="pt-16 p-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{member.name}</h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">{member.role}</p>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <GraduationCap size={18} />
              <span>{member.course} • {member.year}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <MapPin size={18} />
              <span>{member.address}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Mail size={18} />
              <span>{member.email}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {member.description}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            {member.facebook && (
              <a
                href={member.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#1877f2]/80 transition"
              >
                <ExternalLink size={16} />
                Facebook Profile
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About({ darkMode }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">About CLAMS</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          CCS Laboratory Asset Management System — A digital solution for managing laboratory assets
        </p>
      </div>

      {/* Project Description */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Project Overview</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          CLAMS (CCS Laboratory Asset Management System) is a web-based platform designed specifically to digitize 
          equipment tracking across CCS Computer Laboratories 1, 2, and 3. The system allows Admins to monitor 
          real-time inventory while Instructors can quickly log damage reports or process borrow-and-return transactions.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm">React.js</span>
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm">Node.js</span>
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm">Express.js</span>
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm">PostgreSQL</span>
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm">Tailwind CSS</span>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users size={22} />
          The Team — LAPSNADAS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => { setSelectedMember(member); setSelectedInstructor(false); }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
            >
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-indigo-100 dark:border-indigo-900/50 group-hover:border-indigo-500 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mt-4">{member.name}</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{member.role}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{member.course}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-500 group-hover:underline">
                View Profile <ExternalLink size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Section */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen size={22} />
          Project Instructor
        </h2>
        <div
          onClick={() => { setSelectedInstructor(true); setSelectedMember(null); }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group max-w-md mx-auto"
        >
          <div className="relative">
            <img
              src={instructorInfo.image}
              alt={instructorInfo.name}
              className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-emerald-100 dark:border-emerald-900/50 group-hover:border-emerald-500 transition-all duration-300"
            />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mt-4">{instructorInfo.name}</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{instructorInfo.role}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{instructorInfo.course}</p>
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-500 group-hover:underline">
            View Profile <ExternalLink size={12} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedMember && (
        <ProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
      {selectedInstructor && (
        <ProfileModal member={instructorInfo} onClose={() => setSelectedInstructor(false)} />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation-duration: 300ms;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
      `}</style>
    </div>
  );
}