// src/App.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './App.css';

// Artist type
type Artist = {
  id: number;
  name: string;
  style: {
    backgroundColor: string;
    color: string;
    headerImage: string;
  };
};

// Static list of artists
const ARTISTS: Artist[] = [
  {
    id: 1,
    name: 'HEALTH',
    style: {
      backgroundColor: '#0b0b0b',
      color: '#e0e0e0',
      headerImage: '/images/health.webp'
    }
  },
  {
    id: 2,
    name: 'Tool',
    style: {
      backgroundColor: '#0b0b0b',
      color: '#cfcfcf',
      headerImage: '/images/tool.jpg'
    }
  },
  {
    id: 3,
    name: 'Sleep Token',
    style: {
      backgroundColor: '#0b0b0b',
      color: '#cfcfcf',
      headerImage: '/images/sleep_token.jpg'
    }
  }
];

const App: React.FC = () => {
  const [selectedArtist, setSelectedArtist] = useState<Artist>(ARTISTS[0]);
  const [getCreative, setGetCreative] = useState<boolean>(false);
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle URL parameter ?artist=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artistParam = params.get('artist');
    if (artistParam) {
      const found = ARTISTS.find(
        (a) => a.name.toLowerCase() === artistParam.toLowerCase()
      );
      if (found) {
        setSelectedArtist(found);
        document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)), url(${found.style.headerImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
      }
    }
  }, []);

  const fetchLyrics = async () => {
    setLoading(true);
    setError(null);
    setLyrics('');
    try {
      const res = await axios.get('http://127.0.0.1:5000/generate_lyrics', {
        params: {
          artist_id: selectedArtist.id,
          randomness: getCreative ? 1 : 0
        }
      });
      setLyrics(res.data.lyrics);
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.message ||
        'Unknown error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleArtistChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const artistId = parseInt(e.target.value, 10);
    const artist = ARTISTS.find((a) => a.id === artistId);
    if (artist) {
      setSelectedArtist(artist);

      // Update background image when artist changes
      document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)), url(${artist.style.headerImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchLyrics();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lyrics);
  };

  const style = selectedArtist.style;

  return (
    <div
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        minHeight: '100vh',
        padding: '2rem'
      }}
    >
      <img
        src={style.headerImage}
        alt="Header"
        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
      />

      {lyrics && (
        <div
          style={{
            margin: '2rem 0',
            padding: '1rem',
            backgroundColor: '#222',
            borderRadius: '5px'
          }}
        >
          <pre style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</pre>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Choose Artist:</label>
            <select value={selectedArtist.id} onChange={handleArtistChange}>
              {ARTISTS.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={getCreative}
                onChange={() => setGetCreative(!getCreative)}
              />{' '}
              Get Creative
            </label>
          </div>

          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Lyrics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
