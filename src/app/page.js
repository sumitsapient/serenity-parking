'use client';

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usxysetamfoivookrcvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeHlzZXRhbWZvaXZvb2tyY3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NjUyMTksImV4cCI6MjA2MTQ0MTIxOX0.LyaoYreo6LcJC_klaxGy3d3qQXDhWnhP-6GCdZAwJcA'; // Replace safely
const supabase = createClient(supabaseUrl, supabaseKey);

const parkingSlots = [
  "15S-084", "15S-089", "15S-091", "15S-095",
  "15S-100", "15S-105", "15S-110", "15S-115",
  "15S-120", "15S-125", "15S-130", "15S-135",
  "15S-140", "15S-145", "15S-150", "15S-155",
  "15S-160", "15S-165", "15S-170", "15S-175"
];

export default function Home() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [parkingData, setParkingData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showPersonData, setShowPersonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showHelp, setShowHelp] = useState(false);

  const fetchParkingData = async () => {
    const { data, error } = await supabase.from('parking').select('*');
    if (!error && data) {
      const formatted = {};
      data.forEach(entry => {
        if (!formatted[entry.slot]) formatted[entry.slot] = [];
        formatted[entry.slot].push({ name: entry.name, phone: entry.phone });
      });
      setParkingData(formatted);
    }
  };

  useEffect(() => {
    fetchParkingData();

    const now = new Date();
    const millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - now.getTime();
    const timeoutId = setTimeout(async () => {
      await supabase.from('parking').delete().neq('slot', '');
      setParkingData({});
      location.reload();
    }, millisTillMidnight);

    const intervalId = setInterval(fetchParkingData, 10000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const validateInputs = () => {
    const nameWordCount = name.trim().split(/\s+/).length;
    const phoneDigits = phone.replace(/\D/g, ''); // Remove non-digits

    if (nameWordCount > 10) {
      showToast('Name should not exceed 10 words.', 'error');
      return false;
    }

    if (phoneDigits.length > 10) {
      showToast('Phone number should not exceed 10 digits.', 'error');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!selectedSlot || !name || !phone) {
      showToast('All fields are required.', 'error');
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('parking').insert([{ slot: selectedSlot, name, phone }]);
    setLoading(false);
    if (!error) {
      showToast('Saved successfully!', 'success');
      await fetchParkingData();
      setSelectedSlot(null);
      setName('');
      setPhone('');
    } else {
      showToast('Failed to save!', 'error');
    }
  };

  const filteredSlots = parkingSlots.filter(slot =>
    slot.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-fadeIn`}>
          {toast.message}
        </div>
      )}

      {/* Loader Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
<div className="flex items-center mb-6 space-x-3">
  <h1 className="text-3xl font-bold text-indigo-900">Serenity Parking</h1>
  <button
    onClick={() => setShowHelp(true)}
    className="text-white bg-blue-500 hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
    title="How to use?"
  >
    ?
  </button>
</div>


      <div className="w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="Search parking number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full max-w-6xl">
        {filteredSlots.map((slot) => (
          <div
            key={slot}
            onClick={() => !parkingData[slot] && setSelectedSlot(slot)}
            className={`flex flex-col items-center justify-center border rounded-lg p-5 transition-all duration-200 ease-in-out shadow-md hover:scale-105 cursor-pointer ${
              parkingData[slot] ? 'bg-amber-200 hover:bg-amber-300' : 'bg-green-200 hover:bg-green-300'
            }`}
          >
            <p className="text-lg font-semibold text-center">{slot}</p>
            {parkingData[slot] && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPersonData(parkingData[slot]);
                }}
                className="mt-2 text-blue-700 underline hover:text-blue-900 hover:cursor-pointer transition-colors"
              >
                Guest Details
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Person Popup */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg space-y-5 w-80 animate-fadeIn">
            <h2 className="text-xl font-bold mb-2 text-center">Enter Details for {selectedSlot}</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none"
            />
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Person Popup */}
      {showPersonData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 space-y-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-center">Guest Details</h2>
            {showPersonData.map((person, index) => (
              <div key={index} className="border p-3 rounded bg-gray-50">
                <p><strong>Name:</strong> {person.name}</p>
                <p><strong>Phone:</strong> {person.phone}</p>
              </div>
            ))}
            <div className="flex justify-center pt-3">
              <button
                onClick={() => setShowPersonData(null)}
                className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Help Popup */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 animate-fadeIn space-y-4">
            <h2 className="text-xl font-bold text-center">How to Use</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Search parking number using the search box.</li>
              <li>Green color slots are available — click to assign a guest.</li>
              <li>Yellow color slots are already booked — view guest details.</li>
              <li>Each day at midnight, all data will reset automatically.</li>
            </ul>
            <div className="flex justify-center pt-3">
              <button
                onClick={() => setShowHelp(false)}
                className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
