import gulp from 'gulp';

// Import tasks from separate files
import { convertTsConfigToYaml } from './tasks/decap-cms-converter.js';
import { createWebp, watchImages } from './tasks/images.js';
import { watchConfig } from './tasks/watch.js';

// Register individual tasks
gulp.task('convertConfig', convertTsConfigToYaml);
gulp.task('createWebp', createWebp);
gulp.task('watchImages', watchImages);
gulp.task('watchConfig', watchConfig);

// Composite tasks
gulp.task('images', gulp.series('createWebp'));

// Default task
gulp.task('default', gulp.series('convertConfig')); 