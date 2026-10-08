# Startlek: Nyckelkontroller K01–K04

## Översikt

Begrepp: Nyckelkontroll
Betyder: En dokumenterad kontroll som ska visa att data och belopp i reservsättningen är korrekta och kompletta. Görs varje kvartal, kommenteras och signeras.

Begrepp: K01
Betyder: Stämmer av utbetalda skador i skadedatat mot det som är bokfört i huvudboken (E1).

Begrepp: K02
Betyder: Kontrollerar att reserverna som ligger bokade i huvudboken är desamma som räknades fram i bokslutet.

Begrepp: K03
Betyder: Kontrollerar att de bokförda reserverna följer reservanalysen (modellen): skadeprocent för innevarande skadeår och avveckling för tidigare skadeår.

Begrepp: K04
Betyder: Rimlighetskontroll av Solvens II-premiereserven: innevarande kvartal mot föregående per B-klass, med förklaring av förändringarna.

Begrepp: E1
Betyder: Huvudboken, ekonomisystemet där utbetalningar och reserver är bokförda.

Begrepp: Korrekt/Komplett
Betyder: Kontrollkategorin för K01–K03. Korrekt = beloppen stämmer. Komplett = inget saknas.

Begrepp: Sign-off
Betyder: Att den som utfört kontrollen signerar att varje avvikelse är utredd och kommenterad.

Begrepp: Avvikelse
Betyder: En skillnad som inte kan förklaras eller åtgärdas. Ska eskaleras och rapporteras, inte bara kommenteras.

Fråga: Vilken fråga svarar var och en av K01, K02 och K03 på?
Svar: K01: är indatat (utbetalt) rätt? K02: bokades det vi räknade fram? K03: följer det bokade den beslutade modellen?

Fråga: Varför bygger K03 på att K01 och K02 är gjorda?
Svar: Fel i utbetalningsdata eller i bokningen slår igenom i jämförelsen mot modellen. De måste vara uteslutna först.

Fråga: Vem utför nyckelkontrollerna och hur ofta?
Svar: Beräkningsansvarig reservsättning, kvartalsvis.

Fråga: Vad ska en bra kontrollkommentar innehålla?
Svar: Orsak, omfattning (belopp och period) och påverkan. Den ska säga varför, inte bara vad som ändrats.

Fråga: Vad gör du om du inte kan förklara en skillnad?
Svar: Skriver ärligt vad som är okänt och vem som kontaktats, och eskalerar. En gissning är ingen förklaring.

Sant/falskt: "Troligtvis timing" räcker som kommentar på en flaggad skillnad.
Svar: Falskt. Kommentaren ska vara belagd med belopp, period och orsak.

Flerval: Vilken kontroll gäller premiereserven?
Alternativ: K01 / K02 / K03 / K04
Rätt: K04

Ordning: Kontrollernas logiska kedja
1. K01 – utbetalt i skadedata stämmer med huvudboken
2. K02 – bokade reserver stämmer med bokslutsberäkningen
3. K03 – bokade reserver följer reservmodellen
4. K04 – premiereservens förändring kan förklaras

## K01 – utbetalt mot huvudboken

Begrepp: Syftet med K01
Betyder: Säkerställa att skadedatat som reservberäkningarna bygger på är korrekt och komplett, genom att jämföra utbetalt mot bokföringen.

Begrepp: IClass
Betyder: Produktklassen som K01 jämförs på, tillsammans med valuta.

Begrepp: YTD och senaste månad
Betyder: De två perspektiven i K01. YTD = utbetalt hittills i år. Senaste månad = bara sista månaden.

Begrepp: Gränsvärde i K01
Betyder: En skillnad flaggas om den är över 1 000 000 SEK (omräknat till lokal valuta) eller över 10 %, per produktklass eller för affären som helhet.

Begrepp: Matchade och omatchade rader
Betyder: Matchade = produktklass och valuta finns i både skadedata och huvudbok. Omatchade = finns bara i den ena källan.

Begrepp: Avvikelselogg
Betyder: Logg där alla skillnader som passerat gränsvärdet förs in, med åtgärd, prioritet, status och deadline.

Begrepp: Timingskillnad
Betyder: Utbetalning som hamnat i olika perioder i de två källorna. Syns i senaste månad men jämnar ut sig YTD eller vänder nästa period.

