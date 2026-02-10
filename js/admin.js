import { enforceAdminAccess } from "./admin/access.js";
import { setupNavigation } from "./admin/navigation.js";
import { initProductsModule } from "./admin/products.js";
import { initOrdersModule } from "./admin/orders.js";
import { initCustomersModule } from "./admin/customers.js";

const initDashboardModules = () => {
  setupNavigation();
  initProductsModule();
  initOrdersModule();
  initCustomersModule();
};

enforceAdminAccess(initDashboardModules);
