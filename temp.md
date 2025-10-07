23:40:07.028 Running build in Washington, D.C., USA (East) – iad1
23:40:07.028 Build machine configuration: 2 cores, 8 GB
23:40:07.059 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: bca5256)
23:40:07.494 Cloning completed: 434.000ms
23:40:08.406 Restored build cache from previous deployment (4t2Ep3C2MEQnUYHo6V7LNC76gCQ8)
23:40:09.662 Running "vercel build"
23:40:10.067 Vercel CLI 48.2.0
23:40:10.416 Installing dependencies...
23:40:12.249 
23:40:12.250 added 4 packages in 2s
23:40:12.250 
23:40:12.250 159 packages are looking for funding
23:40:12.250   run `npm fund` for details
23:40:12.281 Detected Next.js version: 14.2.33
23:40:12.286 Running "npm run build"
23:40:12.418 
23:40:12.418 > railtrack-qr@0.1.0 build
23:40:12.418 > next build
23:40:12.418 
23:40:13.162   ▲ Next.js 14.2.33
23:40:13.163 
23:40:13.219    Creating an optimized production build ...
23:40:25.867 Failed to compile.
23:40:25.867 
23:40:25.868 ./app/(dashboard)/test-user/page.tsx
23:40:25.868 Error: 
23:40:25.868   [31mx[0m Unexpected token `div`. Expected jsx identifier
23:40:25.868     ,-[[36;1;4m/vercel/path0/app/(dashboard)/test-user/page.tsx[0m:20:1]
23:40:25.869  [2m20[0m |     .single();
23:40:25.869  [2m21[0m | 
23:40:25.869  [2m22[0m |   return (
23:40:25.869  [2m23[0m |     <div className="p-8">
23:40:25.869     : [31;1m     ^^^[0m
23:40:25.870  [2m24[0m |       <h1 className=
23:40:25.870     `----
23:40:25.870 
23:40:25.870 Caused by:
23:40:25.870     Syntax Error
23:40:25.870 
23:40:25.871 Import trace for requested module:
23:40:25.871 ./app/(dashboard)/test-user/page.tsx
23:40:25.871 
23:40:25.880 
23:40:25.881 > Build failed because of webpack errors
23:40:25.908 Error: Command "npm run build" exited with 1