00:10:04.812 Running build in Washington, D.C., USA (East) – iad1
00:10:04.812 Build machine configuration: 2 cores, 8 GB
00:10:04.824 Cloning github.com/namandhakad712/trackfit (Branch: main, Commit: d258c6a)
00:10:05.213 Cloning completed: 389.000ms
00:10:06.211 Restored build cache from previous deployment (4t2Ep3C2MEQnUYHo6V7LNC76gCQ8)
00:10:06.761 Running "vercel build"
00:10:07.144 Vercel CLI 48.2.9
00:10:07.498 Installing dependencies...
00:10:09.774 
00:10:09.775 added 5 packages in 2s
00:10:09.776 
00:10:09.776 159 packages are looking for funding
00:10:09.777   run `npm fund` for details
00:10:09.811 Detected Next.js version: 14.2.33
00:10:09.817 Running "npm run build"
00:10:09.936 
00:10:09.936 > railtrack-qr@0.1.0 build
00:10:09.937 > next build
00:10:09.937 
00:10:10.641   ▲ Next.js 14.2.33
00:10:10.642 
00:10:10.702    Creating an optimized production build ...
00:10:23.883  ⚠ Compiled with warnings
00:10:23.884 
00:10:23.884 ./components/admin/AdminGuard.tsx
00:10:23.885 Attempted import error: 'useSupabase' is not exported from '@/lib/supabase/client' (imported as 'useSupabase').
00:10:23.885 
00:10:23.885 Import trace for requested module:
00:10:23.885 ./components/admin/AdminGuard.tsx
00:10:23.885 ./app/admin/settings/page.tsx
00:10:23.885 
00:10:23.885 ./components/admin/AdminInspectionDashboard.tsx
00:10:23.885 Attempted import error: 'useSupabase' is not exported from '@/lib/supabase/client' (imported as 'useSupabase').
00:10:23.885 
00:10:23.885 Import trace for requested module:
00:10:23.885 ./components/admin/AdminInspectionDashboard.tsx
00:10:23.886 ./app/admin/inspection-logs/page.tsx
00:10:23.886 
00:10:26.979 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (114kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
00:10:37.793  ⚠ Compiled with warnings
00:10:37.794 
00:10:37.794 ./components/admin/AdminGuard.tsx
00:10:37.794 Attempted import error: 'useSupabase' is not exported from '@/lib/supabase/client' (imported as 'useSupabase').
00:10:37.794 
00:10:37.794 Import trace for requested module:
00:10:37.794 ./components/admin/AdminGuard.tsx
00:10:37.794 ./app/admin/inspection-logs/page.tsx
00:10:37.794 
00:10:37.794 ./components/admin/AdminInspectionDashboard.tsx
00:10:37.794 Attempted import error: 'useSupabase' is not exported from '@/lib/supabase/client' (imported as 'useSupabase').
00:10:37.794 
00:10:37.794 Import trace for requested module:
00:10:37.794 ./components/admin/AdminInspectionDashboard.tsx
00:10:37.794 ./app/admin/inspection-logs/page.tsx
00:10:37.795 
00:10:37.828  ✓ Compiled successfully
00:10:37.829    Linting and checking validity of types ...
00:10:48.709 Failed to compile.
00:10:48.710 
00:10:48.710 ./app/api/auth/signup/route.ts:59:12
00:10:48.710 Type error: No overload matches this call.
00:10:48.711   Overload 1 of 2, '(values: never, options?: { count?: "exact" | "planned" | "estimated" | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "users", never, "POST">', gave the following error.
00:10:48.711     Argument of type '{ id: string; email: string; name: string; role: "depot_manager" | "inspector" | "admin"; depot_location: string | null; phone: string | null; }' is not assignable to parameter of type 'never'.
00:10:48.711   Overload 2 of 2, '(values: never[], options?: { count?: "exact" | "planned" | "estimated" | undefined; defaultToNull?: boolean | undefined; } | undefined): PostgrestFilterBuilder<{ PostgrestVersion: "12"; }, never, never, null, "users", never, "POST">', gave the following error.
00:10:48.711     Object literal may only specify known properties, and 'id' does not exist in type 'never[]'.
00:10:48.711 
00:10:48.712 [0m [90m 57 |[39m         [36mconst[39m result [33m=[39m [36mawait[39m serviceRoleSupabase[0m
00:10:48.712 [0m [90m 58 |[39m           [33m.[39m[36mfrom[39m([32m'users'[39m)[0m
00:10:48.712 [0m[31m[1m>[22m[39m[90m 59 |[39m           [33m.[39minsert({[0m
00:10:48.717 [0m [90m    |[39m            [31m[1m^[22m[39m[0m
00:10:48.717 [0m [90m 60 |[39m             id[33m:[39m data[33m.[39muser[33m.[39mid[33m,[39m[0m
00:10:48.717 [0m [90m 61 |[39m             email[33m:[39m validatedData[33m.[39memail[33m,[39m[0m
00:10:48.718 [0m [90m 62 |[39m             name[33m:[39m validatedData[33m.[39mname[33m,[39m[0m
00:10:48.742 Next.js build worker exited with code: 1 and signal: null
00:10:48.760 Error: Command "npm run build" exited with 1