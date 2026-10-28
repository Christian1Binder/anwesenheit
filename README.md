# Teamplan / Anwesenheit

Vollständig lokale Personalplanung als einzelne HTML-Datei, für Edge unter Windows.
Keine Installation, kein Webserver, keine externen Bibliotheken erforderlich.

## Bedienung

App herunterladen und in Edge öffnen. Neue Zuweisungen und Urlaub gelten für ganze
individuelle Arbeitstage. Vorhandene Teilbuchungen bleiben unverändert nachvollziehbar
und sind mit * markiert. Bearbeiten einer regulären Altbuchung stellt diese auf ganze
Tage um; genehmigter Urlaub bleibt an den Antragsablauf gebunden.

Vorhaben erhalten ein eigenes eindeutiges Kürzel (bis 6 Zeichen), Farbe und eigene
Art (Übung, Ausbildung usw.). „Auswirkung auf Verfügbarkeit“ unterscheidet Arbeit,
Abwesenheit und Abgabe. Bestehende Kürzel lassen sich im Vorhabendialog ändern.
Ohne Kürzel erscheinen vorläufig die ersten vier Buchstaben des Namens.

Personal besitzt eine frei eingebbare Anrede (auch Dienstgrad). Im CSV-Import ist
„Anrede“ eine optionale zusätzliche Kopfspalte. Keine automatische Anredezuordnung.

„Filter ▾“ oder der Personenspaltenkopf öffnet Mehrfachwahl für Teams, Anreden und
Vorhabenarten sowie Namenssortierung. Suche und direkte Filter gelten zusätzlich.
„Zurücksetzen“ entfernt alle Filter; Ausdrucke übernehmen die Personenauswahl.

Klick wählt Zellen aus, Pfeile navigieren, Doppelklick/Enter öffnet die Zuweisung.
Rechtsklick/Umschalt+F2 öffnet den Zellkommentar. Violette Ecke = Kommentar.
Kommentare erscheinen vollständig mit Name und Datum unter dem Ausdruck.

Monatszeilen bleiben kompakt (19 Pixel). „Besprechungsmodus“ blendet Bedienung aus.
Der schmale zweizeilige Kopfbereich trennt Navigation von Werkzeugen.
„Daten speichern“ exportiert lokal JSON; unter Verwalten → Export & Drucken wieder
öffnen. Nutzdaten außerhalb des Repository-Ordners aufbewahren.

## Datenschutz und Dateiserver

Das Repository enthält ausschließlich Programmcode und fiktive Beispiele.
Die App überträgt keine Planungsdaten. Es gibt keine Cloud-Synchronisierung,
Telemetrie, Upload-Funktion, externen Schriften oder externen Bibliotheken.
Eine Content-Security-Policy blockiert Netzwerkverbindungen (`connect-src 'none'`).
Wie bei GeoPlan werden Arbeitsstände im lokalen Browser und in lokalen Dateien
gehalten. Hier werden zusätzlich sämtliche App-Netzwerkzugriffe unterbunden.

**Nutzdaten niemals in Git ablegen.** Dazu zählen Personen, Projekte, Anträge,
Notizen, Exporte und Sicherungen. Einen separaten lokalen/Fileserver-Datenordner
verwenden. Die `.gitignore` erlaubt nur ausdrücklich benannte Codedateien.
Das schützt nicht vor bewusstem `git add -f` oder manuellem Upload.
HTML-Export mit eingebetteten Nutzdaten wurde durch separate JSON-Sicherung ersetzt.
Die Repository-HTML enthält ausschließlich leere Demo-Startdaten; fiktive Personen
werden beim ersten Start im Browser erzeugt.

Für gemeinsame Nutzung: Ordner verbinden, gemäß Weisung Rolle wählen, Bearbeitung
übernehmen, Änderungen gemeinsam speichern und Bearbeitung beenden. Urlaubsanträge
liegen in separaten lokalen Dateien. Die App ersetzt keine Dateiserverrechte und
verwendet keine atomare SMB-Sperre. Die ausführliche Anleitung steht unter Hilfe.
Browser-Speicher allein ist keine dauerhafte Datensicherung.

