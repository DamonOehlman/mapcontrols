
// req: 
/*\
 * zoomrect
 [ control ]
 **
 * The zoomrect is an overlay control for zooming into a specific region of the map.
 **
 > Options
 **
 - autoRemove (boolean) whether or not the zoomrect should be autoremoved after a zoom operation
 - calcRadsPerPixel (function) a function that calculates the number of radians per pixel
 **
 = (DOMElement) the dom element that contains the zoomrect
\*/
MapControls.register('zoomrect', function(opts) {
    // initialise option defaults
    opts.className = opts.className || 'mc-zoomrect';
    opts.calcRadsPerPixel = opts.calcRadsPerPixel || MapControls._calcRadsPerPixel;
    
    // this control will go fullsize in the container
    opts.fullsize = true;
    
    // initialise the zoombar element
    var R2D = 180 / Math.PI,
        currentBounds, 
        id = 'zoomrect_' + new Date().getTime(),
        zoomrect = MapControls._createEl('div', { 
            id: id,
            className: opts.className 
        }),
        control,
        box, startXY;
    
    // watch the zoombar
    interact.watch(zoomrect, {
        aggressiveCapture: opts.aggressiveCapture
    });
    
    function _calcTargetBounds(bounds, rect, radsPerPixel) {
        var minlat, minlon, maxlat, maxlon,
            vp = control.getViewport();
        
        // normalize the bounds
        bounds = MapControls._normalizeBounds(bounds);
        
        // calculate the target bounds in rads
        minlon = bounds.minlon + rect.left * radsPerPixel.x;
        minlat = bounds.minlat + (vp.height - rect.bottom) * radsPerPixel.y;
        maxlon = bounds.minlon + rect.right * radsPerPixel.x;
        maxlat = bounds.maxlat - rect.top * radsPerPixel.y;
        
        return {
            min: { lat: minlat * R2D, lon: minlon * R2D },
            max: { lat: maxlat * R2D, lon: maxlon * R2D }
        };
    } // _calcTargetBounds
    
    eve.on('interact.down.' + id, function(evt, absXY, relXY) {
        // if the box was not successfully removed before, do that now
        if (box) {
            zoomrect.removeChild(box);
        }
        
        // create our zoombox
        box = MapControls._createEl('div', { className: opts.className + '-box' }, {
            position: 'absolute',
            margin: relXY.y + 'px 0 0 ' + relXY.x + 'px'
        });
        
        // save the start xy
        startXY = {
            x: relXY.x,
            y: relXY.y
        };
        
        zoomrect.appendChild(box);
    });

    eve.on('interact.move.' + id, function(evt, absXY, relXY) {
        box.style.width = Math.max(0, relXY.x - startXY.x) + 'px';
        box.style.height = Math.max(0, relXY.y - startXY.y) + 'px';
    });
    
    eve.on('interact.up.' + id, function(evt, absXY, relXY) {
        if (currentBounds) {
            // get the box dimensions
            var rect = alignit.bounds(box),
                radsPerPixel = opts.calcRadsPerPixel(currentBounds, control.getViewport()),
                targetBounds = _calcTargetBounds(currentBounds, rect, radsPerPixel);

            // update the target bounds
            control.set('zoombounds', targetBounds);
        }
        
        zoomrect.removeChild(box);
        box = null;
        
        // if we have an autoremove, then 
        if (opts.autoRemove) {
            control.remove();
            control = null;
        } // if
    });
    
    control = MapControls._init(zoomrect);
    
    // handle bounds updates
    control.on('change.bounds', function(prop, value) {
        currentBounds = value;
    });
    
    return control;
});