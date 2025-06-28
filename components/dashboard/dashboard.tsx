'use client';

import OverviewCards from "./overview";
import TaskCalendar from "./calendar/calendar";
import HighPriorityTasks from "./prioritytasks";
import TaskSummary from "./tasksummary";
// import TodaysTasks from './components/TodaysTasks';
// import CompletedTasks from './components/CompletedTasks';

const DashboardPage = () => {
  return (
    <div className="p-6 w-full max-w-7xl mx-auto text-white space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Top: Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCards/>
      </div>

      {/* Middle: Calendar + High Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskCalendar/>
        </div>
        <div>
          <HighPriorityTasks/>
        </div>
      </div>

      {/* Bottom: Today’s Tasks + Recently Completed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskSummary/>
      </div>
    </div>
  );
};

export default DashboardPage;
