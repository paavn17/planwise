'use client';

import OverviewCards from "./overview";
import TaskCalendar from "./calendar/calendar";
import HighPriorityTasks from "./prioritytasks";
import TaskSummary from "./tasksummary";
import Quote from "./motivationCard";
import FocusTimer from "./timer";

const DashboardPage = () => {
  return (
    <div className="p-6 w-full max-w-7xl mx-auto text-gray-900 bg-gray-50 space-y-8 min-h-screen">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Row 1: Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCards />
      </div>

      {/* Row 2: Calendar Left, Right Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Calendar and Task Summary */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <TaskCalendar />
          <TaskSummary />
        </div>

        {/* Right Side: Quote and High Priority Tasks */}
        <div className="flex flex-col gap-6">
          <Quote />
          <HighPriorityTasks />
          <FocusTimer/>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
