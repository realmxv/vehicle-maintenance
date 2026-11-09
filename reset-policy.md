# Rücksetzen von Wartungspunkten

Stand 09.11.2026. Bestätigte Produktregeln für Thermo Top Pro 50 LIN, 5 kW.

| Punkt | Typ | Frist | Rücksetzen |
| --- | --- | --- | --- |
| Regelmäßiger Heizbetrieb | information | 28 Tage | Nur controller, nach normal_heating_operation_confirmed |
| Fachmännische Kontrollarbeiten | service | 24 Kalendermonate | Nur volkner_service_online, mit Wartungsnachweis |

`user` bezeichnet die Benutzerbestätigung in UX, `controller` ein bestätigtes Geräteereignis und `volkner_service_online` euren authentifizierten Online-Service. Mehrere erlaubte Rollen sind im allgemeinen Format möglich, für diese zwei Webasto-Punkte ist jeweils ausschließlich die festgelegte Rolle zulässig. Ohne Rücksetzregel ist Rücksetzen standardmäßig gesperrt; insbesondere ist die Saisonprüfung noch nicht zugeordnet.

Die bestehenden IDs und Intervallfelder bleiben erhalten. `reset`, `type` und `equipmentId` ergänzen das bisherige Schema. Jede Geräteinstanz benötigt einen eigenen geschützten Zustand; ein Ereignis einer Heizung darf keine andere zurücksetzen.

## Steuerungsereignis

Nach bestätigtem normalem Heizbetrieb beginnt die Frist ab `eventTimestamp` erneut für 28 Tage. Ein Einschaltbefehl, Startversuch oder Fehlstart reicht nicht. Die genaue LIN-Zustandsfolge ist noch zu belegen, es wird keine Mindestlaufzeit erfunden. Handbetrieb zählt nur, wenn er nachweisbar erfasst wurde. Wiederholte oder ältere Ereignisse dürfen den letzten bestätigten Betrieb nicht zurückdatieren; Event-ID, Geräteinstanz, Zeitstempel und vertrauenswürdige Herkunft prüfen. Ohne Ausgangsdatum bleibt die Fälligkeit unbekannt, bis Inbetriebnahme oder bestätigter Betrieb vorliegt.

## Online-Service

Nur der angemeldete Volkner-Service darf nach tatsächlich ausgeführter Wartung einen geschützten Nachweis bestätigen. Neue Frist: `performedAt` plus 24 Kalendermonate, nicht Zeitpunkt des Online-Klicks. Nachweis enthält mindestens Geräteinstanz, Durchführungsdatum, Prüfer, Befund und erledigte Prüfpunkte. Berechtigung serverseitig prüfen; weder lokale Benutzerbestätigung noch Steuerungsereignis kann diese Wartung zurücksetzen. Meldung gelesen/ausgeblendet ist kein Wartungsnachweis.

Diese JSON-Regeln beschreiben das künftige Verhalten. Authentifizierung, Nachweisspeicher und LIN-Ereignisauswertung sind noch nicht implementiert. Ein Client-Rollenfeld allein ist kein Berechtigungsnachweis. Der aktuelle UX-Datumsrechner bleibt ausdrücklich eine ungespeicherte Vorschau.

## Verbindliche Volkner-Vorgaben vom 09.11.2026

- Abgasanlage einschließlich Schalldämpfer alle 24 Monate prüfen; Austausch nach Zustand.
- Heizgerät und komplette Abgasanlage einschließlich Schalldämpfer spätestens nach 180 Monaten ersetzen.
- Kühlmittel-Umwälzpumpe und Kraftstoff-Dosierpumpe jeweils spätestens nach 84 Monaten ersetzen.

Diese Fristen sind Volkner-Vorgaben, keine behaupteten Webasto-Hersteller-Austauschfristen. Alle vier Punkte dürfen nur durch Volkner-Service online mit Nachweis bestätigt werden. Austauschpunkte benötigen zusätzlich einen Austauschnachweis. Erste Frist ab Einbau/Inbetriebnahme, danach ab tatsächlicher Durchführung der jeweiligen Tätigkeit. Eine Prüfung setzt keine Austauschfrist zurück; Pumpentausch setzt keine Frist der übrigen Bauteile zurück. Ein Komplettwechsel darf Pumpenfristen nur dann neu starten, wenn auch die betreffenden Pumpen tatsächlich mit ersetzt und dokumentiert wurden. Fehlendes Einbaudatum bedeutet Klärungsbedarf, niemals Start der Frist am heutigen Tag. Die Abgasprüfung ersetzt keine noch offene Freigabe der zusätzlichen Aluminium-Abgasleitung. Defekte können einen früheren Austausch erfordern.
