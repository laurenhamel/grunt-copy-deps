# grunt-copy-deps

> Copy `package.json` dependencies from `node_modules` to a destination of your choosing



## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-copy-deps --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-copy-deps');
```


## copydeps task
_Run this task with the `grunt copydeps` command._


### Options


#### minified

Type: `Boolean`  
Default: `true`

Copy the minified version of each dependency.


#### unminified

Type: `Boolean`  
Default: `false`

Copy the unminified version of each dependency.


#### ignore

Type: `Array`  
Default: `[]`

An array containing the name of the dependencies (as listed in your package file) that should be ignored.

#### exclude

Type: `Object`  
Default: `{ js: [], css: [] }`

An object identifying the `.js` and/or `.css` files that should not be copied.


#### include

Type: `Object`  
Default: `{ js: {}, css: {} }`

An object identifying the `.js` and/or `.css` files that should also be copied along with other dependency files.


#### js

Type: `Boolean`  
Default: `true`

Determines whether or not `.js` files for all dependencies should be copied.


#### css

Type: `Boolean`  
Default: `false`

Determines whether or not `.css` files for all dependencies should be copied.


### Examples

Add a section named `copydeps` to the data object passed into `grunt.initConfig()`.

**Copying only `.min.js` dependencies:**

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      pkg: 'package.json',
      dest: 'dest/js/dependencies/'
    }
  }
});
```

**Copying only `.js` dependencies:**

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      options: {   
        minified: false,
        unminified: true
      },
      pkg: 'package.json',
      dest: 'dest/js/dependencies/'
    }
  }
});
```

**Copying both `.min.js` and `.js` dependencies:**

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      options: {   
        unminified: true,
      },
      pkg: 'package.json',
      dest: 'dest/js/dependencies/'
    }
  }
});
```

**Copying both `.js` and `.css` dependencies:**

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      options: {  
        minified: true,
        unminified: true,
        css: true,
      },
      pkg: 'package.json',
      /**
       * Use an Object with keys `css` and `js`
       * if you wish to place dependencies
       * in different locations based on the
       * type of file.
       */
      dest: {
        css: 'dest/css/dependencies/',
        js: 'dest/js/dependencies/'
      }
    }
  }
});
```


**Copying only `.css` dependencies:**

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      options: {  
        minified: true
        unminified: true,
        css: true,
        js: false
      },
      pkg: 'package.json',
      dest: 'dest/css/dependencies/'
    }
  }
});
```

**Copying with some dependencies ignored:**

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      options: {   
        ignore: [ 'jquery' ]
      },
      pkg: 'package.json',
      dest: 'dest/js/dependencies/'
    }
  }
});
```

**Copying with excluded files:**

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      options: {   
        /**
         * All files paths are relative to
         * the `node_modules/` directory.
         */
        exclude: {
          js: ['jquery/src/**/*.js']
      },
      pkg: 'package.json',
      dest: 'dest/js/dependencies/'
    }
  }
});
```
  
**Copying with included files:**

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      options: {   
        include: {
          /**
           * Object syntax resembles { <src>: <dest> }, 
           * where <dest> refers to a path relative to 
           * your `dest/` directory. You can use
           * '.' if no subfolder is desired. All <src>
           * file paths are relative to the `node_moduels/`
           * directory.
           */
          js: {
            'codemirror/mode/**/*.js': 'codemirror/'
          }
      },
      pkg: 'package.json',
      dest: 'dest/js/dependencies/'
    }
  }
});
```

The `copydeps` task will look for `dependencies` listed in your package file, and these dependencies will be copied into your `dest` folder.
