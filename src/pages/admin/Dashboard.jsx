import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  FiPackage, 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch products
      const productsRes = await api.get('/products?limit=1');
      const products = productsRes.data.products || [];
      
      // Fetch orders
      const ordersRes = await api.get('/orders?limit=10');
      const orders = ordersRes.data.orders || [];
      
      // Fetch customers
      const usersRes = await api.get('/users');
      const users = usersRes.data.users || [];

      // Calculate stats
      const totalProducts = productsRes.data.pagination?.total || products.length;
      const totalCustomers = users.length;
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
      const completedOrders = orders.filter(o => o.orderStatus === 'completed').length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      
      // Low stock products (stock < 10)
      const lowStock = products.filter(p => p.stock < 10).length;

      setStats({
        totalProducts,
        totalCustomers,
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        lowStockProducts: lowStock,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: FiUsers,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingBag,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
  ];

  const statusCards = [
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: FiClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Low Stock Products',
      value: stats.lowStockProducts,
      icon: FiXCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="flex pt-16">
        <AdminSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statusCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.color} mt-1`}>{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{order.orderNumber}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-700">{order.customerDetails?.fullName || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">${order.total?.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.orderStatus === 'processing' ? 'bg-purple-100 text-purple-800' :
                            order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <button className="bg-primary-600 text-white p-4 rounded-xl hover:bg-primary-700 transition-colors text-center">
              <FiPackage className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Product</span>
            </button>
            <button className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors text-center">
              <FiShoppingBag className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">View Orders</span>
            </button>
            <button className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors text-center">
              <FiUsers className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage Customers</span>
            </button>
            <button className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors text-center">
              <FiTrendingUp className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;