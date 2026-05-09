# Main Page of Smart-Kid

Simple, visible, and readable large buttons. Optimized for phones. The top bar should display the current navigation. Like Home > 3rd grade > Maths in the header (all clickable). There should be also placeholder for author credits in the footer.
The page should be divided into grades (buttons). Clicking on a grade should display other buttons - each grade should have its own subjects. Each subject should display subpages for that subject. Up to this point, it should only be a static page with a selection of options - clicking on buttons should only change the selection of further options.

# Subject: Mathematics

On the subject page, there should be buttons launching a subpage with JavaScript for each subcategory:

## Subcategory: Addition, Subtraction, Multiplication, and Division with Remainder

Random seed: a window with a value + regeneration of the value. This parameter should change the order of randomly generated examples.
Selection of the number of digits for factor 1 (moving bar with range).
Selection of operation types: +, -, *, / (integer, remainder).
Selection of the number of digits for factor 2 (moving bar with range).
Display of the task + field for the result + submit button.
Input window for notes and auxiliary calculations (something like graph paper with the ability to write numbers into cells - select a cell and write. The next number is automatically written into the next cell, if the cell is full, it is not overwritten automatically. The value written in the cell changes only after clicking on that cell. After selecting a cell, the value is highlighted - it can be immediately overwritten or deleted. there should be option to set the dimension, like 5x5 or 6x6 etc).
Counter - correct/incorrect, tracking (which examples were wrong, what was the overall distribution of examples within the selected range - 3 lists with range and red/green marks; optionally and/or a table with answers).

# Czech grammar

## i/y — Vyjmenovaná slova (Listed Words)

**Subject:** Czech Language, 3rd grade

### Goal

Exercise where pupils choose the correct letter **i** or **y** after the consonants B, L, M, P, S, V, Z (vyjmenovaná slova). Sentences are stored as plain-text Markdown files, one sentence per line, grouped by the practised consonant.

### Content

Sentence bank split across `scripts/czech/listed_words/B.md`, `L.md`, `M.md`, `P.md`, `S.md`, `V.md`, `Z.md`. Each file contains sentences from the curriculum that include multiple instances of the letter paired with i/y.

### Configuration

- **Letter checkboxes** B L M P S V Z — include sentences from the selected files in the pool.
- **Seed + Regenerate ⟳** — seeded RNG ensures reproducible session order.

### Difficulty

| Level  | What is hidden |
|--------|---------------|
| Easy   | Only the i/y immediately following the practised consonant |
| Medium | The above plus one additional randomly chosen i/y from anywhere in the sentence |
| Hard   | Every i/y (and í/ý) occurrence in the entire sentence |

### Interaction design

- One sentence at a time with gap slots for hidden letters.
- Each gap slot has an inline **[i]** and **[y]** button directly above the blank. Clicking highlights the button and fills the slot with the selected letter.
- **Check** button evaluates all gaps: correct → green, incorrect → red (reveals actual character).
- Button label changes to **Next** after checking; click advances to the next sentence.
- Score counter (✓ / ✗) and session history shown below.

### Notes on i/í and y/ý

The exercise treats i and í (and y and ý) as the same choice: pupils press **i** for either short or long i-sound, and **y** for either short or long y-sound. After checking, the actual character (with or without accent) is revealed.



“i”
“y”


