export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
          Hello,{' '}
          <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            Snip
          </span>
          !
        </h1>
      </div>
    </main>
  );
}