Begrepp: Klassningsskillnad
Betyder: Samma belopp ligger på olika produktklasser i de två källorna. Syns som två lika stora skillnader med motsatt tecken.

Fråga: Varför jämförs utbetalt just mot huvudboken?
Svar: Huvudboken är den officiella sanningen. Om skadedatat avviker bygger reserverna på fel underlag.

Fråga: På vilket datum jämförs utbetalningarna i K01?
Svar: Betalningsdatum, inte skadedatum.

Fråga: Vad betyder en positiv skillnad i K01?
Svar: Skadedatat visar mer utbetalt än huvudboken.

Fråga: Vad signalerar en omatchad rad?
Svar: Oftast ett mappningsproblem, inte nödvändigtvis ett beloppsfel. Ska alltid kontrolleras, oavsett belopp.

Fråga: Två produktklasser i samma land har +50 000 och −50 000 i skillnad. Vad är den troliga orsaken?
Svar: Klassningsskillnad. Nettot är noll, så totalen påverkas inte.

Fråga: Skillnaden finns bara i senaste månad och är nära noll YTD. Vad tyder det på?
Svar: Timing.

Fråga: Varför ska man summera skillnaderna per land själv?
Svar: Gränsvärdet gäller även affären som helhet. Många små skillnader åt samma håll kan tillsammans vara väsentliga.

Sant/falskt: En skillnad under gränsvärdet behöver aldrig tittas på.
Svar: Falskt. Omatchade rader kontrolleras alltid, och små skillnader kan summera till något väsentligt.

Flerval: Vad jämför K01?
Alternativ: Utbetalt mot huvudbok / Reserver mot huvudbok / Skadeprocent mot modell / Premiereserv mot förra kvartalet
Rätt: Utbetalt mot huvudbok

## K02 – bokade reserver mot bokslutet

Begrepp: Syftet med K02
Betyder: Minimera risken att reserverna lästs in fel i ekonomisystemet. Det som ligger bokat ska vara det som räknades fram.

Begrepp: Reservtyperna i K02
Betyder: Fem stycken: Case (RBNS), IBNR, RM, ULAE och ULAE RM.

Begrepp: Bokföringsfil
Betyder: Filen med reservförändringar som skickas från reservsättningen och läses in i huvudboken.

Begrepp: Gränsvärde i K02
Betyder: Finns inget. Varje skillnad ska kunna förklaras, utom avrundning på ±1.

Begrepp: Nyckelmismatch
Betyder: Samma belopp ligger på olika resultatställe, valuta eller år i de två källorna. Syns som två rader med lika belopp och motsatt tecken.

Begrepp: Framrullat saldo
Betyder: Gammalt saldo som ligger kvar i huvudboken på ett avvecklat skadeår trots att reserven är noll.

Fråga: På vilken nivå jämförs reserverna i K02?
Svar: Per bolag, resultatställe, produkt, skadeår och valuta.

Fråga: Vad betyder en positiv skillnad i K02?
Svar: Mer är bokat i huvudboken än vad bokslutsberäkningen säger. Obs: omvänt mot K01.

Fråga: Vilka reservtyper tittar du på först och varför?
Svar: Case och IBNR. De styrs direkt av bokföringsfilen, så noll skillnad där visar att inläsningen fungerar.

Fråga: Hur hänger RM ihop med Case och IBNR i bokslutsberäkningen?
Svar: RM är en fast procentsats av reserven (Case + IBNR).

Fråga: Hur hänger ULAE ihop med Case och IBNR i bokslutsberäkningen?
Svar: ULAE är en fast sats per produkt gånger reserven (Case + IBNR).

Fråga: Huvudboken visar samma saldo som förra månadens beräkning. Vad har troligen hänt?
Svar: Bokningen är inte gjord. Filen är inte inläst.

Fråga: Skillnaden är exakt dubbla den förväntade förändringen. Vad tyder det på?
Svar: Förändringen har bokats med fel tecken.

Fråga: Varför ska man leta efter motsvarande belopp med omvänt tecken innan man kallar något ett bokningsfel?
Svar: Det kan vara en nyckelmismatch: beloppet är rätt men ligger på fel resultatställe, valuta eller år.

Fråga: Vad gör du om felet inte kan åtgärdas?
Svar: Informerar aktuariefunktionen och rapporterar en avvikelse.

