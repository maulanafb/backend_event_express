const createTokenUser = (user) => {
    return {
        name: user.name,
        userId: user._id,
        role: user.role,
        email: user.email,
        organizer: user.organizer,

    }
}

const createTokenParticipant = (participant) => {
    return {
        lastName: participant.lastName,
        participantId: participant._id,
        firstName: participant.firstName,
        email: participant.email,
        organizer: participant.organizer,
        // type: 'participant'
    }
}

module.exports = { createTokenUser, createTokenParticipant };