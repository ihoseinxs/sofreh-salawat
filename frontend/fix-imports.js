const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/components/Layout.tsx',
  'src/pages/Content.tsx',
  'src/pages/CreatePrayer.tsx',
  'src/pages/Home.tsx',
  'src/pages/Login.tsx',
  'src/pages/NotFound.tsx',
  'src/pages/PrayerDetail.tsx',
  'src/pages/Prayers.tsx',
  'src/pages/Profile.tsx',
  'src/pages/Register.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove unused React imports
    content = content.replace(/import React from 'react';?\n?/g, '');
    content = content.replace(/import React, /g, 'import ');
    
    // Remove unused imports
    content = content.replace(/import \{ [^}]*React[^}]* \} from 'react';?\n?/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log('Import fixes completed!'); 