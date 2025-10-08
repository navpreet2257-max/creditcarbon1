// Simple production build script for Carbon Credit Management System
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌱 Building Carbon Credit Management System for production...');

try {
  // Create a simple production build
  console.log('📦 Creating production build...');
  
  // Create build directory
  const buildDir = path.join(__dirname, 'build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Create a simple index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carbon Credit Management System</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #6b8e23 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 50px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 600px;
        }
        .logo {
            font-size: 4em;
            margin-bottom: 20px;
        }
        h1 {
            color: #2d3748;
            margin-bottom: 15px;
        }
        .subtitle {
            color: #718096;
            margin-bottom: 30px;
        }
        .btn {
            background: #4a7c59;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            font-weight: bold;
        }
        .btn:hover {
            background: #6b8e23;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌱</div>
        <h1>Carbon Credit Management System</h1>
        <p class="subtitle">Help Your Business Go Carbon Neutral</p>
        <p>Your sustainable business platform is ready for deployment!</p>
        <a href="https://carboncredits.tk" class="btn">🚀 Launch Platform</a>
        <a href="https://carboncredits.tk/api/docs" class="btn">📚 API Documentation</a>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
  
  console.log('✅ Production build created successfully!');
  console.log('📁 Build directory: build/');
  console.log('🌐 Ready for Netlify deployment!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}



