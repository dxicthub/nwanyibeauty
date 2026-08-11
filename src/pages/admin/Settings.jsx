import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useSettings } from '../../context/SettingsContext';
import { FiSave, FiX, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiLinkedin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { settings, loading, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    phoneNumber: '',
    whatsappNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: '',
    },
    openingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '', close: '' },
    },
    aboutText: '',
    footerText: '',
    deliveryFee: '',
    minimumOrderAmount: '',
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (settings) {
      setFormData({
        businessName: settings.businessName || '',
        businessEmail: settings.businessEmail || '',
        phoneNumber: settings.phoneNumber || '',
        whatsappNumber: settings.whatsappNumber || '',
        address: {
          street: settings.address?.street || '',
          city: settings.address?.city || '',
          state: settings.address?.state || '',
          country: settings.address?.country || '',
          postalCode: settings.address?.postalCode || '',
        },
        socialMedia: {
          facebook: settings.socialMedia?.facebook || '',
          instagram: settings.socialMedia?.instagram || '',
          twitter: settings.socialMedia?.twitter || '',
          youtube: settings.socialMedia?.youtube || '',
          linkedin: settings.socialMedia?.linkedin || '',
        },
        openingHours: {
          monday: settings.openingHours?.monday || { open: '09:00', close: '18:00' },
          tuesday: settings.openingHours?.tuesday || { open: '09:00', close: '18:00' },
          wednesday: settings.openingHours?.wednesday || { open: '09:00', close: '18:00' },
          thursday: settings.openingHours?.thursday || { open: '09:00', close: '18:00' },
          friday: settings.openingHours?.friday || { open: '09:00', close: '18:00' },
          saturday: settings.openingHours?.saturday || { open: '10:00', close: '16:00' },
          sunday: settings.openingHours?.sunday || { open: '', close: '' },
        },
        aboutText: settings.aboutText || '',
        footerText: settings.footerText || '',
        deliveryFee: settings.deliveryFee || '',
        minimumOrderAmount: settings.minimumOrderAmount || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Clean up data
    const cleanData = {
      ...formData,
      deliveryFee: parseFloat(formData.deliveryFee) || 0,
      minimumOrderAmount: parseFloat(formData.minimumOrderAmount) || 0,
    };
    
    const result = await updateSettings(cleanData);
    setSaving(false);
    
    if (result.success) {
      toast.success('Settings updated successfully');
    } else {
      toast.error(result.error || 'Failed to update settings');
    }
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Social Media' },
    { id: 'hours', label: 'Hours' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex pt-16">
          <AdminSidebar />
          <div className="flex-1 flex justify-center items-center">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="flex pt-16">
        <AdminSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-gray-900">Website Settings</h1>
            <p className="text-gray-600 mt-1">Manage your business configuration</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="label">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Your business name"
                    />
                  </div>

                  <div>
                    <label className="label">About Text</label>
                    <textarea
                      name="aboutText"
                      value={formData.aboutText}
                      onChange={handleChange}
                      rows="4"
                      className="input-field"
                      placeholder="Tell customers about your business..."
                    />
                  </div>

                  <div>
                    <label className="label">Footer Text</label>
                    <input
                      type="text"
                      name="footerText"
                      value={formData.footerText}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="© 2024 Your Business. All rights reserved."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Delivery Fee</label>
                      <input
                        type="number"
                        name="deliveryFee"
                        value={formData.deliveryFee}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="label">Minimum Order Amount</label>
                      <input
                        type="number"
                        name="minimumOrderAmount"
                        value={formData.minimumOrderAmount}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Settings */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <label className="label">Business Email</label>
                    <input
                      type="email"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="info@yourbusiness.com"
                    />
                  </div>

                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="label">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold mb-4">Business Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="label">Street Address</label>
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="label">City</label>
                          <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <label className="label">State</label>
                          <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="NY"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="label">Country</label>
                          <input
                            type="text"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="United States"
                          />
                        </div>
                        <div>
                          <label className="label">Postal Code</label>
                          <input
                            type="text"
                            name="address.postalCode"
                            value={formData.address.postalCode}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="10001"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Settings */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="label flex items-center">
                        <FiFacebook className="mr-2 text-blue-600" /> Facebook
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.facebook}
                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        className="input-field"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="label flex items-center">
                        <FiInstagram className="mr-2 text-pink-600" /> Instagram
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.instagram}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        className="input-field"
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="label flex items-center">
                        <FiTwitter className="mr-2 text-blue-400" /> Twitter
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.twitter}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        className="input-field"
                        placeholder="https://twitter.com/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="label flex items-center">
                        <FiYoutube className="mr-2 text-red-600" /> YouTube
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.youtube}
                        onChange={(e) => handleSocialChange('youtube', e.target.value)}
                        className="input-field"
                        placeholder="https://youtube.com/yourchannel"
                      />
                    </div>
                    <div>
                      <label className="label flex items-center">
                        <FiLinkedin className="mr-2 text-blue-700" /> LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.linkedin}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        className="input-field"
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {activeTab === 'hours' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">
                    Set your business opening hours. Leave empty for closed.
                  </p>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <label className="font-medium capitalize">{day}</label>
                      <div>
                        <label className="text-xs text-gray-500">Open</label>
                        <input
                          type="time"
                          value={formData.openingHours[day]?.open || ''}
                          onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Close</label>
                        <input
                          type="time"
                          value={formData.openingHours[day]?.close || ''}
                          onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary inline-flex items-center justify-center disabled:opacity-50"
                >
                  <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;