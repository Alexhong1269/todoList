import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Grab token from storage

    try {
      const response = await axios.post(
        'http://localhost:5001/api/tasks',
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskCreated(response.data); // send new task up to parent
      setTitle('');
      setError('');
    } catch (err) {
      setError('Failed to add task. Make sure you are logged in.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Enter new task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Add Task</button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default TaskForm;
