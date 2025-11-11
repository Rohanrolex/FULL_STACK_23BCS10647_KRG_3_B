import React, { useState, useEffect } from "react";

function BookForm({ addBook, updateBook, editingBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
    } else {
      setTitle("");
      setAuthor("");
    }
  }, [editingBook]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author) return;

    if (editingBook) {
      updateBook({ ...editingBook, title, author });
    } else {
      addBook({ title, author });
    }

    setTitle("");
    setAuthor("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button type="submit">{editingBook ? "Update" : "Add"} Book</button>
    </form>
  );
}

export default BookForm;
