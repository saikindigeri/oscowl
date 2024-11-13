import React, { useState, useEffect } from "react";
import axios from "axios";
import './Todos.css';
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate=useNavigate()
  useEffect(() => {
    fetchTodos();
  }, [todos]);

  
  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/todos/");
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTask || !newDescription) return;

    try {
      const response = await axios.post("http://localhost:5000/api/todos/", {
        title: newTask,
        description: newDescription,
        status: "pending",
      });
      setTodos([...todos, response.data]);
      setNewTask("");
      setNewDescription("");
    } catch (error) {
      console.error("Failed to add todo", error);
    }
  };

  const editTodo = (todo) => {
    setEditTaskId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditStatus(todo.status);
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/todos/${editTaskId}`,
        {
          title: editTitle,
          description: editDescription,
          status: editStatus,
        }
      );

      setTodos(
        todos.map((todo) =>
          todo.id === editTaskId ? response.data : todo
        )
      );
      setEditTaskId(null);
      setEditTitle("");
      setEditDescription("");
      setEditStatus("pending");
    } catch (error) {
      console.error("Failed to update todo", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
  };

  const handleProfile=()=>{
    navigate("/profile")
  }

  return (
    <>

<nav className="header">
    <h2 className="header-title">Todo App</h2>
    {token && <button className="header-logout" onClick={handleLogout}>Logout</button>}
    <button className="profile-button" onClick={handleProfile}><CgProfile /></button>
  </nav>
    <div className="todos-container">
     
      <h2 className="todos-title">Your Tasks</h2>

      <form className="add-task-form" onSubmit={addTodo}>
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="text"
          className="description-input"
          placeholder="Add a Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button className="submit-button" type="submit">Add Task</button>
      </form>

      <ul className="todos-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <span className="todo-text">
              <strong>{todo.title}</strong> - {todo.description} - {todo.status}
            </span>
            <button
              className="edit-button"
              onClick={() => editTodo(todo)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editTaskId && (
        <div className="edit-form">
          <h3 className="edit-title">Edit Task</h3>
          <input
            type="text"
            className="edit-input"
            placeholder="Edit title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <input
            type="text"
            className="edit-input"
            placeholder="Edit description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <select
            className="status-select"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="done">Done</option>
          </select>
          <button className="save-button" onClick={saveEdit}>Save</button>
          <button
            className="cancel-button"
            onClick={() => setEditTaskId(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
    </>

  );
}

export default Todos;
