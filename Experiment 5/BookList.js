import React from "react";

function BookList({ books, deleteBook, setEditingBook }) {
  if (books.length === 0) return <p>No books found!</p>;

  return (
    <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>
              <button onClick={() => setEditingBook(book)}>Edit</button>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookList;
