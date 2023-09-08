module.exports = (app) => {
    const isValidElevator = (elevator) => {
        if (!elevator.id || typeof elevator.id != "string")
            return false;
        if (!elevator.max_weight || typeof elevator.max_weight != "number")
            return false;
        return true;
    }
}