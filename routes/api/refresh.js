import { Router } from 'express';
import { handleRefreshToken } from '../../controllers/refreshTokenController.js';
const router = Router();

// 단순하게 토큰 재발급을 요청하는 것이므로 get으로 처리
router.get('/', handleRefreshToken);

export default router;