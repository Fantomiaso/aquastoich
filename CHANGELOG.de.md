# AquaStoich Änderungsprotokoll

[English](CHANGELOG.md) · [Русский](CHANGELOG.ru.md) · Deutsch · [Español](CHANGELOG.es.md)

## 0.1.3a — Testversion

Diese Version verbindet Wasserwechselberechnungen mit dem Messprotokoll und verbessert die lokalisierte Zahleneingabe.

- Im Wasserwechselmodus gibt es einen vertikalen Schalter für die Protokollquelle. Der letzte passende Messwert des gewählten Aquariums wird erst nach **Werte laden** übernommen; der alternative Modus speichert die aktuellen Aquarienfelder beim Klick auf **Dosierungen berechnen** als tatsächlichen Messwert vor dem Wasserwechsel.
- Oben im Ergebnisbereich wurde **Berechnung zum Protokoll hinzufügen** ergänzt. Damit werden die geschätzten Werte nach dem Wasserwechsel getrennt von Messwerten gespeichert.
- Berechnete Protokolleinträge haben nun eine eigene Farbe und die Kennzeichnung **Berechnet** in Kalender, Diagramm, Auswahllisten, Verlauf und Vergleichskarten.
- Zahlenfelder akzeptieren Punkt und Komma, zeigen sofort das Dezimaltrennzeichen der gewählten Anwendungssprache und behandeln die Dezimaltaste des Ziffernblocks unabhängig von der Tastaturlokalisierung als Trennzeichen.
- Der Textkontrast der Ziel- und Verhältnisbereiche im dunklen Design wurde erhöht.
- Derselbe Rechner wurde als statische [GitHub-Pages-Web-App](https://fantomiaso.github.io/aquastoich/) veröffentlicht. Registrierung und Anmeldung sind nicht nötig; die Anwendung hat kein Backend, keine Cloud-Datenbank, Analyse, Werbung, Telemetrie oder Übertragung von Benutzerdaten.
- Vollständige JSON-Sicherung und Wiederherstellung für Aquarienprofile, Protokolle, eigene Stoffe, Vorlagen, Einstellungen, Sprache und Design wurden ergänzt. Die Web-App fordert zudem dauerhaften Browserspeicher an; für einen anderen Browser oder nach manuellem Löschen der Websitedaten bleibt eine Sicherungsdatei erforderlich.
- Eine strenge Content Security Policy blockiert programmatische ausgehende Datenverbindungen. Externe Quellen und Dokumentation werden nur nach einem bewussten Klick geöffnet.
- Tests für Wasserwechsel-Protokolleinträge und lokalisierte Dezimaleingabe wurden ergänzt; alle 59 Tests bestehen.

## 0.1.2a — Testversion

Diese Version verbessert die Transparenz der Verteilung und die Dokumentation. Rechner und Messwertanalyse verhalten sich unverändert wie in 0.1.1a.

- Jede README enthält nun einen deutlichen Hinweis, dass Windows- und macOS-Pakete weder digital signiert noch notarisiert sind. Das kostenlose, nichtkommerzielle Projekt hat kein Signaturbudget und beabsichtigt nicht, Plattformgebühren für die Signatur kostenloser Software zu bezahlen.
- Die englische, russische, deutsche und spanische README enthält nun einen kurzen datierten Versionsverlauf mit direkten Links zu jedem veröffentlichten Release und dem vollständigen Änderungsprotokoll der jeweiligen Sprache.
- Die Hinweise zum ersten Start über Windows SmartScreen und macOS Gatekeeper wurden erweitert; Pakete sollen ausschließlich von der offiziellen Release-Seite `Fantomiaso/aquastoich` geladen werden.
- Versionsanzeige, Paketnamen, Workflow, Release-Text und Download-Links wurden auf 0.1.2a aktualisiert.
- Vor der Vorbereitung dieses Releases wurden Linux AppImage und DEB-Inhalt sowie die macOS-Anwendungen für x64 und ARM64 auf sauberen GitHub-hosted Systemen gestartet und geprüft.

## 0.1.1a — Testversion

Diese Testversion führt Messwertanalyse, Kalenderverlauf, Vergleichsstatistiken sowie die zugehörigen Verbesserungen an Lesbarkeit und Layout ein.

- Balkendiagramm für Woche, Monat, drei Monate, sechs Monate, Jahr oder einen eigenen Datumsbereich hinzugefügt. Bis zu drei Monate bleibt jeder Kalendertag erhalten; fehlende Tage erscheinen als interpolierte Balken unter einer Trendhüllkurve.
- Minimum, Maximum, mittlere absolute Änderung zwischen aufeinanderfolgenden Messungen und größte Änderung hinzugefügt. Sobald beide Vergleichsmessungen gewählt sind, umfasst die Statistik alle vollständigen Tage dazwischen; andernfalls gilt der aktuelle Diagrammzeitraum.
- Das Diagramm verwendet nun eine adaptive Werteskala, eine an den Balkenmitten ausgerichtete Hüllkurve und die verfügbare Breite ohne ungenutzten Leerraum. Kleine und nahezu konstante Konzentrationen erhalten einen lokalen Bereich, adaptive Dezimalstellen und eine sichtbare Mindesthöhe für Balken ungleich null.
- Zwei Messwerte lassen sich vergleichen: Linksklick wählt den ersten, Rechtsklick den zweiten. Die zugehörigen Karten erklären diese Bedienung direkt. Der erste Messwert darf nicht nach dem zweiten liegen und der zweite nicht vor dem ersten.
- Zugehörige Unterparameter und weitere erfasste Parameter stehen in anfangs geschlossenen Gruppen. Das Öffnen einer Gruppe öffnet nun gleichzeitig die entsprechende Gruppe für den ersten Messwert, den zweiten Messwert und die Differenz.
- Jede Zeile der Differenzkarte enthält beschriftete Spalten für Änderung, Mittelwert, Minimum, Maximum und größte Änderung. Minimum, Maximum und größte Änderung markieren die zugrunde liegenden Messungen durch alle Kalenderebenen; der Mittelwert bleibt rein informativ.
- Bei Auswahl eines leeren Tages werden alle zwischen den nächsten tatsächlichen Messungen linear interpolierbaren Parameter samt Hinweis und Quellzeitpunkten angezeigt.
- Der geöffnete oder geschlossene Zustand der Gruppen für zugehörige und weitere Parameter bleibt bei Zeitraumwechseln und nach einem Neustart erhalten.
- Gewählter Zeitraum und Messort gelten nun auch für den Messverlauf und dessen Excel-Export.
- Die flache Verlaufsliste wurde durch einen klassischen Kalender mit quadratischem Tagesraster ersetzt. Lange Zeiträume beginnen mit Monatszellen; ein Klick auf einen Monat öffnet dessen Tagesraster, und die deutlich umrandete Zurück-Schaltfläche führt zur Zeitraumübersicht.
- Die Zellen der Monatsübersicht sind kompakt und werden nicht mehr über die gesamte Breite des Kalenderfelds gestreckt.
- Kalender und Diagramm sind jetzt zwei alternative obere Ansichten, die mit einem Schiebeschalter gewählt werden. Das frühere Seitenfeld wurde entfernt; eine Gruppe mit mehreren Messungen öffnet ihre verschachtelte Liste direkt in der passenden Karte für den ersten oder zweiten Messwert. Bei horizontal scrollbaren Diagrammen erscheinen an beiden Rändern nicht interaktive Richtungspfeile.
- Jede Vergleichskarte besitzt nun in der ersten Kopfzeile eine klar umrandete Schaltfläche zum Aufheben der Auswahl. Bei schmalen Karten wechseln die übrigen Aktionen in eine eigene Zeile, damit sich keine Bedienelemente überlagern. In der Differenzkarte stellt die Schaltfläche den Parameter wieder her, der vor der Auswahl einer Tabellenzeile aktiv war. Nach der Wahl einer Messung aus einem Tag mit mehreren Einträgen wird die Liste auf eine Zurück-Schaltfläche reduziert; Parameter- und Wertspalten sind in der ersten und zweiten Karte gleich ausgerichtet.
- Alle drei Vergleichskarten verwenden nun dasselbe sechsspalige Tabellenraster. Die Schrift ist so groß wie in den Zellen der Differenzkarte möglich und der Hinweis unter den Verlaufsfiltern bricht sauber um, ohne die Bedienelemente zu berühren. Eine anwendungsweite Lesbarkeitsprüfung hob kompakte Beschriftungen auf mindestens 10,5 px an, verringerte übermäßige vertikale Abstände, färbte helle Tabellenflächen grünlich und definierte in jedem Design kontrastreiche Farben für Formularhinweise, Ergebniskarten und Ionentabellen.
- Messparameter sind in beschrifteten Spalten für Parameter, Wert, Änderung, Änderungsart, Tagesrate und Zeiteinheit ausgerichtet. Der frühere Parametertypfilter wurde entfernt.
- Die obere Leiste enthält nun eine gespeicherte Auswahl für ein helles, dunkles oder farbsehschwächengerechtes Design. Anklickbare Werte und Textaktionen in Listen bleiben auch ohne Mauszeiger deutlich erkennbar.
- Eine Schaltfläche setzt Vergleich und Hervorhebung zurück. Der Parameterwechsel ist nur in der rechten Differenzkarte möglich; Werte der ersten und zweiten Messung sind rein informativ. Der rechts gewählte Parameter bleibt in beiden vollständigen Messwertlisten hervorgehoben und sein Hauptwert steht weiterhin über der Liste.
- Die angeklickte Zeile bleibt beim Parameterwechsel in ihrem ursprünglichen Abschnitt der Differenztabelle. Ein anderer Diagrammparameter löscht die erste und zweite Messung nicht mehr, und die Auswahl einer Messung verschiebt oder zentriert das Diagramm nicht.
- Die Zurück-Schaltfläche der verschachtelten Liste steht nun in der Kartenkopfzeile zwischen Auswahl aufheben und Bearbeiten; bei schmalen Karten werden die Bedienelemente sauber umgebrochen.
- Ressourcenladen und Fensteranzeige der gepackten Version wurden korrigiert, damit der eigenständige portable Build zuverlässig aus dem ASAR-Archiv startet.

## 0.1.0a — Testversion

Das Tag `0.1.0a` ist auf den letzten Build vor Einführung der Messdiagramme festgelegt. Derselbe Build war zuvor als `1.0a` veröffentlicht; nur die Versionsbezeichnung wurde korrigiert. Enthalten sind Aquarienprofile, Volumenberechnung nach Geometrie, getrennte Messprotokolle, Lichtkanäle, Excel-Export, TDS-Ziele und -Protokoll, bearbeitbare Vorlagen sowie Dosierungs- und Remineralisierungsberechnung.
