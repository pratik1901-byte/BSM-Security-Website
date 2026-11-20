# Share cards

The 1200x630 card each page shows when its link is pasted into WhatsApp,
LinkedIn, Slack or a search result.

These are **exports, not the source**. Each card is drawn at build time by
`app/<route>/opengraph-image.tsx`, which all share the layout in `lib/og.tsx`
— the mark, the brass edge, the headline, the agency line along the foot.
A page supplies four strings and gets a card.

To change a card, edit its route file (or `lib/og.tsx` for the layout), then:

    npm run build
    npm run og:export

That redraws them and refreshes this folder. Editing the PNGs here changes
nothing a visitor sees: the pages point at the generated routes.
