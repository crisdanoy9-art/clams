// Local Storage Service - Replaces API calls

export interface User {
  id: number;
  id_number: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'instructor';
  lab_id?: number;
  password?: string;
}

export interface Laboratory {
  id: number;
  name: string;
  location: string;
  total_pcs: number;
}

export interface Equipment {
  id: number;
  lab_id: number;
  category_id: number;
  name: string;
  serial_number: string;
  status: string;
  quantity: number;
  quantity_available: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Peripheral {
  id: number;
  lab_id: number;
  type: string;
  total_count: number;
  working_count: number;
  damaged_count: number;
}

export interface BorrowTransaction {
  id: number;
  equipment_id: number;
  equipment_name?: string;
  borrower_name: string;
  quantity_borrowed: number;
  borrow_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  status: 'Borrowed' | 'Returned';
}

export interface DamageReport {
  id: number;
  equipment_id: number;
  equipment_name?: string;
  description: string;
  status: 'Pending' | 'Under Repair' | 'Resolved';
  date_reported: string;
  reported_by?: string;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  target_table: string;
  target_id: number;
  performed_at: string;
}

// Initialize default data
const initializeData = () => {
  // Laboratories
  if (!localStorage.getItem('laboratories')) {
    localStorage.setItem('laboratories', JSON.stringify([
      { id: 1, name: 'Laboratory 1', location: 'CCS Building - Room 101', total_pcs: 30 },
      { id: 2, name: 'Laboratory 2', location: 'CCS Building - Room 102', total_pcs: 28 },
      { id: 3, name: 'Laboratory 3', location: 'CCS Building - Room 103', total_pcs: 28 }
    ]));
  }

  // Categories
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify([
      { id: 1, name: 'Workstations', description: 'Desktop computers' },
      { id: 2, name: 'Peripherals', description: 'Monitors, keyboards, mice' },
      { id: 3, name: 'Networking Devices', description: 'Routers, switches' }
    ]));
  }

  // Equipment
  if (!localStorage.getItem('equipment')) {
    localStorage.setItem('equipment', JSON.stringify([
      { id: 1, lab_id: 1, category_id: 1, name: 'Dell OptiPlex 7080', serial_number: 'PC-LAB1-001', status: 'Available', quantity: 1, quantity_available: 1 },
      { id: 2, lab_id: 1, category_id: 1, name: 'Dell OptiPlex 7080', serial_number: 'PC-LAB1-002', status: 'Available', quantity: 1, quantity_available: 1 },
      { id: 3, lab_id: 1, category_id: 2, name: 'Dell Monitor', serial_number: 'MON-LAB1-001', status: 'Available', quantity: 1, quantity_available: 1 },
      { id: 4, lab_id: 2, category_id: 1, name: 'HP EliteDesk', serial_number: 'PC-LAB2-001', status: 'Borrowed', quantity: 1, quantity_available: 0 }
    ]));
  }

  // Peripherals
  if (!localStorage.getItem('peripherals')) {
    localStorage.setItem('peripherals', JSON.stringify([
      { id: 1, lab_id: 1, type: 'Monitor', total_count: 30, working_count: 28, damaged_count: 2 },
      { id: 2, lab_id: 1, type: 'Keyboard', total_count: 30, working_count: 29, damaged_count: 1 },
      { id: 3, lab_id: 2, type: 'Monitor', total_count: 28, working_count: 26, damaged_count: 2 }
    ]));
  }

  // Borrow Transactions
  if (!localStorage.getItem('borrow_transactions')) {
    localStorage.setItem('borrow_transactions', JSON.stringify([
      { id: 1, equipment_id: 4, borrower_name: 'Maria Santos', quantity_borrowed: 1, borrow_date: '2026-05-01', expected_return_date: '2026-05-08', status: 'Borrowed' }
    ]));
  }

  // Damage Reports
  if (!localStorage.getItem('damage_reports')) {
    localStorage.setItem('damage_reports', JSON.stringify([
      { id: 1, equipment_id: 3, description: 'Screen flickering issue', status: 'Pending', date_reported: '2026-05-01' }
    ]));
  }

  // Users
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      { id: 1, id_number: 'ADMIN-001', username: 'admin', password: 'admin123', first_name: 'System', last_name: 'Administrator', email: 'admin@clams.com', role: 'admin' },
      { id: 2, id_number: 'INST-001', username: 'instructor', password: 'pass123', first_name: 'John', last_name: 'Instructor', email: 'instructor@clams.com', role: 'instructor', lab_id: 1 }
    ]));
  }

  // Activity Logs
  if (!localStorage.getItem('activity_logs')) {
    localStorage.setItem('activity_logs', JSON.stringify([
      { id: 1, user_id: 1, user_name: 'System Administrator', action: 'LOGIN', target_table: 'users', target_id: 1, performed_at: new Date().toISOString() }
    ]));
  }
};

