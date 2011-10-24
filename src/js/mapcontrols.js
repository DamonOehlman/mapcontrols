var MapControls = (function() {
    
    //= cog!dom
    
    /* internals */
    
    var _classMC = 'mc-controls',
        _registry = {};
    
    function getControlsLayer(target) {
        // look for a controls layer within the target
        var results = target.getElementsByClassName(_classMC),
            controlLayer = results[0];

        // if we don't have a control layer, then create one
        if (! controlLayer) {
            controlLayer = _dom.create('div', { className: _classMC });
        } // if

        return controlLayer;
    } // getControlsLayer
    
    /* exports */
    
    function add(target, controlType, opts) {
        var creator = _registry[controlType];
        if (creator) {
            // get the controls layer for the target
            var controlsLayer = getControlsLayer(target),
                newControl = creator.call(creator);
                
            // add the control to the controls layer
            controlsLayer.appendChild(newControl);
            
            return newControl;
        }
    } // add
    
    function register(controlType, creator) {
        // register the control creator
        _registry[controlType] = creator;
    } // register
    
    return {
        _createEl: _dom.create,
        
        add: add,
        register: register
    };
})();