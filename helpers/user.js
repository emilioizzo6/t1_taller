exports.isValidUser = (user) => {
        if (!user.id || typeof user.id != "string")
            return false;
        if (!user.weight || typeof user.weight != "number")
            return false;
        if (!user.destination || typeof user.destination != "number")
            return false;
        return true;
    };