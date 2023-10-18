const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
    authenticateUser,
    authorizedRoles,
} = require('../../../middlewares/auth');

router.get('/payments', authenticateUser, authorizedRoles('organizer'), index);
router.get(
    '/payments/:id',
    authenticateUser,
    authorizedRoles('organizer'),
    find
);
router.put(
    '/payments/:id',
    authenticateUser,
    authorizedRoles('organizer'),
    update
);
router.delete(
    '/payments/:id',
    authenticateUser,
    authorizedRoles('organizer'),
    destroy
);
router.post('/payments', authenticateUser, authorizedRoles('organizer'), create);

module.exports = router;