import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates that required enterprise environment variables are set
 * @param {string} env - Environment name
 * @throws {Error} If required variables are missing
 */
function validateEnvVars(env) {
  const envUpper = env.toUpperCase();
  const requiredVars = [
    `${envUpper}_ENTERPRISE_LOGIN_URL`,
    `${envUpper}_ENTERPRISE_COMPANY_ID`,
    `${envUpper}_ENTERPRISE_USERNAME`,
    `${envUpper}_ENTERPRISE_PASSWORD`,
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `\n❌ Missing required environment variables for environment "${env}":\n` +
        `   ${missingVars.join('\n   ')}\n\n` +
        `📝 Please check your .env file and ensure:\n` +
        `   1. TEST_ENV is set to: ${env}\n` +
        `   2. All ${envUpper}_* variables are configured\n` +
        `   3. No typos in variable names\n\n` +
        `💡 See README.md for setup instructions\n`,
    );
  }

  // Validate URL format
  const urlVars = requiredVars.filter((v) => v.includes('URL'));
  urlVars.forEach((varName) => {
    const value = process.env[varName];
    if (value && !value.match(/^https?:\/\/.+/)) {
      throw new Error(`Invalid URL format for ${varName}: ${value}`);
    }
  });
}

/**
 * Get configuration for specific environment (enterprise only)
 * @param {string} env - Environment name
 * @returns {Object} Environment-specific configuration
 */
function getEnvConfig(env) {
  const envUpper = env.toUpperCase();
  validateEnvVars(env);

  // Allow runtime override of company ID (useful for running tests with multiple companies)
  const companyId = process.env.RUNTIME_COMPANY_ID || process.env[`${envUpper}_ENTERPRISE_COMPANY_ID`];
  const username = process.env.RUNTIME_USERNAME || process.env[`${envUpper}_ENTERPRISE_USERNAME`];
  const password = process.env.RUNTIME_PASSWORD || process.env[`${envUpper}_ENTERPRISE_PASSWORD`];

  return {
    enterprise: {
      baseUrl: process.env[`${envUpper}_ENTERPRISE_LOGIN_URL`],
      url: process.env[`${envUpper}_ENTERPRISE_LOGIN_URL`], // Backward compatibility
      credentials: {
        companyId: companyId,
        username: username,
        password: password,
      },
    },
  };
}

export const config = {
  // Current active environment
  env: process.env.TEST_ENV || 'dkirc',

  // Get current environment config
  get enterprise() {
    return getEnvConfig(this.env).enterprise;
  },

  // Access specific environment configs directly (lazily)
  get environments() {
    return {
      get first_general() {
        return getEnvConfig('first_general');
      },
      get paul_devis() {
        return getEnvConfig('paul_devis');
      },
      get service_master() {
        return getEnvConfig('service_master');
      },
      get evans() {
        return getEnvConfig('evans');
      },
    };
  },
};

export default config;
