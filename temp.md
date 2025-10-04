00:06:28.841 Running build in Washington, D.C., USA (East) – iad1
00:06:28.841 Build machine configuration: 2 cores, 8 GB
00:06:28.855 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: c2cf37b)
00:06:28.992 Previous build caches not available
00:06:29.165 Cloning completed: 310.000ms
00:06:29.495 Running "vercel build"
00:06:29.916 Vercel CLI 48.2.0
00:06:30.745 Installing dependencies...
00:06:33.657 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
00:06:34.182 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
00:06:35.707 npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
00:06:35.770 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
00:06:35.787 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
00:06:35.929 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
00:06:36.138 npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
00:06:37.851 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
00:06:44.187 
00:06:44.187 added 521 packages in 13s
00:06:44.188 
00:06:44.188 159 packages are looking for funding
00:06:44.188   run `npm fund` for details
00:06:44.241 Running "npm run build"
00:06:44.353 
00:06:44.354 > railtrack-qr@0.1.0 build
00:06:44.354 > next build
00:06:44.354 
00:06:44.904 Attention: Next.js now collects completely anonymous telemetry regarding usage.
00:06:44.905 This information is used to shape Next.js' roadmap and prioritize features.
00:06:44.905 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
00:06:44.905 https://nextjs.org/telemetry
00:06:44.905 
00:06:44.961   ▲ Next.js 14.2.33
00:06:44.962 
00:06:45.022    Creating an optimized production build ...
00:07:03.410 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
00:07:03.645  ⚠ Compiled with warnings
00:07:03.645 
00:07:03.646 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:07:03.646 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
00:07:03.646 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:07:03.647 
00:07:03.647 Import trace for requested module:
00:07:03.647 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:07:03.647 ./node_modules/@supabase/realtime-js/dist/module/index.js
00:07:03.647 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:07:03.647 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:07:03.647 ./node_modules/@supabase/ssr/dist/module/index.js
00:07:03.647 
00:07:03.647 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:07:03.647 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
00:07:03.647 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:07:03.648 
00:07:03.648 Import trace for requested module:
00:07:03.648 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:07:03.648 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:07:03.648 ./node_modules/@supabase/ssr/dist/module/index.js
00:07:03.649 
00:07:16.663  ✓ Compiled successfully
00:07:16.665    Linting and checking validity of types ...
00:07:24.446 Failed to compile.
00:07:24.446 
00:07:24.447 ./app/api/alerts/[id]/route.ts:33:15
00:07:24.447 Type error: Argument of type '{ resolved: boolean; }' is not assignable to parameter of type 'never'.
00:07:24.447 
00:07:24.447 [0m [90m 31 |[39m     [36mconst[39m { data[33m:[39m alert[33m,[39m error } [33m=[39m [36mawait[39m supabase[0m
00:07:24.447 [0m [90m 32 |[39m       [33m.[39m[36mfrom[39m([32m'alerts'[39m)[0m
00:07:24.447 [0m[31m[1m>[22m[39m[90m 33 |[39m       [33m.[39mupdate({ resolved })[0m
00:07:24.447 [0m [90m    |[39m               [31m[1m^[22m[39m[0m
00:07:24.447 [0m [90m 34 |[39m       [33m.[39meq([32m'id'[39m[33m,[39m params[33m.[39mid)[0m
00:07:24.447 [0m [90m 35 |[39m       [33m.[39mselect()[0m
00:07:24.448 [0m [90m 36 |[39m       [33m.[39msingle[33m<[39m[33mAlertData[39m[33m>[39m()[33m;[39m[0m
00:07:24.474 Next.js build worker exited with code: 1 and signal: null
00:07:24.489 Error: Command "npm run build" exited with 1