// Mirrors Backend/src/modules/settings/model/Settings.js
// One document per user (GET/PATCH "mine" only — no admin listing of all settings).
//
// KNOWN GAP: the real admin Settings page (notifPrefs, toggles, themeChoice) is
// 100% local component state today; it never calls this API. Each UI toggle would
// need to map onto notifications/rules/theme/twoFactorEnabled/autoBackup below.

export const SettingsSchema = {
  modelName: 'Settings',
  apiPath: '/api/settings', // GET/PATCH only, always scoped to req.user
  fields: {
    userId: { type: 'ObjectId', required: true, unique: true, ref: 'User', computed: true },
    notifications: { type: 'object', default: {} },
    rules: { type: 'object', default: {} },
    theme: { type: 'string', enum: ['light', 'dark', 'system'], default: 'system' },
    twoFactorEnabled: { type: 'boolean', default: false },
    autoBackup: { type: 'boolean', default: false },
  },
};

export default SettingsSchema;
