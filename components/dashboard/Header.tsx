'use client';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold">RailTrack QR</h1>
          <p className="text-sm text-muted-foreground">
            AI-Powered Fitting Management
          </p>
        </div>
      </div>
    </header>
  );
}
