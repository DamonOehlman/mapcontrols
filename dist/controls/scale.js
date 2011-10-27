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
 - calcPixelDistance (function) a function that calculates the distance for the map bounds and viewport size
 **
 = (DOMElement) the dom element that contains the scale
 ** 
 > Calculating Pixel Distance
 **
 * To be completed...
\*/
MapControls.register('scale', function(opts) {
    // initialise option defaults
    opts.className = opts.className || 'mc-scale';
    opts.scales = opts.scales || ['metric', 'imperial'];
    opts.calcPixelDistance = opts.calcPixelDistance || _calcDistance;
    
    // initialise the default alignment
    opts.alignment = opts.alignment || 'bottom-10 left+10';
    
    var D2R = Math.PI / 180,
        R = 6371,
        unitConversions = {
            metric: 1,
            imperial: 0.621371
        },
        units = {
            metric: 'km',
            imperial: 'mi'
        };
    
    // initialise the zoombar element
    var scaleContainer = MapControls._createEl('div', { className: opts.className }),
        scales = {},
        labels = {},
        control;
        
    function _getViewportWidth() {
        if (control.element && control.element.parentNode) {
            return control.element.parentNode.getBoundingClientRect().width;
        }
    } // _getViewportWidth
        
    function _calcDistance(bounds, vpWidth) {
        var min = bounds.min || bounds.sw || {},
            max = bounds.max || bounds.ne || {},
            minLat = min.lat,
            minLon = min.lon || min.lng,
            maxLat = max.lat,
            maxLon = max.lon || max.lng;
        
        if (vpWidth && typeof minLon != 'undefined' && typeof maxLon != 'undefined') {
            // use the haversine formula to calculate distance: http://www.movable-type.co.uk/scripts/latlong.html
            var dLon = (minLon > maxLon ? 360 - minLon + maxLon : maxLon - minLon) * D2R,
                dLat = maxLat - minLat,
                lat = minLat + dLat / 2,
                a = Math.pow(Math.sin(dLon / 2), 2) * Math.pow(Math.cos(lat * D2R), 2),
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),
                d = R * c,
                kmPerPixel = d / vpWidth;
                
            return kmPerPixel;
        }
    } // _calcScale
    
    function _updateScale(key, kmPerPixel) {
        // determine the maximum available size
        var unitsPerPixel = kmPerPixel * unitConversions[key],
            containerWidth = scaleContainer.getBoundingClientRect().width,
            maxWidth = containerWidth * unitsPerPixel,
            widthExp = Math.floor(Math.log(maxWidth) / Math.log(10)),
            scaleWidth,
            scaleDist,
            bestValues = [10, 5, 2, 1];
            
        // iterate through the best values and find the best value
        for (var ii = 0; ii < bestValues.length; ii++) {
            scaleDist = Math.pow(10, widthExp) * bestValues[ii];
            if (maxWidth / scaleDist > 1) {
                scaleWidth = scaleDist / unitsPerPixel;
                break;
            }
        }
        
        scales[key].style.width = scaleWidth + 'px';
        labels[key].innerHTML = scaleDist + ' ' + units[key];
    } // _updateScales

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

    // create the control
    control = MapControls._init(scaleContainer);
    
    // handle bounds updates
    control.on('change.bounds', function(prop, value) {
        var kmPerPixel = opts.calcPixelDistance(value, _getViewportWidth());

        // iterate through the scales and update
        for (var key in scales) {
            _updateScale(key, kmPerPixel);
        }
    });
    
    return control;
});