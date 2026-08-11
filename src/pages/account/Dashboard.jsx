import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/order';
import { FiUser, FiPackage, FiShoppingBag, FiClock, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      const ordersData = response.orders || [];
      setOrders(ordersData);
      
      // Calculate stats
      const total = ordersData.length;
      const pending = ordersData.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
      const completed = ordersData.filter(o => o.orderStatus === 'completed').length;
      
      setStats({
        totalOrders: total,
        pendingOrders: pending,
        completedOrders: completed,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
          </div>
          <Link to="/account/profile" className="btn-secondary text-sm py-2 px-4">
            Edit Profile
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiShoppingBag className="text-primary-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Orders</p>
                <p className="text-2xl font-bold">{stats.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiPackage className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/shop"
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <FiShoppingBag className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold">Shop Now</p>
                <p className="text-sm text-gray-500">Browse products</p>
              </div>
            </div>
            <FiArrowRight className="text-gray-400" />
          </Link>

          <Link
            to="/account/orders"
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <FiPackage className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">My Orders</p>
                <p className="text-sm text-gray-500">View order history</p>
              </div>
            </div>
            <FiArrowRight className="text-gray-400" />
          </Link>

          <Link
            to="/account/profile"
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <FiUser className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">Profile</p>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>
            </div>
            <FiArrowRight className="text-gray-400" />
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/account/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn-primary inline-block mt-4">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{order.orderNumber}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.orderStatus === 'completed' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                          order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.orderStatus === 'processing' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <span className="font-bold text-primary-600">${order.total.toFixed(2)}</span>
                      <Link
                        to={`/account/order/${order._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;