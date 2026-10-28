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
unten rechts einen Ausfüllgriff. Diesen innerhalb derselben Personenzeile
auf den letzten gewünschten Tag ziehen. Freie Arbeitstage werden ausgefüllt,
arbeitsfreie Tage übersprungen. Andere Belegungen brechen den gesamten Vorgang
ab; nichts wird überschrieben. Rückwärtsziehen füllt frühere Tage ebenfalls aus.
Bestehende gleiche Ganztagszuweisungen werden nicht dupliziert. Zellkommentare
bleiben an ihrem ursprünglichen Tag. Genehmigter Urlaub ist nicht ziehbar.

Den Einsatz selbst ziehen verschiebt ihn über den bestehenden Prüfdialog;
der kleine Griff kopiert auf weitere Tage. Rückgängig nimmt die komplette
Ausfüllaktion zurück. Im Fileserverbetrieb anschließend gemeinsam speichern.
Desktop verwendet natives Drag-and-drop, Touch/Stift den Pointer-Fallback.
