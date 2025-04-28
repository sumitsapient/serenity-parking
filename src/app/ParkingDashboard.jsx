'use client';

import React, { useEffect, useState } from 'react';

// Example list of parking spots
const parkingSpots = [
  '15S-084', '15S-085', '15S-086', '15S-087', '15S-088', '15S-089',
  '15S-090', '15S-091', '15S-092', '15S-093', '15S-094', '15S-095',
  '15S-096', '15S-097', '15S-098', '15S-099', '15S-100', '15S-101',
];

const ParkingDashboard = () => {
  const [parkingData, setParkingData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempNumber, setTempNumber] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setParkingData({});
      }
    }, 60000); // Check every 1 minute

    return () => clearInterval(interval);
  }, []);

  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
    setTempName('');
    setTempNumber('');
  };

  const handleConfirmParking = () => {
    if (tempName.trim() && tempNumber.trim()) {
      setParkingData((prev) => ({
        ...prev,
        [selectedSpot]: {
          name: tempName.trim(),
          number: tempNumber.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      }));
      setSelectedSpot(null);
    }
  };

  const filteredSpots = parkingSpots.filter((spot) =>
    spot.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Parking Dashboard</h2>

      <input
        type="text"
        placeholder="Search parking spot..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          margin: '10px 0',
          fontSize: '16px',
        }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '10px',
      }}>
        {filteredSpots.map((spot) => (
          <div
            key={spot}
            onClick={() => handleSelectSpot(spot)}
            style={{
              border: '1px solid #ccc',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: parkingData[spot] ? '#c8e6c9' : '#f0f0f0',
              cursor: 'pointer',
              borderRadius: '8px',
            }}
          >
            <div><strong>{spot}</strong></div>
            {parkingData[spot] && (
              <>
                <div style={{ fontSize: '14px' }}>{parkingData[spot].name}</div>
                <div style={{ fontSize: '12px' }}>{parkingData[spot].number}</div>
                <div style={{ fontSize: '10px', color: 'gray' }}>at {parkingData[spot].time}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSpot && (
        <div style={{
          position: 'fixed',
          top: '0', left: '0', right: '0', bottom: '0',
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000',
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
          }}>
            <h3>Enter Details for {selectedSpot}</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <input
              type="text"
              placeholder="Your Phone Number"
              value={tempNumber}
              onChange={(e) => setTempNumber(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />

            <button
              onClick={handleConfirmParking}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
                marginBottom: '10px',
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => setSelectedSpot(null)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingDashboard;
