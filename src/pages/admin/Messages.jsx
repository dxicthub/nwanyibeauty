import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';
import { FiMail, FiEye, FiCheckCircle, FiX, FiTrash2, FiSearch, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowDetailsModal(true);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      try {
        await api.put(`/contact/${message._id}`, { status: 'read' });
        fetchMessages();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}`, { status: 'read' });
      toast.success('Message marked as read');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      unread: 'bg-red-100 text-red-700',
      read: 'bg-green-100 text-green-700',
      replied: 'bg-blue-100 text-blue-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.status === filter;
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      message.name?.toLowerCase().includes(search) ||
      message.email?.toLowerCase().includes(search) ||
      message.subject?.toLowerCase().includes(search) ||
      message.message?.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="flex pt-16">
        <AdminSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Contact Messages</h1>
              <p className="text-gray-600 mt-1">Manage customer inquiries</p>
            </div>
            <div className="mt-4 sm:mt-0 text-sm text-gray-500">
              Total: {messages.length} messages
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {messages.filter(m => m.status === 'unread').length} unread
                </span>
              )}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    filter === 'unread'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    filter === 'read'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Read
                </button>
                <button
                  onClick={() => setFilter('replied')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    filter === 'replied'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Replied
                </button>
              </div>
            </div>
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <FiMail className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No messages found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message._id}
                  className={`bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    message.status === 'unread' ? 'border-l-4 border-red-500' : ''
                  }`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{message.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(message.status)}`}>
                          {message.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{message.email} • {message.phone}</p>
                      <p className="font-medium text-gray-700 mt-1">{message.subject}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {message.status === 'unread' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(message._id);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <FiCheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message._id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Details Modal */}
      {showDetailsModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Message Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Sender Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{selectedMessage.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Received</p>
                      <p className="font-medium">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <p className="text-xs text-gray-500">Subject</p>
                  <p className="font-semibold text-lg">{selectedMessage.subject}</p>
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs text-gray-500">Message</p>
                  <div className="bg-gray-50 rounded-lg p-4 mt-1 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {selectedMessage.status === 'unread' && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(selectedMessage._id);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                    >
                      <FiCheckCircle className="mr-2" /> Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 btn-primary inline-flex items-center justify-center"
                  >
                    <FiMail className="mr-2" /> Reply via Email
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteMessage(selectedMessage._id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center justify-center"
                  >
                    <FiTrash2 className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;