Sant/falskt: K02 har samma gränsvärde som K01.
Svar: Falskt. K02 har inget gränsvärde.

Sant/falskt: Om Case och IBNR stämmer men ULAE avviker systematiskt ligger felet troligen i inläsningen av filen.
Svar: Falskt. Inläsningen fungerar. Det pekar på hur ULAE beräknas eller bokas.

Flerval: Vilken skillnad behöver ingen kommentar i K02?
Alternativ: ±1 (avrundning) / Under 10 % / Under 1 MSEK / Ingen, allt kommenteras
Rätt: ±1 (avrundning)

## K03 – bokfört mot reservmodellen

Begrepp: Syftet med K03
Betyder: Säkerställa att reserverna som bokfördes vid kvartalsbokslutet följer reservanalysen som gjordes inför kvartalsskiftet.

Begrepp: Modell (i K03)
Betyder: Den senaste beslutade reservanalysen, den som godkändes på Challenge Meeting.

Begrepp: Bokfört (i K03)
Betyder: Det som faktiskt ligger i huvudboken efter bokslutet.

Begrepp: YTD-delen
Betyder: Jämför skadeprocent och skadekostnad (ultimo) för innevarande skadeår, modell mot bokfört.

Begrepp: Run-off-delen
Betyder: Jämför avvecklingsresultatet för tidigare skadeår, modell mot bokfört.

Begrepp: LR Diff
Betyder: Bokförd skadeprocent minus modellens skadeprocent.

Begrepp: LR Diff i SEK
Betyder: Skadeprocentskillnaden omräknad till kronor: bokförd premie × LR-skillnad × valutakurs.

Begrepp: AvE-justering
Betyder: Justering av ultimo utifrån faktiskt utfall mot förväntat sedan modellen togs fram. Ingår i det bokförda men inte i modellen.

Begrepp: Bokförd avveckling
Betyder: Reserv nu minus (reserv vid årsskiftet minus betalt i år), för tidigare skadeår. Positiv = reserven högre än väntat = avvecklingsförlust.

Begrepp: Modellavveckling
Betyder: Modellens ultimo vid årsskiftet jämfört med modellens senaste ultimo, för tidigare skadeår.

Fråga: Vilka tal är viktigast i YTD-delen?
Svar: Skillnaden i skadeprocent, samma skillnad i kronor och skillnaden i ultimo.

Fråga: Varför skiljer sig Paid, RBNS och IBNR ofta mycket mellan modell och bokfört utan att det är ett fel?
Svar: Modellen gäller analysdatumet, bokfört gäller bokslutsdatumet. Utbetalningar däremellan flyttar belopp från IBNR till Paid. Det är ultimo som ska stämma, inte fördelningen.

Fråga: Vad är den vanligaste förklaringen till att bokförd ultimo skiljer sig från modellens?
Svar: AvE-justeringen. Den ligger i det bokförda men inte i modellen.

Fråga: Hur bekräftar du att en ultimoskillnad beror på AvE?
Svar: Summera AvE-justeringen för produkten och skadeåret och se att den motsvarar skillnaden i ultimo.

Fråga: Ultimoskillnaden är större än AvE-justeringen. Vad kan resten vara?
Svar: Golvet att ultimo inte får understiga Paid + RBNS, en manuell rättelse eller ett bokningsfel (K02).

Fråga: Varför är skillnaden i intjänad premie nästan aldrig noll?
Svar: Modellen använder predikterad premie, det bokförda faktisk premie. Frågan är om skillnaden är rimlig.

Fråga: Vad betyder det om modellens och det bokförda avvecklingsresultatet är lika?
Svar: Att gamla skadeår har bokats enligt modellen. Ingen kommentar utöver det behövs.

Fråga: Varför visar gamla skadeår (2020 och äldre) alltid en skillnad när något rör sig?
Svar: Modellen har ingen avveckling för dem, så all bokförd rörelse syns som skillnad och måste förklaras separat.

Fråga: Vad måste du kontrollera innan du börjar analysera K03?
Svar: Att jämförelsen görs mot rätt modell, den som beslutades på senaste Challenge Meeting.

Sant/falskt: K03 har ett gränsvärde på 10 %.
Svar: Falskt. K03 har inget gränsvärde. Varje skillnad förklaras eller eskaleras.

