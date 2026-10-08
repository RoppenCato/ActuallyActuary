# Startlek: Premiereserv (Solvens II)

## Vad premiereserven är

Begrepp: Premiereserv / premieavsättning (BE^PP)
Betyder: Best Estimate för framtida skador och kostnader på befintliga avtal, minus framtida premieinflöden. Nuvärdesberäknad.

Begrepp: Skadeavsättning (BE^CP)
Betyder: Best Estimate för skador som redan har inträffat. Premieavsättningen gäller i stället skador som ännu inte inträffat.

Begrepp: Kontraktsgräns (contract boundary)
Betyder: Gränsen för vilka framtida premier och åtaganden som räknas till ett befintligt avtal och därmed ingår i premiereserven.

Begrepp: Riskmarginal (RM)
Betyder: Tillägg till Best Estimate för kostnaden att hålla kapital tills åtagandena är avvecklade.

Begrepp: TP (Technical Provisions)
Betyder: Försäkringstekniska avsättningar. TP = BE^PP + BE^CP + RM.

Begrepp: B-klass
Betyder: Den produktnivå premiereserven beräknas på. Summeras sedan till R-klass och totalt.

Begrepp: SakBE
Betyder: Agrias kvartalsvisa Solvens II-leverans av Best Estimate till aktuariefunktionen.

Fråga: Vad är skillnaden mellan premiereserven i Solvens II och UPR i redovisningen?
Svar: UPR är den ej intjänade delen av premien. S2-premiereserven är ett diskonterat kassaflöde: förväntade skador och kostnader minus framtida premieinflöden.

Fråga: Hur kan premiereserven bli negativ?
Svar: När affären är lönsam är förväntade skador och kostnader lägre än premien, och premiefordringar dras av fullt ut.

Fråga: I vilken valuta diskonteras premiereserven och med vilken kurva?
Svar: I SEK oavsett ursprungsvaluta, med EIOPA:s riskfria räntekurva.

Sant/falskt: Premiereserven täcker skador som redan har inträffat.
Svar: Falskt. Det gör skadeavsättningen.

Sant/falskt: En negativ premiereserv är alltid ett fel.
Svar: Falskt. Lönsam affär kan ge negativ premiereserv.

Flerval: Vilken formel stämmer?
Alternativ: TP = BE^PP + BE^CP + RM / TP = UPR + HHP / TP = BE^CP − BE^PP / TP = BE^PP + RM − BE^CP
Rätt: TP = BE^PP + BE^CP + RM

## Balansposter

Begrepp: UPR
Betyder: Unearned Premium Reserve, ej intjänad premie. Den del av premien som avser försäkringstid efter balansdagen.

Begrepp: HHP
Betyder: Framtida premie på befintliga avtal inom kontraktsgränsen, dvs. premie som ännu inte är aviserad men hör till avtal vi redan är bundna av.

Begrepp: FEA / FEE
Betyder: Premiefordringar. Dras av rakt av i premiereserven.

Begrepp: HHPR
Betyder: Återförsäkringspremie på tecknad återförsäkring. Ingår i formeln men är noll i dagens beräkning.

Begrepp: Volymmått (VM)
Betyder: Exponeringen efter annullation: VM = (1 − AN_existing) × UPR + (1 − AN_future) × HHP.

Fråga: Vad är skillnaden mellan UPR och HHP?
Svar: UPR är redan aviserad premie för tid som inte passerat. HHP är premie som ännu inte aviserats men som ligger inom kontraktsgränsen.

Sant/falskt: Premiefordringarna multipliceras med kostnadskvoten innan de dras av.
Svar: Falskt. De dras av rakt av.

## Antaganden

Begrepp: LR (skadeprocent)
Betyder: Antagen framtida skadekostnad som andel av premien.

Begrepp: CHR
Betyder: Claims Handling Ratio, skaderegleringskostnad som andel av premien. Inte samma sak som skadereservens ULAE, som gäller redan inträffade skador.

Begrepp: ADM
Betyder: Administrationskostnad som andel av premien.

Begrepp: PR (provision)
Betyder: Provisionskostnad som andel av premien. Läggs bara på HHP i formeln.

Begrepp: CR
Betyder: Sammanlagd kostnadskvot i formeln: skador plus kostnader (LR + CHR + ADM).

