# CC-02 — "Can't read anything in dark mode"

Reproduced: I attempted to open the website and check the dish names and prices in dark mode. The website showed a server error and the menu did not load, so I could not visually reproduce the complaint

Cause: The .dish-body rule in frontend/style.css used the hard-coded text color #2b2118. This color does not adapt to the active theme and may cause poor text visibility in dark mode

Fix: Replaced color: #2b2118 with color: var(--ink) in the .dish-body rule so the text uses the theme's configured ink color

Checked: Confirmed that the CSS change was committed and pushed to my fork. Visual testing in light and dark modes also showed that problem is fixed

Time: this took me around 40-45 min

CC-05 - "The category bar scrolls away on my phone"

Reproduced: Opened the menu in mobile view and scrolled down through the dishes. The category and filter bar did not stay visible at the top.

Cause: The overflow-x: hidden rule on .view was interfering with the sticky behaviour of the filter bar.

Fix: Commented out the overflow-x: hidden rule from the mobile CSS for .view.

Checked: Refreshed the page and checked the filter bar while scrolling in mobile view.

Time: Approximately 1 hour

CC-01 - "The search suggestions are behind everything"

Reproduced: Typed a dish name in the search bar. The suggestions appeared behind other elements and were difficult to click.

Cause: The search suggestions were getting hidden behind other page elements because of the CSS stacking order.

Fix: Changed the z-index of .search-wrap from 1 to 60 so the search suggestions could appear above the surrounding elements.

Checked: Tested the search suggestions again and checked that they appeared properly and could be clicked.

Time:  Approximately 1 hour

Could not fix

CC-08 — "Expired coupons can be applied"

What I tried: Inspected backend/data/coupons.json and the coupon logic in backend/logic/pricing.js. Found that the FRESHERS24 coupon has an expiry date of September 30, 2024. Examined the applyCoupon logic for its validation checks.

Where I got to: The coupon application logic checks conditions such as usage limits and minimum order value, but I could not complete and verify a fix for expiry validation.

What I would try next: Add an expiry-date check in the coupon application logic, then test expired and valid coupons to confirm that only eligible coupons can be applied.