## Entwicklung und Prüfung

CSS, JavaScript und Anpassungsbeispiele stehen kommentiert in `index.html`.
Keine Build-Werkzeuge oder npm-Abhängigkeiten notwendig.

```sh
node test_start.cjs
node test_import.cjs
node test_shared.cjs
```

Tests verwenden ausschließlich synthetische Daten. Sie prüfen Berechnungen,
Halbtage, Schnellzuweisungen, Notizen, Import, Genehmigungen und Fehlerpfade bei
simulierter Datei-I/O. Kein Ersatz für einen Edge-/SMB-Test vor Ort.

## Logo

`teamplan-logo.svg` ist das skalierbare Original: Personenpunkte und Planungsbalken
in Türkis. Kopfbereich und Browser-Tab verwenden dasselbe direkt eingebettete SVG.
Die HTML-Datei bleibt damit ohne weitere Dateien offline nutzbar.

## Ziehen und Ausfüllen

Vorhaben aus der Palette auf einen Tag ziehen: direkte Ganztagszuweisung,
mit Konfliktprüfung. In Woche/Monat besitzen eindeutige ganztägige Einsätze
unten rechts einen Ausfüllgriff. Diesen bis zur gewünschten Zielzelle ziehen – auch nach unten über mehrere Personen. Alle ausgewählten freien Zellen werden ausgefüllt, auch an arbeitsfreien Tagen. Andere Belegungen brechen den gesamten Vorgang
ab; nichts wird überschrieben. Rückwärtsziehen füllt frühere Tage ebenfalls aus.
Bestehende gleiche Ganztagszuweisungen werden nicht dupliziert. Zellkommentare
bleiben an ihrem ursprünglichen Tag. Genehmigter Urlaub ist nicht ziehbar.

Den Einsatz selbst ziehen verschiebt ihn über den bestehenden Prüfdialog;
der kleine Griff kopiert auf weitere Tage. Rückgängig nimmt die komplette
Ausfüllaktion zurück. Im Fileserverbetrieb anschließend gemeinsam speichern.
Desktop verwendet natives Drag-and-drop, Touch/Stift den Pointer-Fallback.

## Anrede im gesamten Datenfluss

Einfache und erweiterte CSV-Vorlage sowie `beispiel_personal.csv` enthalten die
Spalte Anrede. Vorschau zeigt Anrede getrennt vom Namen. Eine Vorgabe ist möglich,
wenn die Anrede-Spalte fehlt. Explizit leere Anreden bleiben leer. Ohne Kopfzeile
gilt weiterhin Name;Team;Wochenstunden;Beginn. Anreden werden nicht geraten.
Anrede/Dienstgrad: bis 40 Zeichen, keine Zeilenumbrüche.

Personenanzeigen, Auswahl, Suche, Vorhabenbesetzung, Kommentare und Druckberichte
verwenden Anrede und Name. Alle drei CSV-Exporte führen Anrede als eigene Spalte.
JSON und Fileserver behalten das Feld. Neue Urlaubsanträge speichern die Anrede
zusätzlich als historischen Stand; bestehende Anträge werden nicht umgeschrieben.

## Regel für künftige Datenmodelländerungen

Neue Personen- oder Vorhabenfelder immer vollständig durchziehen: Erfassung,
Importparser, beide Vorlagen, Beispieldateien, Importvorschau, Such-/Filterfelder,
Auswahl und Detailanzeigen, Berichte/Druck, CSV/JSON, gemeinsamer Dateistand und
Antragssnapshots. Bestehende Daten kompatibel halten. Tests müssen mindestens
Vorlage → Import → Anzeige → Export prüfen; ein reiner Parser-Test genügt nicht.

## Excel-Tastatur und Ausfüllen über mehrere Personen

