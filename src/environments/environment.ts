// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * Test => "https://curiotory.chargurev.com"
 * Stage => "http://curiotory.stage.chargurev.com"
 * Prod => ""
 */

export const environment = {
  production: false,
  // apiUrl: "https://imagerating.ioweb3.in",
  // apiUrl: "https://imageratingstable-v1.onrender.com",
  // apiUrl: "https://imagerating-hq3k.onrender.com",
  // apiUrl: 'https://be-verbe-q.onrender.com',
  apiUrl: "http://192.168.1.18:8080",
 // apiUrl: "http://localhost:8080",
};

/*192.168.1.21
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
