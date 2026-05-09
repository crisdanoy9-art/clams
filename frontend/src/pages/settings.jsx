import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Monitor,
  Printer,
  Wifi,
  Clock,
  Palette,
  Globe,
  Database,
  Save,
  RefreshCw,
  Key,
  Mail,
  Phone,
  MapPin,
  Building,
  Users,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Moon,
  Sun,
  Eye,
  EyeOff,
  HardDrive,
  Trash2,
  Download,
  Upload,
  Lock,
  Smartphone,
  Settings as SettingsIcon,
} from "lucide-react";

// Mock data for settings
const MOCK_USER_PROFILE = {
  name: "John Doe",
  email: "john.doe@university.edu",
  role: "Lab Administrator",
  department: "Computer Science",
  phone: "+1 (555) 123-4567",
  office: "CCS Building, Room 301",
  avatar: null,
};

const MOCK_LAB_SETTINGS = {
  labName: "CCS Computer Lab 1",
  labCode: "CCS-LAB-01",
  timezone: "America/New_York",
  dateFormat: "YYYY-MM-DD",
  currency: "USD",
  language: "en",
  maintenanceMode: false,
  autoBackup: true,
  backupFrequency: "daily",
};

const MOCK_NOTIFICATION_SETTINGS = {
  emailNotifications: true,
  lowStockAlerts: true,
  maintenanceAlerts: true,
  systemUpdates: false,
  dailyDigest: true,
  reportReady: true,
};

const MOCK_BRANDING_SETTINGS = {
  primaryColor: "#0F172A",
  accentColor: "#3B82F6",
  logoUrl: "",
  faviconUrl: "",
  systemName: "Lab Inventory Manager",
};

const MOCK_INTEGRATION_SETTINGS = {
  googleCalendar: false,
  slackWebhook: "",
  printerAPI: false,
  emailServer: {
    host: "smtp.university.edu",
    port: "587",
    secure: false,
  },
};

