# Dauerhafte Wartungshistorie und Online-Austausch

Stand: 09.11.2026. Verbindliche Produktanforderung; Speicherung, Online-Service und kryptografische Prüfung sind noch nicht implementiert. Der Katalog und die UX-Vorschau allein erfüllen diese Laufzeit-Anforderung nicht.

## Protokoll auf der Steuerung

Jede bestätigte Wartung, jeder Austausch und jedes fristauslösende Steuerungsereignis wird dauerhaft auf der Steuerung gespeichert. Die Historie ist ausschließlich ergänzbar: keine Lösch- oder Überschreibfunktion für Benutzer oder Online-Service. Korrekturen werden als neue, auf den alten Eintrag verweisende Ereignisse ergänzt; das Original bleibt sichtbar. Softwareupdate, Neustart und normale Rücksetzung von Einstellungen dürfen die Historie nicht löschen.

Ein Eintrag enthält eindeutige Ereignis-ID, fortlaufende Nummer, Geräteinstanz, Tätigkeitskennung, tatsächliches Durchführungsdatum, Empfangsdatum, bestätigende Identität und Rolle, ausgeführte Arbeiten/Befund, betroffene Komponenten, Nachweisreferenzen, Katalogversion sowie vorherige und neue Fristanker. Persönliche Angaben, Geräteinstanzen und Nachweise bleiben im geschützten Fahrzeugdatensatz und gelangen niemals in dieses öffentliche Repository.

Erst nach dauerhaft bestätigter Speicherung auf der Steuerung gilt eine neue Frist als übernommen. Protokolleintrag und Friständerung werden atomar gespeichert. Bei Schreibfehler oder vollem Speicher keine erfolgreiche Rücksetzung anzeigen; alte Fristen behalten. Doppelte Ereignis-IDs dürfen keine weitere Rücksetzung erzeugen. Veraltete Ereignisse und Uhrzeitkonflikte dürfen Fristanker nicht still zurückdatieren. Benutzerbestätigungen können lokal/offline erfolgen, soweit die jeweilige Regel dies erlaubt.

Zusätzlich ist eine geschützte Online-Sicherung mit integritätsgesicherter Ereigniskette vorzusehen. Hashverkettung allein verhindert keine Löschung durch privilegierten Speicherzugriff; unabhängige signierte Prüfpunkte und Wiederherstellung sind erforderlich. Bei Steuerungstausch muss die gesamte Historie verifiziert übernommen werden. Manipulationsverdacht oder fehlende Historie führt zu Klärungsbedarf, niemals zu automatisch neu gestarteten Fristen. Absolute physische Unlöschbarkeit ist durch eine gewöhnliche lokale Datei nicht gegeben.

## Austausch ausschließlich durch Online-Service

Nur der authentifizierte und autorisierte Online-Service darf einen Austausch bestätigen. Die Steuerung akzeptiert ausschließlich serverseitig autorisierte, signierte und eindeutig der Geräteinstanz zugeordnete Austauschereignisse. Ein frei gesetztes Rollenfeld, ein lokaler Admin-Knopf oder normaler Gerätebetrieb genügen nicht. Ein Online-Auftrag bleibt ausstehend, bis die Steuerung Annahme und dauerhafte Speicherung bestätigt. Signatur, Ziel, Gültigkeit und Wiederholungsschutz prüfen; verlorene Übertragungen sind mit derselben Ereignis-ID wiederholbar.

Der Service wählt konkret aus, was tatsächlich ersetzt wurde, hinterlegt Durchführungsdatum und Nachweis und sieht vor Bestätigung alle betroffenen Fristen. Alle freigegebenen Wartungs- und Austauschfristen dieser ersetzten Komponenten starten ab dem tatsächlichen Austauschdatum neu. Andere Geräte und nicht ersetzte Unterkomponenten bleiben unverändert. Es gibt keinen pauschalen Reset der gesamten Fahrzeugwartung. Bei mehreren gleichartigen Geräten ist die Geräteinstanz entscheidend. Die alte Gerätegeneration bleibt in der Historie; der Ersatz eröffnet eine neue Komponentengeneration.

| Bestätigter Austausch | Fristen, die neu beginnen |
| --- | --- |
| Wasserpumpe vollständig | Zweijährige Vordruck-/Dichtheitswartung und 15-jährige Austauschfrist dieser Wasserpumpe |
| Heizung einschließlich kompletter Abgasanlage | 28-Tage-Betriebserinnerung als Erstanker der neuen Gerätegeneration, siebenjährige fachmännische Wartung, zweijährige Abgasprüfung und 15-jährige Gesamt-Austauschfrist |
| Kühlmittel-Umwälzpumpe | Siebenjährige Austauschfrist genau dieser Pumpe |
| Kraftstoff-Dosierpumpe | Siebenjährige Austauschfrist genau dieser Pumpe |

Der Austausch einer Heizung bestätigt keinen normalen Heizbetrieb. Die 28-Tage-Erinnerung erhält dabei lediglich den Einbauzeitpunkt als Erstanker; spätere Rücksetzungen erfolgen weiterhin ausschließlich durch bestätigten Normalbetrieb. Die beiden Pumpenfristen beginnen bei Heizungswechsel nur dann neu, wenn die Pumpen ausdrücklich als tatsächlich mit ersetzt dokumentiert sind. Eine normale Wartung setzt niemals die Austauschfrist zurück.

## UX und Abnahme

Die UX zeigt die unveränderliche Historie, Durchführungsdatum, Art der Bestätigung und nächste Fälligkeit. Benutzer können ausschließlich freigegebene Wartungen bestätigen; Austauschbestätigung ist nur im Online-Service verfügbar. Ausstehende Synchronisation und bereits auf der Steuerung bestätigte Übernahme sind unterscheidbar.

Vor Produktfreigabe prüfen: Stromverlust während Speicherung, Neustart/Update, voller Speicher, doppelte und verspätete Ereignisse, ungültige Signaturen, fremde Geräteinstanz, fehlende Online-Verbindung, Rollenkonflikte, Korrektur ohne Originalverlust und Wiederherstellung nach Steuerungstausch. Diese Abnahmen sind noch offen.
