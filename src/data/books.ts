export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  moods: string[];
  categories: string[];
  pages: number;
  publishedAt: string;
  coverImage: string;
}

export const MOODS = [
  "Curious",
  "Philosophical",
  "Focused",
  "Relaxed",
  "Inspired",
  "Adventurous",
  "Melancholic",
  "Optimistic",
];

// Mock API database for storefront listing
export const BOOKS: Book[] = [
  {
    id: "sample-book",
    title: "Quantum Mind: The Next Frontier",
    author: "Dr. Sarah Chen",
    description:
      "An exploration into the deep connections between quantum mechanics and human consciousness.",
    moods: ["Curious", "Philosophical", "Focused"],
    categories: ["Science", "Philosophy"],
    pages: 142,
    publishedAt: "2025-10-14",
    coverImage: "/books/sample-book/cover.png",
  },
  {
    id: "echoes-of-tomorrow",
    title: "Echoes of Tomorrow",
    author: "Elias Vance",
    description:
      "A gripping sci-fi narrative about time-slip anomalies in a distant future megacity.",
    moods: ["Adventurous", "Curious"],
    categories: ["Science Fiction", "Thriller"],
    pages: 310,
    publishedAt: "2024-03-22",
    coverImage:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=400&h=600",
  },
  {
    id: "silent-waters",
    title: "Silent Waters",
    author: "Amelie Roux",
    description:
      "A calming collection of poems inspired by the serenity of nature and water elements.",
    moods: ["Relaxed", "Melancholic"],
    categories: ["Poetry", "Nature"],
    pages: 98,
    publishedAt: "2023-11-05",
    coverImage:
      "https://images.unsplash.com/photo-1436831135709-48bdc150cce5?auto=format&fit=crop&q=80&w=400&h=600",
  },
  {
    id: "designing-joy",
    title: "Designing Joy",
    author: "Marcus Wei",
    description:
      "How to craft everyday experiences that elevate human happiness through deliberate design choices.",
    moods: ["Inspired", "Optimistic"],
    categories: ["Design", "Self-Help"],
    pages: 240,
    publishedAt: "2025-01-10",
    coverImage:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400&h=600",
  },
];

export async function getBook(id: string): Promise<Book | undefined> {
  // In a real scenario, this might fetch `/books/${id}/meta.json`
  return BOOKS.find((b) => b.id === id);
}

export async function fetchBookHtml(id: string): Promise<string> {
  try {
    const response = await fetch(`/books/${id}/index.html`);
    if (!response.ok) throw new Error("Failed to fetch ebook HTML");
    return await response.text();
  } catch (error) {
    console.error("Error fetching ebook:", error);
    return "<div style='padding: 2rem;text-align:center;'><h3>Book content not available</h3><p>Could not load the requested book.</p></div>";
  }
}
