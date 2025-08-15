import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AITools() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [docId, setDocId] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const matchId = localStorage.getItem("matchId"); // Make sure this is set from Matches.jsx

  useEffect(() => {
    if (!token) return navigate("/login");
    if (!matchId) return alert("No match selected");

    const fetchDocuments = async () => {
      try {
        const { data } = await api.get(`/documents/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Documents fetched"); 
        setDocuments(data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch documents.");
      }
    };

    fetchDocuments();
  }, [token, matchId, navigate]);

  const runSummary = async () => {
    if (!docId) return alert("Please select a document.");
    setLoading(true);
    setSummary(null);

    try {
      const { data } = await api.post(
        `/ai/financial-summary/${docId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
        🤖 AI Tools - <span className="text-indigo-600">Financial Summary</span>
      </h2>

      {/* Document Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Select Document
        </label>
        <select
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
        >
          <option value="">-- Choose a document --</option>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.filename || `Document ${doc._id}`}
              </option>
            ))
          ) : (
            <option disabled>No documents available</option>
          )}
        </select>
      </div>

      {/* Run AI Summary Button */}
      <button
        onClick={runSummary}
        disabled={loading || !docId}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          loading || !docId
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
        }`}
      >
        {loading ? "⏳ Generating..." : "🚀 Run AI Summary"}
      </button>

      {/* Summary Output */}
      {summary && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-inner">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            📊 Summary Result
          </h3>
          <pre className="bg-white p-3 rounded-md text-sm text-gray-700 overflow-auto border border-gray-200">
            {JSON.stringify(summary, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
