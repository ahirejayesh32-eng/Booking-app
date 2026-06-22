import { useState, useEffect } from 'react';
import axios from 'axios';
import SlotList from './components/SlotList';

const API = 'http://localhost:3001/api';

export default function App() {
  const [slots, setSlots] = useState([]);

  const fetchSlots = () => {
    axios.get(`${API}/slots`).then((r) => setSlots(r.data));
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F4EE',
      fontFamily: "'Jost', sans-serif",
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '36px',
          borderBottom: '1px solid #d8d0bd',
          paddingBottom: '24px',
        }}>
          <div>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#9c8254',
              fontWeight: 500,
              margin: '0 0 12px',
            }}>
              Private consultation
            </p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '34px',
              fontWeight: 500,
              color: '#2c2620',
              margin: 0,
            }}>
              Dr. Sharma
            </p>
          </div>
          <div style={{ fontSize: '12px', color: '#9c9381', textAlign: 'right' }}>
            General checkup<br />30 minutes
          </div>
        </div>
        <SlotList slots={slots} onBooked={fetchSlots} />
      </div>
    </div>
  );
}