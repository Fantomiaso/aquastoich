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

Der pH wird aus KH, Phosphat und angenommenem gelöstem CO₂ bei 25 °C geschätzt. Die anfänglichen 5 mg/l CO₂ wurden anhand eines berichteten pH-Bereichs für abgestandenes Wasser gewählt und sind kein Messwert oder allgemeingültiger Gleichgewichtswert. Weitere Puffer, Gasaustausch, Ausfällung, Biologie und Temperatur beeinflussen den tatsächlichen pH. Der pH des Ausgangswassers allein bestimmt den Wert nach dem Gasaustausch nicht. Der automatische Dosierungsalgorithmus verwendet pH nicht als exaktes Ziel. Die Grundlagen sind die [Carbonat-Gleichgewichte in USGS PHREEQC](https://water.usgs.gov/water-resources/software/PHREEQC/documentation/phreeqc3-html/phreeqc3-77.htm), [Phosphatdaten des NIST](https://www.nist.gov/system/files/documents/srd/jpcrd615.pdf), die [USGS-Alkalinitätsmethodik](https://or.water.usgs.gov/alk/methods.html) und das [USGS-Modell zum Gasaustausch](https://water.usgs.gov/water-resources/software/PHREEQC/documentation/phreeqc3-html/phreeqc3-69.htm). Einen berechneten pH immer durch Messung prüfen.

### Eigene Stoffe und Messprotokoll

Unter **Stoffdatenbank** können trockene Stoffe, trockene Mischungen und fertige Flüssigkeiten angelegt werden. Erforderlich sind ein chemischer Name, die Formel jeder Komponente und ihre Löslichkeit bei 20 °C in g/l. Für mehrere trockene Formen einer Substanz jede Formel und Löslichkeit einzeln erfassen, etwa MgSO₄ und MgSO₄·7H₂O. Die gewählte Form ändert Ionenanteile und die Prüfung der Stammlösung. Für eine trockene Mischung Massenanteile, für eine Flüssigkeit die Masse jeder Komponente je Liter angeben. Häufige ionische Salze einschließlich Klammern und Kristallwasser werden erkannt. Bei komplexen Produkten mit veröffentlichter Analyse den Ionengehalt manuell in mg/g Trockenstoff oder mg/ml Flüssigkeit ergänzen; ein Handelsname allein belegt keine Zusammensetzung. Alltagssprachliche und Handelsnamen gehören in **Alternative Namen** und bleiben durchsuchbar. Der Löslichkeitshinweis ist besonders bei Mischungen nur ein Anhaltspunkt.

Im **Messprotokoll** Aquarium und Wasserquelle wählen, Tropfentestwerte sowie eine allgemeine Notiz oder Notizen zu einzelnen Tests eintragen. Die Uhrzeit wird beim Speichern automatisch gesetzt, sofern nicht die manuelle Eingabe gewählt ist. Fehlende Tests können mit eigener Einheit ergänzt werden. Unterschiede beziehen sich nur auf denselben Test, dieselbe Wasserquelle und dasselbe Aquarium. Die Tagesrate ist eine Nettoänderung der Konzentration; Dosierungen, Wasserwechsel, Verdünnung und Messfehler werden dabei nicht herausgerechnet. Beleuchtung und bis zu acht Kanäle werden je Eintrag gespeichert und nach Excel exportiert.

## Zusammensetzungsdaten und Methodik

Ca, Mg, K, Na, Fe und Spurenelemente werden als Elemente angegeben; NO₃, PO₄, HCO₃, CO₃ und SO₄ als Ionen, jeweils in mg/l. GH wird aus Ca und Mg berechnet, KH aus der Alkalinität von HCO₃ und CO₃. Eingegebene GH/KH-Werte des Ausgangswassers verraten dessen einzelne Ionen nicht. Molmassen und Ionenanteile folgen aus den hinterlegten Formeln. Bei KH₂PO₄ wird Gesamtphosphat als PO₄-Äquivalent angezeigt, für die Ladungsbilanz dagegen H₂PO₄⁻ verwendet.

| Produkt | Verwendete quantitative Zusammensetzung | Quelle |
| --- | --- | --- |
| WaterSci Remineral GH+ | Ca 27,54; Mg 6,48 g/l | [Produktangabe](https://plantaqua.ru/products/62116684) |
| WaterSci Remineral KH+ | Na 26,21; K 7,65; HCO₃ 69,57; SO₄ 9,40 g/l | [Produktangabe](https://xn--80aafzh6aw.xn--p1ai/catalog/vse_dlya_akvariuma/sredstva_dlya_vody/sredstva_dlya_vody_v_akvariume/30536/) |
| AQUAERUS IRON | Fe 7,00; Mn 1,30 g/l | [Produktangabe](https://zaisy.ru/catalog/ryby/sredstva_po_ukhodu_za_akvariumom/udobreniya_dlya_rasteniy/150745/) |
| AQUAERUS MICRO+ | K 7,920; Fe 1,372; Mg 0,915; Mn 0,475; B 0,082; Mo 0,035; Cu 0,052; Zn 0,017; Co 0,008 g/l | [Produktangabe](https://plantaqua.ru/products/35828202) |

Die Datenbank enthält 54 Einträge mit gängigen Hydraten sowie Produkten von [AQUAYER](https://aquayer.com/ru/product/aquayer-smart-makro), [Seachem](https://www.seachem.com/calculators.php), [Dennerle](https://dennerle.com/en/products/plant-care-npk) und [Aqua Rebell](https://www.aqua-rebell.de/Aqua-Rebell-Makro-Basic-Nitrat-1000-ml). Herstellerangaben zur Dosierung werden nötigenfalls in mg/ml umgerechnet. Magnesiumsulfat nutzt anfangs MgSO₄·7H₂O, Calciumnitrat Ca(NO₃)₂·4H₂O; wasserfreie Formen sind wählbar. Reinheit anhand der eigenen Packung angeben. Für CaSO₄·2H₂O gilt als Richtwert eine [Löslichkeit von 2 g/l bei 20 °C](https://www.merckmillipore.com/INTL/en/product/Calcium-sulfate-dihydrate%2CMDA_CHEM-102160). Bei konzentrierten Stammlösungen sind Warnungen nur Näherungen: Temperatur, Salzform und weitere Stoffe beeinflussen die Löslichkeit. Konzentrate getrennt ansetzen und auf Niederschlag prüfen.

**Abweichung bei WaterSci:** Die veröffentlichten Ca- und Mg-Gehalte für GH+ ergeben etwa **5,35 °dGH**, der HCO₃-Gehalt für KH+ etwa **3,20 °dKH**, jeweils bei 1 ml auf 1 l. Die Produktangaben nennen dagegen 8 °dGH beziehungsweise 4 °dKH. AquaStoich verwendet die veröffentlichten Ionengehalte; die tatsächlichen Werte mit Tropfentests prüfen. Gegenionen von GH+ und komplexen Düngern sind nicht vollständig bekannt und werden nicht willkürlich Cl oder SO₄ zugeordnet. Chelatgebundenes Fe und Mn erscheinen als Gesamtmasse der Elemente, nicht in der Bilanz einfacher Ionen. Ohne vollständige Ionenanalyse kann auch das Ausgangswasser nicht bilanziert werden.

## Aus Quellcode bauen

Node.js 24 installieren und `npm install`, `npm test`, `npm start` ausführen. `npm run dist` erstellt Pakete für das aktuelle Betriebssystem. Der [Release-Workflow](.github/workflows/release.yml) baut Windows-, macOS- und Linux-Pakete und veröffentlicht sie als **Testversion**. Die Web-Entwicklungsversion startet mit `node server.mjs` auf `http://127.0.0.1:4173`.

## Ähnliche Werkzeuge und Lizenz

[Seachem Dose Calculators](https://www.seachem.com/calculators.php) sind für einzelne Markenprodukte einfach. [AquariumToolbox](https://aquariumtoolbox.com/) deckt auch weitere Aquarienaufgaben und Technik ab. [AquaJocund](https://aquajocund.com/dry-fertilizer-stock-solution-calculator/) plant Dünger über eine Woche. AquaStoich kombiniert die Anpassung mehrerer Zusätze an Ionenziele mit Volumenschätzung, Aquarienprofilen und Messprotokollen. Eine wöchentliche Düngeplanung fehlt derzeit.

Die [Lizenz](LICENSE.md) erlaubt ausschließlich nichtkommerzielle Nutzung. Wer Quellcode verwendet, muss **AquaStoich by Fantomiaso** nennen und auf das [Originalprojekt](https://github.com/Fantomiaso/aquastoich) verlinken. Kommerzielle Nutzung bedarf einer gesonderten schriftlichen Genehmigung.
