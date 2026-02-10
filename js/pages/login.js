import { loginUser } from '../services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form'); // Giả sử bạn có form với id này

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        await loginUser(email, password);
        alert('Đăng nhập thành công!');
        window.location.href = '/admin/dashboard.html'; // Chuyển hướng sau khi đăng nhập
      } catch (error) {
        console.error('Login failed:', error);
        alert(`Đăng nhập thất bại: ${error.message}`);
      }
    });
  }
});
