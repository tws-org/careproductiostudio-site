# Process

You should follow this process to build the entire project:

1. Read everything first: REQUIREMENTS.md (success criteria are the contract), SELF_IMPROVE.md, README.md, .devcontainer/ (ports, installed tools), and any skills available to you.
2. Build the entire project as documented in REQUIREMENTS.md, phase by phase.
3. Ensure all success criteria are met — demonstrated, not asserted.
4. Use your product_review subagent to check the final product.
5. Incorporate the review feedback (fix real issues; consciously skip out-of-scope nice-to-haves).
6. IMPORTANT: follow the instructions in SELF_IMPROVE.md to improve yourself.

You must complete step 6 (self-improvement) before you stop.

## Design Assets

The approved visual designs for the site are located in `care-product-studio-site`. Treat this as the source of truth for layout, visual styling, and page content. Do not invent new copy, colors, or layout that conflicts with what's in that folder — if something in REQUIREMENTS.md seems to conflict with the designs, flag it rather than silently picking one over the other.

## Notes for the product_review subagent

When reviewing the final product, check it against REQUIREMENTS.md's Success Criteria section directly, item by item, not against general code quality alone. A criterion is only satisfied if it can be demonstrated (a working route, a passing deploy, a visible element), not because the relevant code exists somewhere in the repo.
