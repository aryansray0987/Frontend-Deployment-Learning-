import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { todoApi } from "../api";
import TodoItem from "../components/TodoItem";

const FILTERS = ["all", "active", "completed"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    todoApi
      .list()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Runs an API call and shows any error in the banner
  async function run(action) {
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleAdd(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    run(async () => {
      const todo = await todoApi.create(title);
      setTodos((prev) => [todo, ...prev]);
      setNewTitle("");
    });
  }

  const replace = (updated) => setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  const handleToggle = (todo) => run(async () => replace(await todoApi.update(todo._id, { completed: !todo.completed })));

  const handleSave = (id, title) => run(async () => replace(await todoApi.update(id, { title })));

  const handleDelete = (id) =>
    run(async () => {
      await todoApi.remove(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    });

  const visible = todos.filter((t) =>
    filter === "active" ? !t.completed : filter === "completed" ? t.completed : true
  );
  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <h1>My Todos</h1>
          <p className="muted">{user.email}</p>
        </div>
        <button className="btn" onClick={logout}>Log out</button>
      </header>

      <main className="card">
        <form className="add-form" onSubmit={handleAdd}>
          <input
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button type="submit" className="btn primary">Add</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="toolbar">
          <span className="muted">
            {remaining} of {todos.length} left
          </span>
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`btn small ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="muted center">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="muted center">{todos.length === 0 ? "No todos yet. Add one above!" : "Nothing here."}</p>
        ) : (
          <ul className="todo-list">
            {visible.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
