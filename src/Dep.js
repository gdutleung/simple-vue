export default class Dep {
	constructor() {
		this.collect = [];
		this.target = null;
	}

	addWatcher(watcher) {
		this.collect.push(watcher);
	}

	notify() {
		this.collect.forEach(w => w.update());
	}
}