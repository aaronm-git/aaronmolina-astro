import gulp from "gulp";
import imagemin from "gulp-imagemin";
import imageminWebp from "imagemin-webp";
import rename from "gulp-rename";

// Create WebP versions of images
export function createWebp() {
  return gulp
    .src([
      "public/images/**/*.{jpg,jpeg,png}",
      "!public/images/**/*.webp",
      "!public/images/**/*-webp-processed.*",
    ])
    .pipe(imagemin([imageminWebp({ quality: 50 })]))
    .pipe(
      rename((path) => {
        // Mark as processed and change extension
        path.basename += "-webp-processed";
        path.extname = ".webp";
      })
    )
    .pipe(gulp.dest("public/images"));
}

// Watch images for changes
export function watchImages() {
  gulp.watch(
    [
      "public/images/**/*.{jpg,jpeg,png}",
      "!public/images/**/*-webp-processed.*",
    ],
    gulp.series("createWebp")
  );
}
