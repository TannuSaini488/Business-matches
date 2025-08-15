import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', completed: false });

  // Fetch tasks from API
  useEffect(() => { fetchTasks(); }, []);
  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditingTask(task._id);
    setForm({
      title: task.title,
      description: task.description,
      completed: task.completed
    });
  };

  // Save updated task
  const saveUpdate = async (id) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, form);
      setTasks(prev => prev.map(t => t._id === id ? data : t));
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    // <div>
    //   <h2 className="text-xl font-bold mb-4">Tasks</h2>

    //   <ul>
    //     {tasks.map(t => (
    //       <li key={t._id} className="bg-white p-3 rounded mb-3 shadow">
    //         {editingTask === t._id ? (
    //           <div className="space-y-2">
    //             <input
    //               type="text"
    //               value={form.title}
    //               onChange={e => setForm({ ...form, title: e.target.value })}
    //               className="border p-1 rounded w-full"
    //             />
    //             <textarea
    //               value={form.description}
    //               onChange={e => setForm({ ...form, description: e.target.value })}
    //               className="border p-1 rounded w-full"
    //             />
    //             <label className="flex items-center gap-2">
    //               <input
    //                 type="checkbox"
    //                 checked={form.completed}
    //                 onChange={e => setForm({ ...form, completed: e.target.checked })}
    //               />
    //               Completed
    //             </label>
    //             <button
    //               onClick={() => saveUpdate(t._id)}
    //               className="bg-green-500 text-white px-3 py-1 rounded"
    //             >
    //               Save
    //             </button>
    //             <button
    //               onClick={() => setEditingTask(null)}
    //               className="bg-gray-400 text-white px-3 py-1 rounded ml-2"
    //             >
    //               Cancel
    //             </button>
    //           </div>
    //         ) : (
    //           <>
    //             <h3 className="font-semibold">{t.title}</h3>
    //             <p>{t.description}</p>
    //             <p className="text-gray-500">
    //               Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No date'}
    //             </p>
    //             <p>Status: <span className={t.completed ? 'text-green-600' : 'text-red-600'}>
    //               {t.completed ? 'Completed' : 'Pending'}
    //             </span></p>
    //             {t.match && (
    //               <p className="text-sm text-purple-600">
    //                 Match: {t.match.name || t.match._id}
    //               </p>
    //             )}
    //             {t.createdBy && (
    //               <p className="text-sm text-blue-600">
    //                 Created by: {t.createdBy.name}
    //               </p>
    //             )}

    //             <div className="mt-2">
    //               <button
    //                 onClick={() => startEdit(t)}
    //                 className="bg-yellow-500 text-white px-3 py-1 rounded"
    //               >
    //                 Edit
    //               </button>
    //               <button
    //                 onClick={() => deleteTask(t._id)}
    //                 className="bg-red-500 text-white px-3 py-1 rounded ml-2"
    //               >
    //                 Delete
    //               </button>
    //             </div>
    //           </>
    //         )}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <div className="p-6 max-w-3xl mx-auto">
  <h2 className="text-2xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
    📋 Tasks
  </h2>

  <ul className="space-y-4">
    {tasks.map((t) => (
      <li
        key={t._id}
        className="bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-200"
      >
        {editingTask === t._id ? (
          <div className="space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Task Title"
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Task Description"
            />
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <input
                type="checkbox"
                checked={form.completed}
                onChange={(e) =>
                  setForm({ ...form, completed: e.target.checked })
                }
              />
              Mark as Completed
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => saveUpdate(t._id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg shadow"
              >
                💾 Save
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg shadow"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{t.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  t.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {t.completed ? "Completed" : "Pending"}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{t.description}</p>
            <p className="text-gray-500 text-sm mt-2">
              📅 Due:{" "}
              {t.dueDate
                ? new Date(t.dueDate).toLocaleDateString()
                : "No date"}
            </p>

            {t.match && (
              <p className="text-sm text-purple-600 mt-1">
                🔗 Match: {t.match.name || t.match._id}
              </p>
            )}
            {t.createdBy && (
              <p className="text-sm text-blue-600 mt-1">
                👤 Created by: {t.createdBy.name}
              </p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => startEdit(t)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg shadow"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteTask(t._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow"
              >
                🗑 Delete
              </button>
            </div>
          </>
        )}
      </li>
    ))}
  </ul>
</div>

  );
}
