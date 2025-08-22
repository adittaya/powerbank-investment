// This file is for Netlify build optimization
// It ensures environment variables are correctly set during build time

// Check if required environment variables are set
const requiredEnvVars = [
  'REACT_APP_API_URL',
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Warning: The following environment variables are not set:');
  missingEnvVars.forEach(envVar => console.warn(`  - ${envVar}`));
  console.warn('This may cause issues in the application.');
}

// Export environment variables for build process
module.exports = {
  webpack: (config, { isServer }) => {
    // Add any webpack optimizations here if needed
    return config;
  },
};