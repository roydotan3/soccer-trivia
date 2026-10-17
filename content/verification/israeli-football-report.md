# Israeli Football Question Bank: Independent Verification Report

**Summary:** I checked all 50 questions in `game/data/israeli-football.json` against fresh web searches on 2026-10-17. Results: **40 pass, 10 fix, 0 drop.** There are two factual problems. The first is **h17**: Zahavi's 29-goal Chinese Super League record no longer stands, because Wu Lei scored 34 in 2024. The second is **r25**: one of its distractors, Maccabi Tel Aviv, is also a correct answer, since Berkovic played there from 2005 to 2006. **h19** has an ambiguous stem. "בכמה נקודות הובילה" reads naturally as the size of the lead, which is 1 point, not the 16-point total. **r14** includes an embellishment I could not verify. The other fixes are wording or citation problems:
- **r10, r11, r26, h05** use "הכול-זמנים". It is a stiff calque, and kids would say "של כל הזמנים".
- **r16 and h10** cite a May 2024 Sport1 column about Maccabi Petah Tikva, which says nothing about Maccabi Tel Aviv's 25th cup.

**Cross-question note (not counted above):** several `detail` texts give away the answers to other questions in the bank:
- r10 and h04 reveal 74 caps.
- r11 reveals 101 caps (h05).
- r26 reveals 274 goals (h16).
- r16 reveals 25 cups (h10).
- r28 reveals 72 years (h12).
- h15 reveals the answer to r18.
- r29 and h08 are near-duplicates.

If questions from the same bank can appear in one game session, de-duplicate them or trim those details.

**Volatile items:** h19 and h20 reflect the table after 6 rounds of 2026/27, updated 12 Oct 2026. Only the Wikipedia season page confirms them, and they will go stale within weeks.

---

## Regular (r01–r30)

