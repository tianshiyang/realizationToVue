import { Dep } from "./dep.js";
function Watcher(vm, exp, callBack) {
  this.callBack = callBack;
  this.vm = vm;
  this.exp = exp;
  this.value = this.get();
}
Watcher.prototype = {
  update: function () {
    this.run();
  },
  run: function () {
    let value = this.vm.data[this.exp];
    let oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.callBack.call(this.vm, value, oldVal);
    }
  },
  get: function () {
    Dep.target = this;
    let value = this.vm.data[this.exp]; // 会触发observer的get方法
    Dep.target = null;
    return value;
  },
};
export { Watcher };
