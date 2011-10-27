if (typeof INTERACT == 'undefined') {
    //= interact!
}

if (typeof classtweak == 'undefined') {
    //= classtweak!
}

var MapControls = (function() {
    
    //= cog!dom
    //= controls/base
    
    /* internals */
    
    var _classMC = 'mc-controls',
        _registry = {};
    
    function getControlsLayer(target) {
        // look for a controls layer within the target
        var results = target.getElementsByClassName(_classMC),
            controlLayer = results[0];

        // if we don't have a control layer, then create one
        if (! controlLayer) {
            var targetBounds = target.getBoundingClientRect();
            
            controlLayer = _dom.create('div', { className: _classMC }, {
                position: 'absolute',
                width: targetBounds.width + 'px',
                height: targetBounds.height + 'px',
                'z-index': 1000
            });
            
            // add to the target
            target.appendChild(controlLayer);
        } // if

        return controlLayer;
    } // getControlsLayer
    
    function positionControl(target, control, opts) {
        // if we have a control that wants to display full size, then match the container size
        if (opts.fullsize) {
            var rect = target.getBoundingClientRect();
            
            control.style.width = rect.width + 'px';
            control.style.height = rect.height + 'px';
            opts.alignment = 'top left';
        }
        
        _dom.position(control, opts.alignment);
        control.style.zIndex = opts.zindex || 1000;
    } // positionControl
    
    /* exports */
    
    function _init(element, opts, methods) {
        return new Control(element, opts);
    } // _init
    
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
     - zindex (number) the CSS `z-index` value (default: 1000)
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
        _createEl: _dom.create,
        _init: _init,
        
        add: add,
        get: get,
        register: register
    };
})();