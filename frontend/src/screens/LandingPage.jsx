import React, { useState } from 'react';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import config from '../constants.js';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lunarAddress, setLunarAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignup(email, password, name, lunarAddress);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80)'}}>
        <div className="min-h-screen bg-black bg-opacity-60 flex flex-col justify-center">
             <div className="max-w-md mx-auto px-4 py-12 w-full">
                <div className="text-center mb-8">
                    <RocketLaunchIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h1 className="text-5xl font-bold text-white mb-2">MoonDash</h1>
                    <p className="text-cyan-300 text-lg">Cosmic Cravings, Delivered at Light Speed.</p>
                </div>

                <div className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-2xl border border-cyan-500">
                <div className="flex mb-6 border border-cyan-500 rounded-lg overflow-hidden">
                    <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 px-4 text-center font-medium transition-all duration-300 ${isLogin ? 'bg-cyan-500 text-gray-900' : 'bg-transparent text-cyan-400 hover:bg-cyan-900'}`}
                    >
                    Login
                    </button>
                    <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 px-4 text-center font-medium transition-all duration-300 ${!isLogin ? 'bg-cyan-500 text-gray-900' : 'bg-transparent text-cyan-400 hover:bg-cyan-900'}`}
                    >
                    Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                    <>
                        <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-1">Callsign (Name)</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 text-white px-3 py-2 border border-cyan-700 rounded-md focus:ring-cyan-500 focus:border-cyan-500" placeholder="Cmdr. Valentina" required={!isLogin} />
                        </div>
                         <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-1">Lunar Address</label>
                        <input type="text" value={lunarAddress} onChange={(e) => setLunarAddress(e.target.value)} className="w-full bg-gray-900 text-white px-3 py-2 border border-cyan-700 rounded-md focus:ring-cyan-500 focus:border-cyan-500" placeholder="Tranquility Base, Sector 7" required={!isLogin} />
                        </div>
                    </>
                    )}

                    <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 text-white px-3 py-2 border border-cyan-700 rounded-md focus:ring-cyan-500 focus:border-cyan-500" placeholder="pilot@galaxy.com" required />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-900 text-white px-3 py-2 border border-cyan-700 rounded-md focus:ring-cyan-500 focus:border-cyan-500" placeholder="••••••••" required />
                    </div>

                    {error && <div className="text-red-400 text-sm text-center p-2 bg-red-900 bg-opacity-50 rounded">{error}</div>}

                    <button type="submit" disabled={loading} className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 disabled:opacity-50 transition-colors duration-300 font-bold">
                    {loading ? 'Transmitting...' : (isLogin ? 'Engage' : 'Launch')}
                    </button>
                </form>
                </div>

                 <div className="mt-6 text-center">
                    <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-200 underline">
                        Access Admin Control Panel
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;
