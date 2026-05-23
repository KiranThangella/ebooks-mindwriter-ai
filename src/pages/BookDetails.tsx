import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBook, Book, BOOKS } from "../data/books";
import { ArrowLeft, BookOpen, Share, Heart } from "lucide-react";
import { BookCard } from "../components/BookCard";

export function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      setLoading(true);
      if (id) {
        const data = await getBook(id);
        if (data) setBook(data);
      }
      setLoading(false);
    }
    loadBook();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-96 rounded-2xl w-full"></div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Book not found</h2>
        <button
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gray-900 underline"
        >
          Return Home
        </button>
      </div>
    );
  }

  const relatedBooks = BOOKS.filter(
    (b) =>
      b.id !== book.id && b.categories.some((c) => book.categories.includes(c)),
  ).slice(0, 4);

  return (
    <div className="animate-in fade-in duration-500">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-16">
        {/* Cover Image */}
        <div className="w-full md:w-1/3 max-w-[300px] shrink-0 mx-auto md:mx-0">
          <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-xl ring-1 ring-black/5 bg-gray-100 flex items-center justify-center relative group">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            {book.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2 leading-tight">
            {book.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {book.moods.map((mood) => (
              <span
                key={mood}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {mood}
              </span>
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed mb-10 md:text-lg">
            {book.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to={`/read/${book.id}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-black text-white rounded-full font-medium shadow-md shadow-gray-900/10 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              Read Ebook
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-gray-600">
                <Heart className="w-5 h-5" />
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-gray-600">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-6">
            <span>
              <strong>Pages:</strong> {book.pages}
            </span>
            <span>
              <strong>Published:</strong> {book.publishedAt}
            </span>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="pt-8 border-t border-gray-100">
          <h3 className="text-xl font-semibold tracking-tight mb-6">
            You might also like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {relatedBooks.map((rb) => (
              <BookCard key={rb.id} book={rb} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