Zelle anklicken und einen Anfangsbuchstaben des Vorhabennamens oder Kürzels tippen.
Eindeutige Treffer werden direkt zugewiesen; bei mehreren Treffern erscheint eine
Auswahl. Ein belegtes Ziel wird nicht überschrieben. Nur ganze Arbeitstage.

Strg+C/Strg+V (Mac: ⌘C/⌘V) oder die Schaltflächen kopieren eine eindeutig belegte
Zelle auf eine andere. Die Kopie gilt nur innerhalb dieser App-Sitzung und dieses
Plans. Keine Systemzwischenablage, keine Übertragung ins Internet. Kommentare,
Notizen und Genehmigungen werden nicht mitkopiert. Am Ziel gilt dessen eigene
Tagesarbeitszeit. Andere Belegungen blockieren das Einfügen.

Der Griff unten rechts lässt sich horizontal, vertikal oder diagonal ziehen.
Er füllt das Rechteck zwischen Quell- und Zielzelle für die sichtbaren Personen
in aktueller Sortierung. Ausgefilterte Personen bleiben unverändert. Auch arbeitsfreie
Tage werden eingeplant, gleiche Vorhaben nicht dupliziert. Ein Konflikt bricht
den gesamten Vorgang ab. Rückgängig nimmt die komplette Aktion zurück.

### Feierabend und Wochenendarbeit

- **Regelmäßig:** Person bearbeiten → Individuelle Arbeitswoche. Für jeden Wochentag einschließlich Samstag und Sonntag Beginn und Feierabend einstellen. Die Stunden werden aus der Differenz berechnet; alternativ Stunden eingeben. 0 Stunden bedeutet arbeitsfrei.
- **Nur an einem Datum:** Tageszelle doppelklicken → **Arbeitszeit / Feierabend** → Arbeitstag wählen, Beginn und Feierabend speichern. Das gilt nur für diese Person und dieses Datum. Anschließend das Vorhaben per Buchstabe, Drag & Drop oder Einfügen zuweisen. Mit „Wochenmodell verwenden“ die Ausnahme zurücksetzen.
- **Übersicht:** Die Arbeitszeit steht im Zelltooltip, nach Auswahl unter der Tafel und im Tagesdialog. So bleiben die Monatszeilen kompakt. Export & Drucken → **Excel-CSV · Arbeitszeiten / Feierabend je Tag** enthält auch ungebundene und arbeitsfreie Tage des gefilterten Zeitraums.
- Kopieren übernimmt weiterhin nur das Vorhaben. Jede Zielperson behält ihre eigenen Tageszeiten. Beim Ausfüllen werden auch Wochenenden und arbeitsfreie Tage eingeplant; fehlende Tageszeiten werden automatisch vorläufig ergänzt.
- Ganztagseinsätze passen sich an die Tageszeit an. Gebuchte Tage lassen sich nicht einfach arbeitsfrei schalten. Datumsänderungen mit genehmigtem Urlaub sind gesperrt. Änderungen sind rückgängig machbar.
- **Import:** Die ausführliche CSV-Vorlage enthält jetzt `Mo_Feierabend` bis `So_Feierabend`. Beginn plus Endzeit ersetzt die Stundenangabe; wenn beides angegeben ist, muss es übereinstimmen. Alte Importdateien bleiben nutzbar.
- Beginn bis Feierabend zählt vollständig als Arbeitszeit, **ohne automatischen Pausenabzug**. Übernacht-Einsätze sind nicht enthalten; `24:00` ist als Tagesende möglich. Änderungen am regelmäßigen Wochenmodell wirken wie bisher auch auf vergangene Tage; für Einzeländerungen deshalb den Tagesdialog verwenden.

