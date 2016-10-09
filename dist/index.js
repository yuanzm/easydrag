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
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      8 @last-edit-date: 2016-10-08
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _util = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// default config
	var defaultConfig = {
		draggingClass: 'dropping',
		wrapper: null,
		limitX: [-9999, 9999],
		limitY: [-9999, 9999],
		lockX: false,
		lockY: false,
		useGPU: true
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

			// save start position temply
			this.startPos = { x: 0, y: 0 };

			// bind function context
			this.start = this.start.bind(this);
			this.move = this.move.bind(this);
			this.end = this.end.bind(this);

			this.init();
		}

		_createClass(EasyDrag, [{
			key: 'init',
			value: function init() {
				_util.util.addEvent(this.ele, this.dragEvent.start, this.start);
			}
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
				var prefix = _util.util.getStylePrefix();

				this.ele.style.cssText = prefix + ':translate(' + pos.x + 'px,' + pos.y + 'px);';
			}
		}, {
			key: 'start',
			value: function start(e) {
				var that = this;

				_util.util.preventDefault(e);
				_util.util.addClass(that.ele, that.config.draggingClass);
				// TODO: set index

				// save start position temply
				that.startPos = _util.util.getComputedPosition(that.ele);
				that.startCursor = _util.util.getCursor(e);

				_util.util.addEvent(document, that.dragEvent.move, that.move);
				_util.util.addEvent(document, that.dragEvent.end, that.end);

				that.onDragStart(that.startCursor.x, that.startCursor.y, e);
			}
		}, {
			key: 'move',
			value: function move(e) {
				var that = this;
				var newCursor = _util.util.getCursor(e);
				var newStartPos = {};

				_util.util.preventDefault(e);

				if (!that.config.lockX) {
					var moveX = newCursor.x - that.startCursor.x;
					var newX = that.startPos.x + moveX;

					newStartPos.x = that.getPosInLimit(newX, that.config.limitX[0], that.config.limitX[1]);

					if (newStartPos.x === newX) that.startCursor.x = newCursor.x;
				}

				if (!that.config.lockY) {
					var moveY = newCursor.y - that.startCursor.y;
					var newY = that.startPos.y + moveY;

					newStartPos.y = that.getPosInLimit(newY, that.config.limitY[0], that.config.limitY[1]);
					if (newStartPos.y === newY) that.startCursor.y = newCursor.y;
				}

				// set next start position
				that.startPos = newStartPos;
				that.moveTo(newStartPos);
				that.onDragIng(newStartPos.x, newStartPos.y, e);
			}
		}, {
			key: 'end',
			value: function end() {
				var that = this;

				_util.util.addClass(that.ele, that.config.draggingClass);

				_util.util.removeEvent(document, that.dragEvent.move, that.move);
				_util.util.removeEvent(document, that.dragEvent.end, that.end);
			}
		}, {
			key: 'setBound',
			value: function setBound() {
				// 
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

	var util = {
	  isType: function isType(type, value) {
	    var _type = Object.prototype.toString.call(value).match(/\s(\w+)/)[1].toLowerCase();

	    return _type === type;
	  },
	  isPlainObject: function isPlainObject(value) {
	    return !!value && util.isType('object', value);
	  },
	  extend: function extend(destination, source) {
	    if (!util.isPlainObject(destination) || !util.isPlainObject(source)) throw 'destination and source must be type of object';

	    for (var property in source) {
	      destination[property] = source[property];
	    }return destination;
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

	    return !!('ontouchstart' in window) ? touchEvents : mouseEvents;
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

	  getPosition: function getPosition() {},

	  getComputedPosition: function getComputedPosition(ele) {
	    if (!window.getComputedStyle) return;

	    var style = getComputedStyle(ele);
	    var transform = style.transform || style.webkitTransform || style.mozTransform || style.msTransform;
	    var mat = transform.match(/^matrix3d\((.+)\)$/);
	    var x = void 0;
	    var y = void 0;

	    if (mat) return parseFloat(mat[1].split(', ')[13]);

	    mat = transform.match(/^matrix\((.+)\)$/);

	    x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
	    y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;

	    return { x: x, y: y };
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
	  }
	};

	exports.util = util;

/***/ }
/******/ ])
});
;