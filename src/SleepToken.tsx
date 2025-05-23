// src/App.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { logGeneratedTopic, logPageView } from './utils/analytics';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
//console.log(backendUrl); 

// ---- DATA TYPES
type Topic = {
    id: number; 
    name: string;
}

const TOPICS: Topic[] = [
    { id: 0, name: 'ANY TOPIC' },
    { id: 1, name: 'LOVE' },
    { id: 2, name: 'DEATH' },
    { id: 3, name: 'BREAK UP' },
    { id: 4, name: 'LONELINESS' }
]

const SleepToken: React.FC = () => {
  //Runs once on initial render
  useEffect(() => {
    logPageView(location.pathname);
  }, []);

  const [selectedTopic, setSelectedTopic] = useState<Topic>(TOPICS[0]);
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLyrics = async () => {
    setLoading(true);
    setError(null);
    setLyrics('');
    try {
      const res = await axios.get(backendUrl+'/lyricgenerator/sleeptoken', {
        params: {
          topicId: selectedTopic.id
        }
      });
      setLyrics(res.data.lyrics);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Unknown error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const topicId = parseInt(e.target.value, 10);   
    const selectedTopic = TOPICS.find((t) => t.id === topicId)!;
    setSelectedTopic(selectedTopic);    
  }

  const handleSubmit = (e: FormEvent) => {
    //Send GTM event for selectedTopic.id
    logGeneratedTopic(selectedTopic.name);
    
    e.preventDefault();
    fetchLyrics();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lyrics);
  };

  return (
    <div className='main-container'>
      <img
        src='/images/sleep_token.png'
        alt="Header"
        className="header-image"
        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
      />

      {lyrics && (
        <div className="lyrics-container"
          style={{
          }}
        >
          <pre style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</pre>
          <button onClick={copyToClipboard}>COPY TO CLIPBOARD</button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
            <div>
                <label>TOPIC</label>
            </div>
          <div>
            <select value={selectedTopic.id} onChange={handleTopicChange}>
              {TOPICS.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'GENERATE CHORUS'}
            </button>
          </div>
        </form>
      </div>
      <footer className="footer">
        <p><a href='https://ko-fi.com/babywolfcam'>BUY ME A TINY COFFEE SO WE CAN KEEP THIS FREE :)</a></p>
      </footer>
    </div>
  );
};

export default SleepToken;
