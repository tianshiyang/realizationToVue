import { Watcher } from "./watcher.js";
function Compile(el, vm) {
  this.vm = vm;
  this.el = document.querySelector(el);
  this.fragment = null;
  this.init();
}
Compile.prototype = {
  init: function () {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el);
      this.compileElement(this.fragment);
      this.el.appendChild(this.fragment);
    } else {
      console.log("el不存在");
    }
  },
  nodeToFragment: function (el) {
    let fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while (child) {
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  compileElement: function (el) {
    let childNodes = el.childNodes;
    const self = this;
    let arr = [];
    arr.slice.call(childNodes).forEach((node) => {
      const reg = /\{\{(.*)\}\}/;
      let text = node.textContent;
      if (self.isElementNode(node)) {
        // 元素节点
        self.compile(node);
      } else if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, reg.exec(text)[1]);
      }
      if (node.childNodes && node.childNodes.length) {
        // 递归遍历所有子节点
        self.compileElement(node);
      }
    });
  },
  compile: function (node) {
    let nodeAttrs = node.attributes;
    const self = this;
    Array.prototype.forEach.call(nodeAttrs, (attr) => {
      let attrName = attr.name;
      if (self.isDirective(attrName)) {
        let exp = attr.value.trim();
        let dir = attrName.substring(2);
        if (self.isEventDirective(dir)) {
          // 事件指令
          self.compileEvent(node, self.vm, exp, dir);
        } else {
          // v-model
          self.compileModel(node, self.vm, exp, dir);
        }
        node.removeAttribute(attrName);
      }
    });
  },
  compileText: function (node, exp) {
    const self = this;
    exp = exp.trim();
    var initText = this.vm[exp];
    // 初始化节点值
    this.updateText(node, initText);
    // watcher监听
    new Watcher(this.vm, exp, (value) => {
      self.updateText(node, value);
    });
  },
  compileEvent: function (node, vm, exp, dir) {
    exp = exp.trim();
    let eventType = dir.split(":")[1];
    let cb = vm.methods && vm.methods[exp];
    if (eventType && cb) {
      // @click = "click" 和method中的click方法存在
      node.addEventListener(eventType, cb.bind(vm), false);
    }
  },
  compileModel: function (node, vm, exp, dir) {
    exp = exp.trim();
    // v-model
    const self = this;
    let val = this.vm[exp];
    // 初始化加载
    this.modelUpdater(node, val);
    new Watcher(this.vm, exp, (value) => {
      // 后期双向绑定值改变的时候，自动触发watcher
      self.modelUpdater(node, value);
    });
    // input 的双向绑定
    node.addEventListener("input", (e) => {
      let newVal = e.target.value;
      if (val === newVal) {
        return;
      }
      self.vm[exp] = newVal;
      val = newVal;
    });
  },
  updateText: function (node, value) {
    node.textContent = typeof value == "undefined" ? "" : value;
  },
  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == "undefined" ? "" : value;
  },
  isDirective: function (attr) {
    return attr.indexOf("v-") == 0;
  },
  isEventDirective: function (dir) {
    return dir.indexOf("on:") === 0;
  },
  isElementNode: function (node) {
    return node.nodeType == 1;
  },
  isTextNode: function (node) {
    return node.nodeType == 3;
  },
};

export { Compile };
