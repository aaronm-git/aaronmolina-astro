#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const technologiesDir = path.join(__dirname, '../src/content/technologies');
const outputFile = path.join(__dirname, '../src/data/skill-labels.json');

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all technology files and build mapping
const skillLabels = {};

const files = fs.readdirSync(technologiesDir);

files.forEach((file) => {
  if (file.endsWith('.json')) {
    const filePath = path.join(technologiesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const tech = JSON.parse(content);

    if (tech.slug && tech.name) {
      skillLabels[tech.slug] = tech.name;
    }
  }
});

// Sort by key for consistent output
const sortedLabels = Object.keys(skillLabels)
  .sort()
  .reduce((acc, key) => {
    acc[key] = skillLabels[key];
    return acc;
  }, {});

// Write to file
fs.writeFileSync(outputFile, JSON.stringify(sortedLabels, null, 2) + '\n');

console.log(`✓ Generated skill labels mapping: ${outputFile}`);
console.log(`✓ Found ${Object.keys(sortedLabels).length} skills`);
