var interleave = require('interleave'),
    fs = require('fs'),
    path = require('path'),
    aliases = {
        'cog': 'github://DamonOehlman/cog/cogs/$1',
        'interact': 'github://DamonOehlman/interact/interact.js',
        'classtweak': 'github://DamonOehlman/classtweak/classtweak.js',
        'eve': 'github://DmitryBaranovskiy/eve/eve.js'
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
