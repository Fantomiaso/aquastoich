# AquaStoich changelog

English · [Русский](CHANGELOG.ru.md) · [Deutsch](CHANGELOG.de.md) · [Español](CHANGELOG.es.md)

## 1.1a — Unreleased

This version is reserved for the measurement analysis and calendar work. It remains a local testing build and has not been uploaded or published.

- Added a measurement bar chart for the last week, month, three months, six months, year, or a manual date range. Ranges up to three months retain every calendar day; missing days are shown as interpolated bars under a trend envelope.
- Added period minimum, maximum, mean absolute adjacent-reading change, and maximum adjacent-reading change. Once both comparison readings are selected, statistics use every whole day between them; otherwise they use the current chart period.
- Improved the chart with an adaptive value scale, an envelope aligned to the bucket centres, and columns that use the available width without leaving an unused tail. Small and nearly constant concentrations now use a local range, adaptive decimal precision, and a visible minimum height for non-zero bars.
- Added two-reading comparison: left-click selects the first reading and right-click selects the second. These controls are explained inside the corresponding cards. The first reading cannot be later than the second, and the second cannot be earlier than the first.
- Related subparameters and other recorded parameters are available in collapsed groups. Opening either group now opens the matching group in the first reading, second reading, and difference cards together.
- Added labelled change, average, minimum, maximum, and maximum-change columns to every row in the Difference card. Minimum, maximum, and maximum-change cells highlight their source readings through every calendar level; average cells remain informational.
- Empty calendar days now show all values that can be linearly interpolated between the nearest actual readings, together with an interpolation notice and source timestamps.
- The open or closed state of related and other parameter groups is remembered across period changes and application restarts.
- Applied the selected chart period and measurement location to Measurement history and its Excel export.
- Replaced the flat history with a classic square-grid calendar. Long ranges begin with month cells; selecting a month opens its day grid, and the outlined Back button returns to the period overview.
- Made month overview cells compact instead of stretching them across the calendar panel.
- Added a contextual reading panel to the right of the calendar. A group with several readings shows a nested list; a single reading opens its parameters immediately. Individual time markers, calendar cells, and chart bars share the first and second reading highlights in both directions.
- Reworked reading details into aligned, labelled columns for parameter, value, change, change type, daily rate, and time unit. The former parameter-type filter was removed.
- Added a persistent theme selector to the top bar with light, dark, and colour-vision-safe modes. Clickable values and text actions in lists now remain visibly distinct without requiring a hover.
- Added a Clear selection control for chart comparisons and highlights. Parameter switching is available only from the Difference card; values in the first and second reading cards are informational. A parameter selected on the right remains in both complete reading lists, where it is highlighted, while its main value remains above the list.
- Kept the clicked row in its original Difference-table section while the chart changes parameter. Changing the chart parameter no longer clears the first and second readings, and selecting a reading no longer recentres or shifts the chart.
- Fixed packaged resource loading and window display so the standalone portable build opens reliably from its ASAR archive.

## 1.0a — Testing release

The `1.0a` tag is fixed at the last build before measurement charts were introduced. It includes aquarium profiles, geometry-based volume estimates, per-aquarium measurement logs, lighting channels, Excel export, TDS targets and logging, editable presets, and the dosing and remineralisation calculator.