**Code anpassen:** `workOnDay(person,datum)` ist die gemeinsame Quelle für Planung, Urlaub, Ausfüllen und Auswertungen. Beispiel einer lokalen Datums-Ausnahme: `person.daySchedule = {'2026-10-31': {start:'09:00', hours:5}}`. `null` steht für explizit arbeitsfrei; ohne Schlüssel gilt `schedule`. Endzeiten werden daraus abgeleitet, nicht doppelt gespeichert. Änderungen in der Oberfläche laufen über `commit()` und `setDayTime()`, damit Validierung und Rückgängig greifen. JSON-Sicherungen und gemeinsame Dateien enthalten die Ausnahmen; personenbezogene Daten bleiben lokal.

### Vorhandenes Personal bearbeiten

**Verwalten → Personal bearbeiten** öffnet die vollständige, durchsuchbare Personalliste. Die Suche berücksichtigt Namen, Anrede und Team; Filter der Personaltafel blenden hier niemanden aus. Alternativ auf der Personaltafel oder im Bericht den Namen anklicken und **Person bearbeiten** wählen.

Im Formular lassen sich Anrede, Name, Team, Arbeitsbeginn, Stunden und Feierabend für Mo–So ändern. Speichern aktualisiert die Person unter derselben ID: Vorhaben, Kommentare, Tagesausnahmen und Anträge bleiben zugeordnet. Die Änderung erscheint in Ansichten, Filtern, CSV und JSON und lässt sich rückgängig machen. Historische Antragssnapshots bleiben als Nachweis unverändert. Ein Wochenmodell darf gebuchte Einsätze nicht durch arbeitsfreie Tage verschwinden lassen oder genehmigten Urlaub verändern. Einzelne abweichende Arbeitszeiten weiterhin über den Tagesdialog erfassen.

Im gemeinsamen Betrieb zuerst als Planer die Bearbeitung übernehmen und anschließend gemeinsam speichern. Lokal den aktualisierten Datenstand als JSON sichern. Die Personalliste verwendet die vorhandenen Bearbeitungsrechte und Sperren; Nutzdaten werden nicht in den HTML-Code geschrieben.

### Überstunden planen

Tageszelle doppelklicken → **Arbeitszeit / Überstunden**. Beispiel: Beginn 08:00, Feierabend 18:00, **Sollstunden 8**. Nach Zuweisung eines Vorhabens entstehen **2 geplante Überstunden**. An einem regulär freien Samstag oder Sonntag mit Soll 0 zählt die gesamte zugewiesene Arbeit als Mehrarbeit. Regelmäßige Samstagsarbeit mit einem normalen Soll erzeugt dagegen nicht automatisch Überstunden.

Die Sollstunden sind getrennt vom planbaren Zeitfenster. Ein längeres Fenster allein erzeugt noch keine Überstunden: Ein Vorhaben muss zugewiesen sein. Die Monatszelle kennzeichnet Mehrarbeit mit **⁺**; Tooltip, Personendetails, Gesamtzeile der Tafel, Besprechungsbericht und Druckzusammenfassung nennen die Stunden. Besprechungs-CSV und Arbeitszeiten-CSV enthalten Soll, planbare Stunden und geplante Überstunden. Der Tages-Einsatzexport unterscheidet Soll und Planfenster.

- Überlappungen bleiben Konflikte. Solche Tage werden bis zur Klärung nicht in die Mehrstundensumme aufgenommen.
- Abwesenheiten und zeitweise Abgaben erzeugen keine Überstunden. Ganztägige Urlaubsanträge verbrauchen höchstens die Sollstunden; das zusätzliche Überstundenfenster wird bei ganztägigem Urlaub nicht als freie Kapazität angeboten.
- Kopieren, Buchstabeneingabe und Ausfüllen verwenden die Zeiten der Zielperson. Soll und Überstundenfenster werden nicht versehentlich mitkopiert.
- Bestehende Tagesausnahmen ohne getrenntes Soll behalten aus Kompatibilitätsgründen ihre bisherige Stundenbasis. Beim Bearbeiten das Soll gezielt auf die gewünschte reguläre Tageszeit setzen. Bereits gespeicherte Daten werden nicht rückwirkend pauschal als Überstunden umgedeutet.
- Die Personalimport-Vorlagen definieren weiterhin das reguläre Wochenmodell; datierte Mehrarbeit wird im Tagesdialog erfasst. JSON-Sicherung und gemeinsamer Datenstand enthalten die getrennten Sollstunden. Rückgängig und bestehende Bearbeitungssperren bleiben wirksam.

