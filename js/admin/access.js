import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import * as dbService from "../services.js";

export const enforceAdminAccess = (onAuthorized) => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "../login.html";
      return;
    }

    const role = await dbService.getUserRole(user.uid);
    if (role !== "admin") {
      alert("Bạn không có quyền truy cập!");
      window.location.href = "../index.html";
      return;
    }

    onAuthorized();
  });
};
