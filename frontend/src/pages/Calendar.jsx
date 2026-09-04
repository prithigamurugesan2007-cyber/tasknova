import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { api } from '../api';

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarPage() {
  // Always starts from the REAL current date/time of the visitor's device — never hardcoded.
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [tasks, setTasks] = useState([]);

  useEffect(() => { api.getTasks().then(d => setTasks(d.tasks)).catch(() => {}); }, []);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1);
  }
  function goToday() { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function tasksForDay(day) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.due_date === iso);
  }

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Calendar" />

        <div className="card">
          <div className="calendar-header">
            <button className="btn-secondary" onClick={prevMonth}>‹ Prev</button>
            <h3 style={{ margin: 0 }}>{MONTH_NAMES[viewMonth]} {viewYear}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={goToday}>Today</button>
              <button className="btn-secondary" onClick={nextMonth}>Next ›</button>
            </div>
          </div>

          <div className="calendar-grid" style={{ marginBottom: 6 }}>
            {DAY_NAMES.map(d => <div key={d} className="day-name">{d}</div>)}
          </div>
          <div className="calendar-grid">
            {cells.map((day, idx) => {
              const isToday = isCurrentMonth && day === today.getDate();
              return (
                <div key={idx} className={`calendar-cell ${isToday ? 'today' : ''}`}>
                  {day && (
                    <>
                      <div className="day-num">{day}</div>
                      {tasksForDay(day).map(t => (
                        <div key={t.id} className="task-pill" title={t.title}>{t.title}</div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
