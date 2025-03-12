"use client"
import React, { useState, useEffect } from 'react';
import './Notification.css';

interface NotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`notification ${show ? 'show' : ''}`}>
      <div className="notification-content">
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;