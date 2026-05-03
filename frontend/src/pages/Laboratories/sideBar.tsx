export const LabSideBar = () => {
  return (
    <>
      {/* {sidebarOpen && selectedPCId && currentSelectedPC && ( */}
      {/*   <div className="w-96 border-l border-zinc-200 bg-slate-50/50 p-10 flex flex-col animate-in slide-in-from-right duration-500"> */}
      {/*     <div className="flex-1"> */}
      {/*       <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2"> */}
      {/*         {isEditSidebar */}
      {/*           ? `Modify ${getPCName(selectedPCId)}` */}
      {/*           : `${getPCName(selectedPCId)} Details`} */}
      {/*       </h4> */}
      {/*       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10"> */}
      {/*         {isEditSidebar */}
      {/*           ? "Select operational status" */}
      {/*           : "Current status & issue report"} */}
      {/*       </p> */}
      {/*       {isEditSidebar ? ( */}
      {/*         <> */}
      {/*           <div className="space-y-4"> */}
      {/*             <button */}
      {/*               onClick={() => */}
      {/*                 handleStatusChange(selectedPCId, "available") */}
      {/*               } */}
      {/*               className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${currentSelectedPC.status === "available" ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-white border-zinc-200 text-slate-400 hover:border-emerald-200"}`} */}
      {/*             > */}
      {/*               <div className="flex items-center gap-4"> */}
      {/*                 <CheckCircle size={20} /> */}
      {/*                 <span className="font-black uppercase tracking-widest text-[11px]"> */}
      {/*                   Available */}
      {/*                 </span> */}
      {/*               </div> */}
      {/*               <div */}
      {/*                 className={`w-3 h-3 rounded-md ${currentSelectedPC.status === "available" ? "bg-white" : "bg-emerald-500"}`} */}
      {/*               /> */}
      {/*             </button> */}
      {/*             <button */}
      {/*               onClick={() => */}
      {/*                 handleStatusChange(selectedPCId, "unavailable") */}
      {/*               } */}
      {/*               className={`w-full flex items-center justify-between p-6 rounded-md border-2 transition-all ${currentSelectedPC.status === "unavailable" ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100" : "bg-white border-zinc-200 text-slate-400 hover:border-rose-200"}`} */}
      {/*             > */}
      {/*               <div className="flex items-center gap-4"> */}
      {/*                 <AlertCircle size={20} /> */}
      {/*                 <span className="font-black uppercase tracking-widest text-[11px]"> */}
      {/*                   Issue Reported */}
      {/*                 </span> */}
      {/*               </div> */}
      {/*               <div */}
      {/*                 className={`w-3 h-3 rounded-md ${currentSelectedPC.status === "unavailable" ? "bg-white" : "bg-rose-500"}`} */}
      {/*               /> */}
      {/*             </button> */}
      {/*           </div> */}
      {/*           {currentSelectedPC.status === "unavailable" && ( */}
      {/*             <div className="mt-8 space-y-3"> */}
      {/*               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider"> */}
      {/*                 Issue Description */}
      {/*               </label> */}
      {/*               <textarea */}
      {/*                 value={tempNote} */}
      {/*                 onChange={(e) => setTempNote(e.target.value)} */}
      {/*                 rows={4} */}
      {/*                 className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none" */}
      {/*                 placeholder="e.g., Faulty RAM, No display..." */}
      {/*               /> */}
      {/*               <div className="flex gap-3"> */}
      {/*                 <button */}
      {/*                   onClick={() => handleNoteSave(selectedPCId)} */}
      {/*                   className="flex-1 py-2 bg-indigo-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700" */}
      {/*                 > */}
      {/*                   OK */}
      {/*                 </button> */}
      {/*                 <button */}
      {/*                   onClick={handleNoteCancel} */}
      {/*                   className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-slate-300" */}
      {/*                 > */}
      {/*                   Cancel */}
      {/*                 </button> */}
      {/*               </div> */}
      {/*             </div> */}
      {/*           )} */}
      {/*         </> */}
      {/*       ) : ( */}
      {/*         <div className="space-y-6"> */}
      {/*           <div className="bg-white rounded-md border border-zinc-200 p-6"> */}
      {/*             <div className="flex items-center justify-between mb-4"> */}
      {/*               <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider"> */}
      {/*                 Current Status */}
      {/*               </span> */}
      {/*               <div */}
      {/*                 className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${currentSelectedPC.status === "available" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`} */}
      {/*               > */}
      {/*                 {currentSelectedPC.status === "available" */}
      {/*                   ? "Available" */}
      {/*                   : "Issue Reported"} */}
      {/*               </div> */}
      {/*             </div> */}
      {/*             {currentSelectedPC.status === "unavailable" && ( */}
      {/*               <div className="border-t border-zinc-100 pt-4 mt-2"> */}
      {/*                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2"> */}
      {/*                   Issue Description */}
      {/*                 </span> */}
      {/*                 <div className="bg-slate-50 p-4 rounded-md border border-zinc-200"> */}
      {/*                   <p className="text-sm font-medium text-slate-700"> */}
      {/*                     {currentSelectedPC.referenceNote || */}
      {/*                       "No description provided."} */}
      {/*                   </p> */}
      {/*                 </div> */}
      {/*               </div> */}
      {/*             )} */}
      {/*             {currentSelectedPC.status === "available" && ( */}
      {/*               <div className="mt-4 text-center py-6"> */}
      {/*                 <CheckCircle */}
      {/*                   size={32} */}
      {/*                   className="mx-auto text-emerald-500 mb-2" */}
      {/*                 /> */}
      {/*                 <p className="text-xs text-slate-500"> */}
      {/*                   This PC is operational and ready for use. */}
      {/*                 </p> */}
      {/*               </div> */}
      {/*             )} */}
      {/*           </div> */}
      {/*         </div> */}
      {/*       )} */}
      {/*     </div> */}
      {/*     {isEditSidebar && ( */}
      {/*       <div className="pt-8 border-t border-slate-200 mt-auto"> */}
      {/*         <p className="text-[9px] font-black text-rose-400 uppercase mb-4 tracking-widest"> */}
      {/*           REMOVE PC SELECTION */}
      {/*         </p> */}
      {/*         <button */}
      {/*           onClick={() => handleDeletePC(selectedPCId)} */}
      {/*           disabled={isDeletingPC === selectedPCId} */}
      {/*           className="w-full flex items-center justify-center gap-2 p-5 bg-rose-50 text-rose-600 rounded-md border border-rose-100 hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group disabled:opacity-50" */}
      {/*         > */}
      {/*           {isDeletingPC === selectedPCId ? ( */}
      {/*             <Loader2 size={16} className="animate-spin" /> */}
      {/*           ) : ( */}
      {/*             <Trash2 */}
      {/*               size={16} */}
      {/*               className="group-hover:animate-bounce" */}
      {/*             /> */}
      {/*           )} */}
      {/*           REMOVE PC */}
      {/*         </button> */}
      {/*       </div> */}
      {/*     )} */}
      {/*     <button */}
      {/*       onClick={() => setSidebarOpen(false)} */}
      {/*       className="mt-6 w-full py-3 bg-slate-200 text-slate-700 rounded-md text-[10px] font-black uppercase tracking-wider hover:bg-slate-300 transition-all" */}
      {/*     > */}
      {/*       Close */}
      {/*     </button> */}
      {/*   </div> */}
      {/* )} */}
    </>
  );
};
