/*
 * grunt-copy-dependencies
 * https://github.com/laurenhamel/grunt-copy-dependencies
 *
 * Copyright (c) 2017 Lauren Hamel
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function (grunt) {

  grunt.registerMultiTask('copydeps', 'Copy `package.json` dependencies from `node_modules` to a destination of your choosing', function () {
    
    // Get options.
    var options = this.options({
      minified: true,
      unminified: false,
      exclude: []
    });
    
    // Read package data.
    var pkg = grunt.file.readJSON(path.resolve(this.data.pkg));
    
    // Get the target destination.
    var dest = this.data.dest;
    
    // Get dependencies.
    var dependencies = Object.keys(pkg.dependencies);
    
    // Create globs of the dependencies.
    var globs = [];
    
    dependencies.forEach(function(dependency){
      
      if( options.exclude.indexOf(dependency) > -1 ) return;
      
      var glob = 'node_modules/' + dependency + '/**/' + dependency;
      
      if( options.minified === true ) globs.push( glob + '.min.js' );
      if( options.unminified === true ) globs.push( glob + '.js' );
      
    });
  
    // Resolve globs.
    var files = grunt.file.expand(globs);
    
    // Fetch and copy dependencies.
    files.forEach(function(file){
      
      // Change the destination.
      var filename = path.basename(file);
      
      grunt.file.copy(file, path.resolve(dest, filename));
      
    });
    
  });
  
};