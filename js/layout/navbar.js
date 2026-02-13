import { APP_CONFIG, NAVIGATION_PATHS, UI_TEXTS } from "../config/constants.js";

export function loadNavbar() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="${NAVIGATION_PATHS.home}">
          <img src="${APP_CONFIG.logoUrl}" width="${APP_CONFIG.logoWidth}" class="me-2" />
          <strong>${APP_CONFIG.name}</strong>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto" id="nav-menu-items">
            <li class="nav-item"><a class="nav-link" href="${NAVIGATION_PATHS.home}">${UI_TEXTS.navbarHome}</a></li>
            <li class="nav-item"><a class="nav-link" href="#">${UI_TEXTS.navbarMenu}</a></li>
            <li class="nav-item" id="admin-feature"></li>
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
