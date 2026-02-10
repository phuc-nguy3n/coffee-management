export const setupNavigation = () => {
  const navLinks = document.querySelectorAll("#sidebar-wrapper .list-group-item");
  const sections = document.querySelectorAll(".admin-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const sectionTarget = link.getAttribute("data-section");
      if (!sectionTarget) return;

      e.preventDefault();
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      sections.forEach((s) => s.classList.add("d-none"));
      document
        .getElementById(`section-${sectionTarget}`)
        ?.classList.remove("d-none");

      const pageTitle = document.querySelector("#page-content-wrapper h2");
      if (pageTitle) pageTitle.innerText = link.innerText.trim();
    });
  });
};
