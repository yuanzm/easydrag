import ES6Template from '../src/index';
import should from 'should';

describe('index test', () => {
	describe('sayName', () => {
		it ('should say name correctly', () => {
			let es6template = new ES6Template();

			es6template.sayName().should.equal('ES6Template');
		});
	});
});