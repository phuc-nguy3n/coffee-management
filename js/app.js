import { renderHeader, renderFooter } from './utils/domUtils.js';
import { onAuthChange, logoutUser } from './services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
  // Render các thành phần chung
  renderHeader();
  renderFooter();

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const dashboardLink = document.getElementById('dashboard-link');
  const logoutBtn = document.getElementById('logout-btn');

  // Lắng nghe thay đổi trạng thái đăng nhập để cập nhật UI
  onAuthChange(user => {
    if (user) {
      // Người dùng đã đăng nhập
      loginLink.style.display = 'none';
      registerLink.style.display = 'none';
      dashboardLink.style.display = 'inline';
      logoutBtn.style.display = 'inline';
    } else {
      // Người dùng đã đăng xuất
      loginLink.style.display = 'inline';
      registerLink.style.display = 'inline';
      dashboardLink.style.display = 'none';
      logoutBtn.style.display = 'none';
    }
  });

  // Gắn sự kiện cho nút logout
  logoutBtn.addEventListener('click', async () => {
    try {
      await logoutUser();
      window.location.href = '/login.html'; // Chuyển hướng về trang đăng nhập
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Đăng xuất thất bại!');
    }
  });
});
