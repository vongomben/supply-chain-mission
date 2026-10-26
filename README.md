# Supply Chain Mission

Mini-escape didattico per lo stand **IT'S YOUR FUTURE** (ITS Liguria).  
Engine: copia autonoma di **`its-escape`**. Contenuti: spedizione Riviera Gusto Albenga → Toronto.

Non mescolare questo repo con `its-crisis` o `lanterna`.

## Avvio

```powershell
npm install
npm run dev
```

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Sviluppo locale |
| `npm run build` | Genera `dist/` con path relativi (`base: "./"`) |
| `npm run preview` | Serve `dist/` in locale |

Dopo `npm run build`, copia il contenuto di `dist/` nella sottocartella Jekyll `/supply-chain-mission/`.

Pannello facilitatore: `?facilitatore=1`.

## Contenuto

Tutto il testo didattico sta in `src/data/game-config.js`.

Il codice lucchetto (`5162`) è **provvisorio** e vive in un'unica costante `lockerCode`.
