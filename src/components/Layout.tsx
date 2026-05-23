import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Library, BookOpen, Search, User } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isReaderPage = location.pathname.startsWith("/read/");

  if (isReaderPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-20 md:pb-0 font-sans">
      <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-[#FDFBF7]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gray-900 p-1.5 rounded-lg text-white group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-semibold tracking-tight text-lg">
                MindWriter Store
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Discover
              </Link>
              <Link
                to="/"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Categories
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="hidden md:flex p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 pb-safe">
        <Link
          to="/"
          className={
            location.pathname === "/"
              ? "text-gray-900 flex flex-col items-center"
              : "text-gray-400 flex flex-col items-center"
          }
        >
          <Library className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/" className="text-gray-400 flex flex-col items-center">
          <Search className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>
        <Link to="/" className="text-gray-400 flex flex-col items-center">
          <User className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}
