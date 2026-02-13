import { enforceAdminAccess } from "./access.js";
import { setupNavigation } from "./navigation.js";
import { initProductsModule } from "./products.js";
import { initOrdersModule } from "./orders.js";
import { initCustomersModule } from "./customers.js";

const initDashboardModules = () => {
  setupNavigation();
  initProductsModule();
  initOrdersModule();
  initCustomersModule();
};

enforceAdminAccess(initDashboardModules);
