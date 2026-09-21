# AquaStoich Änderungsprotokoll

[English](CHANGELOG.md) · [Русский](CHANGELOG.ru.md) · Deutsch · [Español](CHANGELOG.es.md)

## 1.1a — unveröffentlicht

Diese Version ist für Messwertanalyse und Kalenderprotokoll reserviert. Sie bleibt ein lokaler Test-Build und wurde noch nicht hochgeladen oder veröffentlicht.

- Balkendiagramm für Woche, Monat, drei Monate, sechs Monate, Jahr oder einen eigenen Datumsbereich hinzugefügt.
- Zwei Messwerte lassen sich vergleichen: Linksklick wählt den ersten, Rechtsklick den zweiten. Der erste Messwert darf nicht nach dem zweiten liegen und der zweite nicht vor dem ersten.
- Zugehörige Unterparameter und weitere erfasste Parameter stehen in anfangs geschlossenen Gruppen. Das Öffnen einer Gruppe öffnet nun gleichzeitig die entsprechende Gruppe für den ersten Messwert, den zweiten Messwert und die Differenz.
- Gewählter Zeitraum und Messort gelten nun auch für den Messverlauf und dessen Excel-Export.
- Die flache Verlaufsliste wurde durch einen Kalender in voller Breite mit darunterliegender Messwertliste ersetzt. Je nach Zeitraum verwendet er Monats-, Wochen- oder Tageszellen, zeigt beim Überfahren die Anzahl der Messungen und wechselt per Klick von Monat zu Woche und Tag; Dichteskalen wurden entfernt.
- Für mehrere Messungen an einem Tag stehen einzelne Zeitmarken bereit. Kalendermarken und Diagrammbalken synchronisieren die Hervorhebung des ersten und zweiten Messwerts in beide Richtungen.
- Messparameter sind in beschrifteten Spalten für Parameter, Wert, Änderung, Änderungsart, Tagesrate und Zeiteinheit ausgerichtet. Der frühere Parametertypfilter wurde entfernt.
- Ressourcenladen und Fensteranzeige der gepackten Version wurden korrigiert, damit der eigenständige portable Build zuverlässig aus dem ASAR-Archiv startet.

## 1.0a — Testversion

Das Tag `1.0a` ist auf den letzten Build vor Einführung der Messdiagramme festgelegt. Enthalten sind Aquarienprofile, Volumenberechnung nach Geometrie, getrennte Messprotokolle, Lichtkanäle, Excel-Export, TDS-Ziele und -Protokoll, bearbeitbare Vorlagen sowie Dosierungs- und Remineralisierungsberechnung.
