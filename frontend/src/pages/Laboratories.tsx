import React, { useState, useEffect } from 'react';
import { CircleDot, X, Monitor, Info, Edit3, Save, AlertCircle, CheckCircle, FileText, Sidebar, Plus, Trash2 } from 'lucide-react';

// Define types
type PCStatus = 'available' | 'unavailable';

interface PC {
  id: number;
  status: PCStatus;
  referenceNote?: string;
}

interface Lab {
  id: number;
  name: string;
  room: string;
  pcs: number;
  avail: number;
  issues: number;
  pcsData: PC[];
}

// Initial PC data generator
const generateInitialPCs = (totalCount: number, initialIssues: number): PC[] => {
  return Array.from({ length: totalCount }, (_, i) => {
    const isUnavailable = i < initialIssues;
    return {
      id: i + 1,
      status: isUnavailable ? 'unavailable' : 'available',
      referenceNote: isUnavailable ? 'Hardware malfunction' : undefined,
    };
  });
};

// Initial labs data
const initialLabs: Lab[] = [
  { 
    id: 1, name: 'Lab 1', room: 'Room 101', pcs: 30, avail: 28, issues: 2, 
    pcsData: generateInitialPCs(30, 2) 
  },
  { 
    id: 2, name: 'Lab 2', room: 'Room 102', pcs: 28, avail: 24, issues: 4, 
    pcsData: generateInitialPCs(28, 4) 
  },
  { 
    id: 3, name: 'Lab 3', room: 'Room 103', pcs: 20, avail: 15, issues: 5, 
    pcsData: generateInitialPCs(20, 5) 
  },
];

