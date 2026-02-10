import { saveCurrentPage } from "./utils.js";
import { setupLoginForm, setupRegisterForm } from "./auth/forms.js";
import { initAuthStateListener } from "./auth/session.js";

saveCurrentPage();

let isRegistering = false;
const getRegisteringState = () => isRegistering;
const setRegisteringState = (value) => {
  isRegistering = value;
};

initAuthStateListener(getRegisteringState);
setupRegisterForm(setRegisteringState);
setupLoginForm();
