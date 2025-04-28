'use client';

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usxysetamfoivookrcvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeHlzZXRhbWZvaXZvb2tyY3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NjUyMTksImV4cCI6MjA2MTQ0MTIxOX0.LyaoYreo6LcJC_klaxGy3d3qQXDhWnhP-6GCdZAwJcA';
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

  const fetchParkingData = async () => {
    const { data, error } = await supabase.from('parking').select('*');
    if (error) {
      console.error('Error fetching parking data:', error);
    } else {
      const formattedData = {};
      data.forEach((entry) => {
        if (!formattedData[entry.slot]) {
          formattedData[entry.slot] = [];
        }
        formattedData[entry.slot].push({ name: entry.name, phone: entry.phone });
      });
      setParkingData(formattedData);
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

    const intervalId = setInterval(() => {
      fetchParkingData();
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  const handleSave = async () => {
    if (selectedSlot && name && phone) {
      const { error } = await supabase.from('parking').insert([{ slot: selectedSlot, name, phone }]);
      if (error) {
        console.error('Error saving parking data:', error);
      } else {
        await fetchParkingData();
        setSelectedSlot(null);
        setName('');
        setPhone('');
      }
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const openPersonModal = (slot) => {
    setShowPersonData(parkingData[slot]);
  };

  const closePersonModal = () => {
    setShowPersonData(null);
  };

  const filteredSlots = parkingSlots.filter(slot =>
    slot.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Parking Dashboard</h1>

      <div className="flex items-center justify-center mb-6 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Search parking number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-3 rounded shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {filteredSlots.map((slot) => (
          <div
            key={slot}
            onClick={() => handleSlotClick(slot)}
            className={`border border-gray-300 rounded p-6 cursor-pointer shadow-md text-center transition-all duration-200 ${
              parkingData[slot] ? 'bg-amber-200 hover:bg-amber-300' : 'bg-green-200 hover:bg-green-300'
            }`}
          >
            <p className="font-semibold text-lg">{slot}</p>

            {parkingData[slot] && (
              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering handleSlotClick
                    openPersonModal(slot);
                  }}
                  className="text-blue-700 text-sm hover:underline hover:cursor-pointer"
                >
                  Show Person
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Popup to enter details */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 transition-transform transform scale-100">
            <h2 className="text-lg font-bold mb-4 text-center">Enter Details for {selectedSlot}</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded mb-6"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup to show person details */}
      {showPersonData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 transition-transform transform scale-100">
            <h2 className="text-lg font-bold mb-4 text-center">Person Details</h2>
            {showPersonData.map((person, index) => (
              <div key={index} className="border-b border-gray-200 pb-2 mb-2 text-center">
                <p className="font-semibold">{person.name}</p>
                <p className="text-gray-600">{person.phone}</p>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                onClick={closePersonModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
