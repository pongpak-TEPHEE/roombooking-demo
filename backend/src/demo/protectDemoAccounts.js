import { isDemoMode, DEMO_ACCOUNT_IDS } from './config.js';

// Demo mode: stop visitors from editing, suspending or deleting the shared
// demo accounts, which would lock every other visitor out of the demo.
export const protectDemoAccounts = (req, res, next) => {
  if (isDemoMode() && DEMO_ACCOUNT_IDS.includes(req.params.user_id)) {
    return res.status(403).json({ message: 'บัญชี demo ไม่สามารถแก้ไข ระงับ หรือลบได้ (ลองกับผู้ใช้คนอื่นแทน)' });
  }
  next();
};
