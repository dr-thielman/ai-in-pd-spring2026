import { defineConfig } from 'vite';

// HMR is disabled per the demo plan: full reload between iterations
// keeps the physics state clean during the recorded handoffs.
export default defineConfig({
  server: {
    hmr: false,
  },
  optimizeDeps: {
    exclude: ['@dimforge/rapier3d-compat'],
  },
});