const Laboratories: React.FC = () => {
  const [labsData, setLabsData] = useState<Lab[]>(initialLabs);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPCId, setSelectedPCId] = useState<number | null>(null);
  const [editingPCs, setEditingPCs] = useState<PC[]>([]);

  // Load editing PCs when modal opens or selected lab changes
  useEffect(() => {
    if (selectedLab) {
      setEditingPCs(JSON.parse(JSON.stringify(selectedLab.pcsData)));
      setEditMode(false);
      setSidebarOpen(false);
      setSelectedPCId(null);
    }
  }, [selectedLab]);

  // Update lab statistics based on editingPCs
  const updateStatistics = (pcsData: PC[]) => {
    const available = pcsData.filter(pc => pc.status === 'available').length;
    const issues = pcsData.filter(pc => pc.status === 'unavailable').length;
    return { available, issues, total: pcsData.length };
  };

  // Handle PC status change
  const handleStatusChange = (pcId: number, newStatus: PCStatus, referenceNote?: string) => {
    setEditingPCs(prev => prev.map(pc => 
      pc.id === pcId 
        ? { 
            ...pc, 
            status: newStatus,
            referenceNote: newStatus === 'unavailable' ? (referenceNote || pc.referenceNote || 'No reason provided') : undefined
          }
        : pc
    ));
  };

  // Handle reference note change
  const handleReferenceChange = (pcId: number, note: string) => {
    setEditingPCs(prev => prev.map(pc => 
      pc.id === pcId && pc.status === 'unavailable'
        ? { ...pc, referenceNote: note }
        : pc
    ));
  };

  // Add a new PC
  const handleAddPC = () => {
    const maxId = editingPCs.length > 0 ? Math.max(...editingPCs.map(pc => pc.id)) : 0;
    const newId = maxId + 1;
    const newPC: PC = {
      id: newId,
      status: 'available',
    };
    setEditingPCs(prev => [...prev, newPC]);
    // Auto-select the new PC for editing in sidebar
    setSelectedPCId(newId);
    setSidebarOpen(true);
  };

  // Delete a PC
  const handleDeletePC = (pcId: number) => {
    const pcToDelete = editingPCs.find(pc => pc.id === pcId);
    if (!pcToDelete) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${getPCName(pcId)}? This action cannot be undone.`);
    if (confirmDelete) {
      setEditingPCs(prev => prev.filter(pc => pc.id !== pcId));
      if (selectedPCId === pcId) {
        setSelectedPCId(null);
        if (sidebarOpen) setSidebarOpen(false);
      }
    }
  };

  // Save all changes
  const handleSaveChanges = () => {
    if (!selectedLab) return;
    const { available, issues, total } = updateStatistics(editingPCs);
    const updatedLab = {
      ...selectedLab,
      pcs: total,
      avail: available,
      issues: issues,
      pcsData: editingPCs,
    };
    setLabsData(prev => prev.map(lab => lab.id === selectedLab.id ? updatedLab : lab));
    setSelectedLab(updatedLab);
    setEditMode(false);
    setSidebarOpen(false);
    setSelectedPCId(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (selectedLab) {
      setEditingPCs(JSON.parse(JSON.stringify(selectedLab.pcsData)));
      setEditMode(false);
      setSidebarOpen(false);
      setSelectedPCId(null);
    }
  };

  const selectedPC = selectedPCId ? editingPCs.find(pc => pc.id === selectedPCId) : null;
  const getPCName = (id: number) => `PC-${id.toString().padStart(2, '0')}`;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Laboratories</h2>
      </div>

      {/* Lab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {labsData.map((lab) => (
          <div
            key={lab.id}
            onClick={() => setSelectedLab(lab)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{lab.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{lab.room}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <CircleDot className="text-emerald-500 w-2 h-2 fill-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-4">
              <div>
                <p className="text-2xl font-bold text-slate-800">{lab.pcs}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{lab.avail}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">READY</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-500">{lab.issues}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ISSUES</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL SECTION --- */}
      {selectedLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedLab.name} - Unit Status</h3>
                <p className="text-sm text-slate-500">Inventory breakdown for {selectedLab.room}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Edit Mode Toggle Button */}
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-indigo-600 hover:text-indigo-700"
                    title="Enable editing"
                  >
                    <Edit3 size={20} />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveChanges}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => setSelectedLab(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body with Optional Sidebar */}
            <div className="flex flex-1 overflow-hidden">
              {/* Main PC Grid Area */}
              <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${sidebarOpen ? 'pr-2' : ''}`}>
                {/* Legend & Controls Bar */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                  <div className="flex gap-6 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-slate-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-slate-600">Unavailable / Issue</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {editMode && (
                      <>
                        <button
                          onClick={handleAddPC}
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          <Plus size={14} /> Add PC
                        </button>
                        <button
                          onClick={() => setSidebarOpen(!sidebarOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                        >
                          <Sidebar size={14} />
                          {sidebarOpen ? 'Hide Details' : 'Show Details'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* PC Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                  {editingPCs.map((pc) => {
                    const isAvailable = pc.status === 'available';
                    return (
                      <div 
                        key={pc.id} 
                        className={`relative flex flex-col items-center gap-1 transition-all duration-200 group/pc ${
                          editMode ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => {
                          if (editMode) {
                            setSelectedPCId(pc.id);
                            setSidebarOpen(true);
                          }
                        }}
                      >
                        {/* Delete button (visible on hover in edit mode) */}
                        {editMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePC(pc.id);
                            }}
                            className="absolute -top-2 -right-2 z-10 p-1 bg-white rounded-full shadow-md text-rose-500 hover:text-rose-700 opacity-0 group-hover/pc:opacity-100 transition-opacity"
                            title="Delete PC"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <div className={`p-2 rounded-lg transition-all duration-300 relative ${
                          isAvailable 
                            ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' 
                            : 'bg-rose-50 text-rose-500 border border-rose-100'
                        } ${editMode ? 'hover:shadow-md hover:scale-105' : ''}`}>
                          <Monitor size={24} strokeWidth={isAvailable ? 2 : 1.5} />
                          {editMode && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border border-white"></div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{getPCName(pc.id)}</span>
                        {!isAvailable && pc.referenceNote && !editMode && (
                          <div className="text-[8px] text-rose-400 text-center max-w-[60px] truncate" title={pc.referenceNote}>
                            📝 {pc.referenceNote.substring(0, 15)}
                          </div>
                        )}
                        {editMode && (
                          <div className="text-[8px] text-indigo-500 mt-0.5">Click to edit</div>
                        )}
                      </div>
                    );
                  })}
                </div>

            
              </div>

              {/* Sidebar Panel for Editing PC Details */}
              {sidebarOpen && editMode && selectedPC && (
                <div className="w-80 border-l border-slate-200 bg-slate-50/80 p-5 overflow-y-auto flex-shrink-0 animate-in slide-in-from-right duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Edit {getPCName(selectedPC.id)}</h4>
                    <button
                      onClick={() => setSelectedPCId(null)}
                      className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Status Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">STATUS</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatusChange(selectedPC.id, 'available')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-all ${
                            selectedPC.status === 'available'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">Available</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedPC.id, 'unavailable', selectedPC.referenceNote || 'Needs attention')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-all ${
                            selectedPC.status === 'unavailable'
                              ? 'bg-rose-50 border-rose-300 text-rose-700'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <AlertCircle size={16} />
                          <span className="text-sm font-medium">Unavailable</span>
                        </button>
                      </div>
                    </div>

                    {/* Reference Note (only for unavailable) */}
                    {selectedPC.status === 'unavailable' && (
                      <div className="animate-in fade-in duration-200">
                        <label className="block text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                          <FileText size={12} /> REFERENCE NOTE / REASON
                        </label>
                        <textarea
                          value={selectedPC.referenceNote || ''}
                          onChange={(e) => handleReferenceChange(selectedPC.id, e.target.value)}
                          placeholder="Enter reason for unavailability (e.g., broken screen, network issue, under repair)..."
                          rows={4}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          This reference will appear in lab logs and reports.
                        </p>
                      </div>
                    )}

                    {/* Quick Stats for this PC */}
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Unit Information</p>
                      <div className="bg-white rounded-lg p-3 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Unit ID:</span>
                          <span className="font-mono font-bold">{getPCName(selectedPC.id)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Lab:</span>
                          <span>{selectedLab.name} ({selectedLab.room})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Current Status:</span>
                          <span className={selectedPC.status === 'available' ? 'text-emerald-600' : 'text-rose-600'}>
                            {selectedPC.status === 'available' ? '✓ Available' : '✗ Unavailable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="text-xs text-slate-400">
                {editMode ? (
                  <span>✏️ Editing mode active. Click "Save" to apply changes.</span>
                ) : (
                  <span> Total: {selectedLab.pcs} units | {selectedLab.avail} available | {selectedLab.issues} with issues</span>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedLab(null)}
                  className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2">
                  <Info size={16} /> View Lab Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laboratories;