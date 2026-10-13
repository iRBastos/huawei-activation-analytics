# Browser acceptance checks still requiring a real browser

These checks are not reported as passed by the automated test suite.

1. Open the private deployed site as its owner. Confirm the navigation and mobile filter layout are readable.
2. Explore the fictional demo, change dates/product filters, toggle all chart series off then back on, inspect a point, and return to the real workspace. Confirm the real database is unchanged.
3. Import a populated copy of each Excel template. Confirm classifications, source scope and the replacement preview. Check final totals against the files.
4. Reload the browser and close/reopen the tab. Confirm records, coverage, targets and events remain.
5. Import identical data, then one changed value. Confirm quantities are not doubled and the correction is logged.
6. Undo the first correction after making an overlapping later correction. Verify the conflict list and retained later value.
7. Export filtered CSV, download a full backup, change a target, and restore the backup. Verify restored values.
8. Use Print / PDF. Check exact dates, filters, metrics, charts, coverage, last update and interpretation notes.
9. Operate navigation, forms, chart points and dialogs using the keyboard. Check focus visibility and dialog close behaviour.
