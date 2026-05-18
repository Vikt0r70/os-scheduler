const githubUrl = 'https://github.com/Vikt0r70/os-scheduler';

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 py-8 text-slate-300">
      <div className="flex flex-col gap-4 rounded-3xl border border-scheduler-border bg-scheduler-surface/90 px-6 py-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6">
          <span className="text-slate-400">© 2026 OS Scheduler.</span>{' '}
          <span className="font-medium text-slate-100">Made with ❤️</span>
        </p>

        <a
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-scheduler-accent transition-colors duration-200 hover:border-cyan-300/60 hover:bg-cyan-300/15 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the OS Scheduler GitHub repository"
        >
          GitHub repository
        </a>
      </div>
    </footer>
  );
}

export default Footer;
