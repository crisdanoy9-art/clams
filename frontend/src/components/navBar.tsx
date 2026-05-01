interface Props {
  currentView: string;
  userRole: string;
}
export function Navbar({ currentView, userRole }: Props) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between w-full">
      <div>
        <h2 className="font-black text-slate-800 uppercase tracking-tight text-lg">
          {currentView.replace(/([A-Z])/g, " $1").trim()}
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
          CCS Laboratory Asset Management System
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-900">
            {userRole === "admin" ? "Raylle Admin" : "Staff Instructor"}
          </p>
          <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">
            JRMSU Main Campus
          </p>
        </div>
        <div className="w-10 h-10 bg-indigo-600 rounded-md shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black text-xl">
          {userRole === "admin" ? "R" : "I"}
        </div>
      </div>
    </header>
  );
}
