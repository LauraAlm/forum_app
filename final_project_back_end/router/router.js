const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const middleware = require('../middleware/main');

router.post('/login', controller.login);
router.post(
  '/register',
  middleware.validUsername,
  middleware.validEmail,
  middleware.validPassword,
  middleware.validRole,
  controller.register
);

router.post('/autoLogin', middleware.validToken, controller.autoLogin);

router.get('/getCategories', middleware.validToken, controller.getCategories);

router.post(
  '/createCategory',
  middleware.validToken,
  middleware.validAdminRole,
  controller.createCategory
);

router.post(
  '/createSubcategory/:categoryTitle',
  middleware.validToken,
  controller.createSubcategory
);
router.get(
  '/getCategorywithSubcategories/:title',
  middleware.validToken,
  controller.getCategorywithSubcategoriesByTitle
);

router.get(
  '/getSubcategory/:id',
  middleware.validToken,
  controller.getSubcategoryById
);

router.post(
  '/createComment/:subcategoryId',
  middleware.validToken,
  controller.createComment
);

router.get(
  '/getCommentsBySubcategoryId/:id',
  middleware.validToken,
  controller.getCommentsBySubcategoryId
);

// PROFILE

router.get('/getCurrentUser', middleware.validToken, controller.getCurrentUser);

router.post(
  '/updateImage/:userId',
  middleware.validToken,
  controller.updateImage
);

//
router.post(
  '/sendPrivateMessage/:userId',
  middleware.validToken,
  controller.sendPrivateMessage
);

router.get(
  '/getCurrentUsersChats',
  middleware.validToken,
  controller.getCurrentUsersChats
);

router.post(
  '/markMessagesAsRead',
  middleware.validToken,
  controller.markMessagesAsRead
);
//

router.post(
  '/password-reset/email',
  middleware.validEmail,
  controller.sendCode
);
router.post(
  '/password-reset/code',
  middleware.validEmail,
  controller.validateResetCode
);
router.post(
  '/password-reset/password',
  middleware.validEmail,
  middleware.validPassword,
  controller.changePassword
);

router.get('/getUser', controller.getUser);

router.post('/verifyActivationCode', controller.verifyActivationCode);

module.exports = router;
