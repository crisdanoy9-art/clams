import React, { useState } from "react";
import { X, Award, BookOpen, Users, Calendar, Monitor, Cpu, Database, Mail, UserCircle, Server, School, Activity, ZoomIn } from "lucide-react";

export default function AboutModal({ isOpen, onClose }) {
  const [imageErrors, setImageErrors] = useState({});
  const [zoomedImage, setZoomedImage] = useState(null);

  if (!isOpen) return null;

  const handleImageError = (imageName) => {
    setImageErrors(prev => ({ ...prev, [imageName]: true }));
  };

  const handleImageClick = (imageUrl, name) => {
    console.log("Zooming image:", imageUrl, name); // Debug log
    setZoomedImage({ url: imageUrl, name });
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  const teamMembers = [
    {
      name: "Denverneil Algooso",
      role: "Project Manager | System Analyst | UI/UX Designer",
      tasks: "Team leadership, system planning, requirements analysis, UI design",
      email: "dn.algooso@jrsmu.edu",
      color: "from-indigo-500 to-purple-500",
      icon: "👨‍💼",
      imagePath: "/creators/n.jpg",
    },
    {
      name: "Johannes Leo Alolino",
      role: "Backend Developer | Database Administrator | Programmer",
      tasks: "API development, database schema design, general coding",
      email: "jl.alolino@jrsmu.edu",
      color: "from-blue-500 to-cyan-500",
      icon: "💻",
      imagePath: "/creators/l.jpg",
    },
    {
      name: "Cris Lawrence Danoy",
      role: "Frontend Developer",
      tasks: "React UI implementation, frontend-to-backend API integration, PostgreSQL management",
      email: "cl.danoy@jrsmu.edu",
      color: "from-emerald-500 to-teal-500",
      icon: "🎨",
      imagePath: "/creators/d.jpg",
    },
    {
      name: "Al-Shamer Abao",
      role: "QA Tester | Debugger",
      tasks: "System testing, bug identification, validation of all features",
      email: "as.abao@jrsmu.edu",
      color: "from-amber-500 to-orange-500",
      icon: "🐛",
      imagePath: "/creators/s.jpg",
    },
  ];

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Monitor size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">CLAMS</h2>
                <p className="text-indigo-300 text-sm">CCS Laboratory Asset Management System</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={22} className="text-white" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: "thin" }}>
            
            {/* System Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              {/* System Information */}
              <div className="p-5 bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-200">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 cursor-pointer group relative bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
                    onClick={() => handleImageClick("/creators/system-icon.jpg", "System Information")}
                  >
                    {!imageErrors['system'] ? (
                      <>
                        <img
                          src="/creators/.jpg"
                          alt="System"
                          className="w-full h-full object-cover"
                          onError={() => handleImageError('system')}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn size={24} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <Server size={32} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">System Information</h3>
                    <p className="text-xs text-slate-500">Version 1.0</p>
                    <div className="space-y-2 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-slate-600">Released: April 2026</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database size={14} className="text-slate-400" />
                        <span className="text-slate-600">Database: PostgreSQL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-slate-400" />
                        <span className="text-slate-600">Backend: Node.js + Express</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Information with Instructor Image - FIXED ZOOM */}
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 cursor-pointer group relative bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                    onClick={() => {
                      // Use a default image if instructor image doesn't exist
                      const instructorImage = !imageErrors['instructor'] 
                        ? "/creators/m.jpg" 
                        : "https://via.placeholder.com/400x400?text=Mr.+Mark+Mascardo";
                      handleImageClick(instructorImage, "Mr. Mark Mascardo - Course Instructor");
                    }}
                  >
                    {!imageErrors['instructor'] ? (
                      <>
                        <img
                          src="/creators/m.jpg"
                          alt="Instructor"
                          className="w-full h-full object-cover"
                          onError={() => handleImageError('instructor')}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn size={24} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <School size={32} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">Course Information</h3>
                    <p className="text-xs text-slate-500">IM 107 - Information Management</p>
                    <div className="space-y-2 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-emerald-500" />
                        <span className="text-slate-600">Instructor: <span className="font-medium text-emerald-700">Mr. Mark Mascardo</span></span>
                      </div>
                      <p className="text-slate-600">College of Computing Studies</p>
                      <p className="text-slate-600">JRMSU Main Campus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users size={24} className="text-indigo-500" />
                <h3 className="text-xl font-bold text-slate-800">LAPSNADAS Development Team</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">BSIS II - A</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-slate-100 rounded-2xl p-5 hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-20 h-20 rounded-2xl overflow-hidden shadow-md cursor-pointer group relative shrink-0"
                        onClick={() => handleImageClick(member.imagePath, member.name)}
                      >
                        {!imageErrors[member.name] ? (
                          <>
                            <img
                              src={member.imagePath}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(member.name)}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn size={20} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                            <span className="text-3xl">{member.icon}</span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-200">
                          <UserCircle size={14} className="text-slate-400" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-base">{member.name}</h4>
                        <span className="inline-block text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full mt-1">
                          {member.role}
                        </span>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          {member.tasks}
                        </p>
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                          <Mail size={12} className="text-slate-400" />
                          <span className="text-xs text-slate-500 font-mono">{member.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 p-5 bg-slate-50 rounded-xl text-center border border-slate-200">
                <p className="text-xs text-slate-500 font-medium">
                  Submitted in partial fulfillment of the requirements for IM 107 - Information Management
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  © 2026 LAPSNADAS | College of Computing Studies | JRMSU Main Campus
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal - FIXED to ensure it shows */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={closeZoom}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
            {/* Close button top right */}
            <button
              onClick={closeZoom}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X size={28} />
            </button>
            
            {/* Zoomed Image */}
            <img
              src={zoomedImage.url}
              alt={zoomedImage.name}
              className="max-w-[85vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Image+Not+Found";
              }}
            />
            
            {/* Image caption */}
            <p className="mt-4 text-center text-white text-base font-medium bg-black/50 px-6 py-2 rounded-full">
              {zoomedImage.name}
            </p>
            
            {/* Close button bottom */}
            <button
              onClick={closeZoom}
              className="mt-4 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
            >
              Click anywhere or press ESC to close
            </button>
          </div>
        </div>
      )}

      {/* ESC key to close zoom */}
      {zoomedImage && (
        <div
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeZoom();
          }}
        />
      )}
    </>
  );
}