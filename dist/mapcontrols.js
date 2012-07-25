
// req: alignit,eve,classtweak

var MapControls = (function() {
    
    function Control(element, opts) {
        this.element = element;
        
        // iterate through the opts and push to the control
        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                this[key] = opts[key];
            }
        }
        
        // ensure we have a type
        this.type = this.type || 'control';
        
        // ensure we have an id
        this.id = this.id || (this.type + '_' + new Date().getTime());
    };
    
    Control.prototype.getViewport = function() {
        if (this.element && this.element.parentNode) {
            return alignit.bounds(this.element.parentNode);
        }
    };
    
    Control.prototype.remove = function() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        eve('mapcontrols.remove.' + this.id);
    }; // remove
    
    Control.prototype.set = function(prop, value, triggerChange) {
        if (this[prop] !== value) {
            this[prop] = value;
            if (typeof triggerChange == 'undefined' || triggerChange) {
                eve('mapcontrols.change.' + prop + '.' + this.id, this, prop, value);
            } 
        }
        
        return this;
    };
    
    Control.prototype.on = function(evt, handler) {
        eve.on('mapcontrols.' + evt + '.' + this.id, handler);
        
        return this;
    };
    function createElement(tag, attributes, css) {
        var element = document.createElement(tag), key;
        
        // iterate through the attributes
        for (key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element[key] = attributes[key];
            } 
        } 
        
        for (key in css) {
            if (css.hasOwnProperty(key)) {
                element.style[key] = css[key];
            }
        }
        
        return element;
    } // createElement
    
    /* internals */
    
    var D2R = Math.PI / 180,
        MAXLON = 360 * D2R,
        _classMC = 'mc-controls',
        _registry = {};
        
    function _haversineDist(lat1, lon1, lat2, lon2) {
        // use the haversine formula to calculate distance: http://www.movable-type.co.uk/scripts/latlong.html
        var dLon = (lon1 > lon2 ? MAXLON - lon1 + lon2 : lon2 - lon1),
            dLat = lat2 - lat1,
            a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            
        return c;
    }

    /* exports */
    
    function _calcRadsPerPixel(bounds, vp) {
        // normalize the bounds
        bounds = _normalizeBounds(bounds);
        
        if (vp && vp.width && vp.height) {
            var dLat = bounds.maxlat - bounds.minlat,
                centerLat = bounds.minlat + dLat / 2;
            
            return {
                x: _haversineDist(
                        centerLat, bounds.minlon, 
                        centerLat, bounds.maxlon) / vp.width,
                y: _haversineDist(
                        bounds.minlat, bounds.minlon,
                        bounds.maxlat, bounds.minlon) / vp.height
            };
        }
        
        return { x: 0, y: 0 };
    }
    
    function _init(element, opts, methods) {
        return new Control(element, opts);
    } // _init
    
    function _normalizeBounds(bounds) {
        var min = bounds.min || bounds.sw || {},
            max = bounds.max || bounds.ne || {},
            minLat = (bounds.minlat || min.lat || 0) * D2R,
            minLon = (bounds.minlon || min.lon || min.lng || 0) * D2R,
            maxLat = (bounds.maxlat || max.lat || 0) * D2R,
            maxLon = (bounds.maxlon || max.lon || max.lng || 0) * D2R;
        
        return {
            minlat: minLat,
            minlon: minLon,
            maxlat: maxLat,
            maxlon: maxLon
        };
    } // _normalizeBounds
    
    /*\
     * MapControls.add
     [ function ]
     **
     * Add a new control of `controlType` to the specified `target` element.
     **
     > Arguments
     **
     - target (DOMElement) the element that the control will be added to
     - controlType (string) the type of control we are creating
     - opts (object) options that will be passed onto the control
     **
     = (DOMElement) the dom element that contains the newly created control
     **
     > Options
     **
     * The following options are supported by most controls
     **
     - aggressiveCapture (boolean) whether or not Interact will prevent default events from firing after intercepting events
     - zindex (number) the CSS `z-index` value (default: 1)
     - prepend (boolean) whether the control should be prepended in the DOM
    \*/
    function add(target, controlType, opts) {
        // ensure the options have been defined
        // (we pass these by reference)
        opts = opts || {};
        
        // get the control
        var control = get(controlType, opts);
        if (control && target) {
            // get the first child in the target
            var firstChild = target.childNodes[0];
            
            // if we have a first child, insert the control before
            if (firstChild && opts.prepend) {
                target.insertBefore(control.element, firstChild);
            }
            // otherwise, just append
            else {
                target.appendChild(control.element);
            }
            
            // position the control
            positionControl(target, control.element, opts);
        }
        
        return control;
    } // add
    
    /*\
     * MapControls.get
     [ function ]
     **
     * Create a new control of `controlType`
     **
     > Arguments
     **
     - controlType (string) the type of control we are creating
     - opts (object) options that will be passed onto the control
     **
     = (DOMElement) the dom element that contains the newly created control
     **
     > Options
     **
     * As per @MapControls.add
    \*/
    function get(controlType, opts) {
        var creator = _registry[controlType];
        if (creator) {
            return creator.call(creator, opts);
        }
    } // get
    
    function positionControl(target, control, opts) {
        // ensure we have valid opts
        opts = opts || control._posOpts || {};
        
        // if we have a control that wants to display full size, then match the container size
        if (opts.fullsize) {
            var rect = alignit.bounds(target);
            
            control.style.width = rect.width + 'px';
            control.style.height = rect.height + 'px';
            opts.alignment = 'top left';
        }
        
        alignit(control, opts.alignment);
        control.style.zIndex = opts.zindex || 1;
        
        // save the position options in the control 
        if (! control._posOpts) {
            control._posOpts = opts;
        }
    } // positionControl
    
    /*\
     * MapControls.register
     [ function ]
     **
     * Register a new map control creator
     **
     > Arguments
     **
     - controlType (string) the type of control being registered
     - creator (function) the creator function called when a new control is requested
    \*/
    function register(controlType, creator) {
        // register the control creator
        _registry[controlType] = creator;
    } // register
    
    return {
        _calcRadsPerPixel: _calcRadsPerPixel,
        _createEl: createElement,
        _init: _init,
        _normalizeBounds: _normalizeBounds,
        
        add: add,
        get: get,
        positionControl: positionControl,
        register: register
    };
})();