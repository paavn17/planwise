// TaskForm.tsx
'use client';

import { useEffect, useState } from 'react';

export interface TaskFormData {
  title: string;
  description: string;
  category: string[];
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Completed';
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  initialData?: TaskFormData;
  mode?: 'create' | 'edit';
}

const availableCategories = [
  'Coding', 'Design', 'Sports', 'Learning', 'Work',
  'Personal', 'Health', 'Finance', 'Travel', 'Shopping',
  'Chores', 'Fitness', 'Reading', 'Volunteering',
];

export default function TaskForm({ onSubmit, onCancel, initialData, mode = 'create' }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(initialData || {
    title: '',
    description: '',
    category: [],
    priority: 'Medium',
    dueDate: '',
    status: 'To Do',
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

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
      case 'To Do': return 'from-blue-500 to-blue-600';
      case 'In Progress': return 'from-purple-500 to-purple-600';
      case 'Completed': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white border border-gray-200 relative scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 via-purple-100/10 to-green-100/10 animate-pulse pointer-events-none" />

        <div className="relative z-10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              {mode === 'edit' ? 'Edit Task' : 'Create New Task'}
            </h2>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-800">
            {/* Task Title */}
            <div>
              <label className="block mb-1">Task Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter title..."
                className="w-full p-3 rounded bg-white border border-gray-300 placeholder-gray-500 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Enter details..."
                className="w-full p-3 rounded bg-white border border-gray-300 placeholder-gray-500 text-sm resize-none"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block mb-1">Categories</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableCategories.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer
                      ${formData.category.includes(cat)
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}
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
                        ? 'bg-gradient-to-r from-blue-400 to-purple-400 border-blue-400'
                        : 'border-gray-400'}`}>
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

            {/* Priority and Status */}
           {/* Priority and Status with Radio Buttons */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Priority */}
  <div>
    <label className="block mb-2 text-sm font-medium">Priority</label>
    <div className="flex flex-col gap-2">
      {['High', 'Medium', 'Low'].map((priority) => (
        <label
          key={priority}
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border
            ${formData.priority === priority
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}
        >
          <input
            type="radio"
            name="priority"
            value={priority}
            checked={formData.priority === priority}
            onChange={handleChange}
            className="h-4 w-4 cursor-pointer"
          />
          {priority === 'High' && '🔥 High'}
          {priority === 'Medium' && '⚡ Medium'}
          {priority === 'Low' && '🌱 Low'}
        </label>
      ))}
    </div>
  </div>

  {/* Status */}
  <div>
    <label className="block mb-2 text-sm font-medium">Status</label>
    <div className="flex flex-col gap-2">
      {['To Do', 'In Progress', 'Completed'].map((status) => (
        <label
          key={status}
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border
            ${formData.status === status
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}
        >
          <input
            type="radio"
            name="status"
            value={status}
            checked={formData.status === status}
            onChange={handleChange}
            className="h-4 w-4 cursor-pointer"
          />
          {status === 'To Do' && '📋 To Do'}
          {status === 'In Progress' && '⚡ In Progress'}
          {status === 'Completed' && '✅ Completed'}
        </label>
      ))}
    </div>
  </div>
</div>


            {/* Due Date */}
            <div>
              <label className="block mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-white border border-gray-300 text-sm cursor-pointer"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2 rounded bg-gray-200 border border-gray-300 text-gray-700 hover:text-black text-sm"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold text-sm
                  hover:from-green-500 hover:to-blue-500 transition-all transform hover:scale-105 active:scale-95"
              >
                {mode === 'edit' ? '✏️ Update Task' : '✨ Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
