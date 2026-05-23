import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BOOKS, MOODS } from "../data/books";
import { BookCard } from "../components/BookCard";
import { Sparkles, Flame, Clock } from "lucide-react";
import { cn } from "../lib/utils";

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Clean, validate and get initial mood from URL query
  const getInitialMood = () => {
    const rawMood = searchParams.get("mood");
    if (!rawMood) return "All";
    
    // Case-insensitive match against defined MOODS
    const matchedMood = MOODS.find(m => m.toLowerCase() === rawMood.toLowerCase());
    return matchedMood || "All"; // Fallback to "All" if invalid
  };

  const initialMood = getInitialMood();
  const [activeMood, setActiveMood] = useState<string>(initialMood);

  useEffect(() => {
    const rawMood = searchParams.get("mood");
    if (!rawMood) {
      setActiveMood("All");
      return;
    }
    
    const matchedMood = MOODS.find(m => m.toLowerCase() === rawMood.toLowerCase());
    const validMood = matchedMood || "All";
    
    if (validMood !== activeMood) {
      setActiveMood(validMood);
    }
  }, [searchParams]);

  const handleMoodChange = (mood: string) => {
    setActiveMood(mood);
    if (mood === "All") {
      searchParams.delete("mood");
    } else {
      searchParams.set("mood", mood);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredBooks =
    activeMood === "All"
      ? BOOKS
      : BOOKS.filter((b) => b.moods.includes(activeMood));

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-10">
      {/* Hero / Mood Filter section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
              How are you feeling?
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Discover books matched to your current mood from MindWriter.
            </p>
          </div>
          <Sparkles className="w-8 h-8 text-yellow-500 hidden sm:block opacity-50" />
        </div>

        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 scrollbar-none">
          <button
            onClick={() => handleMoodChange("All")}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              activeMood === "All"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm",
            )}
          >
            All Moods
          </button>
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => handleMoodChange(mood)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                activeMood === mood
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm",
              )}
            >
              {mood}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          {activeMood === "All" ? (
            <>
              <Flame className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-semibold tracking-tight">
                Trending Now
              </h2>
            </>
          ) : (
            <h2 className="text-xl font-semibold tracking-tight">
              Books for feeling {activeMood}
            </h2>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-gray-500 font-medium">
              No books found for this mood yet.
            </p>
            <button
              onClick={() => handleMoodChange("All")}
              className="mt-4 text-sm font-medium text-gray-900 underline underline-offset-4"
            >
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* Recently Added */}
      {activeMood === "All" && (
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold tracking-tight">
              Recently Added
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BOOKS.slice(0, 2).map((book) => (
              <div
                key={`recent-${book.id}`}
                className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => (window.location.href = `/book/${book.id}`)}
              >
                <img
                  src={book.coverImage}
                  className="w-16 h-24 object-cover rounded shadow-sm"
                  alt=""
                  loading="lazy"
                />
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500">{book.author}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Added on {book.publishedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