// Call initialize
initializeData();

// Helper functions
const getNextId = (items: any[]): number => {
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
};

const addActivityLog = (userId: number, userName: string, action: string, targetTable: string, targetId: number) => {
  const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
  const newLog = {
    id: getNextId(logs),
    user_id: userId,
    user_name: userName,
    action,
    target_table: targetTable,
    target_id: targetId,
    performed_at: new Date().toISOString()
  };
  logs.push(newLog);
  localStorage.setItem('activity_logs', JSON.stringify(logs));
};

// Auth Service
export const authService = {
  async login(username: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      addActivityLog(user.id, `${user.first_name} ${user.last_name}`, 'LOGIN', 'users', user.id);
      return {
        success: true,
        data: {
          token: 'local-token-' + Date.now(),
          user: { ...user, password: undefined }
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'local-token-' + Date.now());
  }
};

// Laboratory Service
export const laboratoryService = {
  async getAll() {
    return JSON.parse(localStorage.getItem('laboratories') || '[]');
  },
  async getSummary() {
    const labs = JSON.parse(localStorage.getItem('laboratories') || '[]');
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    return labs.map((lab: any) => ({
      lab_id: lab.id,
      lab_name: lab.name,
      location: lab.location,
      total_pcs: lab.total_pcs,
      total_equipment: equipment.filter((e: any) => e.lab_id === lab.id).length,
      available_equipment: equipment.filter((e: any) => e.lab_id === lab.id && e.status === 'Available').length,
      borrowed_equipment: equipment.filter((e: any) => e.lab_id === lab.id && e.status === 'Borrowed').length,
      damaged_equipment: equipment.filter((e: any) => e.lab_id === lab.id && (e.status === 'Under Repair' || e.status === 'Damaged')).length,
      under_repair: 0
    }));
  }
};

// Equipment Service
export const equipmentService = {
  async getAll() {
    return JSON.parse(localStorage.getItem('equipment') || '[]');
  },
  async create(data: any) {
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const newItem = { ...data, id: getNextId(equipment) };
    equipment.push(newItem);
    localStorage.setItem('equipment', JSON.stringify(equipment));
    addActivityLog(1, 'Admin', 'ADD_EQUIPMENT', 'equipment', newItem.id);
    return newItem;
  },
  async update(id: number, data: any) {
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const index = equipment.findIndex((e: any) => e.id === id);
    if (index !== -1) {
      equipment[index] = { ...equipment[index], ...data };
      localStorage.setItem('equipment', JSON.stringify(equipment));
      addActivityLog(1, 'Admin', 'UPDATE_EQUIPMENT', 'equipment', id);
      return equipment[index];
    }
    throw new Error('Equipment not found');
  },
  async delete(id: number) {
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const filtered = equipment.filter((e: any) => e.id !== id);
    localStorage.setItem('equipment', JSON.stringify(filtered));
    addActivityLog(1, 'Admin', 'DELETE_EQUIPMENT', 'equipment', id);
  }
};

// Category Service
export const categoryService = {
  async getAll() {
    return JSON.parse(localStorage.getItem('categories') || '[]');
  }
};

// Peripheral Service
export const peripheralService = {
  async getAll() {
    return JSON.parse(localStorage.getItem('peripherals') || '[]');
  }
};

// Borrow Service
export const borrowService = {
  async getAll() {
    const transactions = JSON.parse(localStorage.getItem('borrow_transactions') || '[]');
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    return transactions.map((t: any) => ({
      ...t,
      equipment_name: equipment.find((e: any) => e.id === t.equipment_id)?.name
    }));
  },
  async getActive() {
    const transactions = JSON.parse(localStorage.getItem('borrow_transactions') || '[]');
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    return transactions.filter((t: any) => t.status === 'Borrowed').map((t: any) => ({
      ...t,
      equipment_name: equipment.find((e: any) => e.id === t.equipment_id)?.name
    }));
  },
  async create(data: any) {
    const transactions = JSON.parse(localStorage.getItem('borrow_transactions') || '[]');
    const newTransaction = {
      ...data,
      id: getNextId(transactions),
      borrow_date: new Date().toISOString().split('T')[0],
      status: 'Borrowed'
    };
    transactions.push(newTransaction);
    localStorage.setItem('borrow_transactions', JSON.stringify(transactions));
    
    // Update equipment availability
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const equipIndex = equipment.findIndex((e: any) => e.id === data.equipment_id);
    if (equipIndex !== -1) {
      equipment[equipIndex].quantity_available -= data.quantity_borrowed;
      if (equipment[equipIndex].quantity_available === 0) {
        equipment[equipIndex].status = 'Borrowed';
      }
      localStorage.setItem('equipment', JSON.stringify(equipment));
    }
    
    addActivityLog(1, 'Admin', 'BORROW_EQUIPMENT', 'borrow_transactions', newTransaction.id);
    return newTransaction;
  },
  async returnItem(id: number, actualReturnDate: string) {
    const transactions = JSON.parse(localStorage.getItem('borrow_transactions') || '[]');
    const index = transactions.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      transactions[index].status = 'Returned';
      transactions[index].actual_return_date = actualReturnDate;
      localStorage.setItem('borrow_transactions', JSON.stringify(transactions));
      
      // Update equipment availability
      const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
      const equipIndex = equipment.findIndex((e: any) => e.id === transactions[index].equipment_id);
      if (equipIndex !== -1) {
        equipment[equipIndex].quantity_available += transactions[index].quantity_borrowed;
        equipment[equipIndex].status = 'Available';
        localStorage.setItem('equipment', JSON.stringify(equipment));
      }
      
      addActivityLog(1, 'Admin', 'RETURN_EQUIPMENT', 'borrow_transactions', id);
      return transactions[index];
    }
    throw new Error('Transaction not found');
  }
};

