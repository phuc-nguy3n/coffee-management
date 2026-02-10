import { registerUser } from '../services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form'); // Giả sử bạn có form với id này

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = registerForm.email.value;
      const password = registerForm.password.value;
      // Thêm confirm password nếu cần

      try {
        await registerUser(email, password);
        alert('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
        window.location.href = '/login.html';
      } catch (error) {
        console.error('Registration failed:', error);
        alert(`Đăng ký thất bại: ${error.message}`);
      }
    });
  }
});
