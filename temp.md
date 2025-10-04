00:24:07.501 Running build in Washington, D.C., USA (East) – iad1
00:24:07.501 Build machine configuration: 2 cores, 8 GB
00:24:07.526 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: c39821c)
00:24:07.649 Previous build caches not available
00:24:07.981 Cloning completed: 455.000ms
00:24:08.322 Running "vercel build"
00:24:08.712 Vercel CLI 48.2.0
00:24:09.918 Installing dependencies...
00:24:12.676 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
00:24:13.369 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
00:24:14.564 npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
00:24:14.756 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
00:24:14.810 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
00:24:14.912 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
00:24:15.049 npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
00:24:16.817 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
00:24:23.324 
00:24:23.325 added 521 packages in 13s
00:24:23.326 
00:24:23.326 159 packages are looking for funding
00:24:23.326   run `npm fund` for details
00:24:23.383 Running "npm run build"
00:24:23.507 
00:24:23.508 > railtrack-qr@0.1.0 build
00:24:23.508 > next build
00:24:23.508 
00:24:24.808 Attention: Next.js now collects completely anonymous telemetry regarding usage.
00:24:24.809 This information is used to shape Next.js' roadmap and prioritize features.
00:24:24.810 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
00:24:24.810 https://nextjs.org/telemetry
00:24:24.810 
00:24:24.866   ▲ Next.js 14.2.33
00:24:24.867 
00:24:24.954    Creating an optimized production build ...
00:24:43.352 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
00:24:43.546  ⚠ Compiled with warnings
00:24:43.547 
00:24:43.547 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:24:43.547 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
00:24:43.547 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:24:43.547 
00:24:43.547 Import trace for requested module:
00:24:43.547 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:24:43.547 ./node_modules/@supabase/realtime-js/dist/module/index.js
00:24:43.547 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:24:43.547 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:24:43.547 ./node_modules/@supabase/ssr/dist/module/index.js
00:24:43.547 
00:24:43.549 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:24:43.549 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
00:24:43.549 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:24:43.549 
00:24:43.549 Import trace for requested module:
00:24:43.549 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:24:43.549 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:24:43.549 ./node_modules/@supabase/ssr/dist/module/index.js
00:24:43.549 
00:24:56.332  ✓ Compiled successfully
00:24:56.333    Linting and checking validity of types ...
00:25:04.277 Failed to compile.
00:25:04.277 
00:25:04.278 ./app/api/alerts/[id]/route.ts:36:15
00:25:04.278 Type error: Argument of type 'Partial<AlertData>' is not assignable to parameter of type 'never'.
00:25:04.278 
00:25:04.279 [0m [90m 34 |[39m     [36mconst[39m { data[33m:[39m alert[33m,[39m error } [33m=[39m [36mawait[39m (supabase[0m
00:25:04.279 [0m [90m 35 |[39m       [33m.[39m[36mfrom[39m([32m'alerts'[39m)[0m
00:25:04.279 [0m[31m[1m>[22m[39m[90m 36 |[39m       [33m.[39mupdate(updateData)[0m
00:25:04.279 [0m [90m    |[39m               [31m[1m^[22m[39m[0m
00:25:04.279 [0m [90m 37 |[39m       [33m.[39meq([32m'id'[39m[33m,[39m params[33m.[39mid)[0m
00:25:04.279 [0m [90m 38 |[39m       [33m.[39mselect()[0m
00:25:04.280 [0m [90m 39 |[39m       [33m.[39msingle() [36mas[39m unknown [36mas[39m [33mPromise[39m[33m<[39m{ data[33m:[39m [33mAlertData[39m [33m|[39m [36mnull[39m[33m;[39m error[33m:[39m any }[33m>[39m)[33m;[39m[0m
00:25:04.303 Next.js build worker exited with code: 1 and signal: null
00:25:04.320 Error: Command "npm run build" exited with 1