import Dep from './Dep.js';

export default class Observer {
	constructor(data) {
		this.observe(data);
	}

	observe(data) {
		if (data && typeof data === 'object') {
			Object.keys(data).forEach((key) => {
				this.defineReactive(data, key, data[key]);
			});
		}
	}

	defineReactive(obj, key, value) {
		this.observe(value);
		const dep = new Dep();
		Object.defineProperty(obj, key, {
			get() {
				const target = Dep.target;
				// 每个data数据对应的节点watcher，一个数据的对应的节点可能是多个的，dep里面保存了一个数据所对应的节点列表
				// 编译器每编译到一个有数据依赖的节点，都会进到这里，把当前遍历到的节点添加到目标数据的依赖列表
				// Dep.target就表示目前正在编译的节点
				target && dep.addWatcher(target);
				Dep.target = null;
				return value;
			},
			set: (newVal) => {
				if (value === newVal) return;
				// 处理复杂数据类型的劫持
				this.observe(newVal);
				value = newVal;
				// 每次更改数据，都更新当前数据的所有依赖节点列表
				dep.notify();
			},
		});
	}
}
