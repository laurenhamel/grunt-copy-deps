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
      'dist/',
      'build/',
      'lib/',
      'src/'
    ];
    
    // Filter files based on precedence.
    dependencies.forEach(function(dependency){
      
      var instances = files.filter(function(file){
        return file.indexOf(dependency + '.') > -1;
      });
      
      if( instances.length === 0 ) return;
      
      var keep;
      
      for(var i = 0; i < precedence.length; i++) {
        
        var match = instances.filter(function(file){
          return file.indexOf(precedence[i]) > -1;
        })[0]; 
        
        if( match ) {
          
          keep = files.indexOf(match);
          
          break;
          
        }
        
      } 

      if( keep !== undefined && keep !== null ) {
        
        var i = instances.length;
        
        while( i-- ) {
          
          if( files.indexOf(instances[i]) !== keep ) {

            files.splice(files.indexOf(instances[i]), 1);

          }
          
        }
        
      }
      
    });
    
    // Fetch and copy dependencies.
    files.forEach(function(file){
      
      // Change the destination.
      var filename = path.basename(file);
      
      grunt.file.copy(file, path.resolve(dest, filename));
      
    });
    
  });
  
};