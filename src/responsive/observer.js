import { Dep } from "./dep.js";
function defineReactive(data, key, val) {
  observer(val); // 递归遍历子属性
  let dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set: function (newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal;
      dep.notify();
    },
  });
}
function observer(data) {
  // typeof null === 'object'
  if (!data || typeof data !== "object") {
    return;
  }
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key]);
  });
}

export { observer };
