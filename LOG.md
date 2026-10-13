# CC-02 — "Can't read anything in dark mode"

Reproduced: I attempted to open the website and check the dish names and prices in dark mode. The website showed a server error and the menu did not load, so I could not visually reproduce the complaint.

Cause: The .dish-body rule in frontend/style.css used the hard-coded text color #2b2118. This color does not adapt to the active theme and may cause poor text visibility in dark mode.

Fix: Replaced color: #2b2118 with color: var(--ink) in the .dish-body rule so the text uses the theme's configured ink color.

Checked: Confirmed that the CSS change was committed and pushed to my fork. Visual testing in light and dark modes remains pending because the menu did not load.

Time: in understanding the bug i ttok me around 10 min and i knew how to fix this problem but due to backend problem in my own system i could not verify it so i took me 1 hour approx.