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
      
      // Ignore exclusions.
      if( options.exclude.indexOf(dependency) > -1 ) return;
      
      // Attempt to use 
      var glob = 'node_modules/' + dependency + '/**/' + dependency;
      
      if( options.minified === true ) globs.push( glob + '.min.js' );
      if( options.unminified === true ) globs.push( glob + '.js' );
      
    });
  
    // Resolve globs.
    var files = grunt.file.expand(globs);
    
    // Set directory precedence for dependencies.
    var precedence = [
      '/dist/',
      '/build/',
      '/lib/',
      '/src/'
    ];
    
    // Filter files based on precedence.
    dependencies.forEach(function(dependency){
      
      // Extract dependency files and sort based on precedence.
      var ordered = files.filter(function(file){
        
        return file.indexOf( dependency + '.' ) > -1;
        
      }).sort(function(a, b){
        
        var A = precedence.slice(0).map(function(p){
                  return a.indexOf(p);
                }),
            B = precedence.slice(0).map(function(p){
                  return b.indexOf(p);
                });
        
        A.max = Math.max.apply(Math, A);    
        B.max = Math.max.apply(Math, B);
        
        A.index = A.indexOf(A.max);
        B.index = B.indexOf(B.max);
        
        if(A.index < B.index) return -1;
        if(A.index > B.index) return 1;
        return 0;
        
      });
      
      // Split into minified and unminified.
      var minified = ordered.filter(function(file){
            return file.indexOf('.min.js') > -1;
          }),
          unminified = ordered.filter(function(file){
            return minified.indexOf(file) === -1;
          });

      // Initialize a set of files to keep.
      var keep = [];
      
      // Get first index of minified/unminified files.
      if( options.minified === true && minified.length > 0 ) keep.push( minified[0] );
      if( options.unminified === true && unminified.length > 0 ) keep.push( unminified[0] );
      
      // Fetch and copy dependencies.
      keep.forEach(function(file){
        
        // Change the destination.
        var filename = path.basename(file);
        
        grunt.file.copy(file, path.resolve(dest, filename));
        
      });
      
    });
    
  });
  
};