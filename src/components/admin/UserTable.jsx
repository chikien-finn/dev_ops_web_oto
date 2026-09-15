import { Trash2 } from 'lucide-react';

export default function UserTable({ users, currentUser, onDeleteUser }) {
  return (
    <div className="glass-card admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Họ và Tên</th>
            <th>Tên Đăng Nhập</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Vai Trò</th>
            <th style={{ textAlign: 'right' }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ fontWeight: '600' }}>{u.name || u.username}</td>
              <td>@{u.username}</td>
              <td>{u.email}</td>
              <td>{u.phone || 'Chưa có'}</td>
              <td>
                <span className={`admin-badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  {u.role === 'admin' ? 'Quản Trị Viên' : 'Thành Viên'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                {u.username !== 'admin' && currentUser && u.id !== currentUser.id && (
                  <button 
                    onClick={() => onDeleteUser(u.id, u.username)}
                    className="btn-action-icon delete"
                    style={{ marginLeft: 'auto' }}
                    title="Xóa người dùng"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
