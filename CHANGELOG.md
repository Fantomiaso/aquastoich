# AquaStoich changelog

English · [Русский](CHANGELOG.ru.md) · [Deutsch](CHANGELOG.de.md) · [Español](CHANGELOG.es.md)

## 1.1a — Unreleased

This version is reserved for the measurement analysis and calendar work. It remains a local testing build and has not been uploaded or published.

- Added a measurement bar chart for the last week, month, three months, six months, year, or a manual date range.
- Added two-reading comparison: left-click selects the first reading and right-click selects the second. The first reading cannot be later than the second, and the second cannot be earlier than the first.
- Related subparameters and other recorded parameters are available in collapsed groups. Opening either group now opens the matching group in the first reading, second reading, and difference cards together.
- Applied the selected chart period and measurement location to Measurement history and its Excel export.
- Replaced the flat history with a full-width calendar and reading list. The calendar uses month, week, or day cells according to the range, shows measurement counts on hover, and drills from month to week to day without density scales.
- Added individual time markers when a day contains several readings. Calendar markers and chart bars share the first and second reading highlights in both directions.
- Reworked reading details into aligned, labelled columns for parameter, value, change, change type, daily rate, and time unit. The former parameter-type filter was removed.
- Fixed packaged resource loading and window display so the standalone portable build opens reliably from its ASAR archive.

## 1.0a — Testing release

The `1.0a` tag is fixed at the last build before measurement charts were introduced. It includes aquarium profiles, geometry-based volume estimates, per-aquarium measurement logs, lighting channels, Excel export, TDS targets and logging, editable presets, and the dosing and remineralisation calculator.
