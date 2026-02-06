export function loadNavbar() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.html">
          <img src="https://cdn-icons-png.flaticon.com/512/924/924514.png" width="40" class="me-2" />
          <strong>Cafe</strong>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto" id="nav-menu-items">
            <li class="nav-item"><a class="nav-link" href="index.html">Trang chủ</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Menu</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown">
                <i class="fa-regular fa-user"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end bg-dark" id="user-menu-list">
                </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>`;

  // Chèn vào vị trí đầu tiên của thẻ body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);
}
