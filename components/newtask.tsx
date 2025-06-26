'use client';

import { useState } from 'react';

export interface TaskFormData {
  title: string;
  description: string;
  category: string[];
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Not Started' | 'To Do' | 'In Progress' | 'Completed';
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
}

const availableCategories = [
  'Coding', 'Design', 'Sports', 'Learning', 'Work',
  'Personal', 'Health', 'Finance', 'Travel', 'Shopping',
  'Chores', 'Fitness', 'Reading', 'Volunteering',
];

export default function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: [],
    priority: 'Medium',
    dueDate: '',
    status: 'Not Started',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'from-red-500 to-red-600';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Yet Started': return 'from-gray-500 to-gray-600';
      case 'To Do': return 'from-blue-500 to-blue-600';
      case 'In Progress': return 'from-purple-500 to-purple-600';
      case 'Completed': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50 relative scrollbar-thin scrollbar-track-zinc-800/50 scrollbar-thumb-zinc-600/50 hover:scrollbar-thumb-zinc-500/70">
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 animate-pulse pointer-events-none" />
        
        <div className="relative z-10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Create New Task
            </h2>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm text-white">
            <div>
              <label className="block mb-1">Task Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter title..."
                className="w-full p-3 rounded bg-zinc-800/50 border border-zinc-600/50 placeholder-gray-400 text-sm"
              />
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Enter details..."
                className="w-full p-3 rounded bg-zinc-800/50 border border-zinc-600/50 placeholder-gray-400 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block mb-1">Categories</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableCategories.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer
                      ${formData.category.includes(cat)
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 text-blue-200'
                        : 'bg-zinc-800/30 border-zinc-600/50 text-gray-300 hover:bg-zinc-700/50'}`}
                  >
                    <input
                      type="checkbox"
                      value={cat}
                      checked={formData.category.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="sr-only"
                    />
                    <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center
                      ${formData.category.includes(cat)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400'
                        : 'border-zinc-500'}`}>
                      {formData.category.includes(cat) && (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={`w-full p-3 rounded bg-gradient-to-r ${getPriorityColor(formData.priority)}
                    border border-zinc-600/50 text-sm`}
                >
                  <option value="High">🔥 High</option>
                  <option value="Medium">⚡ Medium</option>
                  <option value="Low">🌱 Low</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full p-3 rounded bg-gradient-to-r ${getStatusColor(formData.status)}
                    border border-zinc-600/50 text-sm`}
                >
                  <option value="Not Yet Started">⏸️ Not Yet Started</option>
                  <option value="To Do">📋 To Do</option>
                  <option value="In Progress">⚡ In Progress</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-zinc-800/50 border border-zinc-600/50 text-sm cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2 rounded bg-zinc-700/50 border border-zinc-600/50 text-gray-300 hover:text-white text-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold text-sm
                  hover:from-green-500 hover:to-blue-500 transition-all transform hover:scale-105 active:scale-95"
              >
                ✨ Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}