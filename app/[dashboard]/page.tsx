'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TasksPage from '@/components/tasks/tasks';
import ProfilePage from '../profile/page';
import DashboardPage from '@/components/dashboard/dashboard';
import {
  LayoutDashboard,
  ListTodo,
  UserCircle,
} from 'lucide-react';

type Tab = 'dashboard' | 'tasks' | 'profile';

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  component: React.ReactElement;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const router = useRouter();

  const tabs: TabConfig[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={15} />,
      component: <DashboardPage />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <ListTodo size={15} />,
      component: <TasksPage />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserCircle size={15} />,
      component: <ProfilePage />,
    },
  ];

  const activeComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  const TabButton = ({
    tab,
    isMobile = false,
  }: {
    tab: TabConfig;
    isMobile?: boolean;
  }) => {
    const isActive = activeTab === tab.id;

    return (
      <button
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-3 transition-all duration-200 transform
          ${isMobile ? 'px-4 py-2 rounded-full text-xs sm:text-sm' : 'px-4 py-3 rounded-xl w-full'}
          bg-white text-gray-700 hover:bg-gray-100
        `}
      >
        {/* Icon */}
        <span
          className={`p-2 rounded-md transition-all duration-150
            ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}
          `}
        >
          {tab.icon}
        </span>

        {/* Label (not shown on mobile) */}
        {!isMobile && <span className="font-medium">{tab.label}</span>}
      </button>
    );
  };

  return (
    <div className="flex h-screen text-gray-900 bg-gray-50 overflow-hidden relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-6 left-6 bottom-6 w-50 bg-white border border-gray-200 rounded-3xl p-6 z-50 shadow-xl">
        <h2 className="text-xl font-bold mb-10">PlanWise</h2>
        <nav className="flex flex-col gap-3">
          {tabs.map((tab) => (
            <TabButton key={`desktop-${tab.id}`} tab={tab} />
          ))}
        </nav>
      </aside>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 flex gap-6 z-50 shadow-xl border border-gray-200">
        {tabs.map((tab) => (
          <TabButton key={`mobile-${tab.id}`} tab={tab} isMobile />
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="w-full lg:ml-64 h-full overflow-y-auto">
        <div className="h-full w-full rounded-xl shadow-inner p-4 relative bg-gray-50">
          {activeComponent}
        </div>
      </main>
    </div>
  );
}
