import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function SellerList() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  useEffect(() => {
    fetchSellers();
  }, []);
  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("token"); // get token
      const { data } = await api.get("/sellers", {
        headers: { Authorization: `Bearer ${token}` }, // send token
      });
      setSellers(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sellers</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Seller Name */}
            <h3 className="text-lg font-bold text-indigo-700">{s.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{s.email}</p>

            {/* Seller Details */}
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Industry:</span>{" "}
                {s.profile?.industry || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Revenue Range:</span>{" "}
                {s.profile?.revenueRange || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Stay Post Sale:</span>{" "}
                {s.profile?.stayPostSale || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Asking Price:</span>{" "}
                {s.profile?.askingPrice
                  ? `₹${s.profile.askingPrice.toLocaleString()}`
                  : "Not set"}
              </p>
            </div>

            {/* Assets Included */}
            {s.profile?.assetsIncluded?.length > 0 && (
              <div className="mt-3">
                <span className="font-semibold text-gray-800">
                  Assets Included:
                </span>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-1">
                  {s.profile.assetsIncluded.map((asset, i) => (
                    <li key={i}>{asset}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buyer Preferences */}
            {s.profile?.buyerPreferences?.length > 0 && (
              <div className="mt-3">
                <span className="font-semibold text-gray-800">
                  Buyer Preferences:
                </span>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-1">
                  {s.profile.buyerPreferences.map((pref, i) => (
                    <li key={i}>{pref}</li>
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
