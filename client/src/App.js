import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function App() {
  const { register, handleSubmit, reset } = useForm();
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    const res = await axios.get('http://localhost:3001/api/books');
    setBooks(res.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const onSubmit = async (data) => {
    if (editingId) {
      await axios.put(`http://localhost:3001/api/books/${editingId}`, data);
      setEditingId(null);
    } else {
      await axios.post(`http://localhost:3001/api/books`, data);
    }
    reset();
    fetchBooks();
  };

  const handleEdit = (book) => {
    reset(book);
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/api/books/${id}`);
    fetchBooks();
  };

  return (
    <div>
      <h2>{editingId ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('title', { required: true })} placeholder="Title" />
        <input {...register('author', { required: true })} placeholder="Author" />
        <input {...register('publishedDate')} placeholder="Published Date" />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <h2>Books List</h2>
      <ul>
        {books.map(book => (
          <li key={book._id}>
            {book.title} by {book.author} ({book.publishedDate}) &nbsp;
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;