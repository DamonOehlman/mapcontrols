/*\
 * zoom
 [ control ]
 **
 * The zoom control is used to place a zoom slider in the DOM element
 * specified in the @MapControls.add call.
 **
 > Options
 **
 - alignment (string) the alignment string used for placing the control (default: 'right-10 middle')
 - className (string) the class name for the zoom control element (default: `mc-zoom`)
 - min (number) the min slider value (default: 1)
 - max (number) the max slider value (default: 17)
 **
 = (DOMElement) the dom element that contains the zoom slider
\*/
MapControls.register('zoom', function(opts) {
    // initialise default options
    opts = opts || {};
    opts.alignment = opts.alignment || 'right-10 middle';
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
        startY,
        zoombar = MapControls._createEl('div', { 
            id: id,
            className: opts.className 
        }),
        slider = MapControls._createEl('div', {
            className: genClasses('slider')
        }), 
        thumb;
        
    // add a thumb to the slider
    slider.appendChild(thumb = MapControls._createEl('a', {
        className: genClasses('thumb'),
        position: 'absolute'
    }));
    
    // add the zoom out button
    zoombar.appendChild(MapControls._createEl('a', {
        className: genClasses('btn', 'btn-in')
    }));

    // add the slider
    zoombar.appendChild(slider);
    
    // add the zoom in button
    zoombar.appendChild(MapControls._createEl('a', {
        className: genClasses('btn', 'btn-out')
    }));
    
    // watch the zoombar
    INTERACT.watch(zoombar, {
        aggressiveCapture: opts.aggressiveCapture
    });
    
    eve.on('interact.pointer.down.' + id, function(evt, absXY, relXY) {
        if (evt.target === thumb) {
            startY = relXY.y;
        }
    });

    eve.on('interact.pointer.move.' + id, function(evt, absXY, relXY) {
        if (typeof startY != 'undefined') {
            var diffY = relXY.y - startY;
            console.log(diffY);
        }
    });
    
    eve.on('interact.pointer.up.' + id, function(evt, absXY, relXY) {
        startY = undefined;
    });
    
    // return the zoombar
    return {
        element: zoombar
    };
});