Dies sind **geplante Mehrstunden je Tag**, kein Nachweis tatsächlich geleisteter Arbeit und kein fortlaufendes Zeitkonto mit Anfangssaldo, Übertrag oder Freizeitausgleich. Pausen werden weiterhin nicht automatisch abgezogen.

Für Anpassungen im Code: `daySchedule[datum] = {start:'08:00', hours:10, targetHours:8}`. `targetOnDay()` liest das Soll, `workOnDay()` das Zeitfenster, `dayStats()` berechnet `overtime` aus konfliktfreien Vorhabenstunden über Soll. `summarize()` summiert diese Tageswerte; kürzere Tage verrechnen die Mehrstunden anderer Tage nicht stillschweigend.

### Direkt einplanen, Zeiten danach anpassen

Ein Vorhaben kann sofort auf jeden freien Kalendertag gesetzt werden: per Anfangsbuchstabe, Palette/Drag & Drop, Tagesdialog, Mehrfachzuweisung, Ausfüllgriff oder Copy & Paste. Eine vorherige Einrichtung des Wochenendtages ist nicht mehr erforderlich. Beim Ausfüllen zählen sämtliche Tage im Rechteck; bei Serien gelten die angehakten Wochentage.

Existiert keine Tagesarbeitszeit, übernimmt die App **Beginn und Dauer des ersten regulären Arbeitstags der Person in der Reihenfolge Mo–So** (ersatzweise 08:00–16:00). Das Soll des bisher freien Tages bleibt 0. So erzeugt z. B. ein zusätzlicher Samstag mit 8 Stunden Vorhabeneinsatz automatisch 8 geplante Mehrstunden. An normalen Tagen bleibt das bestehende Soll erhalten; ein zusätzlicher regulärer Tag erzeugt nicht künstlich weitere Stunden. Abwesenheiten und Abgaben ergeben weiterhin keine Mehrarbeit.

Automatisch ergänzte Zeiten heißen im Zelltooltip und bei der Auswahl **„Zeit vorläufig“** und im Arbeitszeitenexport **„Vorläufig automatisch“**. Nachträglich Zelle doppelklicken → Arbeitszeit / Überstunden → Beginn oder Feierabend ändern. Sollstunden bleiben getrennt. Speichern macht die Zeiten zu einer bewussten Tagesausnahme; eine Pflicht zur Zeitbestätigung gibt es nicht. Alle Auswertungen rechnen sofort mit dem jeweiligen Planstand.

Beim Entfernen der letzten Zuweisung verschwindet auch eine unbestätigte automatisch erzeugte Tageszeit. Manuell eingestellte Tageszeiten bleiben erhalten. Rückgängig stellt Zuweisung und Tageszeit gemeinsam wieder her. Bestehende Belegungen, genehmigter Urlaub und Bearbeitungsrechte bleiben geschützt. Alte Serien ohne die neue Automatik werden nicht beim Öffnen um zusätzliche Wochenendtage erweitert.

Code: Neue Ganztagseinsätze tragen `autoDay: true`. `assignmentWork()` stellt bereits für die Vorschau die gleiche Tageszeit bereit wie `prepareAssignmentDays()` beim Speichern über `commit()`. Automatische Tagesausnahmen speichern `automatic: true`, Soll 0 und ggf. `previousOff`, um ein zuvor ausdrücklich arbeitsfreies Datum nach Löschen wiederherzustellen. Beim manuellen Bearbeiten entfällt die Automatikmarkierung.
