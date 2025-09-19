"use client";
import Head from 'next/head';
import { useRouter } from 'next/router';

function withLang(path, code) {
  const url = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  url.searchParams.set('lang', code);
  return url.pathname + url.search + url.hash;
}

export default function LangAlternates() {
  const router = useRouter();
  const path = router.asPath || '/';
  const hrefEn = withLang(path, 'en');
  const hrefHi = withLang(path, 'hi');
  return (
    <Head>
      <link rel="alternate" hrefLang="en" href={hrefEn} />
      <link rel="alternate" hrefLang="hi" href={hrefHi} />
      <link rel="alternate" hrefLang="x-default" href={hrefEn} />
    </Head>
  );
}


