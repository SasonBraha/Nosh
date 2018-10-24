'use strict';

// Toasts
const toastContainer = document.querySelector('.toast-container');
const toast = (className, message) => {
  const toastEl = document.createElement('div');
  toastEl.className = `toast ${className}`;
  toastEl.textContent = message;
  toastContainer.appendChild(toastEl); 
  setTimeout(() => toastEl.remove(), 4500);
}