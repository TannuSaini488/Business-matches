import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Documents() {
  const location = useLocation();
  const matchId = location.state?.matchId;

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem("token"); // Must match your login storage
        const res = await axios.get(
          `http://localhost:5000/documents/${matchId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFiles(res.data); // ✅ store documents in state
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [matchId]);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Documents</h2>
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    // <div className="p-4">
    //   <h2 className="text-xl font-bold mb-4">Documents</h2>
    //   {files.length === 0 ? (
    //     <p>No documents uploaded yet.</p>
    //   ) : (
    //     files.map((f) => (
    //       <div key={f._id} className="bg-white p-3 rounded shadow mb-2 border">
    //         <div className="font-bold">{f.filename}</div>
    //         <div>By: {f.uploader?.name || f.uploader?.email}</div>
    //         <div>Size: {(f.size / 1024).toFixed(2)} KB</div>
    //         <div>Uploaded: {new Date(f.createdAt).toLocaleString()}</div>
    //       </div>
    //     ))
    //   )}
    // </div>

    <div className="p-6 bg-gray-50 min-h-screen">
  <h2 className="text-2xl font-extrabold mb-6 text-gray-800 border-b-4 border-blue-500 inline-block">
    📄 Documents
  </h2>

  {files.length === 0 ? (
    <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 border border-yellow-300 shadow-sm">
      No documents uploaded yet.
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((f) => (
        <div
          key={f._id}
          className="bg-white rounded-xl shadow-lg p-5 border hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-lg text-blue-600 truncate">{f.filename}</div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {(f.size / 1024).toFixed(2)} KB
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">By:</span>{" "}
            {f.uploader?.name || f.uploader?.email}
          </div>

          <div className="text-xs text-gray-500">
            Uploaded on: {new Date(f.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}

