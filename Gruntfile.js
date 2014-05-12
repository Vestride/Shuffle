module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var banner = [
    '/*!',
    ' * Shuffle.js by @Vestride',
    ' * Categorize, sort, and filter a responsive grid of items.',
    ' * Dependencies: jQuery 1.9+, Modernizr 2.6.2+',
    ' * @license MIT license',
    ' * @version <%= pkg.version %>',
    ' */\n'
  ].join('\n');



  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      serve: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: 'jekyll serve --watch --config _config.yml,_config_dev.yml'
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: true,
          interupt: true
        },
        files: [
          '_site/**/*.{html,css,js,png,jpg,jpeg,gif,webp,svg,json}'
        ]
      },
      css: {
        files: '_scss/*.scss',
        tasks: ['compile-css'],
      },
      src: {
        files: 'src/*.js',
        tasks: ['concat', 'test']
      },
      test: {
        files: 'test/specs.js',
        tasks: ['test']
      }
    },

    sass: {
      main: {
        options: {
          style: 'expanded'
        },
        files: {
          'temp/gallery.css': '_scss/gallery.scss',
          'temp/shuffle-styles.css': '_scss/shuffle-styles.scss',
          'temp/style.css': '_scss/style.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions']
      },

      main: {
        expand: true,
        flatten: true,
        src: 'temp/*.css',
        dest: 'css/'
      }
    },

    concat: {
      options: {
        banner: banner
      },
      main: {
        src: ['src/intro.js', 'src/shuffle.js', 'src/outro.js'],
        dest: 'dist/jquery.shuffle.js'
      },
      modernizr: {
        src: ['src/modernizr.custom.min.js', 'src/intro.js', 'src/shuffle.js', 'src/outro.js'],
        dest: 'dist/jquery.shuffle.modernizr.js'
      }
    },

    uglify: {
      options: {
        preserveComments: false,
        banner: banner,
        report: 'min',
        mangle: true,
        compress: true
      },
      main: {
        src: 'dist/jquery.shuffle.js',
        dest: 'dist/jquery.shuffle.min.js'
      },
      modernizr: {
        src: 'dist/jquery.shuffle.modernizr.js',
        dest: 'dist/jquery.shuffle.modernizr.min.js'
      }
    },

    jasmine: {
      main: {
        src: 'dist/jquery.shuffle.js',
        options: {
          specs: 'test/specs.js',
          vendor: [
            'dist/modernizr.custom.min.js',
            'http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
          ],
          outfile: 'test/_SpecRunner.html',
          keepRunner: true
        }
      }
    }
  });


  grunt.registerTask('compile-css', 'compile and prefix css', function() {
    grunt.task.run('sass:main');
    grunt.task.run('autoprefixer:main');
  });

  // Use Jekyll to watch and rebuild files.
  grunt.registerTask('serve', function() {
    grunt.task.run(['build', 'shell:serve']);
  });


  grunt.registerTask('build', function() {
    // Copy over custom modernizr build.
    grunt.file.copy('src/modernizr.custom.min.js', 'dist/modernizr.custom.min.js');

    // Run concat and minfication.
    grunt.task.run([
      'concat:main',
      'concat:modernizr',
      'uglify:main',
      'uglify:modernizr',
      'test'
    ]);
  });

  grunt.registerTask('test', function() {
    grunt.task.run('jasmine:main');
  });

  // Default task(s).
  grunt.registerTask('default', ['serve']);

};
