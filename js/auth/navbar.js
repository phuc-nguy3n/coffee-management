import { auth, db } from "../config/firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { NAVIGATION_PATHS, UI_TEXTS } from "../config/constants.js";

const ADMIN_DASHBOARD_PATH = NAVIGATION_PATHS.adminDashboard;

const renderGuestMenu = (userDropdown, dropdownMenu) => {
  userDropdown.innerHTML = `<i class="fa-regular fa-user"></i>`;
  dropdownMenu.innerHTML = `
    <li><a class="dropdown-item text-white" href="${NAVIGATION_PATHS.login}">${UI_TEXTS.navbarLogin}</a></li>
    <li><a class="dropdown-item text-white" href="${NAVIGATION_PATHS.register}">${UI_TEXTS.navbarRegister}</a></li>
  `;
};

const renderUserMenu = (userDropdown, dropdownMenu, user) => {
  userDropdown.innerHTML = `<i class="fa-regular fa-user me-1"></i> ${user.displayName || UI_TEXTS.navbarMember}`;
  dropdownMenu.innerHTML = `
    <li><a class="dropdown-item text-white" href="#"><i class="fa-solid fa-circle-user me-2"></i>${UI_TEXTS.navbarAccount}</a></li>
    <li><hr class="dropdown-divider bg-secondary"></li>
    <li><span role="button" class="dropdown-item text-white " id="logoutBtn">${UI_TEXTS.navbarLogout}</span></li>
  `;

  document
    .getElementById("logoutBtn")
    ?.addEventListener("click", () => signOut(auth));
};

const renderAdminFeature = async (user, adminFeatureContainer) => {
  if (!adminFeatureContainer || !user) return;

  const userDocSnap = await getDoc(doc(db, "users", user.uid));
  if (!userDocSnap.exists()) return;

  if (userDocSnap.data().role === "admin") {
    adminFeatureContainer.innerHTML = `
      <a class="nav-link text-warning" href="${ADMIN_DASHBOARD_PATH}">
        <i class="fa-solid fa-gauge"></i> ${UI_TEXTS.adminDashboard}
      </a>`;
  }
};

export const updateNavbarUI = async (user) => {
  const userDropdown = document.getElementById("userDropdown");
  const dropdownMenu = document.querySelector("#userDropdown + .dropdown-menu");
  const adminFeatureContainer = document.getElementById("admin-feature");

  if (!userDropdown || !dropdownMenu) return;
  if (adminFeatureContainer) adminFeatureContainer.innerHTML = "";

  if (user) {
    await renderAdminFeature(user, adminFeatureContainer);
    renderUserMenu(userDropdown, dropdownMenu, user);
    return;
  }

  renderGuestMenu(userDropdown, dropdownMenu);
};
