23:53:04.214 Running build in Washington, D.C., USA (East) – iad1
23:53:04.215 Build machine configuration: 2 cores, 8 GB
23:53:04.262 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: 274c346)
23:53:04.591 Previous build caches not available
23:53:04.912 Cloning completed: 650.000ms
23:53:05.418 Running "vercel build"
23:53:05.842 Vercel CLI 48.2.0
23:53:06.596 Installing dependencies...
23:53:09.375 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
23:53:10.109 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
23:53:11.254 npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
23:53:11.638 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
23:53:11.660 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
23:53:11.799 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
23:53:11.826 npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
23:53:13.651 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
23:53:20.038 
23:53:20.039 added 520 packages in 13s
23:53:20.040 
23:53:20.040 159 packages are looking for funding
23:53:20.040   run `npm fund` for details
23:53:20.088 Running "npm run build"
23:53:20.909 
23:53:20.909 > railtrack-qr@0.1.0 build
23:53:20.909 > next build
23:53:20.910 
23:53:24.424 Attention: Next.js now collects completely anonymous telemetry regarding usage.
23:53:24.424 This information is used to shape Next.js' roadmap and prioritize features.
23:53:24.425 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
23:53:24.425 https://nextjs.org/telemetry
23:53:24.425 
23:53:24.481   ▲ Next.js 14.2.33
23:53:24.482 
23:53:24.536    Creating an optimized production build ...
23:53:42.272 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
23:53:42.423  ⚠ Compiled with warnings
23:53:42.423 
23:53:42.427 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
23:53:42.428 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
23:53:42.428 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
23:53:42.428 
23:53:42.428 Import trace for requested module:
23:53:42.428 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
23:53:42.429 ./node_modules/@supabase/realtime-js/dist/module/index.js
23:53:42.429 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:53:42.429 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
23:53:42.429 ./node_modules/@supabase/ssr/dist/module/index.js
23:53:42.429 
23:53:42.429 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:53:42.430 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
23:53:42.430 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
23:53:42.430 
23:53:42.430 Import trace for requested module:
23:53:42.430 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:53:42.430 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
23:53:42.430 ./node_modules/@supabase/ssr/dist/module/index.js
23:53:42.431 
23:53:54.978  ✓ Compiled successfully
23:53:54.979    Linting and checking validity of types ...
23:54:02.808 Failed to compile.
23:54:02.808 
23:54:02.808 ./app/api/ai/analyze/route.ts:63:41
23:54:02.808 Type error: Property 'lot_number' does not exist on type 'never'.
23:54:02.808 
23:54:02.808 [0m [90m 61 |[39m [32m        fitting:fittings!inner(lot_number)[39m[0m
23:54:02.809 [0m [90m 62 |[39m [32m      `[39m)[0m
23:54:02.809 [0m[31m[1m>[22m[39m[90m 63 |[39m       [33m.[39meq([32m'fitting.lot_number'[39m[33m,[39m fitting[33m.[39mlot_number)[33m;[39m[0m
23:54:02.809 [0m [90m    |[39m                                         [31m[1m^[22m[39m[0m
23:54:02.809 [0m [90m 64 |[39m[0m
23:54:02.809 [0m [90m 65 |[39m     [90m// Fetch vendor data[39m[0m
23:54:02.809 [0m [90m 66 |[39m     [36mconst[39m { data[33m:[39m vendor } [33m=[39m [36mawait[39m supabase[0m
23:54:02.834 Next.js build worker exited with code: 1 and signal: null
23:54:02.850 Error: Command "npm run build" exited with 1