
let util = {
	isType (type, value) {
		let _type = Object
			   		.prototype
			   		.toString
			   		.call(value)
			   		.match(/\s(\w+)/)[1]
			   		.toLowerCase();

		return _type === type;
	},

	isPlainObject (value) {
		return ( !!value && util.isType('object', value) );
	},

	extend (destination, source) {
		if ( !util.isPlainObject(destination) || !util.isPlainObject(source) )
			throw 'destination and source must be type of object';

		for ( let property in source )
			destination[property] = source[property];

		return destination;
	},

	getDragEvents: () => {
		let mouseEvents = {
			start : 'mousedown',
			move  : 'mousemove',
			end   : 'mouseup',
		};

		let touchEvents = {
			start : 'touchstart',
			move  : 'touchmove',
			end   : 'touchend'
		};

		return (  !!( 'ontouchstart' in window )
				? touchEvents
				: mouseEvents  );
	},

	// Get CSS vendor-prefixed transform property.
	getStylePrefix: () => {
	  	let prefixes = ' -o- -ms- -moz- -webkit-'.split(' ');
		let style = document.body.style;

      	for (let n = prefixes.length; n--;) {
	        let property = prefixes[n] + 'transform';
	        if ( property in style )
	          	return property;
		}
	},

	getPosition: () => {

	},

	getComputedPosition: (ele) => {
		if ( !window.getComputedStyle )
			return;

    	let style     = getComputedStyle(ele);
        let transform = style.transform       || 
        				style.webkitTransform ||
        				style.mozTransform    ||
        				style.msTransform;
    	let mat       = transform.match(/^matrix3d\((.+)\)$/);
    	let x;
    	let y;

    	if ( mat )
    		return parseFloat( mat[1].split(', ')[13] );

    	mat = transform.match( /^matrix\((.+)\)$/ );

    	x = (  mat 
    		 ? parseFloat(mat[1].split(', ')[4]) 
    		 : 0  );
    	y = (  mat 
    		 ? parseFloat(mat[1].split(', ')[5]) 
    		 : 0  );
    	
    	return { x, y };
	},

	hasClass (ele, cls) {
      	let reg       = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      	let className = ele.getAttribute("class") ? ele.className : '';

      	return reg.test(className);
    },

    addClass (ele, cls) {
      	if ( !util.hasClass(ele, cls) )
        	return ele.className += ' ' + cls;
    },

    removeClass (ele, cls) {
      	if ( util.hasClass(ele, cls) ) {
        	let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');

        	return ele.className = ele.className.replace(reg, ' ');
      	}
    },

    // add event listener hack
    addEvent (element, type, handler) {
        if ( element.addEventListener )
            element.addEventListener(type, handler, false);
        
        else if ( element.attachEvent )
            element.attachEvent('on' + type, handler);
        
        else
            element['on' + type] = handler;
    },
    
    // remove event listener hack
    removeEvent ( element, type, handler ) {
        if ( element.removeEventListener )
            element.removeEventListener(type, handler, false);
        
        else if ( element.detachEvent )
            element.detachEvent('on' + type, handler);
        
        else
            element['on' + type] = null;
    },

    /**
     * Prevent default behavior.
     * 
     * e.preventDefault() will prevent the default event from occuring,
     * e.stopPropagation() will prevent the event from bubbling up and return false will do both.
     * Note that this behaviour differs from normal (non-jQuery) event handlers,
     * in which, notably, return false does not stop the event from bubbling up.
     * 
     * reference:
     * http://stackoverflow.com/questions/1357118/event-preventdefault-vs-return-false
     * http://stackoverflow.com/questions/1000597/event-preventdefault-function-not-working-in-ie
     */ 
    preventDefault (e) {
    	if ( e.preventDefault )
    		e.preventDefault();
    	else
    		// It's worth noting that "event" must be the global event object in IE8.
    		// You can't use the event passed into the event handler,
    		// like e.preventDefault, it must be event.preventDefault in order for this to work in IE8.
    		event.returnValue = false;
    },

    /**
     * Get cursor's current position.
     * 
     * reference
     * http://stackoverflow.com/questions/7056026/variation-of-e-touches-e-targettouches-and-e-changedtouches
     */
    getCursor (e) {
		return (  !!( 'ontouchstart' in window )
				? { 
				      x: e.touches[0].pageX,
					  y: e.touches[0].pageY 
				  }
				: {
				      x: e.clientX,
					  y: e.clientY
				  }  );
    }
};

export { util };
