/**
 * Task to pull out specific files from bower packages.
 */
module.exports = function (grunt) {
    grunt.config.set('bower', {
      install: {
        options: {
          layout: function(type, component) {
            return type;
          },
          targetDir: './assets',
          install: true,
          cleanTargetDir: false,
          cleanBowerDir: false
        }
      }
    });
  
    grunt.loadNpmTasks('grunt-bower-task');
  };