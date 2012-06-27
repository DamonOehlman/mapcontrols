var interleave = require('interleave'),
    fs = require('fs'),
    path = require('path');
    
desc('build the core files');
task('build.core', function() {
    interleave(['src/css', 'src/js'], {
        path: 'dist'
    });
});

desc('build the controls');
task('build.controls', function() {
    // build each of the css files
    interleave(['src/css/controls', 'src/js/controls'], {
        path: 'dist/controls',
        
        stylus: {
            plugins: {
                nib: require('nib')
            }
        },
    });
});

task('default', ['build.core', 'build.controls']);
