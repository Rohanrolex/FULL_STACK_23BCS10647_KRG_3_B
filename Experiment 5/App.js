import React, { useState, useEffect } from "react";
import BookList from "./BookList";
import BookForm from "./BookForm";

function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  // Fetch books from API
  useEffect(() => {
    fetch("http://localhost:3001/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  // Add a new book
  const addBook = (book) => {
    fetch("http://localhost:3001/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    })
      .then((res) => res.json())
      .then((newBook) => setBooks([...books, newBook]));
  };

  // Update a book
  const updateBook = (book) => {
    fetch(`http://localhost:3001/books/${book.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    })
      .then((res) => res.json())
      .then((updatedBook) =>
        setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)))
      );
    setEditingBook(null);
  };

  // Delete a book
  const deleteBook = (id) => {
    fetch(`http://localhost:3001/books/${id}`, { method: "DELETE" }).then(() =>
      setBooks(books.filter((b) => b.id !== id))
    );
  };

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Library Management</h1>

      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
      />

      <BookForm
        addBook={addBook}
        updateBook={updateBook}
        editingBook={editingBook}
      />

      <BookList
        books={filteredBooks}
        deleteBook={deleteBook}
        setEditingBook={setEditingBook}
      />
    </div>
  );
}

export default App;
