
exports.isValidLevel = (level_id) => {
    if (level_id === undefined || level_id === null) {
        return false;
    }
    else if (level_id < 1) {
        return false;
    }
    return true;
};
