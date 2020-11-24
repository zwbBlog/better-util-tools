/**
 *  Created by zlgb on 2020-11-24 21:12:50
 *  ------------------修改记录-------------------
 *  修改人      修改日期                 修改目的
 *  zlgb        2020-11-24               创建
 **/
const {src, dest} = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
var clean = require('gulp-clean');

exports.default = function () {
    return src('src/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({extname: `.min.js`}))
        .pipe(clean('dist/'))
        .pipe(dest('dist/'));
};
