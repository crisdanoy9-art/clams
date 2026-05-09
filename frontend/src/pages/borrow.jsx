import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Monitor,
  Calendar,
  MessageSquare,
  ArrowLeftRight,
  BookOpen,
  History,
  RefreshCw,
  Filter,
  ChevronRight,
  AlertCircle,
  Printer,
  MousePointer2,
  Key,
} from "lucide-react";

const STATUS_STYLES = {
  borrowed: "bg-amber-50 text-amber-700",
  returned: "bg-emerald-50 text-emerald-700",
  overdue: "bg-red-50 text-red-600",
  cancelled: "bg-slate-100 text-slate-500",
};

const STATUS_LABELS = {
  borrowed: "Borrowed",
  returned: "Returned",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

// Mock data for equipment and peripherals
const MOCK_EQUIPMENT = [
  {
    id: 1,
    name: "Desktop Computer",
    asset_tag: "A-001",
    lab: "CCS Lab 1",
    status: "working",
    available: true,
  },
  {
    id: 2,
    name: "Desktop Computer",
    asset_tag: "A-002",
    lab: "CCS Lab 1",
    status: "working",
    available: true,
  },
  {
    id: 3,
    name: "Projector",
    asset_tag: "A-003",
    lab: "CCS Lab 2",
    status: "working",
    available: true,
  },
  {
    id: 4,
    name: "Laptop",
    asset_tag: "A-004",
    lab: "Research Lab",
    status: "working",
    available: false,
  },
  {
    id: 5,
    name: "UPS",
    asset_tag: "A-005",
    lab: "CCS Lab 3",
    status: "working",
    available: true,
  },
  {
    id: 6,
    name: "Switch",
    asset_tag: "A-006",
    lab: "Network Lab",
    status: "working",
    available: true,
  },
];

const MOCK_PERIPHERALS = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    asset_tag: "P-001",
    lab: "CCS Lab 1",
    working_count: 12,
    damaged_count: 2,
    available: 12,
  },
  {
    id: 2,
    name: "Wireless Mouse",
    asset_tag: "P-002",
    lab: "CCS Lab 1",
    working_count: 25,
    damaged_count: 3,
    available: 25,
  },
  {
    id: 3,
    name: "Document Camera",
    asset_tag: "P-003",
    lab: "CCS Lab 2",
    working_count: 4,
    damaged_count: 1,
    available: 4,
  },
  {
    id: 4,
    name: "Headset",
    asset_tag: "P-004",
    lab: "Research Lab",
    working_count: 8,
    damaged_count: 0,
    available: 8,
  },
  {
    id: 5,
    name: "Microphone",
    asset_tag: "P-005",
    lab: "CCS Lab 3",
    working_count: 3,
    damaged_count: 2,
    available: 3,
  },
  {
    id: 6,
    name: "Laser Printer",
    asset_tag: "P-006",
    lab: "Network Lab",
    working_count: 2,
    damaged_count: 1,
    available: 2,
  },
];

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    transaction_id: "TR-001",
    instructor_id: "user-001",
    instructor_name: "John Doe",
    instructor_email: "john.doe@university.edu",
    equipment_id: 1,
    equipment_name: "Desktop Computer",
    equipment_asset_tag: "A-001",
    peripheral_id: null,
    peripheral_name: null,
    quantity: 1,
    borrower_name: "John Doe",
    status: "borrowed",
    borrow_date: "2026-05-08 10:30:00",
    expected_return_date: "2026-05-15 10:30:00",
    actual_return_date: null,
    remarks: "Need for research project",
  },
  {
    id: 2,
    transaction_id: "TR-002",
    instructor_id: "user-001",
    instructor_name: "John Doe",
    instructor_email: "john.doe@university.edu",
    equipment_id: null,
    equipment_name: null,
    equipment_asset_tag: null,
    peripheral_id: 2,
    peripheral_name: "Wireless Mouse",
    quantity: 2,
    borrower_name: "John Doe",
    status: "borrowed",
    borrow_date: "2026-05-09 09:00:00",
    expected_return_date: "2026-05-16 09:00:00",
    actual_return_date: null,
    remarks: "For lab activity",
  },
  {
    id: 3,
    transaction_id: "TR-003",
    instructor_id: "user-002",
    instructor_name: "Jane Smith",
    instructor_email: "jane.smith@university.edu",
    equipment_id: 3,
    equipment_name: "Projector",
    equipment_asset_tag: "A-003",
    peripheral_id: null,
    peripheral_name: null,
    quantity: 1,
    borrower_name: "Jane Smith",
    status: "returned",
    borrow_date: "2026-05-05 13:00:00",
    expected_return_date: "2026-05-12 13:00:00",
    actual_return_date: "2026-05-11 15:30:00",
    remarks: "Used for presentation",
  },
  {
    id: 4,
    transaction_id: "TR-004",
    instructor_id: "user-001",
    instructor_name: "John Doe",
    instructor_email: "john.doe@university.edu",
    equipment_id: 5,
    equipment_name: "UPS",
    equipment_asset_tag: "A-005",
    peripheral_id: null,
    peripheral_name: null,
    quantity: 1,
    borrower_name: "John Doe",
    status: "returned",
    borrow_date: "2026-05-01 08:00:00",
    expected_return_date: "2026-05-08 08:00:00",
    actual_return_date: "2026-05-07 16:00:00",
    remarks: "Testing",
  },
  {
    id: 5,
    transaction_id: "TR-005",
    instructor_id: "user-003",
    instructor_name: "Mike Johnson",
    instructor_email: "mike.johnson@university.edu",
    equipment_id: null,
    equipment_name: null,
    equipment_asset_tag: null,
    peripheral_id: 1,
    peripheral_name: "Mechanical Keyboard",
    quantity: 1,
    borrower_name: "Mike Johnson",
    status: "overdue",
    borrow_date: "2026-04-25 14:00:00",
    expected_return_date: "2026-05-02 14:00:00",
    actual_return_date: null,
    remarks: "For student use",
  },
];

