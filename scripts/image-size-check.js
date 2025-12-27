#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const imagesDir = path.join(process.cwd(), 'src', 'images');

// Recommended size thresholds (in KB)
const THRESHOLDS = {
<<<<<<< HEAD
  excellent: 50,     // Under 50KB - Blue (Perfect for icons, logos)
  good: 150,         // 50-150KB - Cyan (Great for small graphics)
  acceptable: 300,   // 150-300KB - Green (Good for product photos)
  warning: 500,      // 300-500KB - Yellow (Acceptable for hero images)
  poor: 1000,        // 500-1000KB - Orange (Getting large)
=======
  excellent: 50, // Under 50KB - Blue (Perfect for icons, logos)
  good: 150, // 50-150KB - Cyan (Great for small graphics)
  acceptable: 300, // 150-300KB - Green (Good for product photos)
  warning: 500, // 300-500KB - Yellow (Acceptable for hero images)
  poor: 1000, // 500-1000KB - Orange (Getting large)
>>>>>>> master
  // Over 1000KB - Red (Too large)
};

// Convert file size to appropriate color
function getColorForSize(sizeKB) {
  if (sizeKB <= THRESHOLDS.excellent) {
    return chalk.blue;
  } else if (sizeKB <= THRESHOLDS.good) {
    return chalk.cyan;
  } else if (sizeKB <= THRESHOLDS.acceptable) {
    return chalk.green;
  } else if (sizeKB <= THRESHOLDS.warning) {
    return chalk.yellow;
  } else if (sizeKB <= THRESHOLDS.poor) {
    return chalk.hex('#FFA500'); // Orange
  } else {
    return chalk.red;
  }
}

// Get file size recommendation
function getSizeRecommendation(sizeKB) {
  if (sizeKB <= THRESHOLDS.excellent) {
    return '✅ Excellent';
  } else if (sizeKB <= THRESHOLDS.good) {
    return '👍 Great';
  } else if (sizeKB <= THRESHOLDS.acceptable) {
    return '👍 Good';
  } else if (sizeKB <= THRESHOLDS.warning) {
    return '⚠️ Large';
  } else if (sizeKB <= THRESHOLDS.poor) {
    return '🔶 Too Large';
  } else {
    return '🔴 Way Too Large';
  }
}

// Format file size
function formatSize(bytes) {
  const kb = Math.round(bytes / 1024);
  return `${kb} KB`;
}

// Main function to check image sizes
function checkImageSizes() {
  if (!fs.existsSync(imagesDir)) {
    console.log(chalk.red('❌ Images directory not found: public/images'));
    return;
  }

  console.log(chalk.bold.white('\n📁 Image Size Analysis\n'));
  console.log(chalk.gray(`Directory: ${imagesDir}\n`));

  // Read all files in the images directory
  const files = fs.readdirSync(imagesDir, { withFileTypes: true });
  const imageFiles = files.filter(file => {
    if (file.isDirectory()) return false;
    const ext = path.extname(file.name).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log(chalk.yellow(`📂 No image files found in ${imagesDir}`));
    return;
  }

  // Sort files by size (largest first)
<<<<<<< HEAD
  const fileStats = imageFiles.map(file => {
    const filePath = path.join(imagesDir, file.name);
    const stats = fs.statSync(filePath);
    return {
      name: file.name,
      size: stats.size,
      sizeKB: Math.round(stats.size / 1024)
    };
  }).sort((a, b) => b.size - a.size);
=======
  const fileStats = imageFiles
    .map(file => {
      const filePath = path.join(imagesDir, file.name);
      const stats = fs.statSync(filePath);
      return {
        name: file.name,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024),
      };
    })
    .sort((a, b) => b.size - a.size);
>>>>>>> master

  // Display files with color coding
  fileStats.forEach((file, index) => {
    const colorFn = getColorForSize(file.sizeKB);
    const recommendation = getSizeRecommendation(file.sizeKB);
    const formattedSize = formatSize(file.size);
<<<<<<< HEAD
    
    console.log(
      `${colorFn('●')} ${colorFn(file.name)} ${chalk.gray('(')}${chalk.white(formattedSize)}${chalk.gray(')')} ${recommendation}`
    );
=======

    console.log(`${colorFn('●')} ${colorFn(file.name)} ${chalk.gray('(')}${chalk.white(formattedSize)}${chalk.gray(')')} ${recommendation}`);
>>>>>>> master
  });

  // Summary statistics
  const totalSize = fileStats.reduce((sum, file) => sum + file.size, 0);
  const avgSize = Math.round(totalSize / fileStats.length / 1024);
  const largestFile = fileStats[0];
  const smallestFile = fileStats[fileStats.length - 1];

  console.log(chalk.gray('\n' + '─'.repeat(60)));
  console.log(chalk.bold.white('\n📊 Summary:'));
  console.log(`${chalk.gray('Total files:')} ${chalk.white(fileStats.length)}`);
  console.log(`${chalk.gray('Total size:')} ${chalk.white(formatSize(totalSize))}`);
  console.log(`${chalk.gray('Average size:')} ${chalk.white(avgSize + ' KB')}`);
  console.log(`${chalk.gray('Largest file:')} ${getColorForSize(largestFile.sizeKB)(largestFile.name)} (${formatSize(largestFile.size)})`);
  console.log(`${chalk.gray('Smallest file:')} ${getColorForSize(smallestFile.sizeKB)(smallestFile.name)} (${formatSize(smallestFile.size)})`);

  // Recommendations
  const problematicFiles = fileStats.filter(file => file.sizeKB > THRESHOLDS.warning);
  const veryLargeFiles = fileStats.filter(file => file.sizeKB > THRESHOLDS.poor);
<<<<<<< HEAD
  
=======

>>>>>>> master
  if (veryLargeFiles.length > 0) {
    console.log(chalk.red(`\n🚨 ${veryLargeFiles.length} file(s) are too large (>1MB)`));
    console.log(chalk.gray('These files may cause performance issues and slow loading times'));
  }
<<<<<<< HEAD
  
=======

>>>>>>> master
  if (problematicFiles.length > 0) {
    console.log(chalk.yellow(`\n⚠️  ${problematicFiles.length} file(s) exceed recommended limits (>500KB)`));
    console.log(chalk.gray('Consider optimizing these files or converting to WebP format'));
  }

  console.log(chalk.gray('\n' + '─'.repeat(60)));
  console.log(chalk.bold.white('\n🎨 Color Legend:'));
  console.log(`${chalk.blue('●')} ${chalk.gray('Excellent (<50KB) - Icons, logos')}`);
  console.log(`${chalk.cyan('●')} ${chalk.gray('Great (50-150KB) - Small graphics')}`);
  console.log(`${chalk.green('●')} ${chalk.gray('Good (150-300KB) - Product photos')}`);
  console.log(`${chalk.yellow('●')} ${chalk.gray('Large (300-500KB) - Hero images')}`);
  console.log(`${chalk.hex('#FFA500')('●')} ${chalk.gray('Too Large (500-1000KB)')}`);
  console.log(`${chalk.red('●')} ${chalk.gray('Way Too Large (>1000KB)')}`);
  console.log(chalk.gray('\n💡 Recommended to keep images under 500KB for optimal performance'));
  console.log('');
}

// Run the script
<<<<<<< HEAD
checkImageSizes(); 
=======
checkImageSizes();
>>>>>>> master
