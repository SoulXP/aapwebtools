function all_combinations(values) {
    // No need to process an empty array
    if (values.length === 0) return [];

    // Define nested callback 
    let results = [];
    const nest_forloop = (v, cb, p = []) => {
        for (const e of v.pop()) {
            if (v.length === 0) { results.push([...p, e]); }
            else { p.push(e); cb([...v], cb, p); p.pop(); }
        }
    }

    // Run callback to iterate over all values
    nest_forloop([...values], nest_forloop);
    
    return results;
}

module.exports = {
    all_combinations
};