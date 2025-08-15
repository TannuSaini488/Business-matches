import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setFormData(data.profile || {});
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put("/auth/profile/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
      setEditMode(false);
      // Refresh data
      const { data } = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setFormData(data.profile || {});
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    // <div className="max-w-lg mx-auto bg-white shadow-xl p-6 rounded-xl">
    //   <h2 className="text-2xl font-bold mb-4">Profile</h2>
    //   {!editMode ? (
    //     <div className="space-y-3">
    //       <div><span className="font-semibold">Name: </span>{user.name}</div>
    //       <div><span className="font-semibold">Email: </span>{user.email}</div>
    //       <div><span className="font-semibold">Role: </span>{user.role}</div>

    //       {user.role === "buyer" && user.profile && (
    //         <>
    //           <div>Industries: {user.profile.industries?.join(", ")}</div>
    //           <div>Budget Min: {user.profile.budgetMin}</div>
    //           <div>Budget Max: {user.profile.budgetMax}</div>
    //           <div>Deal Breakers: {user.profile.dealBreakers?.join(", ")}</div>
    //           <div>Readiness Score: {user.profile.readinessScore}</div>
    //         </>
    //       )}
    //       {user.role === "seller" && user.profile && (
    //         <>
    //           <div>Industry: {user.profile.industry}</div>
    //           <div>Revenue Range: {user.profile.revenueRange}</div>
    //           <div>Asking Price: {user.profile.askingPrice}</div>
    //           <div>Assets Included: {user.profile.assetsIncluded?.join(", ")}</div>
    //           <div>Stay Post Sale: {user.profile.stayPostSale}</div>
    //           <div>Buyer Preferences: {user.profile.buyerPreferences?.join(", ")}</div>
    //         </>
    //       )}
    //       <button
    //         onClick={() => setEditMode(true)}
    //         className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
    //       >
    //         Add Details / Edit Profile
    //       </button>
    //     </div>
    //   ) : (
    //     <div className="space-y-3">
    //       <div>
    //         <label className="font-semibold">Name</label>
    //         <input
    //           type="text"
    //           name="name"
    //           value={formData.name || user.name}
    //           onChange={handleChange}
    //           className="w-full border rounded p-2"
    //         />
    //       </div>
    //       <div>
    //         <label className="font-semibold">Email</label>
    //         <input
    //           type="email"
    //           name="email"
    //           value={formData.email || user.email}
    //           onChange={handleChange}
    //           className="w-full border rounded p-2"
    //         />
    //       </div>
    //       {/* Buyer fields */}
    //       {user.role === "buyer" && (
    //         <>
    //           <div>
    //             <label className="font-semibold">Industries (comma separated)</label>
    //             <input
    //               type="text"
    //               name="industries"
    //               value={formData.industries?.join(", ") || ""}
    //               onChange={(e) =>
    //                 setFormData({
    //                   ...formData,
    //                   industries: e.target.value.split(",").map((s) => s.trim()),
    //                 })
    //               }
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Budget Min</label>
    //             <input
    //               type="number"
    //               name="budgetMin"
    //               value={formData.budgetMin || 0}
    //               onChange={handleChange}
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Budget Max</label>
    //             <input
    //               type="number"
    //               name="budgetMax"
    //               value={formData.budgetMax || 0}
    //               onChange={handleChange}
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Deal Breakers (comma separated)</label>
    //             <input
    //               type="text"
    //               name="dealBreakers"
    //               value={formData.dealBreakers?.join(", ") || ""}
    //               onChange={(e) =>
    //                 setFormData({
    //                   ...formData,
    //                   dealBreakers: e.target.value.split(",").map((s) => s.trim()),
    //                 })
    //               }
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Readiness Score</label>
    //             <input
    //               type="number"
    //               name="readinessScore"
    //               value={formData.readinessScore || 50}
    //               onChange={handleChange}
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //         </>
    //       )}
    //       {/* Seller fields */}
    //       {user.role === "seller" && (
    //         <>
    //           <div>
    //             <label className="font-semibold">Industry</label>
    //             <input
    //               type="text"
    //               name="industry"
    //               value={formData.industry || ""}
    //               onChange={handleChange}
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Revenue Range</label>
    //             <input
    //               type="text"
    //               name="revenueRange"
    //               value={formData.revenueRange || ""}
    //               onChange={handleChange}
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Asking Price</label>
    //             <input
    //               type="number"
    //               name="askingPrice"
    //               value={formData.askingPrice || 0}
    //               onChange={handleChange}
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Assets Included (comma separated)</label>
    //             <input
    //               type="text"
    //               name="assetsIncluded"
    //               value={formData.assetsIncluded?.join(", ") || ""}
    //               onChange={(e) =>
    //                 setFormData({
    //                   ...formData,
    //                   assetsIncluded: e.target.value.split(",").map((s) => s.trim()),
    //                 })
    //               }
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Stay Post Sale</label>
    //             <input
    //               type="text"
    //               name="stayPostSale"
    //               value={formData.stayPostSale || ""}
    //               onChange={handleChange}
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //           <div>
    //             <label className="font-semibold">Buyer Preferences (comma separated)</label>
    //             <input
    //               type="text"
    //               name="buyerPreferences"
    //               value={formData.buyerPreferences?.join(", ") || ""}
    //               onChange={(e) =>
    //                 setFormData({
    //                   ...formData,
    //                   buyerPreferences: e.target.value.split(",").map((s) => s.trim()),
    //                 })
    //               }
    //               className="w-full border rounded p-2"
    //             />
    //           </div>
    //         </>
    //       )}
    //       <button
    //         onClick={handleSubmit}
    //         className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
    //       >
    //         Save
    //       </button>
    //       <button
    //         onClick={() => setEditMode(false)}
    //         className="mt-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
    //       >
    //         Cancel
    //       </button>
    //     </div>
    //   )}
    // </div>

    <div className="max-w-3xl mx-auto bg-gradient-to-br from-white to-gray-50 shadow-2xl p-8 rounded-2xl border border-gray-200">
  <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">
    {editMode ? "Edit Your Profile" : "Profile Overview"}
  </h2>

  {!editMode ? (
    <div className="grid gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-gray-600"><span className="font-semibold">Name:</span> {user.name}</p>
        <p className="text-gray-600"><span className="font-semibold">Email:</span> {user.email}</p>
        <p className="text-gray-600"><span className="font-semibold">Role:</span> {user.role}</p>
      </div>

      {user.role === "buyer" && user.profile && (
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="font-bold text-gray-700 mb-2">Buyer Details</h3>
          <p><span className="font-semibold">Industries:</span> {user.profile.industries?.join(", ")}</p>
          <p><span className="font-semibold">Budget Range:</span> ₹{user.profile.budgetMin} - ₹{user.profile.budgetMax}</p>
          <div>
            <span className="font-semibold">Deal Breakers:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.profile.dealBreakers?.map((item, i) => (
                <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <p><span className="font-semibold">Readiness Score:</span> {user.profile.readinessScore}</p>
        </div>
      )}

      {user.role === "seller" && user.profile && (
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="font-bold text-gray-700 mb-2">Seller Details</h3>
          <p><span className="font-semibold">Industry:</span> {user.profile.industry}</p>
          <p><span className="font-semibold">Revenue Range:</span> {user.profile.revenueRange}</p>
          <p><span className="font-semibold">Asking Price:</span> ₹{user.profile.askingPrice}</p>
          <div>
            <span className="font-semibold">Assets Included:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.profile.assetsIncluded?.map((item, i) => (
                <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <p><span className="font-semibold">Stay Post Sale:</span> {user.profile.stayPostSale}</p>
          <div>
            <span className="font-semibold">Buyer Preferences:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.profile.buyerPreferences?.map((item, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setEditMode(true)}
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-3 rounded-xl shadow-lg"
      >
        Add Details / Edit Profile
      </button>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Name */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || user.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || user.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Buyer fields */}
      {user.role === "buyer" && (
        <>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Industries</label>
            <input
              type="text"
              name="industries"
              value={formData.industries?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  industries: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Budget Min</label>
            <input
              type="number"
              name="budgetMin"
              value={formData.budgetMin || 0}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Budget Max</label>
            <input
              type="number"
              name="budgetMax"
              value={formData.budgetMax || 0}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Deal Breakers</label>
            <input
              type="text"
              name="dealBreakers"
              value={formData.dealBreakers?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dealBreakers: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Readiness Score</label>
            <input
              type="number"
              name="readinessScore"
              value={formData.readinessScore || 50}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </>
      )}

      {/* Seller fields */}
      {user.role === "seller" && (
        <>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Revenue Range</label>
            <input
              type="text"
              name="revenueRange"
              value={formData.revenueRange || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Asking Price</label>
            <input
              type="number"
              name="askingPrice"
              value={formData.askingPrice || 0}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Assets Included</label>
            <input
              type="text"
              name="assetsIncluded"
              value={formData.assetsIncluded?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assetsIncluded: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Stay Post Sale</label>
            <input
              type="text"
              name="stayPostSale"
              value={formData.stayPostSale || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Buyer Preferences</label>
            <input
              type="text"
              name="buyerPreferences"
              value={formData.buyerPreferences?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buyerPreferences: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
        </>
      )}

      <div className="md:col-span-2 flex gap-4 mt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => setEditMode(false)}
          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl shadow-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

  );
}

