/*\
 * scale
 [ control ]
 **
 * The scale control is used to display the map scale with relation to a screen pixels to 
 * real world distance mapping.
 **
 > Options
 **
 - className (string) the classname of the element that will be created (default: `mc-scale`)
 - alignment (string) the alignment for the scale control (default: `bottom-10 left+10`)
 - scales (array) the scales that will be displayed in the scalebar (default: ['metric', 'imperial'])
 **
 = (DOMElement) the dom element that contains the scale
\*/
MapControls.register('scale', function(opts) {
    // initialise option defaults
    opts.className = opts.className || 'mc-scale';
    opts.scales = opts.scales || ['metric', 'imperial'];
    
    // initialise the default alignment
    opts.alignment = opts.alignment || 'bottom-10 left+10';
    
    // initialise the zoombar element
    var scaleContainer = MapControls._createEl('div', { className: opts.className }),
        scales = {},
        labels = {};

    // create the scales
    for (var ii = 0; ii < opts.scales.length; ii++) {
        var scaleName = opts.scales[ii];
        
        scales[scaleName] = MapControls._createEl('div', {
            className: opts.className + '-' + scaleName + ' ' + opts.className + '-' + ii
        });
        
        labels[scaleName] = MapControls._createEl('span', {
            className: opts.className + '-label' + ' ' + opts.className + '-label-' + ii,
            textContent: scaleName
        });
        
        scales[scaleName].appendChild(labels[scaleName]);
        scaleContainer.appendChild(scales[scaleName]);
    }

    return {
        element: scaleContainer
    };
});