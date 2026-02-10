export const renderHeader = () => {
  const headerHTML = `
    <header>
      <nav>
        <a href="index.html">Home</a>
        <a href="login.html" id="login-link">Login</a>
        <a href="register.html" id="register-link">Register</a>
        <a href="admin/dashboard.html" id="dashboard-link" style="display:none;">Dashboard</a>
        <button id="logout-btn" style="display:none;">Logout</button>
      </nav>
    </header>
  `;
  document.body.insertAdjacentHTML('afterbegin', headerHTML);
};

export const renderFooter = () => {
  const footerHTML = `
    <footer>
      <p>&copy; 2023 My Awesome App</p>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', footerHTML);
};