// Damage Service
export const damageService = {
  async getAll() {
    return JSON.parse(localStorage.getItem('damage_reports') || '[]');
  },
  async getPending() {
    const reports = JSON.parse(localStorage.getItem('damage_reports') || '[]');
    return reports.filter((r: any) => r.status !== 'Resolved');
  },
  async create(data: any) {
    const reports = JSON.parse(localStorage.getItem('damage_reports') || '[]');
    const newReport = {
      ...data,
      id: getNextId(reports),
      status: 'Pending',
      date_reported: new Date().toISOString().split('T')[0]
    };
    reports.push(newReport);
    localStorage.setItem('damage_reports', JSON.stringify(reports));
    
    // Update equipment status
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const equipIndex = equipment.findIndex((e: any) => e.id === data.equipment_id);
    if (equipIndex !== -1) {
      equipment[equipIndex].status = 'Damaged';
      localStorage.setItem('equipment', JSON.stringify(equipment));
    }
    
    addActivityLog(1, 'Admin', 'SUBMIT_REPORT', 'damage_reports', newReport.id);
    return newReport;
  },
  async updateStatus(id: number, status: string) {
    const reports = JSON.parse(localStorage.getItem('damage_reports') || '[]');
    const index = reports.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      reports[index].status = status;
      localStorage.setItem('damage_reports', JSON.stringify(reports));
      
      // If resolved, update equipment status
      if (status === 'Resolved') {
        const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
        const equipIndex = equipment.findIndex((e: any) => e.id === reports[index].equipment_id);
        if (equipIndex !== -1) {
          equipment[equipIndex].status = 'Available';
          localStorage.setItem('equipment', JSON.stringify(equipment));
        }
      }
      
      addActivityLog(1, 'Admin', 'UPDATE_DAMAGE_STATUS', 'damage_reports', id);
      return reports[index];
    }
    throw new Error('Report not found');
  }
};

// User Service
export const userService = {
  async getAll() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter((u: any) => u.role !== 'admin').map((u: any) => ({ ...u, password: undefined }));
  },
  async create(data: any) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      ...data,
      id: getNextId(users),
      role: data.role || 'instructor'
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    addActivityLog(1, 'Admin', 'CREATE_USER', 'users', newUser.id);
    return { ...newUser, password: undefined };
  },
  async delete(id: number) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filtered = users.filter((u: any) => u.id !== id);
    localStorage.setItem('users', JSON.stringify(filtered));
    addActivityLog(1, 'Admin', 'DELETE_USER', 'users', id);
  }
};

// Log Service
export const logService = {
  async getAll() {
    return JSON.parse(localStorage.getItem('activity_logs') || '[]');
  }
};