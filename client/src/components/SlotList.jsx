import { useState } from 'react';
import axios from 'axios';

export default function SlotList({ slots, onBooked }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBook = async (slotId) => {
    setError('');
    if (!name || !email) {
      setError('Enter your name and email to reserve a slot.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/bookings', {
        slot_id: slotId,
        name,
        email,
      });
      onBooked();
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data.error);
        onBooked();
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    flex: 1,
    padding: '14px 18px',
    border: 'none',
    borderRight: '1px solid #d8d0bd',
    background: '#fff',
    fontSize: '13px',
    fontFamily: "'Jost', sans-serif",
    color: '#2c2620',
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        marginBottom: '36px',
        border: '1px solid #d8d0bd',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...inputStyle, borderRight: 'none' }}
        />
      </div>

      {error && (
        <div style={{
          fontSize: '12px',
          color: '#9c4a1a',
          marginBottom: '20px',
          letterSpacing: '0.02em',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {slots.map((slot, i) => {
          const isBooked = slot.booking_id !== null;
          return (
            <div
              key={slot.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 4px',
                borderBottom: i === slots.length - 1 ? 'none' : '1px solid #e3ddd0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '20px',
                  color: '#2c2620',
                  minWidth: '110px',
                }}>
                  {formatTime(slot.start_time)}
                </span>
                <span style={{
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isBooked ? '#b3aa95' : '#9c8254',
                }}>
                  {isBooked ? 'Reserved' : 'Available'}
                </span>
              </div>
              <button
                disabled={isBooked || loading}
                onClick={() => handleBook(slot.id)}
                style={{
                  padding: '10px 26px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  cursor: isBooked ? 'default' : 'pointer',
                  fontFamily: "'Jost', sans-serif",
                  background: isBooked ? 'transparent' : '#2c2620',
                  color: isBooked ? '#b3aa95' : '#F7F4EE',
                  border: isBooked ? '1px solid #d8d0bd' : '1px solid #2c2620',
                }}
              >
                {isBooked ? 'Taken' : loading ? 'Reserving…' : 'Reserve'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}