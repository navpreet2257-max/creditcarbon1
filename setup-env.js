const fs = require('fs');

const envVars = {
  REACT_APP_SITE_NAME: "Credit Carbon Trading Platform",
  REACT_APP_DOMAIN: "credit-carbon.netlify.app",
  REACT_APP_BACKEND_URL: "https://carboncredits-backend.railway.app"
};

// Create the .env file content
const envContent = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

// Write to multiple env files to ensure it's picked up
['frontend/.env', 'frontend/.env.production', 'frontend/.env.local', 'frontend/build/.env'].forEach(file => {
  fs.writeFileSync(file, envContent);
  console.log(`Created ${file}`);
});