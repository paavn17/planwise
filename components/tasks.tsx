'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import TaskForm, { TaskFormData } from './newtask'

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
};

const dummyTasks: Task[] = [
  {
    id: '1',
    title: 'Learn Arrays in JS',
    description: 'Practice map, filter, reduce functions with real examples.',
    category: 'Coding',
    priority: 'High',
    status: 'To Do',
    dueDate: '2025-06-28',
  },
  {
    id: '2',
    title: 'Read History Chapter 3',
    description: 'Complete the reading and make notes.',
    category: 'History',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2025-06-27',
  },
];

const getPriorityDot = (priority: Task['priority']) => {
  switch (priority) {
    case 'High': return 'bg-red-500';
    case 'Medium': return 'bg-yellow-400';
    case 'Low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'To Do': return 'text-blue-400';
    case 'In Progress': return 'text-yellow-400';
    case 'Completed': return 'text-green-400';
    case 'Not Started': return 'text-gray-400';
    default: return 'text-white';
  }
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = (data: TaskFormData) => {
    const newTask: Task = {
      ...data,
      id: Date.now().toString(),
      category: data.category[0] || 'General', // Use first category or fallback
    };
    setTasks((prev) => [...prev, newTask]);
    setShowForm(false);
  };

  return (
    <div className="p-6 text-white min-h-screen bg-zinc-900 relative">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          className="px-4 py-2 rounded-md bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring focus:ring-white/20"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-semibold"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="relative bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex flex-col justify-between shadow-md"
          >
            <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${getPriorityDot(
                  task.priority
                )} shadow-[0_0_8px_2px_rgba(255,255,255,0.3)]`}
                title={`Priority: ${task.priority}`}
              />
              <p className={`text-xs ${getStatusColor(task.status)}`}>{task.status}</p>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">{task.title}</h2>
              <p className="text-base text-gray-300 leading-relaxed mb-4">{task.description}</p>

              <div className="flex flex-wrap gap-2 text-xs text-white/80">
                <span className="bg-indigo-600 px-2 py-1 rounded-full">
                  {task.category}
                </span>
                <span className="bg-zinc-700 px-2 py-1 rounded-full">
                  Due: {task.dueDate}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 text-sm transition">
                <Pencil size={16} /> Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-sm transition">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center mt-10 text-gray-400">No tasks found.</div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
