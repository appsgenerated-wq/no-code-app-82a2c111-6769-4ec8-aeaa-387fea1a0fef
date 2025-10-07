import React, { useEffect, useState } from 'react';
import { UserCircleIcon, Cog6ToothIcon, ShoppingBagIcon, TruckIcon, BuildingStorefrontIcon, PowerIcon, PlusIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import config from '../constants.js';

// Feature-Aware Components
const ChoiceSelector = ({ options, value, onChange, label, colors }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${value === option ? `${colors[option]}` : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {option.replace('_', ' ').toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);

const RelationshipPicker = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
    >
      <option value="" disabled>{placeholder}</option>
      {options && options.map(option => (
        <option key={option.id} value={option.id}>{option.name} ({option.email})</option>
      ))}
    </select>
  </div>
);

const ImageUploader = ({ onUpload, preview, onRemove }) => {
  const [dragActive, setDragActive] = useState(false);
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-cyan-400 bg-gray-700' : 'border-gray-600'}`}
      onDrop={(e) => { e.preventDefault(); setDragActive(false); onUpload(e.dataTransfer.files[0]); }}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onClick={() => document.getElementById('image-upload-input').click()}
    >
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="max-h-32 rounded" />
          <button onClick={(e) => {e.stopPropagation(); onRemove();}} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"> <XMarkIcon className='w-4 h-4'/> </button>
        </div>
      ) : (
        <div>
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
          <p className="mt-2 text-sm text-gray-400">Drag photo here or click to upload</p>
          <input id="image-upload-input" type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} />
        </div>
      )}
    </div>
  );
};

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [outposts, setOutposts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [myRover, setMyRover] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [newRover, setNewRover] = useState({ name: '', operatorId: null });
  const [isLoading, setIsLoading] = useState(true);

  const roverStatusColors = { 'idle': 'bg-gray-500 text-white', 'delivering': 'bg-blue-500 text-white', 'charging': 'bg-yellow-500 text-black' };
  const orderStatusColors = { 'placed': 'bg-blue-200 text-blue-800', 'preparing': 'bg-yellow-200 text-yellow-800', 'in_transit': 'bg-purple-200 text-purple-800', 'delivered': 'bg-green-200 text-green-800', 'cancelled': 'bg-red-200 text-red-800' };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const outpostRes = await manifest.from('lunarOutpost').find();
      setOutposts(outpostRes.data);

      if (user.role === 'customer') {
        const orderRes = await manifest.from('order').with(['rover']).find({ filter: { customerId: user.id } });
        setMyOrders(orderRes.data);
      } else if (user.role === 'driver') {
        const roverRes = await manifest.from('lunarRover').find({ filter: { operatorId: user.id }, limit: 1 });
        if (roverRes.data && roverRes.data.length > 0) {
          const rover = roverRes.data[0];
          setMyRover(rover);
          const deliveryRes = await manifest.from('order').with(['customer']).find({ filter: { roverId: rover.id } });
          setMyDeliveries(deliveryRes.data);
        }
      } else if (user.role === 'admin') {
        const driverRes = await manifest.from('user').find({ filter: { role: 'driver' }});
        setDrivers(driverRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleUpdateRoverStatus = async (status) => {
    if (!myRover) return;
    const updatedRover = await manifest.from('lunarRover').update(myRover.id, { status });
    setMyRover(updatedRover);
  }

  const handleCreateRover = async (e) => {
    e.preventDefault();
    if (!newRover.name || !newRover.operatorId) return alert('Please provide a name and select an operator.');
    await manifest.from('lunarRover').create(newRover);
    setNewRover({ name: '', operatorId: null });
    // Ideally, refresh list of rovers, but for this demo, we clear the form.
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <UserCircleIcon className="w-10 h-10 text-cyan-400"/>
            <div>
                <h1 className="font-bold text-lg">{user.name}</h1>
                <p className="text-xs text-gray-400 uppercase">{user.role} | {user.lunarAddress}</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm">
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Admin Panel</span>
            </a>
            <button onClick={onLogout} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm">
                <PowerIcon className="w-5 h-5" />
                <span>Logout</span>
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? <p>Loading transmissions...</p> : (
          <div>
            {/* Customer View */}
            {user.role === 'customer' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center"><BuildingStorefrontIcon className="w-6 h-6 mr-2"/> Lunar Outposts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {outposts && outposts.length > 0 ? outposts.map(outpost => (
                      <div key={outpost.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        <img src={outpost.menuImage?.url || 'https://via.placeholder.com/400x200'} alt={outpost.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <h3 className="font-bold text-xl">{outpost.name}</h3>
                          <p className="text-cyan-400 text-sm">{outpost.cuisine}</p>
                        </div>
                      </div>
                    )) : <p>No outposts found.</p>}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center"><ShoppingBagIcon className="w-6 h-6 mr-2"/>My Orders</h2>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3">
                      {myOrders && myOrders.length > 0 ? myOrders.map(order => (
                        <div key={order.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                          <div>
                            <p>Order #{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-gray-400">Total: ${order.totalPrice}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${orderStatusColors[order.status]}`}>{order.status.toUpperCase()}</span>
                        </div>
                      )) : <p>You haven't placed any orders yet.</p>}
                    </div>
                </div>
              </div>
            )}

            {/* Driver View */}
            {user.role === 'driver' && myRover && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4">Rover Control: {myRover.name}</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                     <ChoiceSelector label="Set Rover Status" options={['idle', 'delivering', 'charging']} value={myRover.status} onChange={handleUpdateRoverStatus} colors={roverStatusColors} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center"><TruckIcon className="w-6 h-6 mr-2"/>My Deliveries</h2>
                   <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3">
                      {myDeliveries && myDeliveries.length > 0 ? myDeliveries.map(delivery => (
                        <div key={delivery.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                           <div>
                            <p>To: {delivery.customer.name}</p>
                            <p className="text-xs text-gray-400">Address: {delivery.customer.lunarAddress}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${orderStatusColors[delivery.status]}`}>{delivery.status.toUpperCase()}</span>
                        </div>
                      )) : <p>No deliveries assigned.</p>}
                    </div>
                </div>
              </div>
            )}

            {/* Admin View */}
            {user.role === 'admin' && (
              <div>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4">Admin: Deploy New Rover</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <form onSubmit={handleCreateRover} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Rover Name</label>
                        <input type="text" value={newRover.name} onChange={(e) => setNewRover({...newRover, name: e.target.value})} className="w-full bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500" placeholder="Rover-01" required />
                      </div>
                      <RelationshipPicker label="Assign Operator" value={newRover.operatorId} onChange={(val) => setNewRover({...newRover, operatorId: val})} options={drivers} placeholder="Select a driver..." />
                      <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 font-bold flex items-center"><PlusIcon className="w-5 h-5 mr-2"/>Deploy Rover</button>
                    </form>
                  </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
