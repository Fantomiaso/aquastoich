# AquaStoich

[![English](https://img.shields.io/badge/English-README-2d7d58)](README.md) [![Русский](https://img.shields.io/badge/Русский-README-2d7d58)](README.ru.md) [![Deutsch](https://img.shields.io/badge/Deutsch-README-2d7d58)](README.de.md) [![Español](https://img.shields.io/badge/Espa%C3%B1ol-README-2d7d58)](README.es.md)

## [⬇ Download AquaStoich 1.0a · Windows / macOS / Linux](https://github.com/Fantomiaso/aquastoich/releases/tag/v1.0a)

**Version 1.0a is a testing release.** AquaStoich calculates freshwater aquarium remineralization, fertilizer doses, stock solutions, ion ratios, and water changes. Verify doses and pH with measurements before using the prepared water.

## Download and install

Download the matching package from [release 1.0a](https://github.com/Fantomiaso/aquastoich/releases/tag/v1.0a): Windows installer or portable `.exe`, macOS `.dmg`, Debian/Ubuntu `.deb`, or Linux `.AppImage`. The first launch uses English; the language selector in the top bar offers English, Russian, German, and Spanish. The testing builds are unsigned, so your operating system may ask you to confirm opening them.

The app works offline and has no account or remote database. Electron stores the calculation, custom substances, journal, and language setting in the current user's application data directory:

| System | Application data location |
| --- | --- |
| Windows | `%APPDATA%\AquaStoich` |
| macOS | `~/Library/Application Support/AquaStoich` |
| Linux | `${XDG_CONFIG_HOME:-~/.config}/AquaStoich` |

The optional browser version keeps separate data in that browser's local storage. It does not migrate data into the desktop app automatically.

## What it does

- Calculates doses from target GH, KH, Ca, Mg, K, NO₃, PO₄, Fe and other measurable ions, and recalculates results as doses change.
- Calculates dry doses and stock-solution concentrations, with separate anhydrous and hydrated forms, purity, and a solubility reminder.
- Fits exact water targets and ion ratios first, using their allowed ranges when exact values conflict. Presets fill both water targets and ratios; several can be combined, with detailed conflict explanations.
- Treats a water change as a separate prepared-water volume mixed with the aquarium's existing water. Locked doses stay fixed during solving.
- Shows cations and anions, each additive's contribution, and an approximate ion-charge balance. The pH estimate can be calibrated against a measurement after mixing.
- Records drop-test measurements, notes, absolute changes, and per-day change for the same test and water source.
- Keeps separate aquarium profiles and measurement logs. Rectangular and cylindrical water volumes can be estimated from external dimensions, glass thickness, average substrate depth, and the unfilled top gap. Manual volume remains available.
- Records lighting with each measurement: fixture, power, intensity, start time, duration, color temperature, PAR, and up to eight selected or custom channels (0–100% each). No channels are preselected. Exports the selected aquarium's log to an Excel `.xlsx` file, including test notes and lighting columns.
- Lets you add custom substances and mixtures from formulas or a disclosed ion analysis. Resins are not included.

## How to use

1. In **Aquariums**, create or select a tank. Set its working water volume manually or choose **From dimensions** and enter the outside dimensions, glass thickness, average substrate depth, and top gap. The active aquarium selector stays in the top bar.
2. Choose **Preparation** or **Water change**. Enter prepared-water volume, source-water GH/KH and any known ions. For a change, also enter the selected aquarium's starting values.
3. Enter only the water targets you need. A blank target is ignored; zero is valid. Open **Allowed range** under a target to set a minimum, maximum, or both. A range can also be used without an exact target. Select one or more presets to fill water targets, their ranges, and ion ratios. Use **Edit** beside a preset to change its targets, ranges, and ratios; **Restore original** resets a built-in preset. **+ Custom preset** creates your own, which can be edited or deleted. Saved presets stay on this device. Overlapping presets use the intersection of their ranges; incompatible ranges are explained. Add ratios such as NO₃:PO₄ = 12:1 with optional bounds.
4. Choose substances in **Substances and doses**. Search by name, synonym, or formula and filter by effect. The `+` or `−` tag shows the direction of change separately from ionic charge, such as `+` with `Mg²⁺` or `−` with `NO₃⁻`. `PO₄ (Σ)` means total phosphate, not one ionic species. Sort by name, effect, or substance/mixture/solution.
5. For a dry substance, choose its chemical form and purity, then a dry dose or a stock solution. Enter the mass and final solution volume. You can also calculate the mass for a convenient millilitre dose.
6. Click **Calculate doses**. Automatic rows are fitted to targets. Editing a dose switches that row to manual mode. **Lock** holds its substance, form, stock settings, and dose fixed.
7. Open a result card or ion-table row to see contributions. Enter a measured pH in **Calibrate pH from a measurement** after mixing and standing to tune the model's effective CO₂ assumption.
8. In **Measurement log**, record readings and optional lighting settings for the selected aquarium. Add light channels from the list or create a custom channel, then set each intensity from 0 to 100%; the limit is eight channels. Notes are available for the whole entry and each test. Use **Export to Excel** to save that aquarium's log, including channel names and values.

### Calculation limits

Concentrations are in mg/L; ratios are by mass. GH and KH are derived from the published or formula-based composition. Unknown ions in commercial mixtures remain unknown and are shown as missing counterions in the balance. HCO₃/CO₃ values in the ion table describe the added formulas before their equilibrium shifts. Acid equivalents reduce calculated KH, but acid products with undisclosed composition cannot supply a complete ion balance. Geometry uses a uniform average substrate layer and excludes water displaced by decor and equipment; use manual volume when you know the actual amount.

pH is an estimate from KH, phosphate, and assumed dissolved CO₂ at 25 °C. The initial effective CO₂ value of 5 mg/L was chosen to match a reported standing-water pH range, not measured atmospheric equilibrium. Other buffers, biological processes, gas exchange, precipitation, and the actual water temperature can change pH. Calibrate and verify it with a test. The solver does not use pH as an exact target.

The built-in catalogue includes salts, WaterSci, AQUAERUS, AQUAYER, Seachem, Dennerle, Aqua Rebell, acid buffers and selected non-resin filter media. Commercial-product calculations use only disclosed quantitative analyses; reference-only filter media do not receive a calculated dose. Solubility for homemade solutions depends on temperature and the actual material.

## Build from source

Install Node.js 24 and run:

```sh
npm install
npm test
npm start
npm run dist
```

`npm run dist` packages the current operating system. The tagged [GitHub Actions workflow](.github/workflows/release.yml) builds Windows, macOS, and Linux packages and creates a prerelease marked **Testing**. The web development version also runs with `node server.mjs` at `http://127.0.0.1:4173`.

## Data and comparisons

Formula masses and ion fractions are calculated from the recorded formulas. Commercial data are referenced in [the detailed Russian methodology](README.ru.md#исходные-данные-и-ограничения); among the primary sources are [Seachem](https://www.seachem.com/calculators.php), [AQUAYER](https://aquayer.com/ru/product/aquayer-smart-makro), [Dennerle](https://dennerle.com/en/products/plant-care-npk), and [Aqua Rebell](https://www.aqua-rebell.de/Aqua-Rebell-Makro-Basic-Nitrat-1000-ml).

Related tools serve different needs. [Seachem's calculators](https://www.seachem.com/calculators.php) are simpler for individual Seachem products. [AquariumToolbox](https://aquariumtoolbox.com/) covers a wider set of aquarium tasks and equipment. [AquaJocund's stock-solution calculator](https://aquajocund.com/dry-fertilizer-stock-solution-calculator/) offers weekly fertilizer schedules. AquaStoich focuses on jointly fitting several substances to ion targets, explaining their contributions, and linking calculations with aquarium profiles and measurement logs. It does not provide weekly fertilizer scheduling.

## License

Source code is available under the [AquaStoich Noncommercial Attribution License](LICENSE.md). Use is allowed only for noncommercial purposes. Any use of the source code must credit **AquaStoich by Fantomiaso** and link to the [original project](https://github.com/Fantomiaso/aquastoich). Commercial use requires separate written permission. This is a source-available license, not an OSI open-source license.
