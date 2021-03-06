var gulp = require("gulp");

var assetsGlob = "./src/**/*.{scss,svg,jpg,png}"

gulp.task("copy-assets", function() {
  gulp.src(assetsGlob)
    .pipe(gulp.dest("./lib/src"))
})

gulp.task("default",["copy-assets"], function() {
  gulp.watch(assetsGlob, ["copy-assets"])
})
