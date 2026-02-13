import { auth } from "../config/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import * as dbService from "../services/index.js";
import { MESSAGES } from "../config/constants.js";

export const enforceAdminAccess = (onAuthorized) => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "../login.html";
      return;
    }
    try {
      const role = await dbService.getUserRole(user.uid);
      if (role !== "admin") {
        alert(MESSAGES.accessDenied);
        window.location.href = "../index.html";
        return;
      }
      onAuthorized();
    } catch (error) {
      console.error("Access check failed:", error);
      window.location.href = "../index.html";
    }
  });
};
