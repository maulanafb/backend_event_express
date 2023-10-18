const { UnauthenticatedError, UnauthorizedError } = require('../errors')
const { isTokenValid } = require('../utils/jwt')

const authenticateUser = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        console.log("req")

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }
        if (!token) {
            throw new UnauthenticatedError('Lu belom login');
        }

        const payload = isTokenValid({ token });


        req.user = {
            email: payload.email,
            role: payload.role,
            name: payload.name,
            organizer: payload.organizer,
            id: payload.userId,
        }
        next();
    } catch (error) {
        next(error)
    }
};

const authenticateParticipant = async (req, res, next) => {

    try {
        let token;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }
        if (!token) {
            throw new UnauthenticatedError('Lu Belom Login');
        }

        const payload = isTokenValid({ token })
        console.log("payload")
        console.log(payload)
        req.participant = {
            email: payload.email,
            lastName: payload.lastName,
            firstName: payload.firstName,
            organizer: payload.organizer,
            id: payload.participantId,
        }
        next();
    } catch (err) {
        next(err)
    }
}

const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            throw new UnauthorizedError('Lu gak punya akses yak')
        }
        next();
    }
}
module.exports = {
    authenticateUser,
    authorizedRoles,
    authenticateParticipant
}