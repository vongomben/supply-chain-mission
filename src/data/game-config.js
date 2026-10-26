/**
 * Supply Chain Mission — contenuti didattici.
 * Il motore legge questo file. lockerCode è definito una sola volta.
 */

const lockerCode = "5162"; // PROVVISORIO — Davide lo verifica nel master Excel

export const gameConfig = {
  id: "supply-chain-mission",
  lockerCode,
  meta: {
    slug: "supply-chain-mission",
    titolo: "Supply Chain Mission",
    titoloIntro: "Il container è pronto. Il piano no.",
    sottotitolo: "Team commerciale-logistico",
    corsoRiferimento:
      "Tecnico superiore per la strategia commerciale — Marketing logistico e gestione pratiche doganali",
    durataStimata: "3-7 minuti",
    obiettivoDidattico:
      "Collegare strategia commerciale, supply chain, logistica intermodale, dogana, tracciabilità, KPI e relazione con il cliente in una spedizione extra-UE.",
    contestoNarrativo:
      "Sei appena entrato nel team commerciale-logistico di Riviera Gusto, una PMI di Albenga che produce olio extravergine e conserve. Un distributore di Toronto vuole un primo ordine di prova. Il tuo compito: portare il container dal magazzino ligure al cliente, senza intoppi.",
    timer: {
      modalita: "countdown",
      secondi: 420,
    },
    brief: {
      intestazioni: ["Voce", "Contenuto"],
      righe: [
        ["Merce", "16 pallet di olio EVO e conserve, 1 container da 20'"],
        ["Destinazione", "Distributore gourmet, Toronto (Canada)"],
        ["Scadenza", "Consegna entro 30 giorni dall'ordine"],
        [
          "Regola",
          "Puoi riprovare ogni prova. Con al massimo un errore al primo tentativo, la spedizione parte.",
        ],
      ],
    },
  },

  navigazione: {
    homeUrl: "../",
    logoSrc: "./img/IT-Y-Flogo.png",
    percorsoLabel: "percorsi ITS Meccatronica e Servizi all'Impresa",
    percorsoUrl: "../meccatronica/",
  },

  tappe: [
    {
      id: "mercato-target",
      titolo: "Definire mercato e target",
      tipo: "quiz",
      testo:
        "La direzione vuole entrare nel mercato canadese e chiede al team il piano commerciale. Prima di fissare prezzi e canali di vendita, qual è la prima scelta?",
      domanda: "Da dove parti?",
      context: {
        type: "list",
        items: [
          ["Mercato", "food italiano in crescita in Ontario"],
          ["Concorrenza", "3 marchi italiani già presenti nella grande distribuzione"],
          ["Accordi", "CETA UE–Canada, con dazi ridotti grazie all'origine preferenziale"],
        ],
      },
      opzioni: [
        {
          testo: "Analizzare mercato, target, concorrenza e posizionamento del prodotto",
          corretta: true,
          feedback:
            "Una strategia commerciale efficace parte dall'analisi del mercato: target, concorrenti e posizionamento guidano prezzo, canali e comunicazione.",
        },
        {
          testo: "Abbassare subito il prezzo per battere i tre concorrenti",
          corretta: false,
          feedback: "Prima di agire su prezzo o canali, devi sapere a chi vendi e contro chi.",
        },
        {
          testo: "Mandare campioni gratis a tutti i distributori trovati online",
          corretta: false,
          feedback: "Prima di agire su prezzo o canali, devi sapere a chi vendi e contro chi.",
        },
        {
          testo: "Copiare il listino del concorrente più grande",
          corretta: false,
          feedback: "Prima di agire su prezzo o canali, devi sapere a chi vendi e contro chi.",
        },
      ],
      indizioExtra: "Prima di agire su prezzo o canali, devi sapere a chi vendi e contro chi.",
      puntiChiave:
        "La strategia commerciale parte da mercato, target, concorrenza e posizionamento — non dal prezzo.",
    },

    {
      id: "intermodale",
      titolo: "Scegliere la soluzione intermodale",
      tipo: "quiz",
      testo:
        "Il container deve andare da Albenga a Toronto entro 30 giorni. Il team logistico mette a confronto quattro piani di trasporto.",
      domanda: "Quale piano proponi al cliente?",
      tabella: {
        intestazioni: ["Piano", "Tempo", "Costo", "Note"],
        righe: [
          ["Camion + nave + treno", "24 gg", "medio", "Un solo container, cambio mezzo senza scaricare"],
          ["Tutto in aereo", "4 gg", "molto alto", "Peso e volume fuori budget"],
          ["Camion low cost fino al porto, poi si vedrà", "?", "basso", "Nessuna prenotazione nave"],
          ["Pacchi con corriere espresso", "8 gg", "alto", "16 pallet da smontare"],
        ],
      },
      opzioni: [
        {
          testo:
            "Camion fino al porto di Genova, nave container fino a Halifax, treno fino a Toronto: mezzi coordinati, un unico container",
          corretta: true,
          feedback:
            "Il trasporto intermodale coordina mezzi diversi (strada, mare, ferrovia) usando la stessa unità di carico: si valutano insieme tempi, risorse, rischi e documenti.",
        },
        {
          testo: "Tutto in aereo: è il più veloce, il resto non conta",
          corretta: false,
          feedback:
            "Cerca il piano che bilancia tempi, costi, rischi e documenti, non solo uno di questi fattori.",
        },
        {
          testo: "Il camion più economico disponibile, la nave la cerchiamo una volta al porto",
          corretta: false,
          feedback:
            "Cerca il piano che bilancia tempi, costi, rischi e documenti, non solo uno di questi fattori.",
        },
        {
          testo: "Smontare i pallet e spedire i pacchi con un corriere espresso",
          corretta: false,
          feedback:
            "Cerca il piano che bilancia tempi, costi, rischi e documenti, non solo uno di questi fattori.",
        },
      ],
      indizioExtra:
        "Cerca il piano che bilancia tempi, costi, rischi e documenti, non solo uno di questi fattori.",
      puntiChiave:
        "Intermodale: un unico container, mezzi coordinati, equilibrio tra tempi, costi, rischi e documenti.",
    },

    {
      id: "dogana",
      titolo: "Preparare la pratica doganale",
      tipo: "quiz",
      testo:
        "Al porto di Genova la merce esce dall'Unione Europea. Senza una pratica doganale corretta il container resta fermo in banchina.",
      domanda: "Cosa serve per far partire la merce?",
      context: {
        type: "list",
        items: [
          ["Incoterms", "FCA Genova. La consegna al vettore è a carico vostro."],
          ["Origine", "prodotto in Liguria con materie prime UE"],
          ["Documenti pronti", "solo la fattura commerciale"],
        ],
      },
      opzioni: [
        {
          testo:
            "Classificare la merce con il codice TARIC, attestare l'origine, preparare i documenti e presentare la dichiarazione doganale di esportazione",
          corretta: true,
          feedback:
            "Le pratiche doganali sono centrali nel commercio internazionale: codice TARIC, origine (che fa scattare i vantaggi CETA), documenti e dichiarazione doganale. Gli Incoterms dicono chi fa cosa, ma non sostituiscono la pratica.",
        },
        {
          testo: "Basta la fattura commerciale: al resto pensa il trasportatore",
          corretta: false,
          feedback: "La dogana deve sapere che cos'è la merce, da dove viene e chi la dichiara.",
        },
        {
          testo: "I prodotti alimentari non passano controlli doganali",
          corretta: false,
          feedback: "La dogana deve sapere che cos'è la merce, da dove viene e chi la dichiara.",
        },
        {
          testo: "I documenti si sistemano dopo l'arrivo in Canada",
          corretta: false,
          feedback: "La dogana deve sapere che cos'è la merce, da dove viene e chi la dichiara.",
        },
      ],
      indizioExtra: "La dogana deve sapere che cos'è la merce, da dove viene e chi la dichiara.",
      puntiChiave:
        "Export extra-UE: TARIC, origine preferenziale CETA, documenti e dichiarazione doganale.",
    },

    {
      id: "tracking",
      titolo: "Tracciare la spedizione",
      tipo: "quiz",
      testo:
        "La nave è in mezzo all'Atlantico. Il distributore di Toronto scrive: «Dov'è il nostro container? Ci servono aggiornamenti in tempo reale per organizzare il magazzino.»",
      domanda: "Come rispondi al cliente?",
      context: {
        type: "list",
        items: [
          ["Sistemi aziendali", "WMS (magazzino) e TMS (trasporti) già in uso"],
          ["Container", "predisposto per tag RFID e sensori IoT"],
        ],
      },
      opzioni: [
        {
          testo:
            "Collegare WMS/TMS al tracking del container con RFID e sensori IoT (posizione, temperatura, urti) e condividere un link di aggiornamento",
          corretta: true,
          feedback:
            "La logistica digitale rende visibili flussi e consegne: WMS, TMS, RFID e sensori IoT trasformano la spedizione in dati condivisi in tempo reale.",
        },
        {
          testo: "Telefonare ogni giorno all'agenzia marittima e girare le notizie al cliente",
          corretta: false,
          feedback: "Il cliente vuole vedere da solo, in ogni momento, non ricevere notizie a voce.",
        },
        {
          testo: "Avvisare il cliente quando la merce arriva in porto",
          corretta: false,
          feedback: "Il cliente vuole vedere da solo, in ogni momento, non ricevere notizie a voce.",
        },
        {
          testo: "Mandare la foto del container alla partenza da Genova",
          corretta: false,
          feedback: "Il cliente vuole vedere da solo, in ogni momento, non ricevere notizie a voce.",
        },
      ],
      indizioExtra: "Il cliente vuole vedere da solo, in ogni momento, non ricevere notizie a voce.",
      puntiChiave: "Tracciabilità: WMS/TMS + RFID/IoT e visibilità condivisa con il cliente.",
    },

    {
      id: "kpi",
      titolo: "Controllare KPI e risorse",
      tipo: "quiz",
      testo:
        "Il container è sbarcato a Halifax, ma il cruscotto KPI segnala scostamenti rispetto al piano.",
      domanda: "Cosa fa il tecnico superiore?",
      tabella: {
        intestazioni: ["KPI", "Previsto", "Reale"],
        righe: [
          ["Lead time totale", "24 gg", "29 gg ⚠"],
          ["Sosta al terminal ferroviario", "1 gg", "5 gg ⚠"],
          ["Tratta navale", "13 gg", "13 gg"],
          ["Costo per pallet", "100%", "112% ⚠"],
        ],
        evidenzia: [0, 1, 3],
      },
      opzioni: [
        {
          testo:
            "Analizzare i KPI, individuare il collo di bottiglia al terminal ferroviario e proporre azioni correttive",
          corretta: true,
          feedback:
            "I KPI trasformano i dati in decisioni: si individua la causa (qui la sosta al terminal) e si agisce lì, per esempio prenotando prima lo slot ferroviario.",
        },
        {
          testo: "Cambiare subito tutti i fornitori di trasporto",
          corretta: false,
          feedback: "Guarda dove si concentra lo scostamento: non tutte le tratte sono in ritardo.",
        },
        {
          testo: "Lasciar perdere: i ritardi capitano",
          corretta: false,
          feedback: "Guarda dove si concentra lo scostamento: non tutte le tratte sono in ritardo.",
        },
        {
          testo: "Aumentare il prezzo al cliente per coprire i costi extra",
          corretta: false,
          feedback: "Guarda dove si concentra lo scostamento: non tutte le tratte sono in ritardo.",
        },
      ],
      indizioExtra: "Guarda dove si concentra lo scostamento: non tutte le tratte sono in ritardo.",
      puntiChiave: "I KPI indicano dove intervenire: qui il collo di bottiglia è il terminal ferroviario.",
    },

    {
      id: "crm-green",
      titolo: "Gestire cliente e sostenibilità",
      tipo: "quiz",
      testo:
        "La merce è arrivata a Toronto. Il distributore è soddisfatto ma aggiunge: «Per i prossimi ordini vorremmo consegne con un impatto ambientale più basso.»",
      domanda: "Come gestisci la richiesta?",
      context: {
        type: "list",
        items: [
          ["Storico cliente", "primo ordine, potenziale di 6 ordini l'anno"],
          ["Strumenti", "CRM aziendale con schede cliente"],
        ],
      },
      opzioni: [
        {
          testo:
            "Registrare il feedback nel CRM, valutare soluzioni di green logistics (più ferrovia, container pieni, imballi riciclabili) e tornare dal cliente con una proposta",
          corretta: true,
          feedback:
            "CRM, ascolto del feedback e scelte di green logistics migliorano il servizio e rendono l'azienda più competitiva sui mercati esteri.",
        },
        {
          testo: "Spiegare al cliente che la sostenibilità costa troppo",
          corretta: false,
          feedback: "La richiesta va ricordata, valutata con dati e trasformata in un'offerta concreta.",
        },
        {
          testo: "Promettere consegne a emissioni zero senza verificarle",
          corretta: false,
          feedback: "La richiesta va ricordata, valutata con dati e trasformata in un'offerta concreta.",
        },
        {
          testo: "Girare la mail al marketing e chiudere la pratica",
          corretta: false,
          feedback: "La richiesta va ricordata, valutata con dati e trasformata in un'offerta concreta.",
        },
      ],
      indizioExtra: "La richiesta va ricordata, valutata con dati e trasformata in un'offerta concreta.",
      puntiChiave: "CRM + green logistics: il feedback del cliente diventa un'offerta verificabile.",
    },
  ],

  esiti: {
    positivo: {
      titolo: "Spedizione sbloccata",
      testo:
        "Il piano commerciale-logistico è coerente e i documenti sono pronti. Hai lavorato come un tecnico superiore della supply chain: dall'analisi del mercato alla relazione con il cliente.",
    },
    negativo: {
      titolo: "Spedizione da rivedere",
      testo:
        "Il container non è ancora pronto a partire: servono controlli su mercato, trasporto, documenti e tracking. Rivedi le prove e riprova.",
    },
  },

  codiceFinale: {
    schermataVittoria: {
      competenzeEvidenziate: [
        "Strategia commerciale e marketing",
        "Supply chain management",
        "Logistica intermodale",
        "Pratiche doganali e commercio internazionale",
        "Logistica digitale e tracciabilità",
        "Analisi KPI",
        "CRM e sostenibilità",
      ],
    },
  },
};

export default gameConfig;
