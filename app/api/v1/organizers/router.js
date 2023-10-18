const express = require('express');
const router = express();
const { createCMSOrganizer, createCMSUser, getCMSUsers } = require('./controller');
const { authenticateUser, authorizedRoles } = require('../../../middlewares/auth')

router.post('/organizers', authenticateUser, authorizedRoles('owner'), createCMSOrganizer);
router.post('/users', authenticateUser, authorizedRoles('organizer'), createCMSUser);
router.get('/users', authenticateUser, authorizedRoles('owner'), getCMSUsers);

module.exports = router;