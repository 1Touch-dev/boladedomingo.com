import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

type BrandMarkProps = {
  tone?: 'on-dark' | 'on-light';
  size?: 'header' | 'footer';
  compressed?: boolean;
  showDomain?: boolean;
};

function hostLabel() {
  const host = siteConfig.seo.canonicalHost?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host || 'boladedomingo.com';
}

export default function BrandMark({
  tone = 'on-dark',
  size = 'header',
  compressed = false,
  showDomain = false,
}: BrandMarkProps) {
  const parts = siteConfig.siteName.trim().split(/\s+/);
  const lead = parts[0] || siteConfig.siteName;
  const rest = parts.slice(1).join(' ');
  const onDark = tone === 'on-dark';

  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className={cn(
          'relative grid shrink-0 place-items-center rounded-full border-2',
          size === 'footer' ? 'h-12 w-12' : compressed ? 'h-8 w-8' : 'h-10 w-10',
          onDark ? 'border-accent bg-white/10' : 'border-primary bg-primary/10'
        )}
      >
        <span
          className={cn(
            'block rounded-full border-[1.5px]',
            size === 'footer' ? 'h-7 w-7' : 'h-5 w-5',
            onDark ? 'border-accent' : 'border-primary'
          )}
        />
        <span
          className={cn(
            'absolute left-1 right-1 h-px',
            onDark ? 'bg-accent' : 'bg-primary'
          )}
        />
      </span>
      <span className="min-w-0 text-left">
        <span
          className={cn(
            'block truncate font-display uppercase leading-none tracking-[0.04em]',
            size === 'footer'
              ? 'text-4xl md:text-5xl'
              : compressed
                ? 'text-xl'
                : 'text-2xl md:text-[1.85rem]'
          )}
        >
          <span className={onDark ? 'text-white' : 'text-secondary'}>{lead}</span>
          {rest ? (
            <span
              className={cn(
                'font-article text-[0.72em] font-normal normal-case italic tracking-normal',
                onDark ? 'text-accent' : 'text-primary'
              )}
            >
              {' '}
              {rest}
            </span>
          ) : null}
        </span>
        {showDomain && !compressed ? (
          <span
            className={cn(
              'mt-1 block truncate text-[10px] uppercase tracking-[0.22em]',
              onDark ? 'text-white/55' : 'text-muted'
            )}
          >
            {hostLabel()}
          </span>
        ) : null}
      </span>
    </span>
  );
}
