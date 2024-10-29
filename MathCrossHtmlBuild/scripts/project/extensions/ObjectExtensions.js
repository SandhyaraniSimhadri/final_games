export {};
Object.prototype.deepClone = function () {
    return JSON.parse(JSON.stringify(this));
};
Object.prototype.with = function (action) {
    action(this);
    return this;
};
Object.prototype.isEmpty = function () {
    return Object.keys(this).length === 0;
};
