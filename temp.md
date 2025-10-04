00:21:23.691 Running build in Washington, D.C., USA (East) – iad1
00:21:23.692 Build machine configuration: 2 cores, 8 GB
00:21:23.711 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: 6c8a7e3)
00:21:23.907 Previous build caches not available
00:21:24.075 Cloning completed: 363.000ms
00:21:24.408 Running "vercel build"
00:21:24.852 Vercel CLI 48.2.0
00:21:25.614 Installing dependencies...
00:21:28.475 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
00:21:28.972 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
00:21:30.337 npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
00:21:30.486 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
00:21:30.548 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
00:21:30.629 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
00:21:30.638 npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
00:21:32.555 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
00:21:38.895 
00:21:38.896 added 521 packages in 13s
00:21:38.896 
00:21:38.896 159 packages are looking for funding
00:21:38.896   run `npm fund` for details
00:21:38.961 Running "npm run build"
00:21:39.071 
00:21:39.072 > railtrack-qr@0.1.0 build
00:21:39.072 > next build
00:21:39.072 
00:21:39.688 Attention: Next.js now collects completely anonymous telemetry regarding usage.
00:21:39.689 This information is used to shape Next.js' roadmap and prioritize features.
00:21:39.689 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
00:21:39.689 https://nextjs.org/telemetry
00:21:39.689 
00:21:39.744   ▲ Next.js 14.2.33
00:21:39.745 
00:21:39.800    Creating an optimized production build ...
00:21:57.926 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
00:21:58.087  ⚠ Compiled with warnings
00:21:58.087 
00:21:58.087 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:21:58.087 A Node.js API is used (process.versions at line: 35) which is not supported in the Edge Runtime.
00:21:58.087 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:21:58.087 
00:21:58.088 Import trace for requested module:
00:21:58.088 ./node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
00:21:58.088 ./node_modules/@supabase/realtime-js/dist/module/index.js
00:21:58.088 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:21:58.088 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:21:58.088 ./node_modules/@supabase/ssr/dist/module/index.js
00:21:58.088 
00:21:58.088 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:21:58.088 A Node.js API is used (process.version at line: 24) which is not supported in the Edge Runtime.
00:21:58.088 Learn more: https://nextjs.org/docs/api-reference/edge-runtime
00:21:58.088 
00:21:58.088 Import trace for requested module:
00:21:58.088 ./node_modules/@supabase/supabase-js/dist/module/index.js
00:21:58.088 ./node_modules/@supabase/ssr/dist/module/createBrowserClient.js
00:21:58.088 ./node_modules/@supabase/ssr/dist/module/index.js
00:21:58.088 
00:22:10.870  ✓ Compiled successfully
00:22:10.871    Linting and checking validity of types ...
00:22:18.793 Failed to compile.
00:22:18.794 
00:22:18.794 ./app/api/alerts/[id]/route.ts:34:43
00:22:18.794 Type error: Conversion of type 'PostgrestBuilder<{ PostgrestVersion: "12"; }, never, false>' to type 'Promise<{ data: AlertData | null; error: any; }>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
00:22:18.794   Type 'PostgrestBuilder<{ PostgrestVersion: "12"; }, never, false>' is missing the following properties from type 'Promise<{ data: AlertData | null; error: any; }>': catch, finally, [Symbol.toStringTag]
00:22:18.795 
00:22:18.795 [0m [90m 32 |[39m     [36mconst[39m updateData[33m:[39m [33mPartial[39m[33m<[39m[33mAlertData[39m[33m>[39m [33m=[39m { resolved }[33m;[39m[0m
00:22:18.795 [0m [90m 33 |[39m     [0m
00:22:18.795 [0m[31m[1m>[22m[39m[90m 34 |[39m     [36mconst[39m { data[33m:[39m alert[33m,[39m error } [33m=[39m [36mawait[39m (supabase[0m
00:22:18.795 [0m [90m    |[39m                                           [31m[1m^[22m[39m[0m
00:22:18.796 [0m [90m 35 |[39m       [33m.[39m[36mfrom[39m([32m'alerts'[39m)[0m
00:22:18.796 [0m [90m 36 |[39m       [33m.[39mupdate(updateData)[0m
00:22:18.796 [0m [90m 37 |[39m       [33m.[39meq([32m'id'[39m[33m,[39m params[33m.[39mid)[0m
00:22:18.819 Next.js build worker exited with code: 1 and signal: null
00:22:18.835 Error: Command "npm run build" exited with 1