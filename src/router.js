import { Router } from 'express';
import { postSignUp, postSignIn } from './controllers/users.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Test: Welcome to GratiBox API!',
  });
});

router.post('/sign-up', postSignUp);
router.post('/sign-in', postSignIn);

export default router;
