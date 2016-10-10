/**
 * @author: zimyuan
 * @last-edit-date: 2016-10-10
 */

import { util } from './util';

// default config
let defaultConfig = {
	draggingClass : 'dragging',
	wrapper       : null,
	limitX        : [-9999, 9999],
	limitY        : [-9999, 9999],
	lockX         : false,
	lockY         : false,
	useGPU        : true,
	lockScreen    : false
};

function none() {}

/**
 * @constructor
 */
export default class EasyDrag {
	constructor (ele, handlers = {}, options = {}) {
		// Extend default config, customize will replace default config.
		this.config    = util.extend(defaultConfig, options);
		this.ele       = ele;
		this.dragEvent = util.getDragEvents();

		// event hooks;
		this.onDragStart = handlers.onDragStart || none;
		this.onDragIng   = handlers.onDragIng   || none; 
		this.onDragEnd   = handlers.onDragEnd   || none;

		this.init();
	}

	init () {
		// use to save start positon temply
		this.startPos = util.getPosition(this.ele);

		this.initPos  = util.getOffsetPosition(this.ele);
		this.currPos  = { x: 0, y: 0 };

		this.prefix = util.getStylePrefix();

		// bind function context
		this.start = this.start.bind(this);
		this.move  = this.move.bind(this);
		this.end   = this.end.bind(this);

		util.addEvent(this.ele, this.dragEvent.start, this.start);

		if ( this.config.wrapper )
			this.limitDragInWrapper(this.config.wrapper);

		if ( this.config.lockScreen )
			this.limitDragInScreen();
			
		this.initGPUAcceleration();

		// fix bug in WeChat(IOS)!!!
		document.ontouchend = none;
	}

	/**
	 * Use GPU Acceleration to improve performance.
	 * 
	 * reference
	 * https://www.sitepoint.com/introduction-to-hardware-acceleration-css-animations/
	 */
	initGPUAcceleration () {
		if ( this.config.useGPU )
			util.setCSSText(this.ele, 'transform: translate3d(0px, 0px, 0px);');
	}

	getPosInLimit (cur, lowLimit, highLimit) {
		let validPos;

		if ( cur >= lowLimit && cur <= highLimit )
			validPos = cur;

		else if ( cur < lowLimit )
			validPos = lowLimit;

		else if ( cur > highLimit )
			validPos = highLimit;

		return validPos;
	}

	getRealPosition (startPos, movePos) {
		return {
			x: startPos.x + movePos.x,
			y: startPos.y + movePos.y
		}
	}

	moveTo (pos) {
		let GPUCSS = (  this.config.useGPU
					  ? 'translate3d(0px, 0px, 0px)'
					  : ''  );
		
		let cssStr = `${this.prefix}:translate(${pos.x}px, ${pos.y}px) ${GPUCSS};`;

		util.setCSSText(this.ele, cssStr);
	}

	start (e) {
		let that = this;

		if ( that.ele.setCapture ) {
          	that.ele.setCapture();
      	} else if ( window.captureEvents ) {
			window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
      	}

		util.preventDefault(e);
		util.addClass(that.ele, that.config.draggingClass);

		// save start position temply
		that.startPos    = util.getPosition(that.ele);
		that.startCursor = util.getCursor(e);

		// add event listener
		util.addEvent(document, that.dragEvent.move, that.move);
		util.addEvent(document, that.dragEvent.end,  that.end);

		that.onDragStart(that.startCursor.x, that.startCursor.y, e);		
	}

	move (e) {
		let that          = this;
		let newCursor     = util.getCursor(e);

		util.preventDefault(e);

		if ( !that.config.lockX ) {
			let moveX = newCursor.x - that.startCursor.x;
			let newX  = that.startPos.x + moveX;

			that.startPos.x = that.getPosInLimit(
								newX,
								that.config.limitX[0],
								that.config.limitX[1]
							);

			if ( that.startPos.x === newX )
				that.startCursor.x = newCursor.x;
		}

		if ( !that.config.lockY ) {
			let moveY = newCursor.y - that.startCursor.y;
			let newY  = that.startPos.y + moveY;

			that.startPos.y = that.getPosInLimit(
								newY,
								that.config.limitY[0],
								that.config.limitY[1]
							);
			if ( that.startPos.y === newY )
				that.startCursor.y = newCursor.y;
		}

		that.moveTo(that.startPos);

		that.currPos = that.getRealPosition(that.initPos, that.startPos);
		that.onDragIng(that.currPos.x, that.currPos.y, e);
	}	

	end () {
		let that = this;

		util.removeClass(that.ele, that.config.draggingClass);

		util.removeEvent(document, that.dragEvent.move, that.move);
		util.removeEvent(document, that.dragEvent.end,  that.end);

		window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
	}

	setBoundWithSizeAndPos (outerPos, elePos, outerSize, eleSize) {
		let that = this;
		let lowerX = 0;
		let lowerY = 0;
		let highX  = 0;
		let highY  = 0;

		if ( !that.config.lockX ) {
			lowerX = outerPos.x - elePos.x;
			highX  = outerSize.width - eleSize.width - Math.abs(lowerX);
		} 

		if ( !that.config.lockY ) {
			lowerY = outerPos.y - elePos.y;
			highY  = outerSize.height - eleSize.height - Math.abs(lowerY);
		}

		this.config.limitX = [lowerX, highX];
		this.config.limitY = [lowerY, highY];
	}

	limitDragInWrapper (outer) {
		let that = this;

		that.setBoundWithSizeAndPos(
			util.getOffsetPosition(outer),
			util.getOffsetPosition(that.ele),
			util.getEleSize(outer),
			util.getEleSize(that.ele)
		);
	}

	limitDragInScreen () {
		let that = this;

		that.setBoundWithSizeAndPos(
			{ x: 0, y: 0 },
			util.getOffsetPosition(that.ele),
			util.getScreenSize(),
			util.getEleSize(that.ele)
		);
	}
}
