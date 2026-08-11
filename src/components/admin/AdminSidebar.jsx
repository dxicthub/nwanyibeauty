import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiBarChart2,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(['products']);

  const toggleExpand = (item) => {
    setExpandedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: FiHome,
      path: '/admin/dashboard',
      exact: true,
    },
    {
      key: 'products',
      label: 'Products',
      icon: FiPackage,
      path: '/admin/products',
      children: [
        { label: 'All Products', path: '/admin/products' },
        { label: 'Add New', path: '/admin/products/new' },
      ],
    },
    {
      key: 'categories',
      label: 'Categories',
      icon: FiGrid,
      path: '/admin/categories',
    },
    {
      key: 'orders',
      label: 'Orders',
      icon: FiShoppingBag,
      path: '/admin/orders',
    },
    {
      key: 'customers',
      label: 'Customers',
      icon: FiUsers,
      path: '/admin/customers',
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: FiMessageSquare,
      path: '/admin/messages',
      badge: 3, // Example badge count
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: FiSettings,
      path: '/admin/settings',
    },
  ];

  const renderNavItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key);
    const isActiveItem = isActive(item.path);

    return (
      <div key={item.key} className="mb-1">
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpand(item.key)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                isActiveItem
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ paddingLeft: `${depth * 16 + 16}px` }}
            >
              <div className="flex items-center">
                <item.icon className={`w-5 h-5 ${isActiveItem ? 'text-primary-600' : 'text-gray-400'} mr-3 flex-shrink-0`} />
                <span className="text-sm">{item.label}</span>
              </div>
              <div className="flex items-center">
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 mr-2">
                    {item.badge}
                  </span>
                )}
                {isExpanded ? (
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <FiChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
            {isExpanded && (
              <div className="mt-1 space-y-1">
                {item.children.map(child => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive: isChildActive }) =>
                      `block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                        isChildActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                    style={{ paddingLeft: `${depth * 16 + 48}px` }}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive: isNavActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isNavActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
            style={{ paddingLeft: `${depth * 16 + 16}px` }}
          >
            <item.icon className={`w-5 h-5 ${isActiveItem ? 'text-primary-600' : 'text-gray-400'} mr-3 flex-shrink-0`} />
            <span className="text-sm">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {item.badge}
              </span>
            )}
          </NavLink>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      {/* Sidebar Header */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            LB
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">Manage your store</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Products</p>
            <p className="text-lg font-bold text-gray-900">156</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Orders</p>
            <p className="text-lg font-bold text-gray-900">43</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4">
        <div className="space-y-1">
          {navItems.map(item => renderNavItem(item))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="px-4 py-4 border-t border-gray-200 mt-auto">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <FiBarChart2 className="text-primary-600 w-5 h-5" />
            <div>
              <p className="text-xs text-gray-500">Today's Revenue</p>
              <p className="text-sm font-bold text-gray-900">$1,284.00</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;