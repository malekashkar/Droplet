function capitalize(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
}

module.exports = { capitalize };