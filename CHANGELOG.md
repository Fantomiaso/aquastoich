# AquaStoich changelog

English · [Русский](CHANGELOG.ru.md) · [Deutsch](CHANGELOG.de.md) · [Español](CHANGELOG.es.md)

## 1.1a — Unreleased

This version is reserved for the measurement analysis and calendar work. It remains a local testing build and has not been uploaded or published.

- Added a measurement bar chart for the last week, month, three months, six months, year, or a manual date range. Ranges up to three months retain every calendar day; missing days are shown as interpolated bars under a trend envelope.
- Added two-reading comparison: left-click selects the first reading and right-click selects the second. These controls are explained inside the corresponding cards. The first reading cannot be later than the second, and the second cannot be earlier than the first.
- Related subparameters and other recorded parameters are available in collapsed groups. Opening either group now opens the matching group in the first reading, second reading, and difference cards together.
- Applied the selected chart period and measurement location to Measurement history and its Excel export.
- Replaced the flat history with a classic square-grid calendar. Long ranges begin with month cells; selecting a month opens its day grid, and the outlined Back button returns to the period overview.
- Added a contextual reading panel to the right of the calendar. A group with several readings shows a nested list; a single reading opens its parameters immediately. Individual time markers, calendar cells, and chart bars share the first and second reading highlights in both directions.
- Reworked reading details into aligned, labelled columns for parameter, value, change, change type, daily rate, and time unit. The former parameter-type filter was removed.
- Fixed packaged resource loading and window display so the standalone portable build opens reliably from its ASAR archive.

## 1.0a — Testing release

The `1.0a` tag is fixed at the last build before measurement charts were introduced. It includes aquarium profiles, geometry-based volume estimates, per-aquarium measurement logs, lighting channels, Excel export, TDS targets and logging, editable presets, and the dosing and remineralisation calculator.
