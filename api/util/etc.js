async function sleep(callback, ms = 1000.0) {
    const id = setTimeout(() => {
        callback();
        clearTimeout(id);
        console.log('timeout cleared!');
    }, ms);
}

module.exports = {
    sleep
};