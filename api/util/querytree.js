class QueryTree {
    constructor(values, parent = null) {
        this.parent = parent;
        
        if (values.length > 0) {
            const last = values.pop()
            this.type = typeof last;
            this.value = last;
            this.next = new QueryTree(values);
        } else {
            this.type = null;
            this.value = null;
            this.next = null;
        }
    }

    get isLeaf() {
        if (this.next === null) return true;
        else return this.next.isLeaf();
    };

    get getValue() {
        return this.value;
    }

    get getType() {
        return this.type;
    }
}

module.exports = {
    QueryTree
};