Begrepp: AN_existing / AN_future
Betyder: Annullationsantaganden. AN_existing gäller redan aviserad premie (UPR), AN_future gäller framtida premie (HHP).

Begrepp: REC_LR / REC_CHR
Betyder: Återförsäkrarens andel av skadekostnad respektive skaderegleringskostnad.

Begrepp: Prem_RIS
Betyder: Framtida återförsäkringspremie som andel av volymmåttet.

Begrepp: CDA
Betyder: Counterparty Default Adjustment. Justering av återförsäkringsandelen för risken att motparten inte betalar.

Fråga: Hur ofta uppdateras antagandena normalt?
Svar: Bara vid årsskifte. Övriga kvartal räknas med oförändrade antaganden.

Sant/falskt: CHR i premiereserven är samma sak som ULAE i skadereserven.
Svar: Falskt. CHR är en kostnadskvot på premie för framtida skador. ULAE är en reserv för reglering av redan inträffade skador.

## Formler

Begrepp: Odiskonterad bruttopremiereserv
Betyder: PP = CR × [(1 − AN_exist) × UPR + (1 − AN_fut) × HHP] + PR × HHP + (AN_exist × UPR + AN_fut × HHP) − (FEA + FEE)

Begrepp: Återförsäkrares andel (PP_RIS)
Betyder: PP_RIS = VM × (LR × REC_LR + CHR × REC_CHR) × (1 − CDA) − (HHPR + VM × Prem_RIS) × (1 − CDA)

Begrepp: Netto
Betyder: Netto = Brutto (Gross) − återförsäkrares andel (RIS).

Begrepp: Diskonterad Best Estimate
Betyder: Summan över framtida månader av belopp × betalningsmönster / (1 + ränta)^tid.

Fråga: Vilka fyra delar består bruttoformeln av?
Svar: 1) Skador och kostnader på kvarvarande volym, 2) provision på HHP, 3) återbetalning vid annullation, 4) avdrag för premiefordringar.

Fråga: Varför finns termen AN_exist × UPR + AN_fut × HHP i formeln?
Svar: Den är återbetalningen vid annullation. Premie som annulleras ger ingen skadekostnad men ska betalas tillbaka.

Fråga: UPR = 100, HHP = 0, CR = 80 %, ingen annullation, inga fordringar. Vad blir odiskonterad PP?
Svar: 80. PP = 0,80 × 100.

Fråga: UPR = 100, HHP = 50, CR = 80 %, PR = 0, ingen annullation, FEA + FEE = 140. Vad blir PP?
Svar: −20. 0,80 × 150 = 120, minus 140 i fordringar.

Fråga: UPR = 100, CR = 80 %, AN_exist = 10 %, HHP = 0, inga fordringar. Vad blir PP?
Svar: 82. Skador och kostnader 0,80 × 90 = 72, plus återbetalning 10.

## Kassaflödets delar

Begrepp: Skadeflöde
Betyder: Framtida skadeutbetalningar på befintliga avtal. Drivs av LR.

Begrepp: Kostnadsflöde
Betyder: Framtida driftskostnader: skadereglering (CHR), administration (ADM) och provision (PR).

Begrepp: Annullationsflöde
Betyder: Återbetalning av premie till kunder som säger upp avtalet i förtid.

Begrepp: Premieinflöde
Betyder: Framtida premier från kunderna. Negativt tecken, eftersom det minskar reserven.

Begrepp: Gross / RIS / Net
Betyder: Brutto, återförsäkrares andel och netto. Kassaflödet redovisas på alla tre.

Begrepp: Betalningsmönster (payment pattern)
Betyder: Fördelning av kassaflödet över framtida månader. Behövs för att kunna diskontera.

Fråga: Varför behövs ett betalningsmönster i premiereserven?
Svar: Formeln ger ett totalbelopp. Mönstret lägger beloppet på rätt framtida månader så att det kan diskonteras.

Fråga: Vilket tecken har premieinflödet och varför?
Svar: Negativt. Det är pengar in, vilket minskar åtagandet.

Flerval: Vilken del av kassaflödet innehåller provisionen?
Alternativ: Skadeflödet / Kostnadsflödet / Annullationsflödet / Premieinflödet
Rätt: Kostnadsflödet

