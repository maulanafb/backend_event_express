const express = require('express');
const router = express();
const { create, index, find, update, destroy, changeStatus } = require('./controller');
const { authenticateUser, authorizedRoles } = require('../../../middlewares/auth')

router.get('/events', authenticateUser, authorizedRoles('organizer'), index);
router.get('/events/:id', authenticateUser, authorizedRoles('organizer'), find);
router.put('/events/:id', authenticateUser, authorizedRoles('organizer'), update);
router.delete('/events/:id', authenticateUser, authorizedRoles('organizer'), destroy);
router.post('/events', authenticateUser, authorizedRoles('organizer'), create);
router.put('/events/:id/status', authenticateUser, authorizedRoles('organizer',), changeStatus);

module.exports = router;