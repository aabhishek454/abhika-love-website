import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Play, User } from 'lucide-react';
import axios from 'axios';
import _ from 'lodash';

// Use a relative path or the production URL for the API
const BACKEND_URL = ''; // Empty string means use the same origin (ideal for Vercel/Render combined setups)
// But since the backend is on Render and Frontend on Vercel:
const API_BASE = 'https://abhika-backend.onrender.com';

const Search = ({ emitEvent }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (q) => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/youtube/search?q=${encodeURIComponent(q)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    _.debounce((q) => fetchResults(q), 500),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handlePlay = (video) => {
    emitEvent('changeVideo', { 
      videoId: video.videoId,
      title: video.title 
    });
    setQuery('');
    setResults([]);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-slate-500 group-focus-within:text-pink-500 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song or artist..."
          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600 text-white"
        />
        {loading && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Results List */}
      {results.length > 0 && (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 max-h-[400px] overflow-y-auto divide-y divide-white/5 animate-in fade-in slide-in-from-top-4 duration-300 scrollbar-hide">
          {results.map((video) => (
            <div 
              key={video.videoId}
              className="group flex items-center gap-4 p-3 hover:bg-white/5 transition-colors"
            >
              <div 
                onClick={() => handlePlay(video)}
                className="relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
              >
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-slate-200 line-clamp-1 truncate" 
                    dangerouslySetInnerHTML={{ __html: video?.title || 'Untitled' }}>
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {video.channel}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePlay(video)}
                  className="p-2 bg-pink-500/10 text-pink-500 rounded-lg hover:bg-pink-500 hover:text-white transition-all text-xs font-bold"
                >
                  Play
                </button>
                <button 
                  onClick={() => emitEvent('addToQueue', { 
                    videoId: video.videoId, 
                    title: video.title,
                    thumbnail: video.thumbnail 
                  })}
                  className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all text-xs font-bold"
                >
                  + Queue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
