/*
 * grunt-copy-dependencies
 * https://github.com/laurenhamel/grunt-copy-dependencies
 *
 * Copyright (c) 2018 Lauren Hamel
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
      js: true,
      css: false,
      ignore: [],
      exclude: {
        css: [],
        js: []
      },
      include: {
        css: {},
        js: {}
      }
    });
    
    // Read package data.
    var pkg = grunt.file.readJSON(path.resolve(this.data.pkg));
    
    // Get the target destination.
    var dest = this.data.dest; 
    
    // Get dependencies.
    var dependencies = Object.keys(pkg.dependencies);
    
    // Create globs of the dependencies.
    var files = [];
    
    dependencies.forEach(function(dependency){
      
      // Ignore exclusions.
      if( options.ignore.indexOf(dependency) > -1 ) return;
      
      // Start a glob path.
      var glob = 'node_modules/' + dependency + '/**/' + dependency;
      
      if( options.js === true ) {
        
        if( options.minified === true ) files.push( glob + '.min.js' );
        if( options.unminified === true ) files.push( glob + '.js' );
        
      }
      
      if( options.css === true ) {
        
        if( options.minified === true ) files.push( glob + '.min.css' );
        if( options.unminified === true ) files.push( glob + '.css' );
        
      }
      
    });
    
    // Create globs of excluded files.
    var excludes = [];
  
    if( options.exclude.css ) {
      
      options.exclude.css.forEach(function(css){
      
        // Start a glob path.
        var glob = 'node_modules/';

        excludes.push( glob + css );

      });
      
    }
    if( options.exclude.js ) {
      
      options.exclude.js.forEach(function(js){
      
      // Start a glob path.
      var glob = 'node_modules/';
      
      excludes.push( glob + js );
      
    });
      
    }
    
    // Create globs of included files.
    var includes = [];
    
    if( options.include.css ) {
      
      // Start a glob path.
      var glob = 'node_modules/';
      
      for(var css in options.include.css) {
        
        includes.push({ src: glob + css, dest: options.include.css[css], target: 'css' });
        
      }
      
    }
    if( options.include.js ) {
      
      // Start a glob path.
      var glob = 'node_modules/';
      
      for(var js in options.include.js) {
        
        includes.push({ src: glob + js, dest: options.include.js[js], target: 'js' });
        
      }
      
    }

    // Resolve globs.
    files = grunt.file.expand(files);
    excludes = grunt.file.expand(excludes);
    includes = includes.map(function(include){
      
      include.src = grunt.file.expand(include.src);
      
      return include;
      
    });
 
    // Remove excluded files.
    files = files.filter(function(file){
      
      var filename = path.basename(file),
          filenames = excludes.map(function(exclude){
            return path.basename(exclude);
          });
      
      if( excludes.indexOf(file) > -1 ) return false; 
      if( filenames.indexOf(filename) > -1 ) return false;
      
      return true;
      
    });

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
      
        return file.indexOf( '/' + dependency + '.' ) > 0;
        
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
         
      // Extract CSS and JS.
      if( minified.length > 0 ) {
        
        minified.js = minified.filter(function(file){
        return file.indexOf('.js') > -1;
        });
        minified.css = minified.filter(function(file){
        return file.indexOf('.css') > -1;
      });
        
      }
      if( unminified.length > 0 ) {
      
        unminified.js = unminified.filter(function(file){
        return file.indexOf('.js') > -1;
      
      });
        unminified.css = unminified.filter(function(file){
        return file.indexOf('.css') > -1;
      });
        
      }

      // Initialize a set of files to keep.
      var keep = [];
      
      // Get first index of minified/unminified files.
      if( options.minified === true && minified.length > 0 ) {

        keep.push( minified.js[0] );
        
        if( options.css === true && minified.css.length > 0 ) keep.push( minified.css[0] );
        
      }
      if( options.unminified === true && unminified.length > 0 ) {
        
        if( options.js === true && unminified.js.length > 0 ) keep.push( unminified.js[0] );
        
        if( options.css === true && unminified.css.length > 0 ) keep.push( unminified.css[0] );
        
      }
 
      // Fetch and copy dependencies.
      keep.forEach(function(file){
        
        // Change the destination.
        var filename = path.basename(file), destination;
        
        if( options.css === true && file.indexOf('.css') > -1 ) {
            
          destination = dest instanceof Object ? dest.css : dest;
          
        }
        
        if( options.js === true && file.indexOf('.js') > -1 ) {
            
          destination = dest instanceof Object ? dest.js : dest;
          
        }
        
        grunt.file.copy(file, path.resolve(destination, filename));
        
      });
      
    }); 
    
    // Also fetch included files.
    includes.forEach(function(include){
      include.src.forEach(function(file){
        
        var filename = path.basename(file), destination = [null, include.dest];

        if( options.css === true && (file.indexOf('.css') > -1 || include.target == 'css') ) {

          destination[0] = dest instanceof Object ? dest.css : dest;

        }

        if( options.js === true && (file.indexOf('.js') > -1 || include.target == 'js') ) {

          destination[0] = dest instanceof Object ? dest.js : dest;

        }
        
        grunt.file.copy(file, path.resolve(path.resolve.apply(null, destination), filename));
        
      });
    });
    
  });
  
};