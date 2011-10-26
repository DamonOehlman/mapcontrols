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