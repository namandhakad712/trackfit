23:46:28.399 Running build in Washington, D.C., USA (East) – iad1
23:46:28.399 Build machine configuration: 2 cores, 8 GB
23:46:28.414 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: fdf2a58)
23:46:28.639 Previous build caches not available
23:46:28.850 Cloning completed: 436.000ms
23:46:29.198 Running "vercel build"
23:46:29.634 Vercel CLI 48.2.0
23:46:31.605 Installing dependencies...
23:46:34.332 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
23:46:34.980 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
23:46:36.212 npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
23:46:36.388 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
23:46:36.389 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
23:46:36.519 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
23:46:36.545 npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
23:46:38.698 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
23:46:45.223 
23:46:45.223 added 520 packages in 13s
23:46:45.224 
23:46:45.224 159 packages are looking for funding
23:46:45.225   run `npm fund` for details
23:46:45.283 Running "npm run build"
23:46:45.394 
23:46:45.395 > railtrack-qr@0.1.0 build
23:46:45.395 > next build
23:46:45.395 
23:46:45.937 Attention: Next.js now collects completely anonymous telemetry regarding usage.
23:46:45.937 This information is used to shape Next.js' roadmap and prioritize features.
23:46:45.937 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
23:46:45.938 https://nextjs.org/telemetry
23:46:45.938 
23:46:45.994   ▲ Next.js 14.2.33
23:46:45.995 
23:46:46.053    Creating an optimized production build ...
23:47:03.540 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
23:47:03.693  ⚠ Compiled with warnings
23:47:03.694 
23:47:03.694 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
23:47:03.694 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
23:47:03.694 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
23:47:03.694 
23:47:03.694 Import trace for requested module:
23:47:03.694 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
23:47:03.694 ./node_modules/@supabase/realtime-js/dist/module/index.js
23:47:03.694 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:47:03.694 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
23:47:03.694 ./node_modules/@supabase/ssr/dist/module/index.js
23:47:03.694 
23:47:03.694 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:47:03.694 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
23:47:03.695 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
23:47:03.695 
23:47:03.695 Import trace for requested module:
23:47:03.695 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:47:03.695 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
23:47:03.695 ./node_modules/@supabase/ssr/dist/module/index.js
23:47:03.695 
23:47:16.371  ✓ Compiled successfully
23:47:16.372    Linting and checking validity of types ...
23:47:24.346 Failed to compile.
23:47:24.346 
23:47:24.346 ./app/(dashboard)/layout.tsx:28:29
23:47:24.347 Type error: Property 'role' does not exist on type 'never'.
23:47:24.347 
23:47:24.347 [0m [90m 26 |[39m     [33m.[39msingle()[33m;[39m[0m
23:47:24.347 [0m [90m 27 |[39m[0m
23:47:24.347 [0m[31m[1m>[22m[39m[90m 28 |[39m   [36mconst[39m userRole [33m=[39m profile[33m?[39m[33m.[39mrole [36mas[39m [32m'depot_manager'[39m [33m|[39m [32m'inspector'[39m [33m|[39m [32m'admin'[39m [33m|[39m undefined[33m;[39m[0m
23:47:24.347 [0m [90m    |[39m                             [31m[1m^[22m[39m[0m
23:47:24.347 [0m [90m 29 |[39m[0m
23:47:24.347 [0m [90m 30 |[39m   [36mreturn[39m ([0m
23:47:24.347 [0m [90m 31 |[39m     [33m<[39m[33mdiv[39m className[33m=[39m[32m"min-h-screen bg-gray-50"[39m[33m>[39m[0m
23:47:24.373 Next.js build worker exited with code: 1 and signal: null
23:47:24.389 Error: Command "npm run build" exited with 1