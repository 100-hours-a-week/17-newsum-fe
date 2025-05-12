// src/utils/auth.js
export function isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }
  