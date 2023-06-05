import gulp from 'gulp';
import node_sass from 'sass';
import gulpSass from 'gulp-sass'
import ts from 'gulp-typescript'
const sass = gulpSass(node_sass);
var tsProject = ts.createProject("tsconfig.json");

gulp.task("sass", (done) => {
    gulp.src("src/sass/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("dist/css"));
        done();
})
gulp.task("copyHTML", (done) => {
    gulp.src("src/html/*.html")
    .pipe(gulp.dest("dist/html"));
    done();
});

gulp.task("ts", (done) => {
    tsProject.src()
    .pipe(tsProject()).js
    .pipe(gulp.dest("dist/js"));
    done();
});

gulp.task('watch', () => {
    gulp.watch('src/scripts/**/*.ts', gulp.series('ts'));
    gulp.watch('src/sass/**/*.scss',gulp.series('sass'));
    gulp.watch('src/html/*.html', gulp.series('copyHTML'));
})