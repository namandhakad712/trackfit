00:16:51.772 Running build in Washington, D.C., USA (East) – iad1
00:16:51.773 Build machine configuration: 2 cores, 8 GB
00:16:51.803 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: de0718a)
00:16:51.930 Previous build caches not available
00:16:52.154 Cloning completed: 351.000ms
00:16:52.630 Running "vercel build"
00:16:53.056 Vercel CLI 48.2.0
00:16:53.850 Installing dependencies...
00:16:56.786 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
00:16:57.312 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
00:16:58.716 npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
00:16:58.768 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
00:16:58.792 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
00:16:58.940 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
00:16:59.127 npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
00:17:00.939 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
00:17:07.340 
00:17:07.340 added 521 packages in 13s
00:17:07.340 
00:17:07.341 159 packages are looking for funding
00:17:07.341   run `npm fund` for details
00:17:07.393 Running "npm run build"
00:17:09.245 
00:17:09.245 > railtrack-qr@0.1.0 build
00:17:09.246 > next build
00:17:09.246 
00:17:09.926 Attention: Next.js now collects completely anonymous telemetry regarding usage.
00:17:09.928 This information is used to shape Next.js' roadmap and prioritize features.
00:17:09.928 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
00:17:09.928 https://nextjs.org/telemetry
00:17:09.928 
00:17:09.985   ▲ Next.js 14.2.33
00:17:09.986 
00:17:10.044    Creating an optimized production build ...
00:17:28.179 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
00:17:28.360  ⚠ Compiled with warnings
00:17:28.360 
00:17:28.360 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:17:28.361 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
00:17:28.361 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:17:28.361 
00:17:28.361 Import trace for requested module:
00:17:28.361 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:17:28.361 ./node_modules/@supabase/realtime-js/dist/module/index.js
00:17:28.361 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:17:28.362 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:17:28.362 ./node_modules/@supabase/ssr/dist/module/index.js
00:17:28.362 
00:17:28.362 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:17:28.362 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
00:17:28.362 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:17:28.362 
00:17:28.362 Import trace for requested module:
00:17:28.363 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:17:28.363 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:17:28.363 ./node_modules/@supabase/ssr/dist/module/index.js
00:17:28.363 
00:17:41.072  ✓ Compiled successfully
00:17:41.073    Linting and checking validity of types ...
00:17:49.010 Failed to compile.
00:17:49.011 
00:17:49.011 ./app/api/alerts/[id]/route.ts:33:15
00:17:49.011 Type error: Argument of type '{ resolved: boolean; }' is not assignable to parameter of type 'never'.
00:17:49.011 
00:17:49.011 [0m [90m 31 |[39m     [36mconst[39m { data[33m:[39m alert[33m,[39m error } [33m=[39m [36mawait[39m supabase[0m
00:17:49.012 [0m [90m 32 |[39m       [33m.[39m[36mfrom[39m([32m'alerts'[39m)[0m
00:17:49.012 [0m[31m[1m>[22m[39m[90m 33 |[39m       [33m.[39mupdate({ resolved } [36mas[39m { resolved[33m:[39m boolean })[0m
00:17:49.012 [0m [90m    |[39m               [31m[1m^[22m[39m[0m
00:17:49.012 [0m [90m 34 |[39m       [33m.[39meq([32m'id'[39m[33m,[39m params[33m.[39mid)[0m
00:17:49.012 [0m [90m 35 |[39m       [33m.[39mselect[33m<[39m[32m'*'[39m[33m,[39m [33mAlertData[39m[33m>[39m()[0m
00:17:49.012 [0m [90m 36 |[39m       [33m.[39msingle()[33m;[39m[0m
00:17:49.038 Next.js build worker exited with code: 1 and signal: null
00:17:49.053 Error: Command "npm run build" exited with 1