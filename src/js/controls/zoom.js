/*\
 * zoom
 [ control ]
 **
 * The zoom control is used to place a zoom slider in the DOM element
 * specified in the @MapControls.add call.
 **
 > Options
 **
 - alignment (string) the alignment string used for placing the control (default: 'right middle')
 - className (string) the class name for the zoom control element (default: `mc-zoom`)
 - min (number) the min slider value (default: 1)
 - max (number) the max slider value (default: 17)
 **
 = (DOMElement) the dom element that contains the zoom slider
\*/
MapControls.register('zoom', function(opts) {
    // initialise default options
    opts = opts || {};
    opts.alignment = opts.alignment || 'right middle';
    opts.className = opts.className || 'mc-zoom';
    opts.min = opts.min || 1;
    opts.max = opts.max || 17;
    
    function genClasses() {
        var output = [];
        for (var ii = 0; ii < arguments.length; ii++) {
            output.push(opts.className + '-' + arguments[ii]);
        }
        
        return output.join(' ');
    } // genClasses

    // initialise the zoombar element
    var id = 'zoombar_' + new Date().getTime(),
        startY = 0,
        zoombar = MapControls._createEl('div', { 
            id: id,
            className: opts.className 
        }),
        slider = MapControls._createEl('div', {
            className: genClasses('slider')
        });
        
    // add a thumb to the slider
    slider.appendChild(MapControls._createEl('div', {
        className: genClasses('thumb'),
        position: 'absolute'
    }));
    
    // add the zoom out button
    zoombar.appendChild(MapControls._createEl('div', {
        className: genClasses('btn', 'btn-in')
    }));

    // add the slider
    zoombar.appendChild(slider);
    
    // add the zoom in button
    zoombar.appendChild(MapControls._createEl('div', {
        className: genClasses('btn', 'btn-out')
    }));
    
    // watch the zoombar
    INTERACT.watch(zoombar, {
        aggressiveCapture: opts.aggressiveCapture
    });
    
    eve.on('interact.pointer.down.' + id, function(evt, absXY, relXY) {
        startY = relXY.y;

        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
    });

    eve.on('interact.pointer.move.' + id, function(evt, absXY, relXY, deltaXY) {
        var diffY = relXY.y - startY;
        
        console.log(diffY);
    });
    
    // return the zoombar
    return zoombar;
});