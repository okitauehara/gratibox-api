import { Router } from 'express';
import postSignUp from './controllers/users.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Test: Welcome to GratiBox API!',
  });
});

router.post('/sign-up', postSignUp);

export default router;
