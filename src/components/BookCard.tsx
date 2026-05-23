import { Link } from "react-router-dom";
import { Book } from "../data/books";
import { cn } from "../lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  return (
    <Link
      to={`/book/${book.id}`}
      className={cn(
        "group flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg",
        className,
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900 line-clamp-1 leading-snug group-hover:text-gray-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {book.moods.slice(0, 2).map((mood) => (
            <span
              key={mood}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium uppercase tracking-wider"
            >
              {mood}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
