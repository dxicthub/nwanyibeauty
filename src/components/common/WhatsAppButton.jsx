import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const { settings } = useSettings();
  
  const phoneNumber = settings?.whatsappNumber || '';
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  if (!cleanNumber) return null;

  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default WhatsAppButton;