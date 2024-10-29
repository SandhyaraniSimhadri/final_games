export {};
Promise.prototype.series = function (promises) {
    return promises.reduce(async (promise, next) => {
        const ts = await promise;
        const t = await next;
        ts.push(t);
        return ts;
    }, Promise.resolve([]));
};
