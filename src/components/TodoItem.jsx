import { useState } from "react";

export default function TodoItem({ todo, onToggle, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  async function handleSave(e) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    if (title !== todo.title) await onSave(todo._id, title);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(todo.title);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="todo-item">
        <form className="todo-edit" onSubmit={handleSave}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleCancel()}
            autoFocus
          />
          <button type="submit" className="btn primary small">Save</button>
          <button type="button" className="btn small" onClick={handleCancel}>Cancel</button>
        </form>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? "done" : ""}`}>
      <label className="todo-check">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo)} />
        <span className="todo-title">{todo.title}</span>
      </label>
      <div className="todo-actions">
        <button className="btn small" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn small danger" onClick={() => onDelete(todo._id)}>Delete</button>
      </div>
    </li>
  );
}
