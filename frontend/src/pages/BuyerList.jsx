import { useEffect, useState } from "react";
import api from "../api/axios";

export default function BuyerList() {
  const [buyers, setBuyers] = useState([]);

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "seller") fetchBuyers();
  }, [role]);

  const fetchBuyers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/buyers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuyers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id, type) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(`/buyers/${id}/${type}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBuyers();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${type} buyer`);
    }
  };

  if (role !== "seller") return <p>Only sellers can see this page</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Buyers</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyers.map((b) => {
          const request = b.requests?.find(
            (r) => r.seller === localStorage.getItem("userId")
          );
          const disabled = request ? true : false;

          return (
            <div
              key={b._id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col justify-between h-full">
                {/* Buyer Info */}
                <div>
                  <h3 className="text-lg font-bold text-indigo-700">
                    {b.user.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Industries: {b.industries?.join(", ") || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Maximum Budget:</span> ₹
                    {b.budgetMax?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Minimum Budget:</span> ₹
                    {b.budgetMin?.toLocaleString() || 0}
                  </p>
                  {b.dealBreakers?.length > 0 && (
                    <div className="mt-2">
                      <span className="font-semibold text-gray-800">
                        Deal Breakers:
                      </span>
                      <ul className="list-disc list-inside text-gray-600 text-sm mt-1">
                        {b.dealBreakers.map((db, i) => (
                          <li key={i}>{db}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(b._id, "accept")}
                    className={`flex-1 py-2 rounded-lg text-white transition ${
                      disabled
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    disabled={disabled}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(b._id, "reject")}
                    className={`flex-1 py-2 rounded-lg text-white transition ${
                      disabled
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={disabled}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
