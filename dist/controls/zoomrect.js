/*\
 * zoomrect
 [ control ]
 **
 * The zoomrect is an overlay control for zooming into a specific region of the map.
 **
 > Options
 **
 * 
 **
 = (DOMElement) the dom element that contains the zoomrect
\*/
MapControls.register('zoomrect', function(opts) {
    // initialise option defaults
    opts.className = opts.className || 'mc-zoomrect';
    
    // this control will go fullsize in the container
    opts.fullsize = true;
    
    // initialise the zoombar element
    var id = 'zoomrect_' + new Date().getTime(),
        zoomrect = MapControls._createEl('div', { 
            id: id,
            className: opts.className 
        }),
        box, startXY;
    
    // watch the zoombar
    INTERACT.watch(zoomrect, {
        aggressiveCapture: opts.aggressiveCapture
    });
    
    eve.on('interact.pointer.down.' + id, function(evt, absXY, relXY) {
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

    eve.on('interact.pointer.move.' + id, function(evt, absXY, relXY) {
        box.style.width = Math.max(0, relXY.x - startXY.x) + 'px';
        box.style.height = Math.max(0, relXY.y - startXY.y) + 'px';
    });
    
    eve.on('interact.pointer.up.' + id, function(evt, absXY, relXY) {
        zoomrect.removeChild(box);
        box = null;
    });
    
    return zoomrect;
});