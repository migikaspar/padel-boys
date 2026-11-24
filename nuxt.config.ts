import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  // Onepager braucht kein separates Payload-File (umgeht zudem einen Prerender-Bug mit unstorage 1.17)
  experimental: { payloadExtraction: false },
  css: [
    // Fallback-Schrift Barlow Condensed, selbst gehostet (kein Request an Google; wird nur geladen, wenn benötigt)
    ...[400, 500, 600, 700, 800].map((w) => `@fontsource/barlow-condensed/latin-${w}.css`),
    '~/assets/css/main.css',
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      // Adobe Fonts Web-Projekt (Futura PT + Futura PT Condensed); per NUXT_PUBLIC_TYPEKIT_ID überschreibbar
      typekitId: 'jhk5uiw',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'de-CH' },
      title: 'Padel Boys – Jeden Dienstag auf dem Court',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Padel Boys – fünf Jungs, ein Court. Jeden Dienstag 18:30–20:00 bei Padel Frenkendorf.' },
        { name: 'theme-color', content: '#002340' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://use.typekit.net', crossorigin: '' },
        { rel: 'preconnect', href: 'https://p.typekit.net', crossorigin: '' },
      ],
    },
  },
})
