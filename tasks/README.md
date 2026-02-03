# Gulp Tasks

This directory contains separated gulp task files for better organization and maintainability.

## Structure

- `images.js` - Image processing and optimization tasks
- `README.md` - This documentation file

## Tasks

### Image Tasks
- `createWebp` - Creates WebP versions of images
- `images` - Composite task that runs createWebp
- `watchImages` - Watches for new images to process

## Usage

These tasks are imported and registered in the main `gulpfile.js`. Run them using:

```bash
# Process images
gulp images

# Watch for new images
gulp watchImages

# Default task (process images)
gulp
```

## Why This Structure?

- **Separation of Concerns**: Each file handles a specific type of task
- **Maintainability**: Easier to find and modify specific functionality
- **Reusability**: Tasks can be imported and used in different contexts
- **Development Focus**: These are build tools, not part of the website bundle
