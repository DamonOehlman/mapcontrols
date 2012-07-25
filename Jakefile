var interleave = require('interleave'),
    fs = require('fs'),
    path = require('path');
    
desc('build the core files');
task('build.core', function() {
    interleave(['src/css/*.*', 'src/js/*.*'], {
        output: 'dist'
    });
});

desc('build the controls');
task('build.controls', function() {
    // build each of the css files
    interleave(['src/css/controls/*.styl', 'src/js/controls/*.js'], {
        output: 'dist/controls',
        
        stylus: {
            plugins: [ require('nib') ]
        }
    });
});

task('default', ['build.core', 'build.controls']);
