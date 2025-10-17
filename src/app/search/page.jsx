"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch results from API
  useEffect(() => {
    const fetchResults = async () => {
      if (!q.trim()) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&category=${category}`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [q, category]);

  const handleSelect = (item) => {
    // Navigate based on type
    if (item._type === "job") {
      router.push(`/jobs/${item._id}`);
    } else if (item._type === "candidate" || item._type === "company") {
      router.push(`/profile/${item.email}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <FaSearch /> Search Results
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Showing results for <strong>"{q}"</strong> in{" "}
          <strong>{category}</strong>
        </p>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500">No results found.</p>
        ) : (
          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelect(item)}
                className="p-3 border rounded-md cursor-pointer hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {item.title || "Untitled"}
                  </h3>
                  <span className="text-xs text-gray-500 uppercase">
                    {item._type}
                  </span>
                </div>
                {item.subtitle && (
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                )}
                {item.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
