'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');
var webpackConfigBackground = require('../webpack.config.background.js');
var utils = require('./utils');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');

gulp.task('bundle', function (cb) {
  webpack(webpackConfigBackground, function(err, stats) {
    if (err) { throw new gutil.PluginError('webpack:build', err); }
    console.log('[webpack:build]', stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true
    }));
    webpack(webpackConfig, function(err, stats) {
      if (err) { throw new gutil.PluginError('webpack:build', err); }
      console.log('[webpack:build]', stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
      }));
      cb()
    });
  });
});

gulp.task('environment', function () {
  var configFile = 'config/env_' + utils.getEnvName() + '.json';
  projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
  var beepOnError = function (done) {
    return function (err) {
      if (err) {
        utils.beepSound();
      }
      done(err);
    };
  };

  watch(['src/**/*.js', 'src/**/*.vue'], batch(function (events, done) {
    gulp.start('bundle', beepOnError(done));
  }));

});

gulp.task('build', ['bundle', 'environment']);