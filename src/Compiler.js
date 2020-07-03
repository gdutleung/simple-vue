import utils from './helper/index.js';

export default class Compiler {
	constructor(el, vm) {
		this.el = this.isElementNode(el) ? el : document.querySelector(el);
		this.vm = vm;
		const fragment = this.CompileFragment(this.el);
		this.compile(fragment);
		this.el.appendChild(fragment);
	}
  
	compile(fragment) {
		const childNodes = Array.from(fragment.childNodes);
		childNodes.forEach(childNode => {
			if (this.isElementNode(childNode)) {
				// 元素节点 检查是否有v-开头的属性
				this.compileElement(childNode);
        
			} else if (this.isTextNode(childNode)) {
				// 文本节点 检查是否有双括号的语法
				this.compileText(childNode);
			}
      
			// DFS遍历子节点的子节点
			if (childNode.childNodes && childNode.childNodes.length) {
				this.compile(childNode);
			}
		});
    
	}
  
	CompileFragment(el) {
		const f = document.createDocumentFragment();
		let firstChild;
		while (el.firstChild) {
			firstChild = el.firstChild;
			f.appendChild(firstChild);
		}
		return f;
	}
  

	compileElement(node) {
		const attributes = Array.from(node.attributes);
		attributes.forEach(attr => {
			const { name, value } = attr;
			if (this.isDirector(name)) {
				// 指令 v-model, v-text, v-bind, v-on:click
				const [, directive] = name.split('-');
				const [compilerKey, eventName] = directive.split(':');
				utils[compilerKey](node, value, this.vm, eventName);
			} else if (this.isEventName(name)) {
				// @click
				const [, eventName] = name.split('@');
				utils['on'](node, value, this.vm, eventName);
			}
		});
	}
  
	isEventName(name) {
		return name.startsWith('@');
	}
  
	isDirector(name) {
		return name.startsWith('v-');
	}

	compileText(node) {
		const content = node.textContent;
		if (/\{\{(.+)\}\}/.test(content)) {
			utils['text'](node, content, this.vm);
		}
	}
  
	isElementNode(el) {
		return el.nodeType === 1;
	}
  
	isTextNode(el) {
		return el.nodeType === 3;
	}
}