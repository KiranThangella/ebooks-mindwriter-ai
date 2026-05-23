import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Moon,
  Sun,
  Type,
  PanelTop,
  Coffee,
  Volume2,
  VolumeX,
} from "lucide-react";
import { fetchBookHtml, getBook, Book } from "../data/books";
import DOMPurify from "dompurify";
import { ShadowDOM } from "../components/ShadowDOM";
import { cn } from "../lib/utils";

type Theme = "light" | "dark" | "sepia";

export function Reader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Reader Settings
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<number>(18);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Load book details and HTML
  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const bookData = await getBook(id);
      if (bookData) {
        setBook(bookData);
        const rawHtml = await fetchBookHtml(id);

        // Sanitize the HTML to prevent XSS but keep styles and structure
        const cleanHtml = DOMPurify.sanitize(rawHtml, {
          WHOLE_DOCUMENT: true,
          ADD_TAGS: ["style"],
          FORCE_BODY: true,
        });

        // Extract inner body content if it exists, otherwise use raw
        const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const stylesMatch = cleanHtml.match(/<style[^>]*>([\s\S]*)<\/style>/gi);

        const extractedStyles = stylesMatch ? stylesMatch.join("\n") : "";
        const extractedBody = bodyMatch ? bodyMatch[1] : cleanHtml;

        setHtmlContent(extractedStyles + extractedBody);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // Handle scroll to hide/show controls
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setControlsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setControlsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const text = doc.body.textContent || "";

      if (!text.trim()) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const themeClasses = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-gray-100",
    sepia: "bg-[#f4ecd8] text-[#5b4636]",
  };

  const headerTheme = {
    light: "bg-white/95 border-gray-200",
    dark: "bg-gray-900/95 border-gray-800",
    sepia: "bg-[#f4ecd8]/95 border-[#e4dcc8]",
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center animate-pulse bg-white">
        Loading...
      </div>
    );
  }

  if (!book) {
    return <div className="p-8 text-center">Book not found in reader</div>;
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500 ease-in-out font-serif",
        themeClasses[theme],
      )}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Top Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 border-b backdrop-blur",
          headerTheme[theme],
          controlsVisible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-black/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-sans font-medium text-sm truncate max-w-[150px] sm:max-w-xs opacity-70">
              {book.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 font-sans">
            {/* Theme Selectors */}
            <div className="hidden sm:flex items-center gap-1 bg-black/5 p-1 rounded-full">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  theme === "light" ? "bg-white shadow-sm" : "hover:bg-black/5",
                )}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("sepia")}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  theme === "sepia"
                    ? "bg-[#e4dcc8] shadow-sm"
                    : "hover:bg-black/5",
                )}
              >
                <Coffee className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  theme === "dark"
                    ? "bg-gray-800 text-white shadow-sm"
                    : "hover:bg-black/5",
                )}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2 bg-black/5 p-1 rounded-full">
              <button
                onClick={() => setFontSize((f) => Math.max(14, f - 2))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 font-medium"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((f) => Math.min(32, f + 2))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 font-medium"
              >
                A+
              </button>
            </div>

            {/* Text to Speech */}
            <button
               onClick={toggleSpeech}
               title={isSpeaking ? "Stop reading aloud" : "Read aloud"}
               className={cn(
                 "p-2 rounded-full transition-colors flex items-center justify-center",
                 isSpeaking ? "bg-black/10 text-blue-600 dark:bg-white/20 dark:text-blue-400" : "hover:bg-black/5"
               )}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button className="p-2 rounded-full hover:bg-black/5">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        ref={contentRef}
        onClick={() => setControlsVisible(!controlsVisible)}
        className="max-w-3xl mx-auto px-6 py-24 md:py-32 min-h-screen cursor-text"
        style={{ lineHeight: 1.8 }}
      >
        <ShadowDOM html={htmlContent} />
      </main>

      {/* Mobile Bottom Controls (Optional to surface theme easily on mobile) */}
      <div
        className={cn(
          "sm:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 border-t backdrop-blur px-6 py-4 flex justify-between items-center pb-safe",
          headerTheme[theme],
          controlsVisible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "p-3 rounded-full transition-colors",
            theme === "light" ? "bg-black/10" : "hover:bg-black/5",
          )}
        >
          <Sun className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme("sepia")}
          className={cn(
            "p-3 rounded-full transition-colors",
            theme === "sepia" ? "bg-black/10" : "hover:bg-black/5",
          )}
        >
          <Coffee className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "p-3 rounded-full transition-colors",
            theme === "dark" ? "bg-white/20" : "hover:bg-black/5",
          )}
        >
          <Moon className="w-5 h-5" />
        </button>
        <button
           onClick={toggleSpeech}
           title={isSpeaking ? "Stop reading aloud" : "Read aloud"}
           className={cn(
             "p-3 rounded-full transition-colors flex items-center justify-center",
             isSpeaking ? "bg-black/10 text-blue-600 dark:bg-white/20 dark:text-blue-400" : "hover:bg-black/5"
           )}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
