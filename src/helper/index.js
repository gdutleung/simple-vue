import Watcher from '../Watcher.js';

export default {
	getValue(expr, vm) {
		return vm.$data[expr.trim()];
	},
	setValue(expr, vm, newVal) {
		vm.$data[expr] = newVal;
	},
	model(node, value, vm) {
		const initValue = this.getValue(value, vm);
		new Watcher(value, vm, (newValue) => {
			this.modelUpdate(node, newValue);
		});
		node.addEventListener('input', (e) => {
			const newVal = e.target.value;
			this.setValue(value, vm, newVal);
		});
		this.modelUpdate(node, initValue);
	},
	text(node, value, vm) {
		let result;
		if (value.includes('{{')) {
			// 插值语法
			value.replace(/\{\{(.+)\}\}/g, (...args) => {
				const expr = args[1];
				new Watcher(expr, vm, (newVal) => {
					this.textUpdater(node, newVal);
				});
				result = this.getValue(args[1], vm);
			});
		} else {
			// 指令
			result = this.getValue(value, vm);
		}
		this.textUpdater(node, result);
	},
	on(node, value, vm, eventName) {
		const fn = vm.$options.methods[value];
		node.addEventListener(eventName, fn.bind(vm), false);
	},
	textUpdater(node, value) {
		node.textContent = value;
	},
	modelUpdate(node, value) {
		node.value = value;
	}
};
