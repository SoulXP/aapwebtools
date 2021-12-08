const e = require('express');
const itertools = require('itertools');

class QueryTree {
    constructor(values, root = null) {
        // Root case for longest dimension
        itertools.permutations()
        if (root === null) {
            const combinations = values.reduce((t, c) => {
                console.log(c);
                return t * ((c[0] < 1) ? 1 : c[0]);
            }, 1);

            console.log('acc:', combinations);
        }   
    }

    // get isLeaf() {
    //     if (this.next === null) return true;
    //     else return this.next.isLeaf();
    // };

    // get getValue() {
    //     return this.value;
    // }

    // get getType() {
    //     return this.type;
    // }
}

function all_combinations(values, acc = []) {
    if (values.length === 0) return acc;
    
    const last = values.pop();
    for (e of last) {
        acc.push(e)
        const combinations = all_combinations(values, acc);
    }

    return acc;
}

module.exports = {
    QueryTree
};