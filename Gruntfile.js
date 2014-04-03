module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

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

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });


  grunt.registerTask('compile-css', 'compile and prefix css', function() {
    grunt.task.run('sass:main');
    grunt.task.run('autoprefixer:main');
  });

  // Use Jekyll to watch and rebuild files.
  grunt.registerTask('serve', function() {
    grunt.task.run(['shell:serve']);
  });

  // Default task(s).
  grunt.registerTask('default', ['serve']);

};
