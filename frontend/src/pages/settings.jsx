// frontend/src/pages/settings.jsx
import React, { useState, useEffect } from "react";
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
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export default function Settings({ userRole, currentUser }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    id_number: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Mock settings (lab, notifications, appearance – keep as is for now)
  const [labSettings, setLabSettings] = useState({
    labName: "CCS Computer Lab 1",
    labCode: "CCS-LAB-01",
    timezone: "America/New_York",
    dateFormat: "YYYY-MM-DD",
    currency: "USD",
    language: "en",
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "daily",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    maintenanceAlerts: true,
    systemUpdates: false,
    dailyDigest: true,
    reportReady: true,
  });

  const [branding, setBranding] = useState({
    primaryColor: "#0F172A",
    accentColor: "#3B82F6",
    logoUrl: "",
    faviconUrl: "",
    systemName: "Lab Inventory Manager",
  });

  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    slackWebhook: "",
    printerAPI: false,
    emailServer: {
      host: "smtp.university.edu",
      port: "587",
      secure: false,
    },
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Use currentUser prop if available, else fetch from API
      if (currentUser && currentUser.user_id) {
        setProfile({
          first_name: currentUser.first_name || "",
          last_name: currentUser.last_name || "",
          email: currentUser.email || "",
          username: currentUser.username || "",
          id_number: currentUser.id_number || "",
          role: currentUser.role || "",
        });
        setLoading(false);
        return;
      }
      const response = await axiosInstance.get("/auth/me");
      const user = response.data;
      setProfile({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
        id_number: user.id_number || "",
        role: user.role || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const userId =
        currentUser?.user_id ||
        JSON.parse(localStorage.getItem("userData"))?.user_id;
      await axiosInstance.put(`/update/users/${userId}`, {
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
        },
      });
      // Update localStorage and currentUser if needed
      const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
      const updatedUser = {
        ...storedUser,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      if (currentUser) {
        currentUser.first_name = profile.first_name;
        currentUser.last_name = profile.last_name;
        currentUser.email = profile.email;
      }
      toast.success("Profile updated successfully");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }
    setPasswordError("");
    try {
      await axiosInstance.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to change password");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
  ];

  const handleReset = () => {
    fetchUserProfile(); // reload from server
    toast.success("Profile reset to saved values");
  };

  // Profile Settings Tab (dynamic)
  const ProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <User size={32} className="text-slate-400" />
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
            First Name
          </label>
          <input
            type="text"
            value={profile.first_name}
            onChange={(e) => handleProfileChange("first_name", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            value={profile.last_name}
            onChange={(e) => handleProfileChange("last_name", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleProfileChange("email", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={profile.username}
            disabled
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            ID Number
          </label>
          <input
            type="text"
            value={profile.id_number}
            disabled
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Role
          </label>
          <input
            type="text"
            value={profile.role === "admin" ? "Administrator" : "Instructor"}
            disabled
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Profile
        </button>
      </div>
    </div>
  );

  // Security Settings Tab (Password change)
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
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 pr-10"
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
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Confirm new password"
            />
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleChangePassword}
            className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition"
          >
            Update Password
          </button>
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
          <button className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-700">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );

  // Notification Settings (unchanged UI, keep as is)
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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emailNotifications ? "bg-slate-900" : "bg-slate-200"}`}
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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.lowStockAlerts ? "bg-slate-900" : "bg-slate-200"}`}
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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.maintenanceAlerts ? "bg-slate-900" : "bg-slate-200"}`}
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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.dailyDigest ? "bg-slate-900" : "bg-slate-200"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.dailyDigest ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );

  // Appearance Settings (unchanged UI)
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
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "appearance":
        return <AppearanceSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your profile and preferences
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
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Reset
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
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${activeTab === tab.id ? "bg-slate-50 text-slate-900 font-medium border-l-2 border-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
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
