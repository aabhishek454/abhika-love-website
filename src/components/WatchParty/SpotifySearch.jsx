import React, { useState, useEffect, useCallback } from 'react';
import { Search, History, Music, X, Play, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.PROD ? 'YOUR_RENDER_URL_HERE' : 'http://localhost:3001';

export default function SpotifySearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchResults = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/youtube/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) fetchResults(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (video) => {
    onSelect(video);
    // Add to recent searches
    const updated = [video.title, ...recentSearches.filter(s => s !== video.title)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Search Header */}
      <div className="p-4 md:p-6 pb-2 shrink-0">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-pink-500 transition-colors" size={18} />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs or artists..."
            className="w-full bg-[#242424]/80 border border-transparent focus:border-pink-500/30 rounded-full py-3.5 pl-12 pr-10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Results / Recent */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 mt-2">
        <AnimatePresence mode="wait">
          {!query && recentSearches.length > 0 ? (
            <motion.div 
               key="recent"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="px-4 py-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                   <History size={14} /> Recent Searches
                </h3>
                <button onClick={clearRecent} className="text-[10px] text-white/20 hover:text-white font-bold uppercase tracking-widest transition-colors">Clear All</button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setQuery(s)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-white/80 text-sm flex items-center gap-3 transition-colors group"
                  >
                    <Search size={14} className="text-white/20 group-hover:text-pink-500" />
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1 px-2"
            >
              {results.map((item, idx) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 transition-all group relative border border-transparent hover:border-white/5"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#333] shrink-0 relative overflow-hidden shadow-lg">
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play size={20} className="text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="text-white font-medium truncate text-sm leading-tight group-hover:text-pink-400 transition-colors">{item.title}</h4>
                    <p className="text-white/40 text-xs mt-1 truncate">{item.channel}</p>
                  </div>
                  <div className="text-[10px] text-white/20 pr-2 flex items-center gap-1">
                    <Clock size={10} /> {item.duration}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : query && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 text-white/20 gap-3">
              <Search size={32} />
              <p className="text-sm">No songs found for "{query}"</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4 px-4 py-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-14 h-14 bg-white/5 rounded-lg" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-white/5 rounded-full w-3/4" />
                    <div className="h-2 bg-white/5 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/20 gap-4 mt-12">
               <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center">
                 <Music size={32} className="text-pink-500/40" />
               </div>
               <p className="text-sm font-bold tracking-widest uppercase">Select a track to start</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
