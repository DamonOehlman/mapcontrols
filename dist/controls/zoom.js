
// req: 
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
    
    function _changeVal(newVal) {
        newVal = Math.min(opts.max, Math.max(opts.min, newVal));
        control.set('value', newVal);
    } // _changeVal
    
    function genClasses() {
        var output = [];
        for (var ii = 0; ii < arguments.length; ii++) {
            output.push(opts.className + '-' + arguments[ii]);
        }
        
        return output.join(' ');
    } // genClasses
    
    function updateThumbPos(value) {
        var range = opts.max - opts.min,
            progress = value - opts.min;
            
        // update the slider height
        sliderHeight = sliderHeight || alignit.bounds(slider).height;
        thumb.style.marginTop = (sliderHeight - (progress / range * sliderHeight)) + 'px';
    } // updateThumbPos

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
        reBtnIn = /btn\-in(?:\s|$)/,
        thumb, control, thumbStart = 0, sliderHeight;
        
    // add a thumb to the slider
    slider.appendChild(thumb = MapControls._createEl('a', {
        className: genClasses('thumb')
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
    interact.watch(zoombar, {
        bindTarget: zoombar,
        aggressiveCapture: opts.aggressiveCapture
    });
    
    // prevent cursor changing to a text selection icon for the zoombar
    zoombar.onselectstart = function() { return false; };

    // also watch the document for up events
    interact.watch(document, {
        ns: 'doc',
        events: ['up']
    });
    
    eve.on('interact.down.' + id, function(evt, absXY, relXY) {
        var el = evt.target || evt.srcElement;
        
        if (el === thumb) {
            startY = relXY.y;
            thumbStart = parseInt(thumb.style.marginTop, 10) || 0;
        }
        else if (el && el.tagName === 'A') {
            _changeVal(control.value + (reBtnIn.test(el.className) ? 1 : -1));
        }
        
        if (typeof evt.cancelBubble != 'undefined') {
            evt.cancelBubble = true;
        }
    })(-1);

    eve.on('interact.move.' + id, function(evt, absXY, relXY) {
        if (typeof startY != 'undefined') {
            if (evt.preventDefault) {
                evt.preventDefault();
                evt.stopPropagation();
                
                if (evt.stopImmediatePropagation) {
                    evt.stopImmediatePropagation();
                } // if
            }
            else if (typeof evt.cancelBubble != 'undefined') {
                evt.cancelBubble = true;
                evt.returnValue = false;
            } // if..else

            sliderHeight = sliderHeight || alignit.bounds(slider).height;
            thumb.style.marginTop = Math.min(
                sliderHeight, Math.max(0, thumbStart + relXY.y - startY)) + 'px';
        }
    })(-1);
    
    eve.on('interact.up.' + id, function(evt, absXY, relXY) {
        // if we are dragging the thumb, then calculate the zoom
        if (startY) {
            sliderHeight = sliderHeight || alignit.bounds(slider).height;

            var range = opts.max - opts.min,
                thumbVal = (sliderHeight - parseInt(thumb.style.marginTop, 10)) / sliderHeight;

            _changeVal((thumbVal * range | 0) + opts.min);
        }
        
        // reset the start y and thumb start
        startY = undefined;
        thumbStart = undefined;
    })(-1);
    
    eve.on('doc.up', function() {
        if (thumbStart) {
            thumb.style.marginTop = thumbStart + 'px';
        }
        
        // reset the start y and thumb start
        startY = undefined;
        thumbStart = undefined;
    });
    
    // create the control
    control = MapControls._init(zoombar);
    
    // handle control level events
    control.on('change.value', function(prop, value) {
        updateThumbPos(value);
    });
    
    return control;
});