import gulp from 'gulp';

// Watch config file for changes
export function watchConfig() {
  gulp.watch('cms-config.ts', gulp.series('convertConfig'));
} 