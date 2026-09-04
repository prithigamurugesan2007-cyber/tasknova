import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { api } from '../api';

const emptyTask = { title: '', description: '', category: 'General', status: 'pending', priority: 'medium', due_date: '' };
const statusLabel = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState('');

  async function loadTasks() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (priorityFilter) params.set('priority', priorityFilter);
    const qs = params.toString();
    try {
      const data = await api.getTasks(qs ? `?${qs}` : '');
      setTasks(data.tasks);
    } catch (e) { setError(e.message); }
  }

  useEffect(() => { loadTasks(); }, [search, statusFilter, priorityFilter]);

  function openAdd() { setForm(emptyTask); setEditingId(null); setModalOpen(true); }
  function openEdit(t) { setForm({ ...t, due_date: t.due_date || '' }); setEditingId(t.id); setModalOpen(true); }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editingId) await api.updateTask(editingId, form);
      else await api.createTask(form);
      setModalOpen(false);
      loadTasks();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return;
    try { await api.deleteTask(id); loadTasks(); } catch (err) { setError(err.message); }
  }

  async function quickStatus(t, status) {
    try { await api.updateTask(t.id, { ...t, status }); loadTasks(); } catch (err) { setError(err.message); }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Tasks" />
        {error && <div className="error-box">{error}</div>}

        <div className="toolbar">
          <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button className="btn-add" onClick={openAdd}>+ Add Task</button>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Status</th><th>Priority</th><th>Due Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.category}</td>
                  <td>
                    <select value={t.status} onChange={e => quickStatus(t, e.target.value)} style={{ border: 'none', background: 'transparent' }}>
                      <option value="pending">🔴 Pending</option>
                      <option value="in_progress">🟡 In Progress</option>
                      <option value="completed">🟢 Completed</option>
                    </select>
                  </td>
                  <td><span className={`badge ${t.priority}`}>{t.priority}</span></td>
                  <td>{t.due_date || '—'}</td>
                  <td className="row-actions">
                    <button onClick={() => openEdit(t)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && <tr><td colSpan="6" style={{ color: '#6b7280', padding: 20 }}>No tasks found.</td></tr>}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>{editingId ? 'Edit Task' : 'Add Task'}</h3>
              <form onSubmit={handleSave}>
                <div className="field"><label>Title</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="field"><label>Description</label>
                  <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="field"><label>Category</label>
                  <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                </div>
                <div className="field"><label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="pending">🔴 Pending</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="completed">🟢 Completed</option>
                  </select>
                </div>
                <div className="field"><label>Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🔵 Low</option>
                  </select>
                </div>
                <div className="field"><label>Due Date</label>
                  <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '9px 18px' }}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
