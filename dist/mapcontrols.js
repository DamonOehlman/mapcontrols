var MapControls = (function() {
    
    var _dom = (function() {
        
        function create(tag, attributes, css) {
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
        } // createEl
        
        return {
            create: create
        };
    })();

    
    /* internals */
    
    var classMC = 'mc-controls',
        registry = {};
    
    function getControlsLayer(target) {
        // look for a controls layer within the target
        var results = target.getElementsByClassName(classMC),
            controlLayer = results[0];

        // if we don't have a control layer, then create one
        if (! controlLayer) {
            controlLayer = _dom.create('div', { className: classMC });
        } // if

        return controlLayer;
    } // getControlsLayer
    
    /* exports */
    
    function add(target, controlType, opts) {
        // get the controls layer for the target
        var controlsLayer = getControlsLayer(target);
    } // add
    
    function register(controlType) {
        
    } // register
    
    return {
        _createEl: _dom.create,
        
        add: add,
        register: register
    };
})();