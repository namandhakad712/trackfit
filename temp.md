23:35:36.714 Running build in Washington, D.C., USA (East) – iad1
23:35:36.714 Build machine configuration: 2 cores, 8 GB
23:35:36.755 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: 5185596)
23:35:36.912 Previous build caches not available
23:35:37.035 Cloning completed: 279.000ms
23:35:37.362 Running "vercel build"
23:35:37.768 Vercel CLI 48.2.0
23:35:38.529 Installing dependencies...
23:35:41.310 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
23:35:41.850 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
23:35:43.067 npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
23:35:43.333 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
23:35:43.385 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
23:35:43.471 npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
23:35:43.516 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
23:35:45.342 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
23:35:51.649 
23:35:51.650 added 520 packages in 13s
23:35:51.651 
23:35:51.651 159 packages are looking for funding
23:35:51.651   run `npm fund` for details
23:35:51.723 Running "npm run build"
23:35:51.832 
23:35:51.833 > railtrack-qr@0.1.0 build
23:35:51.833 > next build
23:35:51.833 
23:35:52.374 Attention: Next.js now collects completely anonymous telemetry regarding usage.
23:35:52.375 This information is used to shape Next.js' roadmap and prioritize features.
23:35:52.375 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
23:35:52.375 https://nextjs.org/telemetry
23:35:52.375 
23:35:52.432   ▲ Next.js 14.2.33
23:35:52.433 
23:35:52.488    Creating an optimized production build ...
23:36:10.823 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
23:36:10.982  ⚠ Compiled with warnings
23:36:10.982 
23:36:10.983 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
23:36:10.984 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
23:36:10.984 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
23:36:10.984 
23:36:10.984 Import trace for requested module:
23:36:10.984 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
23:36:10.984 ./node_modules/@supabase/realtime-js/dist/module/index.js
23:36:10.985 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:36:10.985 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
23:36:10.985 ./node_modules/@supabase/ssr/dist/module/index.js
23:36:10.985 
23:36:10.986 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:36:10.986 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
23:36:10.986 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
23:36:10.986 
23:36:10.986 Import trace for requested module:
23:36:10.987 ./node_modules/@supabase/supabase-js/dist/module/index.js
23:36:10.987 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
23:36:10.987 ./node_modules/@supabase/ssr/dist/module/index.js
23:36:10.987 
23:36:23.737  ✓ Compiled successfully
23:36:23.738    Linting and checking validity of types ...
23:36:31.646 Failed to compile.
23:36:31.646 
23:36:31.647 ./app/(dashboard)/layout.tsx:30:35
23:36:31.647 Type error: Property 'role' does not exist on type 'never'.
23:36:31.647 
23:36:31.647 [0m [90m 28 |[39m   [36mreturn[39m ([0m
23:36:31.648 [0m [90m 29 |[39m     [33m<[39m[33mdiv[39m className[33m=[39m[32m"min-h-screen bg-gray-50"[39m[33m>[39m[0m
23:36:31.648 [0m[31m[1m>[22m[39m[90m 30 |[39m       [33m<[39m[33mSidebar[39m userRole[33m=[39m{profile[33m?[39m[33m.[39mrole} [33m/[39m[33m>[39m[0m
23:36:31.648 [0m [90m    |[39m                                   [31m[1m^[22m[39m[0m
23:36:31.649 [0m [90m 31 |[39m       [33m<[39m[33mdiv[39m className[33m=[39m[32m"lg:pl-64"[39m[33m>[39m[0m
23:36:31.649 [0m [90m 32 |[39m         [33m<[39m[33mHeader[39m[0m
23:36:31.649 [0m [90m 33 |[39m           user[33m=[39m{[0m
23:36:31.672 Next.js build worker exited with code: 1 and signal: null
23:36:31.689 Error: Command "npm run build" exited with 1