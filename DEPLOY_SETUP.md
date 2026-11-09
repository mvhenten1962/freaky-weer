# Freaky Weer – SiteGround automatische publicatie

## Status
- Repository: `mvhenten1962/freaky-weer`
- Doelwebsite: `mmsweerrapport.com`
- Workflow: `.github/workflows/deploy.yml`
- Bij iedere wijziging aan `main`: controle van bestanden, animaties, JavaScript en PWA.
- **Publicatie staat standaard UIT** tot de SiteGround-verbinding is ingesteld en de repositoryvariabele `SITEGROUND_DEPLOY_READY=true` is gezet.
- Handmatige proefpublicatie kan daarna via GitHub → Actions → Check and publish Freaky Weer → Run workflow.

## Eenmalige beveiligde koppeling

In SiteGround, voor **mmsweerrapport.com**: Site Tools → Devs → SSH Keys Manager. Gebruik een eigen SSH-sleutel voor deze publicatie. SiteGround gebruikt doorgaans SSH-poort **18765**.

In GitHub: Freaky Weer → Settings → Secrets and variables → Actions → **Repository secrets**. Voeg toe:

| Secret | Betekenis |
| --- | --- |
| `SITEGROUND_HOST` | Hostnaam van de SSH-server uit SiteGround SSH Credentials |
| `SITEGROUND_USER` | SSH-gebruikersnaam uit SiteGround SSH Credentials |
| `SITEGROUND_TARGET` | Het **gecontroleerde absolute pad** naar de map van alleen deze website, eindigend op `/mmsweerrapport.com/public_html` |
| `SITEGROUND_SSH_KEY` | Private sleutel van een aparte, niet-interactief bruikbare deploy-sleutel |
| `SITEGROUND_KNOWN_HOSTS` | Gecontroleerde SSH-hostsleutelregel voor de SSH-server op poort 18765, bijvoorbeeld in OpenSSH `known_hosts`-formaat met `[host]:18765` |

**Veiligheid:** Zet nooit private sleutels, wachtwoorden of host-verbindingsgegevens in een publiek GitHub-bestand, een commit of een chatbericht. Maak de sleutel bij voorkeur afzonderlijk voor Freaky Weer. SSH-hostsleutels moeten onafhankelijk worden gecontroleerd, niet blind geaccepteerd.

Een SiteGround-sleutel met passphrase is niet zonder meer geschikt voor de huidige niet-interactieve workflow. Gebruik een speciaal voor dit doel ingestelde sleutel die geen interactieve invoer vraagt, en bewaar de private sleutel uitsluitend als GitHub secret. SiteGround meldt dat SSH-sleutels toegang tot de hele websitebestandsruimte kunnen geven; behandel deze daarom als gevoelige servertoegang.

## Ingebruikname
1. Stel alle vijf secrets in.
2. Controleer of `SITEGROUND_TARGET` echt bij `mmsweerrapport.com` hoort.
3. Ga naar GitHub → Actions → Check and publish Freaky Weer → Run workflow. De workflow controleert eerst de site, valideert de doelmap, synchroniseert zonder bestanden op de server te verwijderen en controleert de openbare homepage.
4. Controleer vervolgens met de browser de onderdelen Actueel, 24 uur, 5 dagen, Verkeersweer, Motorweer, Marsie-animaties en installatie als webapp.
5. Zet **pas na een geslaagde proefpublicatie** onder Settings → Secrets and variables → Actions → Variables de repositoryvariabele `SITEGROUND_DEPLOY_READY` op `true`. Voortaan publiceert een wijziging op `main` automatisch na de controles.

## Grenzen
- Er worden **geen** bestanden van andere websites of de afzonderlijke Maassluis-cockpit gepubliceerd.
- De synchronisatie gebruikt bewust **geen** `--delete` totdat live is gecontroleerd dat alleen projectbestanden in de juiste doelmap staan.
- Weerbronnen, verkeerskoppeling, DNS/SSL en Android/iOS-installatie vereisen afzonderlijke praktijktests.
- Geen garantie van productiegeschiktheid van openbare OSRM/Nominatim-demodiensten.