Ordning: Från balans till Best Estimate
1. Ta fram balansposter (UPR, HHP, fordringar) per B-klass
2. Applicera antaganden (LR, CHR, ADM, PR, annullation)
3. Fördela beloppen över framtida månader med betalningsmönstret
4. Dela upp på brutto, återförsäkring och netto
5. Diskontera med EIOPA-kurvan
6. Summera till R-klass och totalt

## Samband – hur allt hänger ihop

Fråga: Hur hänger tecknad premie, intjänad premie och UPR ihop?
Svar: Tecknad premie tjänas in över försäkringstiden. Det som ännu inte tjänats in på balansdagen är UPR.

Fråga: Vad händer med UPR mellan två förnyelser?
Svar: Den sjunker i takt med att premien tjänas in, och hoppar upp igen när avtalen förnyas. Därför har UPR säsongsmönster.

Fråga: Hur hänger premiereserven och skadereserven ihop över tid?
Svar: När tiden går tjänas premien in och skador inträffar. Åtagandet flyttar då från premiereserven till skadereserven.

Fråga: Om det inte finns HHP, fordringar eller annullation, hur förhåller sig premiereserven till UPR?
Svar: PP = CR × UPR. Är kostnadskvoten under 100 % blir premiereserven lägre än UPR.

Fråga: Vad händer med premiereserven om UPR ökar, allt annat lika?
Svar: Den ökar, eftersom mer exponering ger mer förväntade skador och kostnader.

Fråga: Vad händer med premiereserven om LR-antagandet höjs?
Svar: Den ökar. Högre förväntad skadekostnad på samma volym.

Fråga: Vad händer med premiereserven om premiefordringarna ökar, allt annat lika?
Svar: Den minskar krona för krona, eftersom fordringarna dras av rakt av.

Fråga: Vad händer med premiereserven om annullationsantagandet höjs och kostnadskvoten är under 100 %?
Svar: Den ökar. Annullerad premie betalas tillbaka till 100 %, medan kvarvarande premie bara kostar CR.

Fråga: Vad händer med en positiv premiereserv när räntan stiger?
Svar: Den sjunker, eftersom framtida kassaflöden diskonteras hårdare.

Fråga: Vad händer med nettoreserven om återförsäkrarens andel ökar?
Svar: Den minskar. Netto = brutto − återförsäkrares andel.

Fråga: Varför kan en utlandsklass ändras utan att affären har ändrats?
Svar: Valutaeffekt. Reserven räknas om till SEK, så en svagare krona gör beloppet större.

Fråga: Antagandena är oförändrade men premiereserven har rört sig. Vad kan ligga bakom?
Svar: Volymen (UPR, HHP, fordringar), räntekurvan eller valutakurserna.

Sant/falskt: Premiereserven är alltid lägre än UPR.
Svar: Falskt. HHP, annullation och en kostnadskvot över 100 % kan göra den högre.

Sant/falskt: Antagandeändringar förklarar normalt förändringen mellan Q1 och Q2.
Svar: Falskt. Antagandena uppdateras normalt bara vid årsskifte.

Flerval: Vilken förändring sänker premiereserven?
Alternativ: Högre UPR / Högre LR / Högre premiefordringar / Lägre ränta
Rätt: Högre premiefordringar

## Rörelseanalys

Begrepp: Rörelseanalys
Betyder: Förklaring av hur premiereserven förändrats mellan två kvartal, uppdelad på drivare som volym, antaganden, ränta och valuta.

Begrepp: TQ / LQ
Betyder: This Quarter och Last Quarter. Kvartalet som rapporteras och kvartalet det jämförs mot.

Begrepp: K04
Betyder: Nyckelkontrollen av premiereserven. Jämför TQ mot LQ per B-klass och kräver kommentarer till förändringarna.

Begrepp: Volymeffekt
Betyder: Den del av förändringen som beror på ändrade balansposter (UPR, HHP, fordringar).

Begrepp: Antagandeeffekt
Betyder: Den del av förändringen som beror på ändrade antaganden (LR, kostnader, annullation).

Begrepp: Ränteeffekt
Betyder: Den del av förändringen som beror på en ändrad diskonteringskurva.

Begrepp: Valutaeffekt
Betyder: Den del av förändringen som beror på ändrade växelkurser mot SEK.
