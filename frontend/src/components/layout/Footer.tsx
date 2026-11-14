import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { APP_ROUTES } from '@/constants/app-routes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Snip. Short links, cleanly managed.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted-foreground"
          aria-label="Footer"
        >
          <a href="/#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="/#how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <Link to={APP_ROUTES.LOGIN} className="hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link to={APP_ROUTES.REGISTER} className="hover:text-foreground transition-colors">
            Create account
          </Link>
        </nav>
      </div>
    </footer>
  );
}
