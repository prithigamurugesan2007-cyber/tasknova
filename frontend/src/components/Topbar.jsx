import { useAuth } from '../context/AuthContext';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : '?';

  return (
    <div className="topbar">
      <h1>{title}</h1>
      <div className="user-chip">
        <span>{user?.name}</span>
        <div className="avatar-circle">
          {user?.avatar ? <img src={user.avatar} alt="avatar" /> : initials}
        </div>
      </div>
    </div>
  );
}
