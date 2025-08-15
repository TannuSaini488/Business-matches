import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [showDocForm, setShowDocForm] = useState(null);
  const [docFile, setDocFile] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const { data } = await api.get("/matches");
    setMatches(data);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/matches/${id}/status`, { status: newStatus });
      setMatches(
        matches.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (id) => {
    try {
      const { title, description, dueDate } = taskData;
      const { data } = await api.post("/tasks", {
        title,
        description,
        dueDate,
        match: id,
      });

      setMatches(
        matches.map((m) =>
          m._id === id ? { ...m, tasks: [...(m.tasks || []), data] } : m
        )
      );

      setTaskData({ title: "", description: "", dueDate: "" });
      setShowTaskForm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDocument = async (id) => {
    try {
      const fd = new FormData();
      fd.append("file", docFile);
      const { data } = await api.post(`/matches/${id}/documents`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMatches(
        matches.map((m) =>
          m._id === id ? { ...m, documents: [...(m.documents || []), data] } : m
        )
      );

      setDocFile(null);
      setShowDocForm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();

  const goToAITools = (matchId) => {
    localStorage.setItem("matchId", matchId);
    navigate("/dashboard/ai-tools");
  };

  const statusOptions = [
    "pending",
    "active",
    "negotiation",
    "due-diligence",
    "closed",
    "rejected",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Matches</h2>

      <div className="grid gap-6">
        {matches.map((m) => (
          <div
            key={m._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 flex flex-wrap justify-between items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold">
                  {m.buyer?.name || m.buyer?.email}
                  <span className="mx-2 text-gray-500">↔</span>
                  {m.seller?.name || m.seller?.email}
                </h3>

                <div className="flex items-center mt-1 text-sm">
                  <span className="font-medium text-gray-700">Status:</span>
                  <select
                    className="ml-2 border border-gray-300 px-2 py-1 rounded text-sm"
                    value={m.status}
                    onChange={(e) => handleStatusChange(m._id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() =>
                    setShowTaskForm(showTaskForm === m._id ? null : m._id)
                  }
                >
                  {showTaskForm === m._id ? "Cancel" : "Add Task"}
                </button>

                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() =>
                    setShowDocForm(showDocForm === m._id ? null : m._id)
                  }
                >
                  {showDocForm === m._id ? "Cancel" : "Add Document"}
                </button>

                <Link
                  to="/dashboard/documents"
                  state={{ matchId: m._id }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                >
                  View Documents
                </Link>

                <button
                  className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded text-sm"
                  onClick={() => goToAITools(m._id)}
                >
                  AI Tools
                </button>
              </div>
            </div>

            {/* Task Form */}
            {showTaskForm === m._id && (
              <div className="p-4 bg-gray-50 border-t space-y-2">
                <input
                  type="text"
                  placeholder="Task title"
                  value={taskData.title}
                  onChange={(e) =>
                    setTaskData({ ...taskData, title: e.target.value })
                  }
                  className="border p-2 rounded w-full text-sm"
                />
                <textarea
                  placeholder="Description"
                  value={taskData.description}
                  onChange={(e) =>
                    setTaskData({ ...taskData, description: e.target.value })
                  }
                  className="border p-2 rounded w-full text-sm"
                />
                <input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) =>
                    setTaskData({ ...taskData, dueDate: e.target.value })
                  }
                  className="border p-2 rounded w-full text-sm"
                />
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleAddTask(m._id)}
                >
                  Save Task
                </button>
              </div>
            )}

            {/* Document Form */}
            {showDocForm === m._id && (
              <div className="p-4 bg-gray-50 border-t space-y-2">
                <input
                  type="file"
                  onChange={(e) => setDocFile(e.target.files[0])}
                  className="block text-sm"
                />
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleAddDocument(m._id)}
                >
                  Save Document
                </button>
              </div>
            )}

            {/* Tasks List */}
            {m.tasks && m.tasks.length > 0 && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Tasks</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {m.tasks.map((task) => (
                    <li key={task._id}>
                      <span className={task.completed ? "line-through" : ""}>
                        {task.title}
                      </span>
                      {task.dueDate &&
                        ` (Due: ${new Date(
                          task.dueDate
                        ).toLocaleDateString()})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Documents List */}
            {m.documents && m.documents.length > 0 && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Documents</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {m.documents.map((doc) => (
                    <li key={doc._id}>
                      {doc.filename} — Uploaded by{" "}
                      {doc.uploader?.name || doc.uploader?.email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
