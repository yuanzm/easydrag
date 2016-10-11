(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("EasyDrag", [], factory);
	else if(typeof exports === 'object')
		exports["EasyDrag"] = factory();
	else
		root["EasyDrag"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author: zimyuan
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @last-edit-date: 2016-10-10
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _util = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// default config
	var defaultConfig = {
		draggingClass: 'dragging',
		wrapper: null,
		limitX: [-9999, 9999],
		limitY: [-9999, 9999],
		lockX: false,
		lockY: false,
		useGPU: true,
		lockScreen: false
	};

	function none() {}

	/**
	 * @constructor
	 */

	var EasyDrag = function () {
		function EasyDrag(ele) {
			var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			_classCallCheck(this, EasyDrag);

			// Extend default config, customize will replace default config.
			this.config = _util.util.extend(defaultConfig, options);
			this.ele = ele;
			this.dragEvent = _util.util.getDragEvents();

			// event hooks;
			this.onDragStart = handlers.onDragStart || none;
			this.onDragIng = handlers.onDragIng || none;
			this.onDragEnd = handlers.onDragEnd || none;

			this.init();
		}

		_createClass(EasyDrag, [{
			key: 'init',
			value: function init() {
				// use to save start positon temply
				this.startPos = _util.util.getOffsetPosition(this.ele);
				this.initPos = _util.util.getOffsetPosition(this.ele);

				this.prefix = _util.util.getStylePrefix();

				// bind function context
				this.start = this.start.bind(this);
				this.move = this.move.bind(this);
				this.end = this.end.bind(this);

				// set drag wrapper
				if (this.config.wrapper) this.limitDragInWrapper(this.config.wrapper);

				// limit drag in screen
				if (this.config.lockScreen) this.limitDragInScreen();

				this.moveTo(this.initPos);

				_util.util.addEvent(this.ele, this.dragEvent.start, this.start);

				// fix bug in WeChat(IOS)!!!
				document.ontouchend = none;
			}

			// Check whether given position is in limit.

		}, {
			key: 'getPosInLimit',
			value: function getPosInLimit(cur, lowLimit, highLimit) {
				var validPos = void 0;

				if (cur >= lowLimit && cur <= highLimit) validPos = cur;else if (cur < lowLimit) validPos = lowLimit;else if (cur > highLimit) validPos = highLimit;

				return validPos;
			}
		}, {
			key: 'moveTo',
			value: function moveTo(pos) {
				var GPUCSS = this.config.useGPU ? 'transform: translate3d(0px, 0px, 0px);' : '';

				var cssStr = GPUCSS + ' position: absolute; left: ' + pos.x + 'px; top: ' + pos.y + 'px; margin: 0; bottom: auto; right: auto;';
				_util.util.setCSSText(this.ele, cssStr);
			}
		}, {
			key: 'start',
			value: function start(e) {
				var that = this;

				if (that.ele.setCapture) {
					that.ele.setCapture();
				} else if (window.captureEvents) {
					window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
				}

				_util.util.preventDefault(e);
				_util.util.addClass(that.ele, that.config.draggingClass);

				// save start position temply
				that.startPos = _util.util.getOffsetPosition(that.ele);
				that.startCursor = _util.util.getCursor(e);

				// add event listener
				_util.util.addEvent(document, that.dragEvent.move, that.move);
				_util.util.addEvent(document, that.dragEvent.end, that.end);

				that.onDragStart(that.startPos.x, that.startPos.y, e);

				that.setZoom();
			}
		}, {
			key: 'setZoom',
			value: function setZoom() {
				var that = this;
				var element = that.ele;
				var zoom = 1;

				while (element = element.offsetParent) {
					var z = getStyle(element).zoom;

					if (z && z !== 'normal') {
						zoom = z;
						break;
					}
				}

				return zoom;
			}
		}, {
			key: 'move',
			value: function move(e) {
				var that = this;
				var newCursor = _util.util.getCursor(e);
				var newPos = { x: that.startPos.x, y: that.startPos.y };

				_util.util.preventDefault(e);

				if (!that.config.lockX) {
					var newX = newCursor.x - that.startCursor.x + that.startPos.x;

					var validX = that.getPosInLimit(newX, that.config.limitX[0], that.config.limitX[1]);

					newPos.x = validX;
				}

				if (!that.config.lockY) {
					var newY = newCursor.y - that.startCursor.y + that.startPos.y;

					var validY = that.getPosInLimit(newY, that.config.limitY[0], that.config.limitY[1]);

					newPos.y = validY;
				}

				that.moveTo(newPos);
				that.onDragIng(newPos.x, newPos.y, e);
			}
		}, {
			key: 'end',
			value: function end() {
				var that = this;

				_util.util.removeClass(that.ele, that.config.draggingClass);

				_util.util.removeEvent(document, that.dragEvent.move, that.move);
				_util.util.removeEvent(document, that.dragEvent.end, that.end);

				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			}
		}, {
			key: 'setBoundWithSizeAndPos',
			value: function setBoundWithSizeAndPos(outerPos, elePos, outerSize, eleSize) {
				var that = this;
				var lowerX = 0;
				var lowerY = 0;
				var highX = 0;
				var highY = 0;

				if (!that.config.lockX) {
					lowerX = outerPos.x - elePos.x;
					highX = outerSize.width - eleSize.width - Math.abs(lowerX);
				}

				if (!that.config.lockY) {
					lowerY = outerPos.y - elePos.y;
					highY = outerSize.height - eleSize.height - Math.abs(lowerY);
				}

				this.config.limitX = [elePos.x + lowerX, elePos.x + highX];
				this.config.limitY = [elePos.y + lowerY, elePos.y + highY];
			}
		}, {
			key: 'limitDragInWrapper',
			value: function limitDragInWrapper(outer) {
				var that = this;

				that.setBoundWithSizeAndPos(_util.util.getOffsetPosition(outer), _util.util.getOffsetPosition(that.ele), _util.util.getEleSize(outer), _util.util.getEleSize(that.ele));
			}
		}, {
			key: 'limitDragInScreen',
			value: function limitDragInScreen() {
				var that = this;

				that.setBoundWithSizeAndPos({ x: 0, y: 0 }, _util.util.getOffsetPosition(that.ele), _util.util.getScreenSize(), _util.util.getEleSize(that.ele));
			}
		}]);

		return EasyDrag;
	}();

	exports.default = EasyDrag;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @author: zimyuan
	 * @last-edit-date: 2016-10-10
	 */

	var util = {
	    extend: function extend(a, b) {
	        for (var key in b) {
	            if (b.hasOwnProperty(key)) a[key] = b[key];
	        }return a;
	    },
	    isTouchDevice: function isTouchDevice() {
	        return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
	    },


	    getDragEvents: function getDragEvents() {
	        var mouseEvents = {
	            start: 'mousedown',
	            move: 'mousemove',
	            end: 'mouseup'
	        };

	        var touchEvents = {
	            start: 'touchstart',
	            move: 'touchmove',
	            end: 'touchend'
	        };

	        return util.isTouchDevice() ? touchEvents : mouseEvents;
	    },

	    // Get CSS vendor-prefixed transform property.
	    getStylePrefix: function getStylePrefix() {
	        var prefixes = ' -o- -ms- -moz- -webkit-'.split(' ');
	        var style = document.body.style;

	        for (var n = prefixes.length; n--;) {
	            var property = prefixes[n] + 'transform';
	            if (property in style) return property;
	        }
	    },

	    isStrEndWith: function isStrEndWith(str, suffix) {
	        var l = str.length - suffix.length;

	        return l >= 0 && str.indexOf(suffix, l) === l;
	    },
	    setCSSText: function setCSSText(ele, cssStr) {
	        var cssText = ele.style.cssText;

	        // In IE6/7/8, cssText is not end with `;` !!!
	        if (!util.isStrEndWith(cssText, ';')) cssText += ';';

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
	    getOffsetPosition: function getOffsetPosition(ele) {
	        var rect = ele.getBoundingClientRect();

	        return {
	            x: rect.left + document.body.scrollLeft,
	            y: rect.top + document.body.scrollTop
	        };
	    },


	    getPosition: function getPosition(ele) {
	        if (!window.getComputedStyle) return;

	        var style = window.getComputedStyle(ele);
	        var prefix = util.getStylePrefix();
	        var transform = style.getPropertyValue(prefix);

	        var mat3d = transform.match(/^matrix3d\((.+)\)$/);
	        if (mat3d) {
	            var coords = mat3d[1].split(', ');
	            return {
	                x: parseFloat(coords[12]),
	                y: parseFloat(coords[13])
	            };
	        }

	        var mat2d = transform.match(/^matrix\((.+)\)$/);
	        if (mat2d) {
	            var _coords = mat2d[1].split(', ');
	            return {
	                x: parseFloat(_coords[4]),
	                y: parseFloat(_coords[5])
	            };
	        }

	        return { x: 0, y: 0 };
	    },

	    hasClass: function hasClass(ele, cls) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        var className = ele.getAttribute("class") ? ele.className : '';

	        return reg.test(className);
	    },
	    addClass: function addClass(ele, cls) {
	        if (!util.hasClass(ele, cls)) return ele.className += ' ' + cls;
	    },
	    removeClass: function removeClass(ele, cls) {
	        if (util.hasClass(ele, cls)) {
	            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');

	            return ele.className = ele.className.replace(reg, ' ');
	        }
	    },


	    // add event listener hack
	    addEvent: function addEvent(element, type, handler) {
	        if (element.addEventListener) element.addEventListener(type, handler, false);else if (element.attachEvent) element.attachEvent('on' + type, handler);else element['on' + type] = handler;
	    },


	    // remove event listener hack
	    removeEvent: function removeEvent(element, type, handler) {
	        if (element.removeEventListener) element.removeEventListener(type, handler, false);else if (element.detachEvent) element.detachEvent('on' + type, handler);else element['on' + type] = null;
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
	    preventDefault: function preventDefault(e) {
	        if (e.preventDefault) e.preventDefault();else
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
	    getCursor: function getCursor(e) {
	        return !!('ontouchstart' in window) ? {
	            x: e.touches[0].pageX,
	            y: e.touches[0].pageY
	        } : {
	            x: e.clientX,
	            y: e.clientY
	        };
	    },


	    /**
	     * Get width and height of element
	     * It is better to use clientWidth/clientHeight than offsetWidth/offsetHeight
	     *
	     * http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
	     */
	    getEleSize: function getEleSize(ele) {
	        return {
	            width: parseInt(ele.clientWidth, 10),
	            height: parseInt(ele.clientHeight, 10)
	        };
	    },
	    getScreenSize: function getScreenSize() {
	        var e = window;
	        var a = 'inner';

	        if (!('innerWidth' in window)) {
	            a = 'client';
	            e = document.documentElement || document.body;
	        }

	        return {
	            width: e[a + 'Width'],
	            height: e[a + 'Height']
	        };
	    }
	};

	exports.util = util;

/***/ }
/******/ ])
});
;