import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiMail, FiPhone, FiArrowRight } from 'react-icons/fi';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="pt-16 container-custom py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">No order found</h2>
        <Link to="/shop" className="btn-primary inline-block mt-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Order Successfully Placed!</h1>
            <p className="text-gray-600 mt-2">Thank you for your order.</p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="text-xl font-bold text-primary-600">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">${order.total?.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiPackage className="text-gray-400" />
                <span>
                  <span className="font-medium">{order.items?.length}</span> items ordered
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiMail className="text-gray-400" />
                <span>Confirmation sent to <span className="font-medium">{order.customerDetails?.email}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiPhone className="text-gray-400" />
                <span>We'll contact you at <span className="font-medium">{order.customerDetails?.phone}</span></span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
            <p className="text-gray-600 text-sm">
              {order.deliveryAddress?.street}<br />
              {order.deliveryAddress?.city}, {order.deliveryAddress?.state}<br />
              {order.deliveryAddress?.country} {order.deliveryAddress?.postalCode}
            </p>
          </div>

          {/* Order Items Summary */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                  <span>
                    {item.name} <span className="text-gray-500">×{item.quantity}</span>
                  </span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/account/orders" className="flex-1 btn-secondary text-center">
              View My Orders
            </Link>
            <Link to="/shop" className="flex-1 btn-primary text-center inline-flex items-center justify-center">
              Continue Shopping <FiArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              We will contact you shortly to confirm your order.
            </p>
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Need help? Contact us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;