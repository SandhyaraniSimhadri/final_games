export async function withCallback(fun, onCompleted = null) {
    await fun();
    if (onCompleted)
        onCompleted();
}
export async function mergeParallel(funs) {
    return new Promise((resolve, _) => {
        let left = funs.length;
        if (left <= 0)
            resolve();
        for (const fun of funs) {
            withCallback(fun, () => {
                left--;
                // 				console.log(left);
                if (left <= 0)
                    resolve();
            });
        }
    });
}
