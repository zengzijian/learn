class NewArray extends Array {
    constructor(...args: any[]) {
        super();
        let arr = Array.apply(null, args);
        arr.__proto__ = NewArray.prototype;
        return arr;
    }
}

let arrayMethods = Object.create(Array.prototype);
arrayMethods.constructor = NewArray;
NewArray.prototype = arrayMethods;

[
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'splice',
    'reverse'
].forEach(method => {
    (NewArray.prototype as any)[method] = function () {
        console.log("监听到数组变化");
        return (Array.prototype as any)[method].apply(this, arguments);
    }
});

export {NewArray};