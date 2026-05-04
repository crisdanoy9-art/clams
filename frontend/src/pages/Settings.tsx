// Settings.tsx
import React from "react";
import { AlertTriangle, User, Bell, Settings as SettingsIcon } from "lucide-react";

// Error boundary for the settings page
class SettingsErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Settings Error</h2>
          <p className="text-red-700">Something went wrong loading settings. Please refresh.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Settings: React.FC = () => {
  return (
    <SettingsErrorBoundary>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
              <p className="text-slate-500 text-sm">Manage your account and system preferences</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Profile Settings */}
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-800">Profile Settings</h2>
              </div>
              <p className="text-slate-500 text-sm mb-4">Update your personal information and account details.</p>
              <div className="bg-slate-50 rounded-xl p-4 text-slate-400 text-sm italic">
                Profile management features coming soon...
              </div>
            </div>

            {/* Notifications */}
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
              </div>
              <p className="text-slate-500 text-sm mb-4">Configure how you receive alerts and updates.</p>
              <div className="bg-slate-50 rounded-xl p-4 text-slate-400 text-sm italic">
                Notification preferences coming soon...
              </div>
            </div>

            {/* System Preferences */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon size={18} className="text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-800">System Preferences</h2>
              </div>
              <p className="text-slate-500 text-sm mb-4">Customize system behavior and display options.</p>
              <div className="bg-slate-50 rounded-xl p-4 text-slate-400 text-sm italic">
                System configuration coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsErrorBoundary>
  );
};

export default Settings;