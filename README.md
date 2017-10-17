# grunt-copy-dependencies

> Copy `package.json` dependencies from `node_modules` to a destination of your choosing



## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-copy-dependencies --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-copy-dependencies');
```


## Copydeps task
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


#### exclude

Type: `Array`  
Default: `[]`

An array containing the name of dependencies that should be excluded from copying.



### Examples

Add a section named `sasson` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  copydeps: {            
    target: {            
      options: {   
        minified: true,
        unminified: false,
        exclude: []
      },
      pkg: 'package.json',
      dest: 'dest/js/dependencies/'
    }
  }
});

grunt.loadNpmTasks('grunt-copy-dependencies');

grunt.registerTask('default', ['copydeps']);
```

Dependencies will be copied in your `dest` folder.