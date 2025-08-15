import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);      // <- store role
    localStorage.setItem('userId', data._id); 
      navigate('/dashboard/buyers');
    }catch(err){
      alert(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    // <div className="flex items-center justify-center h-screen bg-gray-100">
    //   <div className="bg-white p-6 rounded shadow-md w-96">
    //     <h1 className="text-2xl font-bold mb-4">Login</h1>
    //     <form className="space-y-4" onSubmit={submit}>
    //       <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" placeholder="Email" />
    //       <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full border p-2 rounded" placeholder="Password" />
    //       <button className="bg-blue-500 text-white w-full p-2 rounded">Login</button>
    //     </form>
    //     <p className="text-sm text-center">
    //       Don't have an account?{" "}
    //       <span
    //         className="text-blue-600 cursor-pointer hover:underline"
    //         onClick={() => navigate("/signup")}
    //       >
    //         Signup
    //       </span>
    //     </p>
    //   </div>
    // </div>

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
  <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
    {/* Header */}
    <div className="text-center mb-6">
      <h1 className="text-3xl font-extrabold text-indigo-700">Welcome Back</h1>
      <p className="text-gray-500 text-sm mt-1">
        Please sign in to continue
      </p>
    </div>

    {/* Form */}
    <form className="space-y-5" onSubmit={submit}>
      <div>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-lg p-3 outline-none transition-all"
          placeholder="Email Address"
        />
      </div>
      <div>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-lg p-3 outline-none transition-all"
          placeholder="Password"
        />
      </div>
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg shadow-md transition-all">
        Login
      </button>
    </form>

    {/* Divider */}
    <div className="flex items-center my-6">
      <hr className="flex-1 border-gray-300" />
      <span className="px-2 text-gray-400 text-sm">OR</span>
      <hr className="flex-1 border-gray-300" />
    </div>

    {/* Signup Link */}
    <p className="text-center text-sm text-gray-600">
      Don't have an account?{" "}
      <span
        className="text-indigo-600 font-medium cursor-pointer hover:underline"
        onClick={() => navigate("/signup")}
      >
        Sign up here
      </span>
    </p>
  </div>
</div>

  )
}
