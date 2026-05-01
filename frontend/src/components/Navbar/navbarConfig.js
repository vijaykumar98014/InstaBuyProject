const NAV_CONFIG = {
  USER: [
    { key: 'inventory', label: 'Inventory', path: '/inventory' },
    { key: 'cart', label: 'Cart', path: '/cart' },
    { key: 'orders', label: 'Orders', path: '/orders' }
  ],
  ADMIN: [
    { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { key: 'inventory', label: 'Inventory', path: '/inventory' },
    { key: 'orders', label: 'Orders', path: '/orders' },
  ]
};

export function getNavItems(role = 'USER') {
  return NAV_CONFIG[role] || NAV_CONFIG.USER;
}

export default NAV_CONFIG;
