// Style Dictionary build — transforms the DTCG tokens/*.tokens.json files into
// CSS custom properties. Emits two selectors:
//   :root  — palette + scale + light semantic
//   .dark  — dark semantic overrides (references resolve to the :root palette vars)
// This is the "any team can transform the neutral .tokens.json" proof. Other
// platforms (iOS, Android, JS, Tailwind) are added here the same way.
import StyleDictionary from 'style-dictionary';
import { writeFileSync, readFileSync, rmSync } from 'node:fs';

const PREFIX = 'vds';
const BUILD = 'dist/.dtcg-build/';
const OUT = 'dist/vipre-tokens.dtcg.css';

// Pass 1 — :root (palette + scale + light semantic)
const root = new StyleDictionary({
  source: ['tokens/palette.tokens.json', 'tokens/scale.tokens.json', 'tokens/semantic.light.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css', prefix: PREFIX, buildPath: BUILD,
      files: [{ destination: 'root.css', format: 'css/variables', options: { outputReferences: true, selector: ':root' } }],
    },
  },
});

// Pass 2 — .dark (only the dark semantic file is emitted; palette is loaded so
// references resolve to the --vds-palette-* vars already defined in :root)
const dark = new StyleDictionary({
  source: ['tokens/palette.tokens.json', 'tokens/semantic.dark.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css', prefix: PREFIX, buildPath: BUILD,
      files: [{
        destination: 'dark.css', format: 'css/variables',
        filter: (t) => t.filePath.includes('semantic.dark'),
        options: { outputReferences: true, selector: '.dark' },
      }],
    },
  },
});

await root.buildAllPlatforms();
await dark.buildAllPlatforms();

const banner = `/* Vipre Design System — generated from tokens/*.tokens.json (DTCG) by Style Dictionary.\n   DO NOT EDIT BY HAND. Run: npm run build:tokens:dtcg */\n\n`;
writeFileSync(OUT, banner + readFileSync(BUILD + 'root.css', 'utf8') + '\n' + readFileSync(BUILD + 'dark.css', 'utf8'));
rmSync(BUILD, { recursive: true, force: true });
console.log('wrote', OUT);
