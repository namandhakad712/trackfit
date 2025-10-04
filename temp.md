00:27:30.612 Running build in Washington, D.C., USA (East) – iad1
00:27:30.613 Build machine configuration: 2 cores, 8 GB
00:27:30.626 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: ea002ca)
00:27:30.768 Previous build caches not available
00:27:30.916 Cloning completed: 290.000ms
00:27:31.292 Running "vercel build"
00:27:31.673 Vercel CLI 48.2.0
00:27:32.526 Installing dependencies...
00:27:35.250 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
00:27:35.884 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
00:27:37.316 npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
00:27:37.338 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
00:27:37.388 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
00:27:37.522 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
00:27:37.747 npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
00:27:39.399 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
00:27:45.644 
00:27:45.645 added 521 packages in 13s
00:27:45.646 
00:27:45.646 159 packages are looking for funding
00:27:45.646   run `npm fund` for details
00:27:45.730 Running "npm run build"
00:27:45.862 
00:27:45.862 > railtrack-qr@0.1.0 build
00:27:45.862 > next build
00:27:45.862 
00:27:46.418 Attention: Next.js now collects completely anonymous telemetry regarding usage.
00:27:46.418 This information is used to shape Next.js' roadmap and prioritize features.
00:27:46.418 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
00:27:46.419 https://nextjs.org/telemetry
00:27:46.419 
00:27:46.476   ▲ Next.js 14.2.33
00:27:46.476 
00:27:46.538    Creating an optimized production build ...
00:28:03.854 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
00:28:04.076  ⚠ Compiled with warnings
00:28:04.076 
00:28:04.077 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:28:04.077 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
00:28:04.077 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:28:04.077 
00:28:04.078 Import trace for requested module:
00:28:04.078 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:28:04.078 ./node_modules/@supabase/realtime-js/dist/module/index.js
00:28:04.078 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:28:04.078 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:28:04.078 ./node_modules/@supabase/ssr/dist/module/index.js
00:28:04.078 
00:28:04.078 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:28:04.078 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
00:28:04.078 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:28:04.078 
00:28:04.078 Import trace for requested module:
00:28:04.079 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:28:04.079 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:28:04.079 ./node_modules/@supabase/ssr/dist/module/index.js
00:28:04.079 
00:28:17.175  ✓ Compiled successfully
00:28:17.176    Linting and checking validity of types ...
00:28:24.759 Failed to compile.
00:28:24.759 
00:28:24.759 ./app/api/alerts/[id]/route.ts:24:15
00:28:24.759 Type error: Argument of type '{ resolved: boolean; }' is not assignable to parameter of type 'never'.
00:28:24.759 
00:28:24.759 [0m [90m 22 |[39m     [36mconst[39m { data[33m:[39m alert[33m,[39m error } [33m=[39m [36mawait[39m supabase[0m
00:28:24.760 [0m [90m 23 |[39m       [33m.[39m[36mfrom[39m([32m'alerts'[39m)[0m
00:28:24.760 [0m[31m[1m>[22m[39m[90m 24 |[39m       [33m.[39mupdate({ resolved })[0m
00:28:24.760 [0m [90m    |[39m               [31m[1m^[22m[39m[0m
00:28:24.760 [0m [90m 25 |[39m       [33m.[39meq([32m'id'[39m[33m,[39m params[33m.[39mid)[0m
00:28:24.760 [0m [90m 26 |[39m       [33m.[39mselect()[0m
00:28:24.760 [0m [90m 27 |[39m       [33m.[39msingle()[33m;[39m[0m
00:28:24.785 Next.js build worker exited with code: 1 and signal: null
00:28:24.799 Error: Command "npm run build" exited with 1