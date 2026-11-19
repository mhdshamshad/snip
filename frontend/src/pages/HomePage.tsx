import { Link, Navigate } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ClipboardCopy,
  Copy,
  Globe,
  Lock,
  PenLine,
  QrCode,
  Search,
  Server,
  UserPlus,
} from 'lucide-react';

import { Footer, Navbar } from '@/components/layout';
import { APP_ROUTES } from '@/constants/app-routes';
import { Button } from '@/components/common';
import { useAuthStore } from '@/features/auth';

const FEATURES = [
  {
    icon: PenLine,
    title: 'Custom aliases',
    body: 'Pick memorable paths like /spring-launch, with instant availability checks.',
  },
  {
    icon: ArrowRight,
    title: 'Fast redirects',
    body: 'Send visitors directly to the destination with a short, easy-to-share link.',
  },
  {
    icon: QrCode,
    title: 'QR codes',
    body: 'Every link gets a QR code you can recolor and download as PNG or SVG.',
  },
  {
    icon: Search,
    title: 'Search & sort',
    body: 'Find any link by destination or alias. Sort by newest or oldest.',
  },
  {
    icon: Lock,
    title: 'Private by account',
    body: 'Only you can view and manage your saved links in your account.',
  },
  {
    icon: ClipboardCopy,
    title: 'One-click copy',
    body: 'Copy, open or share any short link in a single click, on any device.',
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create your account',
    body: 'Register with your name and email. It takes less than a minute.',
  },
  {
    icon: PenLine,
    title: 'Paste a long link',
    body: 'Add any http or https URL and, if you like, a custom alias.',
  },
  {
    icon: ClipboardCopy,
    title: 'Share anywhere',
    body: 'Copy your short link or share its QR code wherever your audience is.',
  },
];

const PREVIEW_ROWS = [
  { code: 'launch-kit', domain: 'figma.com', letter: 'F' },
  { code: 'roadmap', domain: 'notion.so', letter: 'N' },
  { code: 'Hq7xTb', domain: 'github.com', letter: 'G' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.URLS} replace />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground antialiased selection:bg-brand/20 selection:text-brand">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 grid-cols-1 *:min-w-0">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground shadow-xs">
              <span className="size-1.5 rounded-full bg-brand" /> URL shortener for teams and
              creators
            </p>
            <h1 className="mt-5 text-[34px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Short links,
              <br />
              cleanly managed.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-[17px]">
              Snip turns long, messy URLs into short links that are easy to share and manage in one
              place.
            </p>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <Link to={APP_ROUTES.REGISTER}>
                <Button
                  size="lg"
                  className="h-11 px-5 w-full sm:w-auto"
                  rightIcon={<ArrowRight className="size-4" />}
                >
                  Get started free
                </Button>
              </Link>
              <Link to={APP_ROUTES.LOGIN}>
                <Button size="lg" variant="outline" className="h-11 px-5 w-full sm:w-auto">
                  Log in
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card. Try the demo account from the log-in page.
            </p>
          </div>

          <ProductPreview />
        </section>

        {/* How works */}
        <section id="how-it-works" className="scroll-mt-16 border-y border-border bg-subtle">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="max-w-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-brand">
                How it works
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
                A short code that points somewhere longer
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Each short link is a unique code mapped to your original URL. When someone opens it,
                Snip looks up the code and sends them straight to the destination.
              </p>
            </div>

            <div className="mt-10 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <FlowCard label="Visitor opens" value="snip.app/aB92xK" />
              <FlowArrow />
              <FlowCard
                label="Snip looks up the code"
                value="aB92xK → destination found"
                icon={Server}
              />
              <FlowArrow />
              <FlowCard label="Redirects to" value="example.com/products/electronics/mobile" />
            </div>

            <ol className="mt-14 grid gap-4 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-lg border border-border bg-card p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-subtle">
                      <step.icon className="size-4 text-foreground" strokeWidth={1.75} />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-16 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
        >
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Features
            </p>
            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
              Everything a link needs, nothing it doesn't
            </h2>
          </div>

          <div className="mt-10 rounded-2xl bg-muted/70 p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(f => (
                <div key={f.title} className="flex flex-col">
                  <f.icon className="size-5 text-foreground" strokeWidth={1.75} />
                  <h3 className="mt-4 text-sm sm:text-[15px] font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[13px] sm:text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card px-6 py-12 text-center shadow-xs sm:py-16">
            <div className="dot-grid absolute inset-0 opacity-50 mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
                Your next link, shorter.
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
                Create an account and shorten your first link in under a minute.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
                <Link to={APP_ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    className="h-11 px-5 w-full sm:w-auto"
                    rightIcon={<ArrowRight className="size-4" />}
                  >
                    Create free account
                  </Button>
                </Link>
                <Link to={APP_ROUTES.LOGIN}>
                  <Button size="lg" variant="outline" className="h-11 px-5 w-full sm:w-auto">
                    I already have an account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ProductPreview() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="dot-grid absolute -inset-4 rounded-3xl opacity-60 mask-[radial-gradient(ellipse_at_center,black_40%,transparent_75%)] sm:-inset-8" />
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-md">
        <div className="flex items-center gap-1.5 border-b border-border bg-subtle px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 truncate font-mono text-[11px] text-muted-foreground">
            snip.app/dashboard
          </span>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div className="rounded-lg border border-border bg-subtle p-3">
            <p className="text-[11px] font-medium text-muted-foreground">Destination URL</p>
            <p className="mt-1 truncate font-mono text-xs text-foreground/80">
              https://www.figma.com/community/file/1219416380519421/launch-kit-2026?ref=newsletter&utm_source=email
            </p>
          </div>
          <div className="flex justify-center">
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-card">
              <ArrowDown className="size-3 text-muted-foreground" />
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-brand/30 bg-brand-soft/60 p-3">
            <span className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-foreground">
              F
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-sm font-medium text-foreground">
                snip.app/launch-kit
              </p>
              <p className="flex items-center gap-1 text-[11px] text-success font-medium">
                <Check className="size-3" /> Ready to share
              </p>
            </div>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground shadow-xs">
              <Copy className="size-3" /> Copy
            </span>
          </div>
        </div>
        <div className="border-t border-border">
          {PREVIEW_ROWS.map(r => (
            <div
              key={r.code}
              className="flex items-center gap-3 border-b border-border px-4 py-2.5 sm:px-5"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-card text-[11px] font-semibold text-muted-foreground">
                {r.letter}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs font-medium text-foreground">/{r.code}</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Globe className="size-3" /> {r.domain}
                </p>
              </div>
              <span className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                <QrCode className="size-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlowCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Server;
}) {
  return (
    <div className="flex min-w-0 flex-col justify-center rounded-lg border border-border bg-card p-4 shadow-xs">
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        {Icon && <Icon className="size-3" />} {label}
      </p>
      <p className="mt-1.5 break-all font-mono text-[13px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center text-muted-foreground">
      <ArrowRight className="size-4 rotate-90 md:rotate-0" />
    </div>
  );
}
