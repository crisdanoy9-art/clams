import { useState } from "react";
import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-stone-100">
      <NavBar onToggle={() => setSidebarOpen((p) => !p)} />

      <div className="flex flex-1 overflow-hidden">
        <SideBar isOpen={sidebarOpen} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
              Dashboard
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Welcome back — here's what's happening today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Revenue",
                value: "$48,295",
                delta: "+12.5%",
                up: true,
              },
              {
                label: "Active Users",
                value: "3,842",
                delta: "+4.1%",
                up: true,
              },
              { label: "New Orders", value: "284", delta: "-2.3%", up: false },
              { label: "Conversion", value: "5.6%", delta: "+0.8%", up: true },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl border border-stone-200 p-5"
              >
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
                  {s.label}
                </p>
                <p className="text-2xl font-semibold text-stone-800 tracking-tight">
                  {s.value}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${s.up ? "text-emerald-600" : "text-red-500"}`}
                >
                  {s.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="text-sm font-semibold text-stone-700 mb-4">
                Recent Activity
              </h2>
              <ul className="divide-y divide-stone-100">
                {[
                  {
                    user: "Alice Chen",
                    action: "placed a new order",
                    time: "2 min ago",
                  },
                  {
                    user: "Marco Silva",
                    action: "updated their profile",
                    time: "14 min ago",
                  },
                  {
                    user: "Priya Nair",
                    action: "submitted a support ticket",
                    time: "1 hr ago",
                  },
                  {
                    user: "Tom Hargreaves",
                    action: "completed onboarding",
                    time: "3 hr ago",
                  },
                  {
                    user: "Yuki Tanaka",
                    action: "upgraded to Pro",
                    time: "Yesterday",
                  },
                ].map((item) => (
                  <li key={item.user} className="flex items-center gap-3 py-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center shrink-0">
                      {item.user[0]}
                    </div>
                    <p className="flex-1 text-sm text-stone-500 truncate">
                      <span className="font-medium text-stone-800">
                        {item.user}
                      </span>{" "}
                      {item.action}
                    </p>
                    <span className="text-xs text-stone-400 shrink-0">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="text-sm font-semibold text-stone-700 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "New Report", icon: "📄" },
                  { label: "Invite User", icon: "👤" },
                  { label: "Export Data", icon: "📤" },
                  { label: "Settings", icon: "⚙️" },
                ].map((a) => (
                  <button
                    key={a.label}
                    className="flex flex-col items-center gap-2 p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 transition-colors cursor-pointer"
                  >
                    <span className="text-xl">{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
