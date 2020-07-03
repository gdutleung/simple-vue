import Observer from './Observer.js';
import Compiler from './Compiler.js';

class Vue {
	constructor(options) {
		const { el, data } = options;
		this.$el = el;
		this.$data = data;
		this.$options = options;

		// 对数据进行劫持
		new Observer(this.$data);
    
		// 处理模板部分
		new Compiler(this.$el, this);

		this.proxyData(this.$data);
	}

	// 把所有data里的数据转发代理到this上，以便通过this.xx = xx 的方式修改数据，从而触发模板更新
	proxyData(data) {
		Object.keys(data).forEach((key) => {
			Object.defineProperty(this, key, {
				get() {
					return data[key];
				},
				set(newVal) {
					data[key] = newVal;
				},
			});
		});
	}
}

export default Vue;
