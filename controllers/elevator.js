const Elevator = require('../models').Elevator;
const User = require('../models').User;
const isValidElevator = require('../helpers/elevator');

module.exports = {
    create(req, res) {
        if (!req.body.max_weight) {
            return res.status(400).send({
                error: 'missing parameter: max_weight'
            });
        }
        else if (req.body.max_weight < 0) {
            return res.status(400).send({
                error: 'parameter max_weight must be greater than 0'
            });
        }
        else if (typeof req.body.max_weight !== 'number') {
            return res.status(400).send({
                error: `invalid max_weight ${req.body.max_weight}`
            });
        }
        return Elevator
            .create({
                max_weight: req.body.max_weight,
                current_weight: 0,
                level: 1
            })
            .then(elevator => res.status(201).send(elevator))
            .catch(error => res.status(400).send(error));
    },
    // delete every user and elevator
    // check if the id is valid
    async destroy(req, res) {
        if (!req.params.elevator_id) {
            res.status(400).send({
                error: 'missing parameter: id'
            });
        }
        // check if the elevator exists
        const elevator = await Elevator.findByPk(req.params.elevator_id)
        if (!elevator) {
            return res.status(404).send({
                error: `elevator with id ${req.params.elevator_id} not found`
            });
        }
        return elevator
            .destroy()
            .then(() => res.status(204).send())
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return Elevator
            .findAllWithUsers()
            .then(elevators => res.status(200).send(elevators))
            .catch(error => res.status(400).send(error));
    },
    find(req, res) {
        return Elevator
            .findWithUsers(req.params.elevator_id)
            .then(elevator => {
                if (!elevator) {
                    return res.status(404).send({
                        error: `elevator with id ${req.params.elevator_id} not found`
                    });
                }
                return res.status(200).send(elevator);
            }
            )
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        if (!req.body.level){
            res.status(400).send({
                error: 'missing parameter: level'
            });
        }
        else if (req.body.level < 1 || typeof req.body.level !== 'number') {
            res.status(400).send({
                error: `invalid level ${req.body.level}`
            });
        }
        return Elevator
            .findByPk(req.params.elevator_id)
            .then(elevator => {
                if(!elevator){
                    return res.status(404).send({
                        error: `elevator with id ${req.params.elevator_id} not found`
                    });
                }
                else if (elevator.doors === 'open'){
                    return res.status(400).send({
                        error: 'elevator doors are open'
                    });
                }
                // TODO: check if move is valid
                return elevator
                    .update({
                        level: req.body.level
                    })
                    .then(() => res.status(200).send(elevator))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    doors(req, res) {
        if (!req.body.doors) {
            return res.status(400).send({
                error: 'missing parameter: doors'
            });
        }
        else if (req.body.doors !== 'open' && req.body.doors !== 'closed') {
            return res.status(400).send({
                error: `invalid door state ${req.body.doors}`
            });
        }
        return Elevator
            .findByPk(req.params.elevator_id)
            .then(elevator => {
                if (!elevator) {
                    return res.status(404).send({
                        error: `elevator with id ${req.params.elevator_id} not found`
                    });
                }
                return elevator
                    .update({
                        doors: req.body.doors
                    })
                    .then(() => res.status(200).send(elevator))
                    .catch(error => res.status(400).send(error));
            }
            )
            .catch(error => res.status(400).send(error));
    },
    async enter(req, res) {
        if (!req.params.user_id) {
            res.status(400).send({
                error: 'missing parameter: user_id'
            });
        }
        else if (typeof req.params.user_id !== 'string') {
            res.status(400).send({
                error: `invalid user_id ${req.params.user_id}`
            });
        }
        const elevator = await Elevator.findByPk(req.params.elevator_id);
        if (!elevator) {
            return res.status(404).send({
                error: `elevator ${req.params.elevator_id} not found`
            });
        }
        else if (elevator.doors === 'closed') {
            return res.status(400).send({
                error: 'elevator doors are closed'
            });
        }
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            return res.status(404).send({
                error: `user ${req.params.user_id} not found`
            });
        }
        else if (user.elevator_id) {
            return res.status(400).send({
                error: `user ${req.params.user_id} already in elevator <${user.elevator_id}>`
            });
        }
        else if (user.level_id !== elevator.level) {
            return res.status(400).send({
                error: "user and elevator are not on the same level"
            });
        }
        else if (user.weight + elevator.current_weight > elevator.max_weight) {
            return res.status(400).send({
                error: `elevator max weight exceeded with ${user.weight + elevator.current_weight - elevator.max_weight} kg`
            });
        }
        await user.update({
            elevator_id: elevator.id
        })
        await elevator.update({
            current_weight: elevator.current_weight + user.weight
        })
        res.status(200).send(elevator);
    },

    exit(req, res) {
        return Elevator
            .findByPk(req.params.elevator_id)
            .then(elevator => {
                if (!elevator){
                    return res.status(404).send({
                        error: `elevator ${req.params.elevator_id} not found`
                    });
                }
                else if (elevator.doors === 'closed') {
                    return res.status(400).send({
                        error: 'elevator doors are closed'
                    });
                }
                return User
                    .findByPk(req.params.user_id)
                    .then(user => {
                        if (!user) {
                            return res.status(404).send({
                                error: `user ${req.params.user_id} not found`
                            });
                        }
                        else if (user.elevator_id !== elevator.id) {
                            return res.status(400).send({
                                error: `user ${req.params.user_id} not in elevator ${req.params.elevator_id}`
                            });
                        }
                        else if (user.destination !== elevator.level) {
                            return res.status(400).send({
                                error: `user requested level ${user.destination} but elevator is on level ${elevator.level}`
                            });
                        }
                        // check if the user allready left the elevator
                        else if (user.elevator_id === null) {
                            return res.status(400).send({
                                error: `user ${req.params.user_id} already left elevator ${req.params.elevator_id}`
                            });
                        }
                        return user
                            .update({
                                elevator_id: null
                            })
                            .then(() => {
                                return elevator
                                    .update({
                                        current_weight: elevator.current_weight - user.weight
                                    })
                                    .then(() => res.status(200).send(elevator))
                                    .catch(error => res.status(400).send(error));
                            }
                            )
                            .catch(error => res.status(400).send(error));
                    }
                    )

            }
            )
            .catch(error => res.status(400).send(error));
    },

};