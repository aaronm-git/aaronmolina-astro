import gulp from 'gulp';

// Import tasks from separate files
import { createWebp, watchImages } from './tasks/images.js';

// Register individual tasks
gulp.task('createWebp', createWebp);
gulp.task('watchImages', watchImages);

// Composite tasks
gulp.task('images', gulp.series('createWebp'));

// Default task
gulp.task('default', gulp.series('createWebp'));
