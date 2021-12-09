function all_combinations(values) {
    // Define nested callback 
    let results = [];
    const l = (v, cb, p = []) => {
        for (const e of v.pop()) {
            if (v.length === 0) { results.push([...p, e]); }
            else { p.push(e); cb([...v], cb, p); p.pop(); }
        }
    }

    // Run callback to iterate over all values
    l([...values], l);
    return results;
}

module.exports = {
    all_combinations
};