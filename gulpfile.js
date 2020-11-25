/**
 *  Created by zlgb on 2020-11-24 21:12:50
 *  ------------------修改记录-------------------
 *  修改人      修改日期                 修改目的
 *  zlgb        2020-11-24               创建
 **/
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
var deleted = require('gulp-deleted');
const {src, dest} = gulp;


gulp.task('clean', function () {
    const source = 'src/*.js';
    const dest = 'dist/';
    return src(source)
        .pipe(deleted({src: source, dest, patterns: ['*', '!need.txt']}));
});

gulp.task('build', async function () {
    return src('src/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({extname: `.min.js`}))
        .pipe(dest('dist/'));
});

gulp.task('version', gulp.series('clean', 'build'));

