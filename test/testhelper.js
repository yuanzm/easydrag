
import jsdom from 'jsdom';

global.document  = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window    = document.defaultView;

global.navigator = {
	userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_4 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G35 MicroMessenger/6.3.23 NetType/WIFI Language/zh_CN'
};

global.location = {
	search: '?foo=bar'	
}

global.localStorage = window.localStorage = window.sessionStorage = {
	 _data      : {},
    setItem     : function (id, val) { return this._data[id] = String(val); },
    getItem     : function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : null; },
    removeItem  : function(id) { return delete this._data[id]; },
    clear       : function() { return this._data = {}; }
};
