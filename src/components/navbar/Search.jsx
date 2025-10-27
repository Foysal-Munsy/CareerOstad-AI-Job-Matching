"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { useRouter } from "next/navigation";

const categories = ["All", "Jobs", "Candidates", "Companies"];

const Search = () => {
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch suggestions while typing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&category=${category}`
        );
        const data = await res.json();
        setResults(data.results || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, category]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}&category=${category}`);
    setShowSuggestions(false);
  };

  const handleSelect = (item) => {
    // Navigate based on item type (customize routes if needed)
    if (item._type === "job") {
      router.push(`/jobs/${item._id}`);
    } else if (item._type === "candidate" || item._type === "company") {
      router.push(`/profile/${item.email}`);
    } 
    else {
      router.push(`/search?q=${encodeURIComponent(item.title)}&category=${category}`);
    }
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-2">
      <form
        onSubmit={handleSubmit}
        className="flex items-center text-sm rounded-lg h-9 shadow-md overflow-hidden"
      >
        {/* Category Selector */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select h-9 rounded-none rounded-l-lg border-none focus:outline-none cursor-pointer bg-gray-200 text-center text-sm w-fit"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Search Input */}
        <div className="flex items-center px-2 relative bg-white h-9 w-full">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowSuggestions(true)}
            placeholder="Search For"
            className="bg-transparent outline-none w-full"
            style={{ minWidth: "140px" }}
          />
          {query === "" && (
            <span className="absolute left-[105px] text-gray-400 pointer-events-none">
              <Typewriter
                words={["Jobs...", "Candidates...", "Companies..."]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={100}
                deleteSpeed={80}
                delaySpeed={1500}
              />
            </span>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-primary text-white px-3 h-9 hover:bg-black transition"
        >
          <FaSearch />
        </button>
      </form>

      {/* Suggestion Dropdown */}
      {showSuggestions && (
        <div className="absolute bg-white border border-gray-200 mt-1 rounded-md shadow-lg w-full z-50 max-h-64 overflow-auto">
          {loading ? (
            <p className="p-2 text-gray-500 text-sm">Loading...</p>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item._id}
                onMouseDown={() => handleSelect(item)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                <div className="text-sm font-medium text-gray-800 flex justify-between">
                  {item.title}
                  <span className="text-xs text-gray-500 uppercase">
                    {item._type}
                  </span>
                </div>
                {item.subtitle && (
                  <p className="text-xs text-gray-600">{item.subtitle}</p>
                )}
                {item.description && (
                  <p className="text-xs text-gray-400 truncate">
                    {item.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-500 text-sm">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
