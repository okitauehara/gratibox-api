import { Router } from 'express';
import { postSignUp, postSignIn } from './controllers/users.js';
import ensureAuth from './middlewares/ensureAuth.js';
import postSignature from './controllers/signatures.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Test: Welcome to GratiBox API!',
  });
});

router.post('/sign-up', postSignUp);
router.post('/sign-in', postSignIn);

router.post('/subscriptions/:planId', ensureAuth, postSignature);
// router.get('/subscriptions', ensureAuth, getSignatures);

export default router;
