import * as dbService from "../services/index.js";
import { formatFirestoreDate } from "../utils/date.js";

export const initCustomersModule = () => {
  dbService.subscribeCustomers((snapshot) => {
    const list = document.getElementById("customer-list-render");
    if (!list) return;

    list.textContent = "";
    snapshot.forEach((docSnap) => {
      const u = docSnap.data();
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = u?.displayName || "N/A";

      const tdEmail = document.createElement("td");
      tdEmail.textContent = u?.email || "";

      const tdRole = document.createElement("td");
      const roleBadge = document.createElement("span");
      roleBadge.className = "badge bg-info";
      roleBadge.textContent = u?.role || "";
      tdRole.appendChild(roleBadge);

      const tdCreated = document.createElement("td");
      tdCreated.textContent = formatFirestoreDate(u?.createdAt);

      tr.appendChild(tdName);
      tr.appendChild(tdEmail);
      tr.appendChild(tdRole);
      tr.appendChild(tdCreated);

      list.appendChild(tr);
    });
  });
};
