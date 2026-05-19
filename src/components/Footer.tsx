import { GitHubIcon } from './Icons';

const githubUrl = 'https://github.com/Vikt0r70/os-scheduler';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto animate-fade-in">
      <div className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto gap-4 text-on-surface-variant text-sm">
        <div className="font-mono text-xs font-bold uppercase tracking-wider">
          © 2026 OS Scheduler. Built for Technical Education.
        </div>
        <div className="flex gap-6 font-mono text-xs">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-all hover:scale-105 duration-200 flex items-center gap-1.5"
          >
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