export default function Settings({ userRole }) {
  const [activeTab, setActiveTab] = useState("general");
  const [profile, setProfile] = useState(MOCK_USER_PROFILE);
  const [labSettings, setLabSettings] = useState(MOCK_LAB_SETTINGS);
  const [notifications, setNotifications] = useState(
    MOCK_NOTIFICATION_SETTINGS,
  );
  const [branding, setBranding] = useState(MOCK_BRANDING_SETTINGS);
  const [integrations, setIntegrations] = useState(MOCK_INTEGRATION_SETTINGS);
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Tabs configuration - FIXED: using SettingsIcon instead of Settings
  const tabs = [
    { id: "general", label: "General", icon: <SettingsIcon size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "integration", label: "Integrations", icon: <Globe size={18} /> },
    { id: "backup", label: "Backup & Data", icon: <Database size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
  ];

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setProfile(MOCK_USER_PROFILE);
    setLabSettings(MOCK_LAB_SETTINGS);
    setNotifications(MOCK_NOTIFICATION_SETTINGS);
    setBranding(MOCK_BRANDING_SETTINGS);
    setIntegrations(MOCK_INTEGRATION_SETTINGS);
  };

  // General Settings Tab
  const GeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Laboratory Information
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Manage your lab's basic settings and preferences
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Lab Name
            </label>
            <input
              type="text"
              value={labSettings.labName}
              onChange={(e) =>
                setLabSettings({ ...labSettings, labName: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Lab Code
            </label>
            <input
              type="text"
              value={labSettings.labCode}
              onChange={(e) =>
                setLabSettings({ ...labSettings, labCode: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Timezone
            </label>
            <select
              value={labSettings.timezone}
              onChange={(e) =>
                setLabSettings({ ...labSettings, timezone: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Date Format
            </label>
            <select
              value={labSettings.dateFormat}
              onChange={(e) =>
                setLabSettings({ ...labSettings, dateFormat: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Maintenance Mode
            </h3>
            <p className="text-sm text-slate-500">
              Prevent users from accessing the system during maintenance
            </p>
          </div>
          <button
            onClick={() =>
              setLabSettings({
                ...labSettings,
                maintenanceMode: !labSettings.maintenanceMode,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              labSettings.maintenanceMode ? "bg-slate-900" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                labSettings.maintenanceMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  // Profile Settings Tab
  const ProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={32} className="text-slate-400" />
          )}
        </div>
        <div>
          <button className="text-sm font-medium text-slate-900 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition">
            Change Avatar
          </button>
          <p className="text-xs text-slate-400 mt-1">
            JPG, PNG or GIF. Max 2MB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Role
          </label>
          <input
            type="text"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Department
          </label>
          <input
            type="text"
            value={profile.department}
            onChange={(e) =>
              setProfile({ ...profile, department: e.target.value })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Office Location
          </label>
          <input
            type="text"
            value={profile.office}
            onChange={(e) => setProfile({ ...profile, office: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>
      </div>
    </div>
  );

  // Notification Settings Tab
  const NotificationSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="font-medium text-slate-900">Email Notifications</p>
          <p className="text-xs text-slate-500">
            Receive system notifications via email
          </p>
        </div>
        <button
          onClick={() =>
            setNotifications({
              ...notifications,
              emailNotifications: !notifications.emailNotifications,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications.emailNotifications ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailNotifications ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="font-medium text-slate-900">Low Stock Alerts</p>
          <p className="text-xs text-slate-500">
            Get notified when inventory is running low
          </p>
        </div>
        <button
          onClick={() =>
            setNotifications({
              ...notifications,
              lowStockAlerts: !notifications.lowStockAlerts,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications.lowStockAlerts ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.lowStockAlerts ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="font-medium text-slate-900">Maintenance Alerts</p>
          <p className="text-xs text-slate-500">
            Equipment maintenance reminders and updates
          </p>
        </div>
        <button
          onClick={() =>
            setNotifications({
              ...notifications,
              maintenanceAlerts: !notifications.maintenanceAlerts,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications.maintenanceAlerts ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.maintenanceAlerts ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="font-medium text-slate-900">Daily Digest</p>
          <p className="text-xs text-slate-500">
            Receive a summary of daily activities
          </p>
        </div>
        <button
          onClick={() =>
            setNotifications({
              ...notifications,
              dailyDigest: !notifications.dailyDigest,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications.dailyDigest ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.dailyDigest ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );

  // Security Settings Tab
  const SecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Change Password
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Update your password to keep your account secure
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition pr-10"
                placeholder="Enter current password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-slate-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition">
            Enable 2FA
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Session Management
            </h3>
            <p className="text-sm text-slate-500">
              View and manage active sessions
            </p>
          </div>
          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
            Log out all devices
          </button>
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone size={16} className="text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Chrome on Windows
                </p>
                <p className="text-xs text-slate-400">
                  New York, USA • Last active 2 minutes ago
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Current
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Integration Settings Tab
  const IntegrationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Globe size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">
              Google Calendar Integration
            </p>
            <p className="text-xs text-slate-500">
              Sync maintenance schedules with Google Calendar
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            setIntegrations({
              ...integrations,
              googleCalendar: !integrations.googleCalendar,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            integrations.googleCalendar ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${integrations.googleCalendar ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Printer size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">
              Print Server Integration
            </p>
            <p className="text-xs text-slate-500">
              Connect to your lab's print server
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            setIntegrations({
              ...integrations,
              printerAPI: !integrations.printerAPI,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            integrations.printerAPI ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${integrations.printerAPI ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          Slack Webhook URL
        </label>
        <input
          type="text"
          value={integrations.slackWebhook}
          onChange={(e) =>
            setIntegrations({ ...integrations, slackWebhook: e.target.value })
          }
          placeholder="https://hooks.slack.com/services/..."
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
        />
        <p className="text-xs text-slate-400 mt-1">
          Receive notifications in your Slack channel
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Email Server Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              SMTP Host
            </label>
            <input
              type="text"
              value={integrations.emailServer.host}
              onChange={(e) =>
                setIntegrations({
                  ...integrations,
                  emailServer: {
                    ...integrations.emailServer,
                    host: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              SMTP Port
            </label>
            <input
              type="text"
              value={integrations.emailServer.port}
              onChange={(e) =>
                setIntegrations({
                  ...integrations,
                  emailServer: {
                    ...integrations.emailServer,
                    port: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Backup & Data Tab
  const BackupSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="font-medium text-slate-900">Automatic Backups</p>
          <p className="text-xs text-slate-500">
            Regularly backup your data to prevent loss
          </p>
        </div>
        <button
          onClick={() =>
            setLabSettings({
              ...labSettings,
              autoBackup: !labSettings.autoBackup,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            labSettings.autoBackup ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${labSettings.autoBackup ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      {labSettings.autoBackup && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Backup Frequency
          </label>
          <select
            value={labSettings.backupFrequency}
            onChange={(e) =>
              setLabSettings({
                ...labSettings,
                backupFrequency: e.target.value,
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
          <Download size={16} />
          Export Data
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
          <Upload size={16} />
          Import Data
        </button>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="bg-amber-50 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Danger Zone</p>
              <p className="text-xs text-amber-700 mt-1">
                Permanently delete all lab data. This action cannot be undone.
              </p>
              <button className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
                <Trash2 size={14} />
                Delete All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Appearance Tab
  const AppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Theme Settings
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Customize the look and feel of your dashboard
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-slate-900 transition">
            <div className="w-full h-24 bg-slate-900 rounded-lg mb-3 flex items-center justify-center">
              <Sun size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-slate-900 text-center">
              Light Mode
            </p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-slate-900 transition">
            <div className="w-full h-24 bg-slate-900 rounded-lg mb-3 flex items-center justify-center">
              <Moon size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-slate-900 text-center">
              Dark Mode
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          Primary Color
        </label>
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-lg bg-slate-900 border-2 border-slate-200 cursor-pointer" />
          <div className="w-10 h-10 rounded-lg bg-blue-600 border-2 border-slate-200 cursor-pointer" />
          <div className="w-10 h-10 rounded-lg bg-emerald-600 border-2 border-slate-200 cursor-pointer" />
          <div className="w-10 h-10 rounded-lg bg-purple-600 border-2 border-slate-200 cursor-pointer" />
          <input
            type="color"
            value={branding.primaryColor}
            className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          System Name
        </label>
        <input
          type="text"
          value={branding.systemName}
          onChange={(e) =>
            setBranding({ ...branding, systemName: e.target.value })
          }
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "profile":
        return <ProfileSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      case "integration":
        return <IntegrationSettings />;
      case "backup":
        return <BackupSettings />;
      case "appearance":
        return <AppearanceSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your laboratory system preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-sm text-emerald-700">Settings saved!</span>
            </div>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={16} />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-slate-50 text-slate-900 font-medium border-l-2 border-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                <ChevronRight
                  size={14}
                  className={`${activeTab === tab.id ? "opacity-100" : "opacity-0"} transition-opacity`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
