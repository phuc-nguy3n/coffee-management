import * as dbService from "../services.js";

export const initCustomersModule = () => {
  dbService.subscribeCustomers((snapshot) => {
    const list = document.getElementById("customer-list-render");
    if (!list) return;

    list.textContent = "";
    snapshot.forEach((docSnap) => {
      const u = docSnap.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u?.displayName || "N/A"}</td>
        <td>${u?.email || ""}</td>
        <td><span class="badge bg-info">${u?.role || ""}</span></td>
        <td>${u?.createdAt && typeof u.createdAt.toDate === "function" ? u.createdAt.toDate().toLocaleDateString("vi-VN") : "N/A"}</td>
      `;
      list.appendChild(tr);
    });
  });
};
