import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, RotateCcw, Search, User, Package, Calendar, 
  X, AlertCircle, CheckCircle, Clock, Layers, Users, BookOpen, 
  Repeat, ArrowLeftRight, HardDrive
} from 'lucide-react';

interface Item {
  id: number;
  name: string;
  total: number;
  available: number;
  category: string;
  model?: string;
  laboratory?: string;
}

interface Transaction {
  id: number;
  itemId: number;
  borrowerName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Borrowed' | 'Returned';
}

interface BorrowReturnProps {
  role: 'admin' | 'instructor';
}

const BorrowReturn: React.FC<BorrowReturnProps> = ({ role }) => {
  // ---------- STATE ----------
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Logitech Headset', total: 8, available: 5, category: 'Audio', model: 'H390', laboratory: 'Laboratory 1' },
    { id: 2, name: 'VGA Adapter', total: 4, available: 2, category: 'Adapter', model: 'UGREEN', laboratory: 'Laboratory 2' },
    { id: 3, name: 'Webcam C922', total: 6, available: 3, category: 'Video', model: 'Logitech C922', laboratory: 'Laboratory 1' },
    { id: 4, name: 'HDMI Cable', total: 10, available: 7, category: 'Cable', model: '6ft', laboratory: 'Laboratory 3' },
    { id: 5, name: 'Wireless Mouse', total: 12, available: 9, category: 'Peripheral', model: 'MX Master 3', laboratory: 'Laboratory 2' },
    { id: 6, name: 'Tripod Stand', total: 3, available: 2, category: 'Equipment', model: 'Amazon Basics', laboratory: 'Laboratory 1' },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 101, itemId: 1, borrowerName: 'Johannes Leo', borrowDate: '2026-04-27', dueDate: '2026-04-30', status: 'Borrowed' },
    { id: 102, itemId: 2, borrowerName: 'Bernadette M.', borrowDate: '2026-04-25', dueDate: '2026-04-28', status: 'Borrowed' },
    { id: 103, itemId: 3, borrowerName: 'James Lovell', borrowDate: '2026-04-28', dueDate: '2026-05-01', status: 'Borrowed' },
    { id: 104, itemId: 4, borrowerName: 'Sarah Chen', borrowDate: '2026-04-26', dueDate: '2026-04-29', status: 'Borrowed' },
    { id: 105, itemId: 5, borrowerName: 'Michael Torres', borrowDate: '2026-04-20', dueDate: '2026-04-23', returnDate: '2026-04-22', status: 'Returned' },
    { id: 106, itemId: 6, borrowerName: 'Emma Watson', borrowDate: '2026-04-18', dueDate: '2026-04-21', returnDate: '2026-04-20', status: 'Returned' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'borrowing' | 'returning'>('borrowing');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [returnDate, setReturnDate] = useState('');
  
  const [borrowForm, setBorrowForm] = useState({
    itemId: '',
    borrowerName: '',
    dueDate: '',
  });
  const [assetForm, setAssetForm] = useState({
    assetName: '',
    model: '',
    laboratory: '',
    initialStatus: 'Available',
    stockQuantity: 1,
  });
  const [formError, setFormError] = useState('');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredByMode = transactions.filter(t => 
    viewMode === 'borrowing' ? t.status === 'Borrowed' : t.status === 'Returned'
  );

  const displayedTransactions = filteredByMode
    .map(t => ({
      ...t,
      itemName: items.find(i => i.id === t.itemId)?.name || 'Unknown Item',
    }))
    .filter(t => t.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()));

  const getItemById = (itemId: number) => items.find(i => i.id === itemId);

  const totalItems = items.reduce((sum, i) => sum + i.total, 0);
  const totalAvailable = items.reduce((sum, i) => sum + i.available, 0);
  const activeBorrows = transactions.filter(t => t.status !== 'Returned').length;
  const totalReturns = transactions.filter(t => t.status === 'Returned').length;

  // Open return modal
  const openReturnModal = (transactionId: number) => {
    if (role !== 'instructor') return;
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || transaction.status === 'Returned') return;
    setSelectedTransactionId(transactionId);
    setReturnDate(new Date().toISOString().split('T')[0]);
    setShowReturnModal(true);
  };

  const confirmReturn = () => {
    if (selectedTransactionId === null) return;
    const transaction = transactions.find(t => t.id === selectedTransactionId);
    if (!transaction || transaction.status === 'Returned') return;

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === transaction.itemId
          ? { ...item, available: Math.min(item.available + 1, item.total) }
          : item
      )
    );

    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === selectedTransactionId 
          ? { ...t, status: 'Returned', returnDate: returnDate } 
          : t
      )
    );

    const itemName = getItemById(transaction.itemId)?.name;
    alert(`✅ "${itemName}" has been returned successfully. Return date: ${formatDate(returnDate)}`);
    setShowReturnModal(false);
    setSelectedTransactionId(null);
  };

  const handleNewBorrow = () => {
    if (role !== 'instructor') return;
    setBorrowForm({ itemId: '', borrowerName: '', dueDate: '' });
    setFormError('');
    setShowBorrowModal(true);
  };

  const submitBorrow = () => {
    if (!borrowForm.itemId) {
      setFormError('Please select an item');
      return;
    }
    if (!borrowForm.borrowerName.trim()) {
      setFormError('Please enter borrower name');
      return;
    }
    if (!borrowForm.dueDate) {
      setFormError('Please select due date');
      return;
    }

    const itemId = parseInt(borrowForm.itemId);
    const selectedItem = items.find(i => i.id === itemId);
    
    if (!selectedItem) {
      setFormError('Invalid item selected');
      return;
    }
    if (selectedItem.available <= 0) {
      setFormError(`"${selectedItem.name}" is currently out of stock. No available units.`);
      return;
    }

    const dueDateObj = new Date(borrowForm.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDateObj < today) {
      setFormError('Due date cannot be in the past');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      itemId: itemId,
      borrowerName: borrowForm.borrowerName.trim(),
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: borrowForm.dueDate,
      status: 'Borrowed',
    };

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, available: item.available - 1 } : item
      )
    );

    setTransactions(prev => [...prev, newTransaction]);
    setShowBorrowModal(false);
    alert(`✅ "${selectedItem.name}" borrowed by ${borrowForm.borrowerName}. Due: ${formatDate(borrowForm.dueDate)}`);
  };

  // --- New Asset Registration (matches screenshot) ---
  const handleAddAsset = () => {
    setAssetForm({
      assetName: '',
      model: '',
      laboratory: '',
      initialStatus: 'Available',
      stockQuantity: 1,
    });
    setFormError('');
    setShowAssetModal(true);
  };

  const submitAsset = () => {
    if (!assetForm.assetName.trim()) {
      setFormError('Asset name is required');
      return;
    }
    if (!assetForm.model.trim()) {
      setFormError('Model is required');
      return;
    }
    if (!assetForm.laboratory.trim()) {
      setFormError('Please assign a laboratory');
      return;
    }
    if (assetForm.stockQuantity < 1) {
      setFormError('Stock quantity must be at least 1');
      return;
    }

    const newId = Math.max(...items.map(i => i.id), 0) + 1;
    const quantity = assetForm.stockQuantity;
    const available = assetForm.initialStatus === 'Available' ? quantity : 0;

    const newItem: Item = {
      id: newId,
      name: assetForm.assetName.trim(),
      total: quantity,
      available: available,
      category: 'Misc',
      model: assetForm.model.trim(),
      laboratory: assetForm.laboratory.trim(),
    };

    setItems(prev => [...prev, newItem]);
    setShowAssetModal(false);
    alert(`✅ Added ${quantity} new asset(s): ${assetForm.assetName} (${assetForm.model}) to ${assetForm.laboratory} with status "${assetForm.initialStatus}"`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => [...prev]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Borrow & Return</h2>
          <p className="text-xs font-bold text-slate-400">Track movement of lab accessories and equipment</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddAsset}
            className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            <Plus size={18} /> Add New Asset
          </button>
          {role === 'instructor' && (
            <button
              onClick={handleNewBorrow}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
            >
              <Plus size={18} /> New Borrow Entry
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Inventory</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{totalItems}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Layers className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Available Now</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{totalAvailable}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Package className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Borrows</p>
              <p className="text-3xl font-black text-amber-600 mt-1">{activeBorrows}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Users className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Completed Returns</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{totalReturns}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Repeat className="text-slate-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table with View Toggle */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-indigo-600" size={18} />
            <span className="font-black text-slate-700 text-[10px] uppercase tracking-widest">
              {viewMode === 'borrowing' ? 'Borrowing Records' : 'Return History'}
            </span>
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-1 rounded-full">
              {displayedTransactions.length} {viewMode === 'borrowing' ? 'active' : 'returned'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('borrowing')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === 'borrowing' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ArrowLeftRight size={12} />
                Borrowing
              </button>
              <button
                onClick={() => setViewMode('returning')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewMode === 'returning' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Repeat size={12} />
                Returning
              </button>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search borrower name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-[0.15em]">
                <th className="px-8 py-5">Borrower</th>
                <th className="px-8 py-5">Equipment / Item</th>
                <th className="px-8 py-5">Borrow Date</th>
                {viewMode === 'returning' && <th className="px-8 py-5">Actual Return Date</th>}
                <th className="px-8 py-5">Status</th>
                {role === 'instructor' && viewMode === 'borrowing' && <th className="px-8 py-5 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="text-xs font-bold text-slate-600 divide-y divide-slate-50">
              {displayedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={(() => {
                    let cols = 4;
                    if (viewMode === 'returning') cols++;
                    if (role === 'instructor' && viewMode === 'borrowing') cols++;
                    return cols;
                  })()} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <BookOpen size={32} className="opacity-50" />
                      <p className="text-xs font-bold">
                        {viewMode === 'borrowing' ? 'No active borrow records' : 'No return records yet'}
                      </p>
                      {role === 'instructor' && viewMode === 'borrowing' && (
                        <button onClick={handleNewBorrow} className="mt-2 text-indigo-600 text-[10px] font-black uppercase tracking-wider hover:underline">
                          + Create new borrow entry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          <User size={14} />
                        </div>
                        <span className="text-slate-900">{t.borrowerName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-slate-300" />
                        {t.itemName}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} />
                        {formatDate(t.borrowDate)}
                      </div>
                    </td>
                    {viewMode === 'returning' && (
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={14} />
                          {t.returnDate ? formatDate(t.returnDate) : '—'}
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-5">
                      {viewMode === 'borrowing' ? (
                        <span className="px-4 py-1.5 rounded-full text-[9px] uppercase font-black tracking-tighter bg-indigo-100 text-indigo-600 flex items-center gap-1 w-fit">
                          <Clock size={10} /> Returning
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 rounded-full text-[9px] uppercase font-black tracking-tighter bg-emerald-100 text-emerald-600 flex items-center gap-1 w-fit">
                          <CheckCircle size={10} /> Returned
                        </span>
                      )}
                    </td>
                    {role === 'instructor' && viewMode === 'borrowing' && (
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => openReturnModal(t.id)}
                          className="flex items-center gap-2 ml-auto text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white"
                        >
                          <RotateCcw size={14} />
                          <span className="text-[10px] uppercase font-black">Return Item</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Status Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Package size={14} /> Real-time Inventory Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-black text-slate-800 text-sm">{item.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.model} • {item.laboratory}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-slate-800">{item.available}<span className="text-xs font-bold text-slate-400">/{item.total}</span></p>
                <p className="text-[9px] font-bold text-slate-400">available</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Borrow Modal */}
      {showBorrowModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Plus className="text-indigo-600" size={20} />
                <h3 className="font-black text-slate-800 text-lg">New Borrow Entry</h3>
              </div>
              <button onClick={() => setShowBorrowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-600" />
                  <p className="text-rose-700 text-xs font-bold">{formError}</p>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Select Equipment</label>
                <select
                  value={borrowForm.itemId}
                  onChange={(e) => setBorrowForm({ ...borrowForm, itemId: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose an item...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id} disabled={item.available === 0}>
                      {item.name} ({item.model}) - {item.available} available {item.available === 0 ? '(Out of stock)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Borrower Name</label>
                <input
                  type="text"
                  value={borrowForm.borrowerName}
                  onChange={(e) => setBorrowForm({ ...borrowForm, borrowerName: e.target.value })}
                  placeholder="Full name"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Due Date (Expected Return)</label>
                <input
                  type="date"
                  value={borrowForm.dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBorrowForm({ ...borrowForm, dueDate: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[9px] text-slate-400 mt-1">Recommended: 3-7 days from today</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button onClick={() => setShowBorrowModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={submitBorrow} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Confirm Borrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Date Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RotateCcw className="text-indigo-600" size={20} />
                <h3 className="font-black text-slate-800 text-lg">Confirm Return</h3>
              </div>
              <button onClick={() => setShowReturnModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Actual Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[9px] text-slate-400 mt-1">Select the date when the item was actually returned.</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button onClick={() => setShowReturnModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={confirmReturn} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Asset Modal - matches screenshot exactly */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HardDrive className="text-emerald-600" size={20} />
                <h3 className="font-black text-slate-800 text-lg">Register New Asset(s)</h3>
              </div>
              <button onClick={() => setShowAssetModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-600" />
                  <p className="text-rose-700 text-xs font-bold">{formError}</p>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">ASSET NAME</label>
                <input
                  type="text"
                  value={assetForm.assetName}
                  onChange={(e) => setAssetForm({ ...assetForm, assetName: e.target.value })}
                  placeholder="e.g. Dell, Logitech, HP"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">MODEL</label>
                <input
                  type="text"
                  value={assetForm.model}
                  onChange={(e) => setAssetForm({ ...assetForm, model: e.target.value })}
                  placeholder="e.g. Optiplex 7080, G-Pro Mouse"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">ASSIGN TO LABORATORY</label>
                <select
                  value={assetForm.laboratory}
                  onChange={(e) => setAssetForm({ ...assetForm, laboratory: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select laboratory</option>
                  <option value="Laboratory 1">Laboratory 1</option>
                  <option value="Laboratory 2">Laboratory 2</option>
                  <option value="Laboratory 3">Laboratory 3</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">INITIAL STATUS</label>
                <select
                  value={assetForm.initialStatus}
                  onChange={(e) => setAssetForm({ ...assetForm, initialStatus: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Broken">Broken</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">STOCK QUANTITY</label>
                <input
                  type="number"
                  min="1"
                  value={assetForm.stockQuantity}
                  onChange={(e) => setAssetForm({ ...assetForm, stockQuantity: parseInt(e.target.value) || 1 })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[9px] text-slate-400 mt-1">Creates this many identical assets with the selected status.</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button onClick={() => setShowAssetModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={submitAsset} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                Save Asset(s)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowReturn;