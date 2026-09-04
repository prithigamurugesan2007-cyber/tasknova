import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { api } from '../api';

export default function Categories() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => { api.getTasks().then(d => setTasks(d.tasks)).catch(() => {}); }, []);

  const grouped = tasks.reduce((acc, t) => {
    acc[t.category] = acc[t.category] || [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Categories" />
        {Object.keys(grouped).length === 0 && (
          <div className="card"><p style={{ color: '#6b7280', margin: 0 }}>No categories yet. Categories are created automatically when you add a task with a category name.</p></div>
        )}
        {Object.entries(grouped).map(([category, list]) => (
          <div className="card" key={category}>
            <h3>{category} <span style={{ color: '#6b7280', fontWeight: 400 }}>({list.length})</span></h3>
            <table><tbody>
              {list.map(t => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td><span className={`badge ${t.status}`}>{t.status.replace('_',' ')}</span></td>
                  <td><span className={`badge ${t.priority}`}>{t.priority}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        ))}
      </div>
    </div>
  );
}