isr-r01: pass — Maccabi Haifa, founded 1913, play at Sammy Ofer Stadium in Haifa; https://en.wikipedia.org/wiki/Maccabi_Haifa_F.C.
isr-r02: pass — Maccabi Tel Aviv's nickname is "The Yellows" and their colours are yellow and blue. Beitar wears yellow-black, so the stem's "צהוב וכחול" rules it out; https://en.wikipedia.org/wiki/Maccabi_Tel_Aviv_F.C.
isr-r03: pass — Bloomfield is the home of both Maccabi and Hapoel Tel Aviv; https://en.wikipedia.org/wiki/Bloomfield_Stadium
isr-r04: pass — Maccabi Tel Aviv has 26 titles, ahead of Maccabi Haifa (15) and Hapoel TA (13). Optional: the detail could say "נכון לאוקטובר 2026", because the 2025/26 title went to Be'er Sheva and the count is still 26; https://en.wikipedia.org/wiki/List_of_Israeli_football_champions
isr-r05: pass — Hapoel Be'er Sheva won 2025/26 with 79 points, ahead of Beitar (76). It was their 6th title and their first since 2017/18; https://en.wikipedia.org/wiki/2025%E2%80%9326_Israeli_Premier_League
isr-r06: pass — Beitar Jerusalem were founded in 1936 and play at Teddy Stadium; https://en.wikipedia.org/wiki/Beitar_Jerusalem_F.C.
isr-r07: pass — Hapoel Be'er Sheva play at Turner Stadium in Be'er Sheva; https://en.wikipedia.org/wiki/Hapoel_Be%27er_Sheva_F.C.
isr-r08: pass — Wikipedia lists the nicknames "The Camels" and "The Reds from the South", with red and white kits; https://en.wikipedia.org/wiki/Hapoel_Be%27er_Sheva_F.C.
isr-r09: pass — Maccabi Haifa's nickname is "The Greens", and none of the distractors carries that nickname (Netanya is "The Diamonds"); https://en.wikipedia.org/wiki/Maccabi_Haifa_F.C.
isr-r10: fix — The fact is correct: Zahavi has 35 goals in 74 caps (2010–2024), per https://en.wikipedia.org/wiki/Israel_national_football_team_records_and_statistics. Change the wording "מלך השערים הכול-זמנים של נבחרת ישראל" to "מלך השערים של כל הזמנים בנבחרת ישראל", the natural form for kids. The detail also reveals the answer to h04 (74).
isr-r11: fix — The fact is correct: Benayoun is the caps leader with 101 (some press counts give 102), per https://en.wikipedia.org/wiki/Israel_national_football_team_records_and_statistics. Change the wording "שיא ההופעות הכול-זמנים" to "שיא ההופעות של כל הזמנים". The detail reveals the answer to h05.
isr-r12: pass — Benayoun's English clubs were West Ham, Liverpool, Chelsea, Arsenal (loan) and QPR. None of the distractors are English clubs, and he never played for any of them; https://en.wikipedia.org/wiki/Yossi_Benayoun
isr-r13: pass — Benayoun was born in Dimona, and his first senior club was Hapoel Be'er Sheva (1997–98); https://en.wikipedia.org/wiki/Yossi_Benayoun
isr-r14: fix — The answer is correct: Spiegler scored in the 56th minute of the 1–1 draw with Sweden on 7 June 1970, Israel's only World Cup goal ever (https://en.wikipedia.org/wiki/Israel_at_the_FIFA_World_Cup). But the cited Sport1 article never uses the phrase "ונודע מאז בסיפוריו על 'הגול במקסיקו'", and I found no source for it. It is also vague for kids. Suggested stem: "מי כבש את השער היחיד של נבחרת ישראל בתולדות המונדיאל, מול שוודיה ב-1970?"
isr-r15: pass — Israel's only World Cup was 1970. It finished 3rd in its 2026 qualifying group, behind Norway and Italy, so the "2026" distractor is safely wrong; https://en.wikipedia.org/wiki/Israel_national_football_team
isr-r16: fix (source only) — The answer is correct: the 2026 final win took Maccabi Tel Aviv to 25 cups. But the cited source (sport1 ?p=1316460) is a May 2024 Dvorin column about Maccabi Petah Tikva and does not support the claim. Replace it with https://www.babagol.net/blog/2026/5/27/maccabi-tel-aviv-win-cup-25-in-israeli-cup-final (it says "25th cup"; the Jerusalem Post report says the same).
isr-r17: pass — Maccabi Tel Aviv beat Hapoel Be'er Sheva 2–1 at Teddy Stadium in late May 2026 (26 May per Walla, Betfred and the JPost; babagol says 27 May). The cited Walla page shows the result; https://sports.walla.co.il/league/2901
isr-r18: pass — Wikipedia: "first time the cup was won by a club from an Israeli Arab town" (2003–04); https://en.wikipedia.org/wiki/2003%E2%80%9304_Israel_State_Cup
isr-r19: pass — Bnei Sakhnin are based in Sakhnin. Minor: the stem spells it "סכנין" and the answer "סח'נין". Both spellings are standard, but using one spelling throughout would avoid a moment of doubt; https://en.wikipedia.org/wiki/Bnei_Sakhnin_F.C.
isr-r20: pass — Be'er Sheva have played at Turner since 2015–16; before that they played at Vasermil; https://en.wikipedia.org/wiki/Hapoel_Be%27er_Sheva_F.C.
isr-r21: pass — Netanya Stadium opened in October 2012 and is Maccabi Netanya's home; https://en.wikipedia.org/wiki/Maccabi_Netanya_F.C.
isr-r22: pass — Doha Stadium in Sakhnin opened in 2006 and was partly funded by Qatar; https://en.wikipedia.org/wiki/Bnei_Sakhnin_F.C.
isr-r23: pass — Wikipedia lists Beitar's nicknames as "The Menorah", "The Lions from the Capital" and "The Flag of the State". Minor: "הצהובים" is a slightly weak distractor because Beitar wear yellow, but that nickname belongs to Maccabi TA, so it is still wrong; https://en.wikipedia.org/wiki/Beitar_Jerusalem_F.C.
isr-r24: pass — Beitar's traditional colours are yellow and black; https://en.wikipedia.org/wiki/Beitar_Jerusalem_F.C.
isr-r25: fix — The distractor "מכבי תל אביב" is also correct: Berkovic played for Maccabi Tel Aviv in 2005–06, his final season, after Maccabi Haifa refused to take him back. Replace that distractor with "הפועל באר שבע" or "מכבי נתניה". Evidence: https://en.wikipedia.org/wiki/Eyal_Berkovic and https://www.thejc.com/life/sport/berkovic-to-take-charge-of-israels-youth-team-ietlals4
isr-r26: fix — The fact is correct: Spiegler scored 274 goals in all competitions, the club record (https://en.wikipedia.org/wiki/Maccabi_Netanya_F.C.; his league-only total is 217, per Hamichlol). Change the wording "מלך השערים הכול-זמנים" to "מלך השערים של כל הזמנים". The detail reveals the answer to h16.
isr-r27: pass — Hapoel Tel Aviv are Maccabi's Tel Aviv derby rival; https://en.wikipedia.org/wiki/Maccabi_Tel_Aviv_F.C.
isr-r28: pass — Maccabi Petah Tikva beat Be'er Sheva 1–0 on 30 May 2024. Their previous cup was in 1952, 72 years earlier; https://en.wikipedia.org/wiki/2023%E2%80%9324_Israel_State_Cup and https://sport1.maariv.co.il/?p=1316122
isr-r29: pass — Kiryat Shmona won the 2011–12 title. Wikipedia: it was the first title won outside the three major cities "in almost 30 years" (the previous one was Netanya in 1982–83). It is a near-duplicate of h08; https://en.wikipedia.org/wiki/Ironi_Kiryat_Shmona_F.C.
isr-r30: pass — The crest shows the Roaring Lion statue, which commemorates those killed in the Battle of Tel Hai (1 March 1920); https://en.wikipedia.org/wiki/Ironi_Kiryat_Shmona_F.C.

## Hard (h01–h20)

isr-h01: pass — Maccabi Tel Aviv have 26 titles, after winning both 2023–24 and 2024–25; https://en.wikipedia.org/wiki/List_of_Israeli_football_champions
isr-h02: pass — In 2002–03 Maccabi Haifa became the first Israeli club to reach the Champions League group stage. The distractors 2009–10 and 2022–23 are its later group-stage seasons, so they are correctly wrong for "first"; https://en.wikipedia.org/wiki/Maccabi_Haifa_F.C.
isr-h03: pass — 35 goals in 2015–16 is still the record. Every top scorer since has scored 24 or fewer (2025–26: Dor Peretz, 19); https://en.wikipedia.org/wiki/Israeli_Premier_League and https://www.maccabi-tlv.co.il/?p=325147
isr-h04: pass — Zahavi has 74 caps (2010 to 21 Mar 2024) and 35 goals; https://en.wikipedia.org/wiki/List_of_international_goals_scored_by_Eran_Zahavi
isr-h05: fix — The answer of 101 is correct per Wikipedia and RSSSF (https://rsssf.org/miscellaneous/isra-intlp-benayoun.html), and none of the distractors equals 102, the alternative press figure. Two wording problems: the stem says "הכול-זמנים" (change to "של כל הזמנים"), and the detail says "החזיק" in the past tense although he still holds the record (change to "מחזיק").
isr-h06: pass — Be'er Sheva won their first title in 1974–75 and their second in 1975–76; https://en.wikipedia.org/wiki/Hapoel_Be%27er_Sheva_F.C.
isr-h07: pass — Wikipedia: in 2015–16 the team "went 29 games without a loss" and lost only 3 matches. The title came 40 years after 1975–76; https://en.wikipedia.org/wiki/Hapoel_Be%27er_Sheva_F.C.
isr-h08: pass — Kiryat Shmona won in 2011–12 and clinched the title on 2 April 2012. The answer is also given away by r29, a near-duplicate; https://en.wikipedia.org/wiki/Ironi_Kiryat_Shmona_F.C.
isr-h09: pass — Maccabi Netanya have 5 titles: 1970–71, 1973–74, 1977–78, 1979–80 and 1982–83; https://en.wikipedia.org/wiki/Maccabi_Netanya_F.C.
isr-h10: fix (source only) — The answer of 25 is correct, following the May 2026 final. The cited sport1 ?p=1316460 is a 2024 Petah Tikva column and does not support it. Replace the source with https://www.babagol.net/blog/2026/5/27/maccabi-tel-aviv-win-cup-25-in-israeli-cup-final. Note that the Maccabi Tel Aviv Wikipedia page still says 24, so the "24" distractor is a was-true-until-May-2026 trap. The stem's "נכון לאוקטובר 2026" covers it, but the source must be one that shows 25.
isr-h11: pass — The final ended 2–1 to Maccabi (Varela 57', Revivo 64'; Abu Rumi 12' for Be'er Sheva) at Teddy Stadium; https://sports.walla.co.il/league/2901 and https://www.babagol.net/blog/2026/5/27/maccabi-tel-aviv-win-cup-25-in-israeli-cup-final
isr-h12: pass — Petah Tikva's previous cup wins were in 1935 and 1951–52, so the gap to 2024 is 72 years. The "כ-90 שנה" distractor is deliberately the gap from 1935, but "הקודמת" makes the question unambiguous; https://en.wikipedia.org/wiki/Maccabi_Petah_Tikva_F.C.
isr-h13: pass — The penalty came in the 86th minute per Wikipedia, Sport1 and Walla (babagol says 84', but neither 84 nor 86 is used as a distractor); https://sport1.maariv.co.il/?p=1316122
isr-h14: pass (minor) — Walla reports about 38,000. Wikipedia and Maariv (via the Jewish Virtual Library) say 35,000. Either way no distractor is close (10k/20k/50k), so the question is still unambiguous. Optional: soften the answer to "יותר מ-30,000"; https://sports.walla.co.il/item/544872 and https://en.wikipedia.org/wiki/2003%E2%80%9304_Israel_State_Cup
isr-h15: pass — Bnei Sakhnin beat Hapoel Haifa 4–1 at Ramat Gan on 18 May 2004; https://en.wikipedia.org/wiki/2003%E2%80%9304_Israel_State_Cup
isr-h16: pass — Spiegler scored 274 goals in all competitions, the club record. His league-only total is 217, which does not clash with any distractor; https://en.wikipedia.org/wiki/Maccabi_Netanya_F.C.
isr-h17: fix — The record claim is outdated. Zahavi's 29 goals in 2019 broke Elkeson's 28, but Wu Lei scored 34 goals for Shanghai Port in the 2024 CSL, so 29 is no longer the record. That also makes "35" or a higher figure an arguable answer to "שיא אותה ליגה". Rewrite the stem without the record claim, e.g. "כמה שערים כבש ערן זהבי בעונת 2019 בליגה הסינית, כשזכה בתואר מלך השערים?" (answer 29), or say "a record at the time" ("שיא הליגה באותה תקופה"). Evidence: https://en.wikipedia.org/wiki/2024_Chinese_Super_League and https://en.wikipedia.org/wiki/Chinese_Super_League (Golden Boot table: 2024 Wu Lei 34).
isr-h18: pass — Zahavi announced his retirement in an Instagram video in early January 2026, aged 38, after leaving Maccabi Tel Aviv in summer 2025; https://sport1.maariv.co.il/israeli-soccer/ligat-haal/article/1735357/ and https://en.wikipedia.org/wiki/Eran_Zahavi
isr-h19: fix — The stem is ambiguous. "בכמה נקודות הובילה מכבי תל אביב" most naturally means "by how many points did it lead", which is 1 point over Maccabi Haifa (15), not the 16-point total. The detail itself says "בפער של נקודה אחת". Reword to "כמה נקודות צברה מכבי תל אביב, שעמדה בראש טבלת ליגת העל אחרי 6 מחזורים בעונת 2026/27?" (answer 16). The data is confirmed only by the Wikipedia season page (updated 12 Oct 2026) and is highly volatile; https://en.wikipedia.org/wiki/2026%E2%80%9327_Israeli_Premier_League
isr-h20: pass (volatile) — Dor Peretz (Maccabi TA) leads with 8 goals after 6 rounds, ahead of Idoko (5) and Novakovich (4). The distractors are safely wrong: Zahavi and Suan are retired, and Hindi is not near the top. I could confirm it only on Wikipedia, and it will go stale quickly, so plan a refresh or retirement date; https://en.wikipedia.org/wiki/2026%E2%80%9327_Israeli_Premier_League

---

## Re-verification (2026-10-17, scoped re-check after writer fixes)

**Summary:** I re-read the current `game/data/israeli-football.json` (still 50 questions) and checked the items below.
- All 10 original fixes are **ADDRESSED**.
- The new h08 **passes**.
- The detail trims on r10, r11, r26, r16, r28 and h15 introduced **no new factual errors** and broke no distractor logic.
- There is **one new wording issue** in the r16 detail ("השחקנית").
- Several **question stems** (not just details) still give away answers to other questions. I had not flagged these in the first pass because I only checked details. They are listed below.

isr-h17: ADDRESSED — The stem no longer claims a record. It now asks about 2019 "כשזכה בתואר מלך השערים", and the answer 29 is correct (2019 CSL Golden Boot: Zahavi, Guangzhou R&F, 29). The distractors 35/20/40 are wrong; https://en.wikipedia.org/wiki/Chinese_Super_League
isr-r25: ADDRESSED — The distractors are now Hapoel Be'er Sheva, Beitar Jerusalem and Hapoel Tel Aviv. Berkovic never played for any of them. His senior clubs were Maccabi Haifa, Southampton (loan), West Ham, Celtic, Blackburn (loan), Man City, Portsmouth and Maccabi TA; https://en.wikipedia.org/wiki/Eyal_Berkovic
isr-h19: ADDRESSED — The stem now asks "כמה נקודות צברה", so the answer is clearly the 16-point total. Distractors: no other team has 18 or 14 points. Beitar has 12, but the question is explicitly about Maccabi TA, so that is not a trap; https://en.wikipedia.org/wiki/2026%E2%80%9327_Israeli_Premier_League
isr-r14: ADDRESSED — The "הגול במקסיקו" embellishment is gone. The new stem ("השער היחיד של נבחרת ישראל בתולדות המונדיאל, מול שוודיה ב-1970") is accurate: Spiegler scored in the 56th minute of a 1–1 draw, Israel's only World Cup goal ever. The cited Sport1 article supports it; https://en.wikipedia.org/wiki/Israel_at_the_FIFA_World_Cup
isr-r16: ADDRESSED (source) — The source is now babagol's "Maccabi Tel Aviv win cup 25" report, which supports the claim. The detail trim no longer states a count. See the NEW issue line below about "השחקנית".
isr-h10: ADDRESSED — The source is now the babagol report, which says "25th cup in their storied history". The answer 25 and the "נכון לאוקטובר 2026" framing are intact; https://www.babagol.net/blog/2026/5/27/maccabi-tel-aviv-win-cup-25-in-israeli-cup-final
isr-r10: ADDRESSED — The stem now reads "מלך השערים של כל הזמנים בנבחרת ישראל". The trimmed detail ("כבש יותר שערים מכל שחקן אחר", 2010–2024) is accurate and no longer reveals 74 caps.
isr-r11: ADDRESSED — The stem now reads "שיא ההופעות של כל הזמנים". The trimmed detail is accurate and no longer reveals 101.
isr-r26: ADDRESSED — The stem now reads "מלך השערים של כל הזמנים במכבי נתניה". The trimmed detail is accurate and no longer reveals 274. The distractors are still wrong.
isr-h05: ADDRESSED (both) — The stem says "השיא של כל הזמנים" and the detail says "מחזיק בשיא". The answer 101 is unchanged and correct.
isr-h08 (new question): pass — Hapoel Tel Aviv reached the CL group stage in 2010–11. Wikipedia: "one of only three Israeli teams to have qualified for the UEFA Champions League group stage" (the other two are Maccabi Haifa and Maccabi TA).
- The "only three" claim still holds as of Oct 2026. Hapoel Be'er Sheva, the only Israeli club in 2026–27 CL qualifying, lost the play-off to Sabah 6–4 on aggregate on 25 Aug 2026 (https://www.jns.org/news/israel-news/hapoel-beer-sheva-falls-short-of-champions-league-qualification-in-baku).
- The distractors 2002/03, 2009/10 and 2022/23 are Maccabi Haifa's group-stage seasons, and Hapoel TA did not qualify in any of them. They are plausible and correctly wrong.
- The wording is clear for ages 9–11.
- Minor: those distractors overlap with h02's answer and distractors. If both questions appear in one session, a kid could eliminate 2002/03 using h02. This is acceptable, not a blocker.
- Source: https://en.wikipedia.org/wiki/Hapoel_Tel_Aviv_F.C.
isr-r28: OK (detail trim) — The detail ("ניצחה את הפועל באר שבע 1:0 ... אחרי הפסקה ארוכה מאוד") is accurate and no longer reveals 72.
isr-h15: OK (detail trim) — The detail no longer says "first Arab club", so it no longer reveals r18. "אחד ההישגים הגדולים בתולדות המועדון" is a safe claim, since it is the club's only major trophy. The answer 4:1 is unchanged and correct.
isr-h14 (also changed, not in my fix list): pass — The answer is now "יותר מ-30,000" with distractors 10k, 15k and 20k. This is consistent with both reported figures, 35,000 (Wikipedia/Maariv) and 38,000 (Walla). The detail correctly gives the range.

NEW issue — isr-r16 detail: "מכבי תל אביב היא השחקנית עם הכי הרבה זכיות" uses "השחקנית" (a female player), which is the wrong word for a club. Change it to "הקבוצה עם הכי הרבה זכיות בגביע המדינה".
NEW/remaining cross-question issue (stems, not details): several hard-question stems still name the answer to a regular question:
- h05 names Benayoun as the caps record holder, which answers r11.
- h10 names Maccabi TA as the cup record holder, which answers r16.
- h16 names Spiegler as Netanya's club scoring record holder, which answers r26.
- h11 says Maccabi TA beat Be'er Sheva in the 2025/26 final, which answers r17.
- h12 and h13 name Maccabi Petah Tikva as the 2023/24 cup winner, which answers r28.
- h15 names Bnei Sakhnin as the 2004 cup winner, which nearly answers r18.

This only matters if regular and hard questions can be served in the same session. If they can, keep each pair apart in the same game, or accept it as a design choice.

---

## Final re-check (2026-10-17): r16 wording and the reworded hard-question stems

**Summary:** I re-read the current JSON (50 questions). Every item in this check is fixed. No stem names its paired regular question's answer any more, and every reworded stem is still factually correct and has exactly one correct option. **The topic can be closed.** One optional, non-blocking note is at the end.

isr-r16: ADDRESSED — The detail now reads "מכבי תל אביב היא הקבוצה עם הכי הרבה זכיות בגביע המדינה".
isr-h05: ADDRESSED — The stem ("השחקן שמחזיק בשיא ההופעות של כל הזמנים") no longer names Benayoun. The answer 101 is correct, and no distractor equals 101 or the alternative 102 count.
isr-h10: ADDRESSED — The stem ("לקבוצה המחזיקה בשיא כל הזמנים") no longer names Maccabi TA. The answer 25 is correct as of Oct 2026.
isr-h16: ADDRESSED — The stem ("מלך השערים של כל הזמנים של מכבי נתניה") no longer names Spiegler. The answer 274 (all competitions) is correct, and no distractor matches his league-only 217.
isr-h11: ADDRESSED — The stem no longer names the winner. The 2025/26 final at Teddy in May 2026 ended 2:1 (Maccabi TA over Be'er Sheva). No distractor reverses that score. Minor: the detail now just repeats the stem, which is harmless.
isr-h12: ADDRESSED — The stem refers to "הקבוצה שזכתה בגביע המדינה בעונת 2023/24" without naming it. The answer of about 72 years (1952 to 2024) is correct. "הקודמת" still makes "כ-90 שנה" (the gap from 1935) clearly wrong.
isr-h13: ADDRESSED — The stem asks only for the minute of the winning penalty in the 2023/24 final, without naming the team or scorer. The answer, 86, matches Wikipedia, Sport1 and Walla.
isr-h15: ADDRESSED — The stem is now asked from the loser's side ("באיזו תוצאה הפסידה הפועל חיפה בגמר 2003/04"). The answer 4:1 is correct, and no distractor is the reversed score, so the RTL score order cannot cause confusion. The stem does reveal that Hapoel Haifa lost that final. That only helps a kid rule out one r18 distractor; it does not give away the answer.

Optional note (non-blocking): the explanation texts on hard questions, shown after the kid answers, still name the answers to their paired regular questions:
- h05 names Benayoun (r11).
- h10 names Maccabi TA (r16).
- h16 names Spiegler (r26).
- h12 and h13 name Maccabi Petah Tikva (r28).
- h15 names Bnei Sakhnin (r18).

This only matters if a hard question is served before its paired regular question in the same session. The easiest fix, if wanted, is in the game logic: don't serve both questions of a pair in one session.
