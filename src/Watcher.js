import Dep from './Dep.js';
import utils from './helper/index.js';

export default class Watcher {
	constructor(expr, vm, cb) {
		this.expr = expr;
		this.vm = vm;
		this.cb = cb;
		// 触发getter对数据进行绑定，标记当前watcher
		this.oldValue = this.getOldValue();
	}
  
	getOldValue() {
		Dep.target = this;
		const oldValue = utils.getValue(this.expr, this.vm);
		Dep.target = null;
		return oldValue;
	}

	update() {
		const newValue = utils.getValue(this.expr, this.vm);
		if (newValue !== this.oldValue) {
			this.cb(newValue);
		}
	}
}

