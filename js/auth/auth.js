import { saveCurrentPage } from "../utils.js";
import { setupLoginForm, setupRegisterForm } from "./forms.js";
import { initAuthStateListener } from "./session.js";

saveCurrentPage();

let isRegistering = false;
const getRegisteringState = () => isRegistering;
const setRegisteringState = (value) => {
  isRegistering = value;
};

initAuthStateListener(getRegisteringState);
setupRegisterForm(setRegisteringState);
setupLoginForm();
