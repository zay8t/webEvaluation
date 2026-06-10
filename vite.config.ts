import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        profile: resolve(__dirname, 'profile.html'),
        orders: resolve(__dirname, 'orders.html'),
        ordersHistory: resolve(__dirname, 'orders-history.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        confirmation: resolve(__dirname, 'confirmation.html'),
        admin: resolve(__dirname, 'admin.html'),
        apiTester: resolve(__dirname, 'API_TESTER.html'),
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});