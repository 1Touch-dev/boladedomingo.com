import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Sobre',
  description: `Conheça ${siteConfig.siteName}`,
};

export default function AboutPage() {
  const host = siteConfig.seo.canonicalHost?.replace(/\/$/, '') ?? 'https://boladedomingo.com';

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        {host.replace(/^https?:\/\//, '')}
      </p>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-secondary">
        Sobre {siteConfig.siteName}
      </h1>
      <p className="mt-3 font-article text-lg italic text-muted">{siteConfig.tagline}</p>
      <div className="mt-8 space-y-4 font-article text-base leading-relaxed text-foreground">
        <p>
          Bola de Domingo nasceu do ritual mais brasileiro do fim de semana: o jogo que
          para a cidade, enche o bar e divide a mesa. Em boladedomingo.com a cobertura
          não espera a segunda-feira.
        </p>
        <p>
          Acompanhamos Brasileirão, Série B, Copa do Brasil, Libertadores e a Seleção —
          placar ao vivo, classificação, artilharia e o que se move no mercado da bola.
          Bastidores entram quando mudam o jogo, não para preencher página.
        </p>
        <p>
          A redação publica em português do Brasil, no fuso de São Paulo, do aquecimento
          ao apito final. Domingo é o nome. A bola rola a semana inteira.
        </p>
      </div>
    </div>
  );
}
