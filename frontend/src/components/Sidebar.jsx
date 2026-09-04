import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">🚀 TaskNova</div>
      <nav>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? 'active' : ''}>Tasks</NavLink>
        <NavLink to="/calendar" className={({isActive}) => isActive ? 'active' : ''}>Calendar</NavLink>
        <NavLink to="/categories" className={({isActive}) => isActive ? 'active' : ''}>Categories</NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>Settings</NavLink>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
      </nav>
    </div>
  );
}