Sant/falskt: En stor skillnad i IBNR mellan modell och bokfört är alltid ett fel.
Svar: Falskt. Fördelningen mellan Paid, RBNS och IBNR förskjuts över tid. Titta på ultimo.

Flerval: Vad jämför K03 för tidigare skadeår?
Alternativ: Skadeprocent / Avvecklingsresultat / Utbetalt mot huvudbok / Premiereserv
Rätt: Avvecklingsresultat

Flerval: Bokförd reserv för ett gammalt skadeår är högre än väntat. Vad är det?
Alternativ: Avvecklingsvinst / Avvecklingsförlust / AvE-justering / Timing
Rätt: Avvecklingsförlust

## K04 – premiereserven

Begrepp: Syftet med K04
Betyder: Kontrollera att premiereserven är rimlig och att varje väsentlig förändring mot föregående kvartal kan förklaras.

Begrepp: TQ / LQ
Betyder: This Quarter och Last Quarter. K04 jämför premiereserven TQ mot LQ per B-klass.

Begrepp: Fyraeffektsbryggan
Betyder: Uppdelning av förändringen i premiereserven i fyra effekter: volym, receivables, mix och parameter.

Begrepp: Volymeffekt
Betyder: Förändring som beror på att UPR + HHP har ändrats. Typiska orsaker: nyteckning, förnyelsesäsong, prishöjning, valuta.

Begrepp: Receivables-effekt
Betyder: Förändring som beror på ändrade premiefordringar (FEA + FEE). Speglar normalt volymeffekten.

Begrepp: Mixeffekt
Betyder: Förändring som beror på ändrad andel UPR mot HHP. Oftast liten och räknas som restpost.

Begrepp: Parametereffekt
Betyder: Förändring som beror på ändrade antaganden (skadeprocent, kostnader, annullation, återförsäkring). Den enda effekten som kräver aktuariell motivering.

Fråga: Vilka frågor ska du kunna svara på om en B-klass i K04?
Svar: Varför ändras UPR? Vad händer i underliggande risk? Varför ändras Best Estimate totalt? Vad driver HHP?

Fråga: Hur väljer du vilka B-klasser som ska kommenteras utförligt?
Svar: Sortera på förändring i Best Estimate, både i belopp och procent, och ta dem som sticker ut åt båda håll.

Fråga: Alla delar av kassaflödet rör sig ungefär lika mycket och antagandena är oförändrade. Vad är det?
Svar: Volym. Förklara med affärshändelsen bakom.

Fråga: En del av kassaflödet sticker ut och ett antagande har ändrats. Vad är det?
Svar: Parameterdriven förändring. Ange vilket antagande, hur mycket och varför.

Fråga: Fordringarna har inte rört sig i takt med volymen. Vad kan det bero på?
Svar: Ändrad betalningsfrekvens eller betalningsvillkor, eller ett systembyte.

Fråga: En utlandsklass har alla belopp skalade lika mycket. Vad är det?
Svar: Valutaeffekt.

Fråga: Stor procentuell förändring men litet belopp. Hur kommenterar du?
Svar: Proportionerligt. Små portföljer är slumpkänsliga.

Fråga: När behöver nettoreserven en egen kommentar?
Svar: När den rör sig annorlunda än brutto, dvs. när återförsäkringsvillkoren har ändrats.

Fråga: Varför spelar ordningen i en stegvis brygga roll?
Svar: Effekterna samverkar, så den som räknas först får en annan del av samspelet. Ange vilken ordning som använts.

Sant/falskt: En bra K04-kommentar beskriver vad som har ändrats.
Svar: Falskt. Den ska förklara varför, med konkret orsak och belopp.

Sant/falskt: Det är bättre att tvinga ihop bryggan än att lämna en oförklarad rest.
Svar: Falskt. Erkänn den oförklarade resten.

Flerval: Vilken effekt kräver aktuariell motivering?
Alternativ: Volym / Receivables / Mix / Parameter
Rätt: Parameter

Ordning: Analys av en B-klass i K04
1. Se hur mycket Best Estimate ändrats i belopp och procent
2. Bryt ner förändringen i UPR, HHP och fordringar
3. Kontrollera om något antagande har ändrats
4. Dela upp i volym, receivables, mix och parameter
5. Ta reda på affärshändelsen bakom
6. Skriv kommentaren med orsak, belopp och eventuell oförklarad rest