export default function BorrowTransactions({ userRole }) {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [instructorView, setInstructorView] = useState("current"); // "current" or "history"

  // New borrow form state
  const [newBorrow, setNewBorrow] = useState({
    item_type: "equipment",
    item_id: "",
    quantity: 1,
    expected_return_date: "",
    remarks: "",
  });

  // Get current user (mock - in real app, this would come from auth context)
  const currentUser = {
    id: "user-001",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: userRole,
  };

  // Filter transactions based on user role and view
  let filteredTransactions = transactions;

  if (userRole === "instructor") {
    const userTransactions = transactions.filter(
      (t) => t.instructor_id === currentUser.id,
    );
    if (instructorView === "current") {
      filteredTransactions = userTransactions.filter(
        (t) => t.status === "borrowed",
      );
    } else if (instructorView === "history") {
      filteredTransactions = userTransactions.filter(
        (t) => t.status !== "borrowed",
      );
    }
  }

  // Apply search and status filters
  const filtered = filteredTransactions.filter((transaction) => {
    const matchSearch =
      transaction.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.equipment_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      false ||
      transaction.peripheral_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      false ||
      transaction.borrower_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || transaction.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calculate statistics
  let stats = {};
  if (userRole === "admin") {
    const borrowedCount = transactions.filter(
      (t) => t.status === "borrowed",
    ).length;
    const returnedCount = transactions.filter(
      (t) => t.status === "returned",
    ).length;
    const overdueCount = transactions.filter(
      (t) => t.status === "overdue",
    ).length;
    stats = {
      borrowedCount,
      returnedCount,
      overdueCount,
      total: transactions.length,
    };
  } else {
    const userTransactions = transactions.filter(
      (t) => t.instructor_id === currentUser.id,
    );
    const currentBorrowed = userTransactions.filter(
      (t) => t.status === "borrowed",
    ).length;
    const totalHistory = userTransactions.filter(
      (t) => t.status !== "borrowed",
    ).length;
    stats = { currentBorrowed, totalHistory };
  }

  const handleReturnItem = (transaction) => {
    if (
      window.confirm(
        `Mark "${transaction.equipment_name || transaction.peripheral_name}" as returned?`,
      )
    ) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transaction.id
            ? {
                ...t,
                status: "returned",
                actual_return_date: new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " "),
              }
            : t,
        ),
      );
    }
  };

  const handleSubmitBorrow = () => {
    if (!newBorrow.item_id || !newBorrow.expected_return_date) {
      alert("Please fill in all required fields");
      return;
    }

    let selectedItem;
    let itemName, itemAssetTag;

    if (newBorrow.item_type === "equipment") {
      selectedItem = MOCK_EQUIPMENT.find(
        (e) => e.id === parseInt(newBorrow.item_id),
      );
      itemName = selectedItem?.name;
      itemAssetTag = selectedItem?.asset_tag;
    } else {
      selectedItem = MOCK_PERIPHERALS.find(
        (p) => p.id === parseInt(newBorrow.item_id),
      );
      itemName = selectedItem?.name;
      itemAssetTag = selectedItem?.asset_tag;
    }

    const newTransaction = {
      id: transactions.length + 1,
      transaction_id: `TR-${String(transactions.length + 1).padStart(3, "0")}`,
      instructor_id: currentUser.id,
      instructor_name: currentUser.name,
      instructor_email: currentUser.email,
      equipment_id:
        newBorrow.item_type === "equipment"
          ? parseInt(newBorrow.item_id)
          : null,
      equipment_name: newBorrow.item_type === "equipment" ? itemName : null,
      equipment_asset_tag:
        newBorrow.item_type === "equipment" ? itemAssetTag : null,
      peripheral_id:
        newBorrow.item_type === "peripheral"
          ? parseInt(newBorrow.item_id)
          : null,
      peripheral_name: newBorrow.item_type === "peripheral" ? itemName : null,
      quantity: parseInt(newBorrow.quantity),
      borrower_name: currentUser.name,
      status: "borrowed",
      borrow_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      expected_return_date: newBorrow.expected_return_date,
      actual_return_date: null,
      remarks: newBorrow.remarks || "No remarks",
    };

    setTransactions((prev) => [...prev, newTransaction]);
    setIsFormOpen(false);
    setNewBorrow({
      item_type: "equipment",
      item_id: "",
      quantity: 1,
      expected_return_date: "",
      remarks: "",
    });
  };

  const openViewModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "borrowed":
        return <Clock size={14} />;
      case "returned":
        return <CheckCircle size={14} />;
      case "overdue":
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  // Get available items for dropdown
  const getAvailableEquipment = () => {
    const borrowedEquipmentIds = transactions
      .filter((t) => t.status === "borrowed" && t.equipment_id)
      .map((t) => t.equipment_id);
    return MOCK_EQUIPMENT.filter(
      (e) => !borrowedEquipmentIds.includes(e.id) && e.available,
    );
  };

  const getAvailablePeripherals = () => {
    const borrowedPeripheralIds = transactions
      .filter((t) => t.status === "borrowed" && t.peripheral_id)
      .map((t) => t.peripheral_id);
    return MOCK_PERIPHERALS.filter(
      (p) => !borrowedPeripheralIds.includes(p.id),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {userRole === "admin" ? "Borrow & Return" : "My Borrowings"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {userRole === "admin"
              ? `${stats.borrowedCount} active borrowings • ${stats.overdueCount} overdue`
              : `${stats.currentBorrowed} active borrowings`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
          {userRole === "instructor" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Borrow Item
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {userRole === "admin" ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Borrowed
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.borrowedCount}
              </p>
              <p className="text-xs text-slate-400">Active borrowings</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Returned
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.returnedCount}
              </p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Overdue
              </p>
              <p className="text-2xl font-bold text-red-600">
                {stats.overdueCount}
              </p>
              <p className="text-xs text-slate-400">Past due date</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <ClipboardList size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Total
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-400">All transactions</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <BookOpen size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Current Borrowed
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.currentBorrowed}
              </p>
              <p className="text-xs text-slate-400">Items in your possession</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <History size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Borrow History
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalHistory}
              </p>
              <p className="text-xs text-slate-400">Completed transactions</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructor View Tabs */}
      {userRole === "instructor" && (
        <div className="flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setInstructorView("current")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              instructorView === "current"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              Current Borrowings
            </div>
          </button>
          <button
            onClick={() => setInstructorView("history")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              instructorView === "history"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <History size={16} />
              Borrow History
            </div>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Transaction ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Item
                </th>
                {userRole === "admin" && (
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Borrower
                  </th>
                )}
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Qty
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Borrow Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Expected Return
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={userRole === "admin" ? 8 : 7}
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    No borrow transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                      {transaction.transaction_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          {transaction.equipment_id ? (
                            <Monitor size={15} className="text-blue-500" />
                          ) : (
                            <MousePointer2
                              size={15}
                              className="text-blue-500"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {transaction.equipment_name ||
                              transaction.peripheral_name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            {transaction.equipment_asset_tag ||
                              transaction.peripheral_name?.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={12} className="text-slate-500" />
                          </div>
                          <span className="text-sm text-slate-600">
                            {transaction.instructor_name}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {transaction.borrow_date.split(" ")[0]}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {transaction.expected_return_date.split(" ")[0]}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[transaction.status]}`}
                      >
                        {getStatusIcon(transaction.status)}
                        {STATUS_LABELS[transaction.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(transaction)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {userRole === "instructor" &&
                          transaction.status === "borrowed" && (
                            <button
                              onClick={() => handleReturnItem(transaction)}
                              className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                              title="Mark as Returned"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Transaction Modal */}
      {isViewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Transaction Details
                </h2>
                <p className="text-sm text-slate-500 font-mono">
                  {selectedTransaction.transaction_id}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <XCircle size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Item
                  </label>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    {selectedTransaction.equipment_name ||
                      selectedTransaction.peripheral_name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedTransaction.equipment_asset_tag ||
                      "Peripheral Item"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Quantity
                  </label>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    {selectedTransaction.quantity}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Borrower
                  </label>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTransaction.borrower_name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedTransaction.instructor_email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[selectedTransaction.status]}`}
                    >
                      {getStatusIcon(selectedTransaction.status)}
                      {STATUS_LABELS[selectedTransaction.status]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Borrow Date
                  </label>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTransaction.borrow_date}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Expected Return Date
                  </label>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTransaction.expected_return_date}
                  </p>
                </div>
              </div>

              {selectedTransaction.actual_return_date && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Actual Return Date
                  </label>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTransaction.actual_return_date}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Remarks
                </label>
                <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-3 rounded-lg">
                  {selectedTransaction.remarks || "No remarks provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Borrow Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Borrow Item</h2>
              <p className="text-sm text-slate-500">
                Fill out the form to borrow equipment
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Item Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="equipment"
                      checked={newBorrow.item_type === "equipment"}
                      onChange={(e) =>
                        setNewBorrow({
                          ...newBorrow,
                          item_type: e.target.value,
                          item_id: "",
                        })
                      }
                      className="w-4 h-4 text-slate-900"
                    />
                    <span className="text-sm text-slate-700">Equipment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="peripheral"
                      checked={newBorrow.item_type === "peripheral"}
                      onChange={(e) =>
                        setNewBorrow({
                          ...newBorrow,
                          item_type: e.target.value,
                          item_id: "",
                        })
                      }
                      className="w-4 h-4 text-slate-900"
                    />
                    <span className="text-sm text-slate-700">Peripheral</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Select{" "}
                  {newBorrow.item_type === "equipment"
                    ? "Equipment"
                    : "Peripheral"}{" "}
                  *
                </label>
                <select
                  value={newBorrow.item_id}
                  onChange={(e) =>
                    setNewBorrow({ ...newBorrow, item_id: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                >
                  <option value="">Select an item</option>
                  {(newBorrow.item_type === "equipment"
                    ? getAvailableEquipment()
                    : getAvailablePeripherals()
                  ).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (
                      {item.asset_tag || `Available: ${item.working_count}`}) -{" "}
                      {item.lab}
                    </option>
                  ))}
                </select>
                {(newBorrow.item_type === "equipment"
                  ? getAvailableEquipment()
                  : getAvailablePeripherals()
                ).length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No available items to borrow
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  max={newBorrow.item_type === "equipment" ? 1 : 10}
                  value={newBorrow.quantity}
                  onChange={(e) =>
                    setNewBorrow({ ...newBorrow, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                />
                {newBorrow.item_type === "equipment" && (
                  <p className="text-xs text-slate-400 mt-1">
                    Equipment can only be borrowed one at a time
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Expected Return Date *
                </label>
                <input
                  type="datetime-local"
                  value={newBorrow.expected_return_date}
                  onChange={(e) =>
                    setNewBorrow({
                      ...newBorrow,
                      expected_return_date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Standard borrowing period is 7 days
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Remarks
                </label>
                <textarea
                  value={newBorrow.remarks}
                  onChange={(e) =>
                    setNewBorrow({ ...newBorrow, remarks: e.target.value })
                  }
                  rows={3}
                  placeholder="Purpose of borrowing, special instructions, etc."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBorrow}
                disabled={
                  (newBorrow.item_type === "equipment"
                    ? getAvailableEquipment()
                    : getAvailablePeripherals()
                  ).length === 0
                }
                className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Borrow Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
