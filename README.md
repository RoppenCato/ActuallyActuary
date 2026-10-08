# ActuallyActuary

Ett spel för att lära sig och memorera aktuariekunskap (och annat). Flashcards, sant/falskt, flerval och
ordningsövningar med spaced repetition, XP, nivåer och streak.

**Spela:** https://roppencato.github.io/ActuallyActuary/

På mobilen: öppna länken i Safari/Chrome och välj *Lägg till på hemskärmen*. Då får du en app-ikon,
helskärm och offline-stöd.

## Lägga till innehåll

Allt innehåll ligger som YAML i `content/<kategori>/<subkategori>.yaml`. Varje push till `main`
bygger och publicerar automatiskt. Enklast: beskriv vad du vill lägga till i chatten med Claude,
eller lägg en fil (Excel, PDF, text) i `inbox/` och be Claude konvertera den.

```
content/
  aktuarie/
    _category.yaml      # namn, beskrivning, ikon
    bokslut.yaml
    reservsattning.yaml
    ...
```

### Korttyper

```yaml
name: Reservsättning
description: Kort beskrivning
items:
  - type: term            # begrepp, blir flashcard
    term: IBNR
    definition: Incurred But Not Reported ...

  - type: qa              # fråga med fritt svar, blir flashcard
    question: Vad betyder negativ run-off?
    answer: Att reserven var för liten ...

  - type: truefalse
    statement: SCR motsvarar VaR 99,5 % över ett år.
    answer: true
    explanation: Valfri förklaring som visas efter svar

  - type: mcq             # flerval, correct är index (0-baserat) i options
    question: Vilken fördelning används för skadefrekvens?
    options: [Normal, Gamma, Poisson, Lognormal]
    correct: 2

  - type: order           # steg som ska ordnas rätt
    prompt: Ordna stegen i chain ladder
    steps:
      - Bygg triangel
      - Beräkna utvecklingsfaktorer
      - Projicera till slutkostnad
```

Alla typer kan ha `explanation` och `tags`. Kör `npm run validate` för att kontrollera filerna.

## Utveckling

```bash
npm install
npm run dev
```

Progress sparas lokalt i webbläsaren och kan exporteras/importeras som JSON under Inställningar.
