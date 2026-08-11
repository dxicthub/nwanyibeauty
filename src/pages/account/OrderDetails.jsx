import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/order';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(id);
      setOrder(response.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error.response?.status === 404) {
        navigate('/account/orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <FiClock className="text-yellow-600" />;
      case 'confirmed':
        return <FiCheckCircle className="text-blue-600" />;
      case 'processing':
        return <FiPackage className="text-purple-600" />;
      case 'ready':
        return <FiTruck className="text-indigo-600" />;
      case 'completed':
        return <FiCheckCircle className="text-green-600" />;
      default:
        return <FiPackage className="text-gray-600" />;
    }
  };

  const getStatusSteps = () => {
    const steps = ['pending', 'confirmed', 'processing', 'ready', 'completed'];
    const currentIndex = steps.indexOf(order?.orderStatus);
    
    return steps.map((step, index) => ({
      step,
      label: step.charAt(0).toUpperCase() + step.slice(1),
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="pt-16 flex justify-center items-center min-h-screen">
        <div className="loading-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-16 container-custom py-12 text-center">
        <h2 className="text-2xl font-semibold">Order not found</h2>
        <Link to="/account/orders" className="btn-primary inline-block mt-4">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <Link to="/account/orders" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FiArrowLeft className="mr-2" /> Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold">{order.orderNumber}</h1>
              <p className="text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className={`text-sm px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6 relative">
              {getStatusSteps().map((step, index) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? <FiCheckCircle /> : <FiClock />}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {step.active && (
                      <p className="text-sm text-primary-600">Current status</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/80x80/ec4899/ffffff?text=' + item.name}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.sku || 'N/A'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span className="font-bold text-primary-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <p className="text-gray-600 text-sm">
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                {order.deliveryAddress.country} {order.deliveryAddress.postalCode}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p className="text-gray-600 text-sm capitalize">
                {order.paymentMethod.replace('_', ' ')}
              </p>
              <p className={`text-sm capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                Status: {order.paymentStatus}
              </p>
            </div>

            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Order Notes</h3>
                <p className="text-gray-600 text-sm">{order.notes}</p>
              </div>
            )}

            <Link to="/shop" className="block w-full btn-primary text-center mt-6">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;