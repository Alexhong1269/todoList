import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //Add new task to list
  const handleNewTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  //Delete Task
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  //Toggle Complete/Incomplete
  const toggleComplete = async (task) => {
    try {
      const updatedTask = {
        ...task,
        completed: !task.completed,
      };
      const response = await axios.put(
        `http://localhost:5001/api/tasks/${task._id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? response.data : t))
      );
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="tasklist-container">
      <h2>My To-Do List</h2>
      <TaskForm onTaskCreated={handleNewTask} />
      <ul className="tasklist">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />
            <span className="task-title">{task.title}</span>
            <button onClick={() => handleDelete(task._id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
