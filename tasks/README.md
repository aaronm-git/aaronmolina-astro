# Gulp Tasks

This directory contains separated gulp task files for better organization and maintainability.

## Structure

- `decap-cms-converter.js` - Converts DecapCMS TypeScript config to YAML format
- `images.js` - Image processing and optimization tasks  
- `watch.js` - File watching tasks
- `README.md` - This documentation file

## Tasks

### DecapCMS Tasks
- `convertConfig` - Converts DecapCMS TypeScript config to YAML format

### Image Tasks
- `createWebp` - Creates WebP versions of images
- `images` - Composite task that runs createWebp

### Watch Tasks
- `watchConfig` - Watches for changes in cms-config.ts
- `watchImages` - Watches for new images to process

## Usage

These tasks are imported and registered in the main `gulpfile.js`. Run them using:

```bash
# Convert config
gulp convertConfig

# Process images
gulp images

# Watch for changes
gulp watchConfig
gulp watchImages

# Default task (converts config)
gulp
```

## Why This Structure?

- **Separation of Concerns**: Each file handles a specific type of task
- **Maintainability**: Easier to find and modify specific functionality
- **Reusability**: Tasks can be imported and used in different contexts
- **Development Focus**: These are build tools, not part of the website bundle 