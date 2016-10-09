/**
 * @author: zimyuan
 * @last-edit-date: 2016-10-08
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
};

function none() {}

/**
 * @constructor
 */
export default class EasyDrag {
	constructor (ele, handlers = {}, options = {}) {
		// Extend default config, customize will replace default config.
		this.config = util.extend(defaultConfig, options);
		console.log(this.config)
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
		this.startPos = { x: 0, y: 0 };

		// bind function context
		this.start = this.start.bind(this);
		this.move  = this.move.bind(this);
		this.end   = this.end.bind(this);

		util.addEvent(this.ele, this.dragEvent.start, this.start);

		if ( this.config.wrapper )
			this.setWrapper(this.config.wrapper);
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

	moveTo (pos) {
		let prefix = util.getStylePrefix();

		this.ele.style.cssText = `${prefix}:translate(${pos.x}px, ${pos.y}px);`;
	}

	start (e) {
		let that = this;

		util.preventDefault(e);
		util.addClass(that.ele, that.config.draggingClass);
		// TODO: set index

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

		// set next start position
		that.moveTo(that.startPos);
		that.onDragIng(that.startPos.x, that.startPos.y, e);
	}	

	end () {
		let that = this;

		util.removeClass(that.ele, that.config.draggingClass);

		util.removeEvent(document, that.dragEvent.move, that.move);
		util.removeEvent(document, that.dragEvent.end,  that.end);
	}

	/**
	 * Set drap wrapper.
	 */
	setWrapper (outer) {
		let that = this;

		let outerPos = util.getPosition(outer);
		let elePos   = util.getPosition(that.ele);

		let outerSize = util.getEleSize(outer);
		let eleSize   = util.getEleSize(that.ele);

		let lowerX = 0;
		let lowerY = 0;
		let highX  = 0;
		let highY  = 0;		

		if ( !that.config.lockX ) {
			lowerX = elePos.x - outerPos.x;
			highX  = outerSize.width - eleSize.width - Math.abs(lowerX);
		} 

		if ( !that.config.lockY ) {
			lowerY = elePos.y - outerPos.y;
			highY  = outerSize.height - eleSize.height - Math.abs(lowerY);
		}

		this.config.limitX = [lowerX, highX];
		this.config.limitY = [lowerY, highY];

		console.log(this.config.limitY)
	}
}
