# AquaStoich Änderungsprotokoll

[English](CHANGELOG.md) · [Русский](CHANGELOG.ru.md) · Deutsch · [Español](CHANGELOG.es.md)

## 1.1a — unveröffentlicht

Diese Version ist für Messwertanalyse und Kalenderprotokoll reserviert. Sie bleibt ein lokaler Test-Build und wurde noch nicht hochgeladen oder veröffentlicht.

- Balkendiagramm für Woche, Monat, drei Monate, sechs Monate, Jahr oder einen eigenen Datumsbereich hinzugefügt. Bis zu drei Monate bleibt jeder Kalendertag erhalten; fehlende Tage erscheinen als interpolierte Balken unter einer Trendhüllkurve.
- Minimum, Maximum, mittlere absolute Änderung zwischen aufeinanderfolgenden Messungen und größte Änderung im Zeitraum hinzugefügt. Die Auswahl einer Kennzahl markiert ihre Messungen in Diagrammbalken, Monaten, Tagen, verschachtelten Messwertlisten und Parameterdetails.
- Das Diagramm verwendet nun eine adaptive Werteskala, eine an den Balkenmitten ausgerichtete Hüllkurve und die verfügbare Breite ohne ungenutzten Leerraum.
- Zwei Messwerte lassen sich vergleichen: Linksklick wählt den ersten, Rechtsklick den zweiten. Die zugehörigen Karten erklären diese Bedienung direkt. Der erste Messwert darf nicht nach dem zweiten liegen und der zweite nicht vor dem ersten.
- Zugehörige Unterparameter und weitere erfasste Parameter stehen in anfangs geschlossenen Gruppen. Das Öffnen einer Gruppe öffnet nun gleichzeitig die entsprechende Gruppe für den ersten Messwert, den zweiten Messwert und die Differenz.
- Die aufgeklappten Vergleichsgruppen haben Spaltenüberschriften für Parameter und Wert beziehungsweise Änderung.
- Gewählter Zeitraum und Messort gelten nun auch für den Messverlauf und dessen Excel-Export.
- Die flache Verlaufsliste wurde durch einen klassischen Kalender mit quadratischem Tagesraster ersetzt. Lange Zeiträume beginnen mit Monatszellen; ein Klick auf einen Monat öffnet dessen Tagesraster, und die deutlich umrandete Zurück-Schaltfläche führt zur Zeitraumübersicht.
- Die Zellen der Monatsübersicht sind kompakt und werden nicht mehr über die gesamte Breite des Kalenderfelds gestreckt.
- Rechts neben dem Kalender steht ein kontextbezogenes Messwertfeld. Gruppen mit mehreren Messungen zeigen eine verschachtelte Liste, einzelne Messungen sofort ihre Parameter. Zeitmarken, Kalenderzellen und Diagrammbalken synchronisieren die Hervorhebung des ersten und zweiten Messwerts in beide Richtungen.
- Messparameter sind in beschrifteten Spalten für Parameter, Wert, Änderung, Änderungsart, Tagesrate und Zeiteinheit ausgerichtet. Der frühere Parametertypfilter wurde entfernt.
- Ressourcenladen und Fensteranzeige der gepackten Version wurden korrigiert, damit der eigenständige portable Build zuverlässig aus dem ASAR-Archiv startet.

## 1.0a — Testversion

Das Tag `1.0a` ist auf den letzten Build vor Einführung der Messdiagramme festgelegt. Enthalten sind Aquarienprofile, Volumenberechnung nach Geometrie, getrennte Messprotokolle, Lichtkanäle, Excel-Export, TDS-Ziele und -Protokoll, bearbeitbare Vorlagen sowie Dosierungs- und Remineralisierungsberechnung.
