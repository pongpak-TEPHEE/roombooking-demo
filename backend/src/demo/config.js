// Demo mode settings.
// DEMO_MODE=true turns on: passwordless demo login, no outgoing email,
// protected demo accounts and seeded sample data.

export const isDemoMode = () => process.env.DEMO_MODE === 'true';

// The accounts behind the "login as ..." buttons on the demo login page.
export const DEMO_ACCOUNTS = {
  staff: 'demo-staff',
  teacher: 'demo-teacher',
};

export const DEMO_ACCOUNT_IDS = Object.values(DEMO_ACCOUNTS);
