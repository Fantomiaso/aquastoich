# AquaStoich changelog

English · [Русский](CHANGELOG.ru.md) · [Deutsch](CHANGELOG.de.md) · [Español](CHANGELOG.es.md)

## 0.1.3a — Testing release

This release connects water-change calculations with the measurement log and improves localized numeric entry.

- Added a vertical journal-source selector to Water change mode. The latest compatible aquarium test is loaded only after an explicit **Load values** action; the alternative mode saves the current aquarium fields as a measured pre-change entry when **Calculate doses** is pressed.
- Added **Add calculation to log** near the top of the Result panel. It saves the estimated post-change aquarium parameters separately from measured values.
- Calculated log entries now have a distinct colour and a **Calculated** badge in the calendar, chart, nested choices, history and comparison cards.
- Numeric fields accept both decimal dot and comma, immediately display the separator required by the selected app language, and interpret the numeric keypad decimal key as a separator regardless of the operating-system keyboard locale.
- Increased the text contrast of target and ratio range fields in the dark theme.
- Added tests for the water-change journal snapshots and locale-aware decimal normalization; the full suite contains 56 passing tests.

## 0.1.2a — Testing release

This release improves distribution transparency and documentation. Calculator and measurement-analysis behaviour is unchanged from 0.1.1a.

- Added a prominent notice to every README that Windows and macOS packages are not digitally signed or notarized. The project is free and noncommercial, has no signing budget, and does not intend to pay platform fees to sign software that should remain free.
- Added a concise, dated version history to the English, Russian, German, and Spanish README files, with direct links to every published release and the full language-specific changelog.
- Expanded first-launch guidance for Windows SmartScreen and macOS Gatekeeper and emphasized downloading only from the official `Fantomiaso/aquastoich` releases page.
- Updated the application badge, package filenames, workflow, release notes, and download links to 0.1.2a.
- Verified launchability of the Linux AppImage and DEB payload and the macOS x64 and ARM64 applications on clean GitHub-hosted runners before preparing this release.

## 0.1.1a — Testing release

This testing release introduces measurement analysis, the calendar history, comparison statistics, and the related readability and layout work.

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
- Calendar and chart are now two alternative top views selected with a slider. The former side panel was removed; choosing a group with several readings now opens its nested list directly in the relevant First reading or Second reading card. Scrollable charts show non-interactive directional arrows at their left and right edges.
- Each comparison card now has its own clearly bordered Clear selection button in the first heading row. At narrow card widths the remaining actions wrap onto a dedicated row so controls never overlap. Clearing the Difference card restores the parameter that was active before a table row was selected. After choosing one reading from a multi-reading day, the list collapses to a Back control, and parameter/value columns align consistently in the first and second cards.
- Unified all three comparison cards on the same six-column table grid, enlarged their text to the maximum size supported by the Difference card, and fixed the explanatory note below the history filters so it wraps without touching the controls. An application-wide readability pass raised compact labels to at least 10.5 px, reduced excess vertical spacing, tinted light table surfaces green, and added explicit high-contrast colours for form hints, result cards and ion tables in every theme.
- Reworked reading details into aligned, labelled columns for parameter, value, change, change type, daily rate, and time unit. The former parameter-type filter was removed.
- Added a persistent theme selector to the top bar with light, dark, and colour-vision-safe modes. Clickable values and text actions in lists now remain visibly distinct without requiring a hover.
- Added a Clear selection control for chart comparisons and highlights. Parameter switching is available only from the Difference card; values in the first and second reading cards are informational. A parameter selected on the right remains in both complete reading lists, where it is highlighted, while its main value remains above the list.
- Kept the clicked row in its original Difference-table section while the chart changes parameter. Changing the chart parameter no longer clears the first and second readings, and selecting a reading no longer recentres or shifts the chart.
- Moved the nested-list Back button into the card header between Clear selection and Edit, with responsive wrapping at narrow widths.
- Fixed packaged resource loading and window display so the standalone portable build opens reliably from its ASAR archive.

## 0.1.0a — Testing release

The `0.1.0a` tag is fixed at the last build before measurement charts were introduced. The same build was previously published as `1.0a`; only its version label was corrected. It includes aquarium profiles, geometry-based volume estimates, per-aquarium measurement logs, lighting channels, Excel export, TDS targets and logging, editable presets, and the dosing and remineralisation calculator.
