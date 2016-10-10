/**
 * @author: zimyuan
 * @last-edit-date: 2016-10-10
 */

let util = {
    extend (a, b) {
        for ( let key in b )
            if ( b.hasOwnProperty(key) )
                a[key] = b[key];

        return a;
    },

    isTouchDevice () {
 		return (   ( 'ontouchstart' in window )
      		    || ( navigator.MaxTouchPoints > 0 )
      			|| ( navigator.msMaxTouchPoints > 0 )  );
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

        return (  util.isTouchDevice ()
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

    isStrEndWith (str, suffix) {
    	let l = str.length - suffix.length;

		return (   l >= 0 
				&& str.indexOf(suffix, l) === l  );	
    },

	setCSSText(ele, cssStr) {
		let cssText = ele.style.cssText;

		// In IE6/7/8, cssText is not end with `;` !!!
		if ( !util.isStrEndWith(cssText, ';') )
			cssText += ';';

		ele.style.cssText = cssText + cssStr;
	}, 

    /**
     * Get offset postion.
     * 
     * reference
     *
     * http://youmightnotneedjquery.com/
     * http://ejohn.org/blog/getboundingclientrect-is-awesome/
     */
    getOffsetPosition (ele) {
      	var rect = ele.getBoundingClientRect();

		return {
		  	x: rect.left + document.body.scrollLeft,
		  	y: rect.top + document.body.scrollTop
		};
    },

    getPosition: (ele) => {
        if ( !window.getComputedStyle )
            return;

        let style     = window.getComputedStyle(ele);
        let prefix    = util.getStylePrefix();
        let transform = style.getPropertyValue(prefix)

        let mat3d = transform.match(/^matrix3d\((.+)\)$/);
        if ( mat3d ) {
        	let coords = mat3d[1].split(', ');
            return {
            	x: parseFloat( coords[12] ),
            	y: parseFloat( coords[13] )
            };        	
        }

        let mat2d = transform.match( /^matrix\((.+)\)$/ );
        if ( mat2d ) {
        	let coords = mat2d[1].split(', ');
        	return {
            	x: parseFloat( coords[4] ),
            	y: parseFloat( coords[5] )
            };
        }

        return {  x: 0, y: 0 };
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
    },

    /**
     * Get width and height of element
     * It is better to use clientWidth/clientHeight than offsetWidth/offsetHeight
     *
     * http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
     */
    getEleSize (ele) {
    	return {
    		width  : parseInt(ele.clientWidth, 10),
    		height : parseInt(ele.clientHeight, 10) 
    	};
    },

    getScreenSize() {
	    let e = window;
	    let a = 'inner';

	    if ( !( 'innerWidth' in window ) ) {
	        a = 'client';
	        e = document.documentElement || document.body;
	    }

	    return { 
	        width  : e[a+'Width'], 
	        height : e[a+'Height'] 
	    };
	}
};

export { util };
