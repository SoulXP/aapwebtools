
// Globals for module
const MICROSECONDS = 10000000.0;
const NANOSECONDS = 1000000000.0;
const N_RESOLUTION = MICROSECONDS;

// TODO: Fix precision/rounding error for floats
function float_to_tc(n, frame_rate) {
    let h = m = s = f = 0.0
    if (n >= 60.0 * 60.0 * N_RESOLUTION) {
        h = n / (60.0 * 60.0 * N_RESOLUTION);
        h = Math.trunc(h);
        n = n % (60.0 * 60.0 * N_RESOLUTION);
    }
    
    if (n >= 60.0 * N_RESOLUTION) {
        m = n / (60.0 * N_RESOLUTION);
        m = Math.trunc(m);
        n = n % (60.0 * N_RESOLUTION);
    }
    
    if (n >= N_RESOLUTION) {
        s = n / N_RESOLUTION;
        s = Math.trunc(s);
        n = n % N_RESOLUTION;
    }

    f = Math.round(n * frame_rate / N_RESOLUTION);

    hs = (h.toString().length == 1) ? '0' + h.toString() : h.toString();
    ms = (m.toString().length == 1) ? '0' + m.toString() : m.toString();
    ss = (s.toString().length == 1) ? '0' + s.toString() : s.toString();
    fs = (f.toString().length == 1) ? '0' + f.toString() : f.toString();

    return `${hs}:${ms}:${ss}:${fs}`;
}

function tc_to_float(tc, frame_rate) {
    let h = m = s = f = 0.0
    const chunks = tc.split(':') // TODO: Handle drop-frame with ; delimiter
    
    h = parseFloat(chunks[0]) * 60.0 * 60.0;
    m = parseFloat(chunks[1]) * 60.0;
    s = parseFloat(chunks[2]);
    f = parseFloat(chunks[3]) / frame_rate;

    return (h + m + s + f) * N_RESOLUTION;
}

// Module exports
module.exports = {
    float_to_tc,
    tc_to_float
};