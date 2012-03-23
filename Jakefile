var interleave = require('interleave'),
    fs = require('fs'),
    path = require('path'),
    aliases = {
        'snippets': 'github://DamonOehlman/snippets/$1'
    };
    
desc('build the core files');
task('build.core', function() {
    interleave(['src/css', 'src/js'], {
        aliases: aliases
    });
});

desc('build the controls');
task('build.controls', function() {
    // build each of the css files
    interleave(['src/css/controls', 'src/js/controls'], {
        path: 'dist/controls',
        aliases: aliases
    });
});

task('default', ['build.core', 'build.controls']);
