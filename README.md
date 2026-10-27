# Teamplan / Anwesenheit

Vollständig lokale Personalplanung als einzelne HTML-Datei, für Edge unter Windows.
Keine Installation, kein Webserver, keine externen Bibliotheken erforderlich.

## Start

1. `index.html` herunterladen und lokal in Edge öffnen.
2. Die Beispieldaten sind ausschließlich fiktiv. Mit „Eigene Planung starten“ leeren.
3. Unter „Verwalten“ Personal erfassen oder CSV/Excel-Zellen importieren.
4. Mit „+ Vorhaben“ Vorhaben anlegen. Person/Tag doppelt anklicken und ganzen Tag,
   erste oder zweite Arbeitshälfte zuweisen. Mehrere Tage/Personen und genaue
   Uhrzeiten sind über „+ Zuweisung“ möglich.
5. Person/Tag auswählen, dann „Kommentar“, Rechtsklick oder Umschalt+F2 verwenden.
6. „Daten speichern“ lädt eine JSON-Datei herunter. Außerhalb des Repo-Ordners
   aufbewahren. Wieder öffnen: Verwalten → Export & Drucken → JSON-Sicherung öffnen.

## Kompakte Darstellung

Start: Monatsansicht, 19 Pixel je Personenzeile. 30 Personen benötigen etwa 570
Pixel zuzüglich Kopfbereich. Je nach Bildschirmhöhe/Zoom ist Scrollen nötig.
„Besprechungsmodus“ blendet Bedienbereiche aus. „Normale Zeilen“ vergrößert die
Darstellung. Name und Datum bleiben beim Scrollen fixiert.

Links/rechts im Tagesfeld stehen die beiden Hälften der individuellen Arbeitszeit.
V01 usw. entsprechen der Vorhabenlegende. Ein durchgehendes Feld bedeutet volle
Belegung beider Hälften; ein Punkt teilweise Belegung, … mehrere Vorhaben.
Prozentplanung ist zeitlich flexibel und wird rechnerisch auf beide Hälften verteilt.
Schwarz = abgegeben, Schraffur = Abwesenheit, roter Rand = Konflikt.
Kommentare sind je Person und Tag gespeichert, unabhängig von der Zuweisung.
Eine violette Ecke markiert die Zelle, der Text erscheint beim Darüberfahren.
Einfacher Klick wählt eine Zelle, Pfeiltasten bewegen die Auswahl, Doppelklick/Enter
öffnet die Zuweisung. Rechtsklick/Umschalt+F2 öffnet den Kommentar.
Kommentare stehen beim Ausdruck mit Name und Datum vollständig unter dem Plan.
Alte allgemeine Tageshinweise bleiben erhalten; es erfolgt keine automatische
Zuordnung dieser Hinweise zu Mitarbeitern.

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
