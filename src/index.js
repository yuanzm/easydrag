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
	lockScreen    : false,
    CSSPosition   : 'absolute',
};

function none() {}

/**
 * @constructor
 */
export default class EasyDrag {
	constructor (ele, handlers = {}, options = {}) {
		// Extend default config, customize will replace default config.
		this.config      = util.extend(defaultConfig, options);
		this.ele         = ele;
		this.dragEvent   = util.getDragEvents();

		// event hooks;
		this.onDragStart = handlers.onDragStart || none;
		this.onDragIng   = handlers.onDragIng   || none;
		this.onDragEnd   = handlers.onDragEnd   || none;

        this.isFixed = !!( this.config.CSSPosition === 'fixed' );

		this.init();
	}

	init () {
		// use to save start positon temply
		this.startPos  = util.getOffsetPosition(this.ele, this.isFixed);
		this.initPos   = util.getOffsetPosition(this.ele, this.isFixed);

		this.prefix = util.getStylePrefix();

		// bind function context
		this.start = this.start.bind(this);
		this.move  = this.move.bind(this);
		this.end   = this.end.bind(this);

        // 将拖拽限定在边界内
        this.limitDragInWrapper();

		this.moveTo(this.initPos);

		this.enable();
		// fix bug in WeChat(IOS)!!!
		document.ontouchend = none;
	}

	// Check whether given position is in limit.
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
		let GPUCSS = (  this.config.useGPU
					  ? 'transform: translate3d(0px, 0px, 0px)'
					  : ''  );

		let cssStr = `${GPUCSS};
					  position : ${this.config.CSSPosition};
					  left     : ${pos.x}px;
					  top      : ${pos.y}px;
					  margin   : 0;
					  bottom   : auto;
					  right    : auto;`;
		util.setCSSText(this.ele, cssStr);
	}

	enable () {
		util.addEvent(this.ele, this.dragEvent.start, this.start);
	}

	disable () {
		util.removeEvent(this.ele, this.dragEvent.start, this.start);
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
		that.startPos    = util.getOffsetPosition(that.ele, this.isFixed);
		that.startCursor = util.getCursor(e);

		// add event listener
		util.addEvent(document, that.dragEvent.move, that.move);
		util.addEvent(document, that.dragEvent.end,  that.end);

		that.onDragStart(that.startPos.x, that.startPos.y, e);

        // 将拖拽限定在边界内
        this.limitDragInWrapper();

		this.moveTo(this.startPos);
	}

    setZoom () {
      	let that    = this;
      	let element = that.ele;
      	let zoom    = 1;

      	while ( element = element.offsetParent ) {
        	let z = getStyle(element).zoom;

        	if ( z && z !== 'normal' ) {
          		zoom = z;
          		break;
        	}
      	}

      	return zoom;
    }

	move (e) {
		let that      = this;
		let newCursor = util.getCursor(e);
		let newPos    = {x: that.startPos.x, y: that.startPos.y};

		util.preventDefault(e);

		if ( !that.config.lockX ) {
			let newX = newCursor.x - that.startCursor.x + that.startPos.x;

			let validX =
				that.getPosInLimit(
					newX,
					that.config.limitX[0],
					that.config.limitX[1]
				 );

			newPos.x = validX;
		}

		if ( !that.config.lockY ) {
			let newY = newCursor.y - that.startCursor.y + that.startPos.y;

			let validY =
				that.getPosInLimit(
					newY,
					that.config.limitY[0],
					that.config.limitY[1]
				);

			newPos.y = validY;
		}

		that.moveTo(newPos);
		that.onDragIng(newPos.x, newPos.y, e);
		that.lastPos = newPos;
	}

	end () {
		let that = this;

		util.removeClass(that.ele, that.config.draggingClass);

		util.removeEvent(document, that.dragEvent.move, that.move);
		util.removeEvent(document, that.dragEvent.end,  that.end);

		window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);

        let endPos = (  this.lastPos && this.lastPos.x
                      ? this.lastPos
                      : this.startPos  );

		that.onDragEnd(endPos.x, endPos.y);
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

		this.config.limitX = [elePos.x + lowerX, elePos.x + highX];
		this.config.limitY = [elePos.y + lowerY, elePos.y + highY];
	}

	limitDragInWrapper () {
        if ( !this.config.wrapper && !this.config.lockScreen )
            return;

		// set drag wrapper
		if ( this.config.wrapper ) {
            let outet = this.config.wrapper;
            let that = this;

            that.setBoundWithSizeAndPos(
                util.getOffsetPosition(outer, this.isFixed),
                util.getOffsetPosition(that.ele, this.isFixed),
                util.getEleSize(outer),
                util.getEleSize(that.ele)
            );
        }

		// limit drag in screen
		if ( this.config.lockScreen ) {
            let that = this;

            that.setBoundWithSizeAndPos(
                { x: 0, y: 0 },
                util.getOffsetPosition(that.ele, this.isFixed),
                util.getScreenSize(),
                util.getEleSize(that.ele)
            );
        }
	}
}
