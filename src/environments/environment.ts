// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/admin/api', // Fixed: added /admin prefix to match backend routes
  pusher: {
    key: 'your_pusher_key',
    cluster: 'eu',
    forceTLS: true
  },
  gemini: {
    // Updated with new API key - should resolve 401 authentication error
    // Get your API key from: https://makersuite.google.com/app/apikey
    apiKey: 'AIzaSyBI6NhDU_Ht6881F7cRm1W2nbQHITRDYiA', // New working API key
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
  }
};