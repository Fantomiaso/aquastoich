# AquaStoich

[![English](https://img.shields.io/badge/English-README-2d7d58)](README.md) [![Русский](https://img.shields.io/badge/Русский-README-2d7d58)](README.ru.md) [![Deutsch](https://img.shields.io/badge/Deutsch-README-2d7d58)](README.de.md) [![Español](https://img.shields.io/badge/Espa%C3%B1ol-README-2d7d58)](README.es.md)

## [⬇ AquaStoich 1.0a herunterladen · Windows / macOS / Linux](https://github.com/Fantomiaso/aquastoich/releases/tag/v1.0a)

**Version 1.0a befindet sich in der Testphase.** AquaStoich berechnet die Remineralisierung von Süßwasser-Aquarien, Dünger und Stammlösungen. Dosierungen und pH sollten vor der Verwendung des Wassers durch Messungen überprüft werden.

## Download und Installation

Laden Sie im [Release 1.0a](https://github.com/Fantomiaso/aquastoich/releases/tag/v1.0a) das passende Paket herunter: Windows-Installer oder portable `.exe`, macOS-`.dmg`, Debian/Ubuntu-`.deb` oder Linux-`.AppImage`. Beim ersten Start ist Englisch eingestellt. Über die Sprachauswahl oben können Sie Deutsch, Englisch, Russisch oder Spanisch wählen. Die Testpakete sind nicht mit einem Entwicklerzertifikat signiert; das Betriebssystem kann daher eine Bestätigung verlangen.

Die Anwendung arbeitet offline ohne Konto. Berechnung, eigene Stoffe, Messprotokoll und Sprache werden im Anwendungsdatenverzeichnis des jeweiligen Benutzers gespeichert:

| System | Speicherort |
| --- | --- |
| Windows | `%APPDATA%\AquaStoich` |
| macOS | `~/Library/Application Support/AquaStoich` |
| Linux | `${XDG_CONFIG_HOME:-~/.config}/AquaStoich` |

Die Browser-Version speichert Daten getrennt im lokalen Speicher des Browsers; eine automatische Übernahme in die Desktop-App findet nicht statt.

## Funktionen

- Dosierungen aus Zielwerten für GH, KH, Ca, Mg, K, NO₃, PO₄, Fe und weitere Ionen berechnen; beim Ändern einer Dosis Ergebnisse sofort neu berechnen.
- Trockene Dosierung und Stammlösung berechnen, einschließlich wasserfreier und hydratisierter Formen, Reinheit und Löslichkeitshinweis.
- Exakte Wasserzielwerte und Ionenverhältnisse zuerst anstreben; zulässige Bereiche verwenden, wenn exakte Werte kollidieren. Vorlagen setzen Wasserzielwerte und Verhältnisse gemeinsam. Mehrere Vorlagen und detaillierte Konfliktmeldungen sind möglich.
- Beim Wasserwechsel aufbereitetes Wasser und vorhandenes Aquarienwasser getrennt erfassen und mischen. Gesperrte Dosierungen bleiben unverändert.
- Kationen, Anionen, Beiträge einzelner Zusätze und die angenäherte Ladungsbilanz anzeigen. Die pH-Schätzung kann mit einem Messwert kalibriert werden.
- Tropfentest-Messungen mit Uhrzeit und Notizen erfassen; absolute und tägliche Veränderungen für denselben Test und dieselbe Wasserquelle berechnen.
- Mehrere Aquarien mit eigenen Profilen und Messprotokollen verwalten. Das Wasservolumen rechteckiger oder zylindrischer Becken aus Außenmaßen, Glasdicke, mittlerer Bodengrundhöhe und Abstand zum oberen Rand schätzen oder manuell eingeben.
- Beleuchtung je Messung speichern: Leuchte, Leistung, Helligkeit, Beginn, Dauer, Farbtemperatur, PAR und bis zu acht einzeln einstellbare Kanäle. Anfangs sind keine Kanäle gewählt; vorhandene oder eigene Kanäle lassen sich mit 0–100 % eintragen. Das Protokoll des gewählten Aquariums mit Testnotizen und Kanalwerten als Excel-Datei (`.xlsx`) exportieren.
- Eigene Stoffe und Mischungen anhand von Formeln oder angegebenem Ionengehalt hinzufügen. Harze sind nicht enthalten.

## Anleitung

Vor einer Wasserwechselberechnung unter **Aquarien** ein Becken anlegen oder auswählen. Bei **Aus Abmessungen** Außenmaße und Abzüge eintragen. Die Schätzung berücksichtigt keine Verdrängung durch Dekoration oder Technik. Das ausgewählte Aquarium steht oben in der Auswahl; sein Volumen, seine Ausgangswerte und sein Messprotokoll bleiben von anderen Becken getrennt. Im **Messprotokoll** können Beleuchtungseinstellungen erfasst und mit **Nach Excel exportieren** für dieses Aquarium gespeichert werden. Die nächste Messung übernimmt die zuletzt gespeicherten Beleuchtungseinstellungen als Vorschlag. Ein bestehendes Protokoll wird beim Update dem ersten Aquarium zugeordnet.

1. **Aufbereitung** oder **Wasserwechsel** auswählen. Volumen, GH/KH des Ausgangswassers und bekannte Ionen eintragen. Beim Wasserwechsel auch Aquarienvolumen und Ausgangswerte des Aquariums angeben.
2. Nur benötigte Zielwerte ausfüllen. Ein leeres Feld wird ignoriert; null ist ein gültiger Zielwert. Unter jedem Wasserziel kann **Zulässiger Bereich** geöffnet und eine oder beide Grenzen eingetragen werden, auch ohne exaktes Ziel. Eine oder mehrere Vorlagen setzen Wasserziele, deren Bereiche und Ionenverhältnisse. Mit **Bearbeiten** neben einer Vorlage lassen sich Ziele, Grenzen und Verhältnisse ändern; **Original wiederherstellen** setzt eine integrierte Vorlage zurück. Mit **+ Eigene Vorlage** wird eine neue Vorlage erstellt, die bearbeitet oder gelöscht werden kann. Gespeicherte Vorlagen bleiben lokal auf diesem Gerät. Überlappende Bereiche werden geschnitten; unvereinbare Bereiche werden erklärt. Die Beispiele an Arten und Messwerte anpassen. Bei Bedarf ein Verhältnis wie NO₃:PO₄ = 12:1 mit Grenzen angeben.
3. Stoffe in **Stoffe und Dosierungen** auswählen. Nach Name, Synonym oder Formel suchen. Das Tag `+` oder `−` zeigt die Änderungsrichtung getrennt von der Ionenladung, etwa `+` mit `Mg²⁺` oder `−` mit `NO₃⁻`. `PO₄ (Σ)` steht für Gesamtphosphat. Nach Name, Wirkung oder Stoff/Mischung/Lösung sortieren.
4. Bei Trockensalzen Form, Reinheit und trockene Zugabe oder Stammlösung wählen. Einwaage und Endvolumen angeben; eine praktische Milliliter-Dosis kann berechnet werden.
5. **Dosierungen berechnen** anklicken. Automatische Zeilen werden an die Ziele angepasst. Eine manuell bearbeitete Dosis bleibt manuell; **Sperren** fixiert Stoff, Form, Lösung und Dosis.
6. Ergebnisfeld oder Ionentabelle öffnen, um Einzelbeiträge zu sehen. Nach dem Mischen und Abstehen einen gemessenen pH im Kalibrierfeld eintragen.
7. Im **Messprotokoll** Uhrzeit automatisch oder manuell setzen und allgemeine sowie testspezifische Notizen ergänzen.

## Grenzen der Berechnung

Konzentrationen sind in mg/l angegeben, Verhältnisse beziehen sich auf die Masse. Bei Fertigpräparaten werden nur veröffentlichte quantitative Bestandteile berechnet; unbekannte Gegenionen bleiben unbekannt. Die HCO₃/CO₃-Werte zeigen die nominelle Zugabe vor der Gleichgewichtseinstellung. Säureäquivalente senken die berechnete KH. Für Filtermedien ohne verlässliche Dosisformel wird keine Dosis ausgegeben.

Der pH wird aus KH, Phosphat und angenommenem gelöstem CO₂ bei 25 °C geschätzt. Die anfänglichen 5 mg/l CO₂ wurden anhand eines berichteten pH-Bereichs für abgestandenes Wasser gewählt und sind kein Messwert. Weitere Puffer, Gasaustausch, Ausfällung, Biologie und Temperatur beeinflussen den tatsächlichen pH. Der automatische Dosierungsalgorithmus verwendet pH nicht als exaktes Ziel. Weitere Angaben und [Quellen zur Zusammensetzung](README.ru.md#исходные-данные-и-ограничения) stehen in der ausführlichen Methodik.

## Aus Quellcode bauen

Node.js 24 installieren und `npm install`, `npm test`, `npm start` ausführen. `npm run dist` erstellt Pakete für das aktuelle Betriebssystem. Der [Release-Workflow](.github/workflows/release.yml) baut Windows-, macOS- und Linux-Pakete und veröffentlicht sie als **Testversion**. Die Web-Entwicklungsversion startet mit `node server.mjs` auf `http://127.0.0.1:4173`.

## Ähnliche Werkzeuge und Lizenz

[Seachem Dose Calculators](https://www.seachem.com/calculators.php) sind für einzelne Markenprodukte einfach. [AquariumToolbox](https://aquariumtoolbox.com/) deckt auch Geometrie und Technik ab. [AquaJocund](https://aquajocund.com/dry-fertilizer-stock-solution-calculator/) plant Dünger über eine Woche. AquaStoich konzentriert sich auf gemeinsame Ionenziele mehrerer Zusätze und deren Beiträge; Geometrie und Wochenplanung fehlen derzeit.

Die [Lizenz](LICENSE.md) erlaubt ausschließlich nichtkommerzielle Nutzung. Wer Quellcode verwendet, muss **AquaStoich by Fantomiaso** nennen und auf das [Originalprojekt](https://github.com/Fantomiaso/aquastoich) verlinken. Kommerzielle Nutzung bedarf einer gesonderten schriftlichen Genehmigung.
