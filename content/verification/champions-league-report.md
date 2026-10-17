# Champions League question bank: independent verification report

Checked file: `game/data/champions-league.json` (50 questions). Checked on 2026-10-17 using fresh web searches only.

**Summary:** 41 pass, 9 fix, 0 drop. Every answer is factually correct. No distractor turned out to be true, and no fact has changed since the asOf date. The 9 fixes break down as follows:
- 1 wrong fact in a `detail` field (r03)
- 1 cross-question leak, which touches 2 ids (r01 and r19)
- 2 questions where the distractors make the answer too easy to eliminate (r07, r26)
- 1 answer that gives itself away through its formatting (r05)
- 2 wording problems in Hebrew (r11, r22)
- 1 source URL that can't be verified (h19)

Leaks found: **1 direct** (r01 and r19). Related to it, r27, h01 and r20 all say that Arsenal played in the 2026 final, so r01 comes down to a choice between PSG and Arsenal. Hebrew spellings checked: הנדל (hamichlol.org.il), plus מוצרט, בטהובן and באך (standard Hebrew Wikipedia/Hamichlol forms). מכבי חיפה, הפועל באר שבע and הפועל תל אביב match the spelling used by Israeli outlets (Kan, Walla, Sport1, Sport5). I found no differences. Hebrew grammatical agreement (gender and number) is correct in all 50 questions.

## Regular

ucl-r01: fix — the answer (PSG) is correct. Final in Budapest on 30 May 2026: 1-1 after extra time, PSG won 4-3 on penalties. **Leak:** the r19 stem ("שער השוויון של פריז סן ז'רמן בגמר 2026") reveals that PSG played in this final, and r27, h01 and r20 reveal that Arsenal was the other finalist. Fix this through r19's wording (see r19); no change is needed in r01 itself; https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
ucl-r02: pass — Real Madrid have 15 titles and 18 finals, both records; https://www.uefa.com/uefachampionsleague/news/0275-1541637ad1db-88aeeefefefd-1000--champions-league-winners-list-which-teams-have-won-the-eu/
ucl-r03: fix — the answer is correct (Ronaldo 140, Messi 129, Lewandowski 109, Benzema 90 as of 14 Oct 2026). The detail is wrong: Ronaldo is NOT the only player to score in three different finals. Di Stéfano scored in five European Cup finals (1956-60). Correct to: "והוא השחקן הראשון שהבקיע בשלושה גמרים בעידן ליגת האלופות (מאז 1992)", or simply delete the clause; https://www.tntsports.co.uk/football/champions-league/2016-2017/video-the-moment-cristiano-ronaldo-matched-di-stefano-for-scoring-in-three-european-cup-finals_sto6197978/story.shtml
ucl-r04: pass — Mbappé was top scorer with 15 goals, ahead of Kane with 14. This is his second top-scorer award; https://www.uefa.com/uefachampionsleague/news/02a5-20a9b1d54074-d4a2c11aa589-1000--champions-league-2025-26-season-in-numbers/
ucl-r05: fix — the fact is correct. However, the answer is the only option with an English gloss in parentheses, "(Big Ears)", which gives it away. Remove "(Big Ears)" from the answer; the detail already gives "Ol' Big Ears"; https://www.planetfootball.com/champions-league/champions-league-trophy-worth-weight-size-history-who-keeps-it
ucl-r06: pass — Liverpool came back from 0-3 to 3-3 and won 3-2 on penalties; Gerrard 54', Šmicer 56', Alonso about 60'; https://www.liverpoolfc.com/news/day-2005-liverpools-champions-league-miracle-istanbul
ucl-r07: fix — the fact is correct: Chelsea won in 2012 in Munich and were the first London club to win. Two problems: (1) Liverpool and Man Utd are not London clubs, and the stem says "from London", so a kid can rule them out and pick between Chelsea and Arsenal. Use London distractors: ארסנל, טוטנהאם, ווסטהאם. (2) The wording "שהייתה הראשונה מלונדון שעושה זאת" is awkward. Suggested: "בשנת 2012 זכתה בגביע, לראשונה, קבוצה מלונדון. איזו קבוצה זו?"; https://en.wikipedia.org/wiki/2012_UEFA_Champions_League_final
ucl-r08: pass — Puskás Aréna, Budapest, 30 May 2026; https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
ucl-r09: pass — Metropolitano, Madrid, 5 June 2027; https://en.wikipedia.org/wiki/2026%E2%80%9327_UEFA_Champions_League
ucl-r10: pass — Maccabi Haifa were the first Israeli club in the group stage (2002/03). Their three appearances (2002/03, 2009/10, 2022/23) are an Israeli record; https://en.wikipedia.org/wiki/Maccabi_Haifa_F.C._in_European_football
ucl-r11: fix (minor) — the fact is correct: Hapoel Be'er Sheva, the Israeli champion, entered in the second qualifying round and lost to Sabah 6-4 on aggregate in the play-off. The qualifiers are over, so the present tense "היא הנציגה" should be "הייתה הנציגה". Optionally add to the detail: "והודחה בסבב הפלייאוף מול סבאח מאזרבייג'ן"; https://www.jns.org/news/israel-news/hapoel-beer-sheva-falls-short-of-champions-league-qualification-in-baku
ucl-r12: pass — PSG 5-0 Inter in Munich on 31 May 2025, the club's first title; https://www.thescore.com/epl/news/3294092
ucl-r13: pass — the European Cup (גביע אירופה לאלופות), renamed in 1992; https://en.wikipedia.org/wiki/UEFA_Champions_League
ucl-r14: pass — Real Madrid 2-0 Dortmund at Wembley. Note: the detail only repeats the stem, so consider adding a real fact (e.g. the 15th title); https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
ucl-r15: pass — Man City 1-0 Inter in Istanbul in 2023; City's only title (1 title in 2 finals); https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
ucl-r16: pass — Man Utd 2-1 Bayern at Camp Nou, attendance 90,245; https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
ucl-r17: pass — Tony Britten's anthem, adapted from Handel's "Zadok the Priest", performed by the Royal Philharmonic Orchestra. Hebrew spelling הנדל confirmed; https://en.wikipedia.org/wiki/Tony_Britten
ucl-r18: pass — the top 8 go straight to the round of 16, places 9-24 play the knockout play-offs, and places 25-36 are eliminated; https://en.wikipedia.org/wiki/2026%E2%80%9327_UEFA_Champions_League
ucl-r19: fix — the answer is correct (Dembélé, 65' penalty), but the stem names PSG as a 2026 finalist, which leaks r01's answer. Reword without the team, e.g. "מי הבקיע מנקודת הפנדל את שער השוויון בגמר 2026?" (the distractor Havertz still works, since he scored Arsenal's goal); https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
ucl-r20: pass — Arsenal beat Atlético 2-1 on aggregate (1-1 away, 1-0 at home); their first final since 2006; https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
ucl-r21: pass — Bayern 1-0 PSG in Lisbon in 2020. The 2020-2023 finals were all 1-0; https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
ucl-r22: fix (wording) — the fact is correct: PSG won 4-2 at Man City on 14 Oct 2026 (matchday 2), and with their 6-1 win over Slovan on MD1 they have 6 points. "ביום המשחק השני" is a calque of "Matchday 2"; Israeli outlets say "במחזור השני". Also consider replacing the source, which is a fixtures article and does not show the result; https://aljazeera.com/sports/2026/10/14/psg-beat-man-city-4-2-in-champions-league-thriller
ucl-r23: pass — Milan have 7 titles from 11 finals; https://www.uefa.com/uefachampionsleague/news/0275-1541637ad1db-88aeeefefefd-1000--champions-league-winners-list-which-teams-have-won-the-eu/
ucl-r24: pass — Messi is 2nd with 129 goals; Lewandowski has 109, Benzema 90, Haaland fewer. Messi has 8 hat-tricks; https://www.uefa.com/uefachampionsleague/news/0257-0e910cf2494a-5185150de9d4-1000--champions-league-all-time-top-scorers-cristiano-ronaldo-/
ucl-r25: pass — Gerrard headed in at 54'; Crespo and Shevchenko played for Milan; https://www.liverpoolfc.com/news/day-2005-liverpools-champions-league-miracle-istanbul
ucl-r26: fix — the fact is correct (Kane 14 goals, the most by an English player in one season; first Englishman to score in 7 games in a row). But the stem asks "which ENGLISH player" and none of the three distractors (Mbappé, Haaland, Lewandowski) is English, so the question answers itself. Replace with English players, e.g. אנתוני גורדון (10 goals in 2025/26), ג'וד בלינגהאם, בוקאיו סאקה; https://www.uefa.com/uefachampionsleague/news/02a5-20a9b1d54074-d4a2c11aa589-1000--champions-league-2025-26-season-in-numbers/
ucl-r27: pass — the 2006 final was Barcelona 2-1 Arsenal at the Stade de France; https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
ucl-r28: pass — Vitinha (PSG) was player of the match in the 2026 final; https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
ucl-r29: pass — Aston Villa have 1 title; Liverpool 6, Barcelona 5, Ajax 4; https://www.uefa.com/uefachampionsleague/news/0275-1541637ad1db-88aeeefefefd-1000--champions-league-winners-list-which-teams-have-won-the-eu/
ucl-r30: pass — Real Madrid 1-0 Liverpool at the Stade de France in 2022; https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals

## Hard

ucl-h01: pass — Havertz scored in the 6th minute; https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
ucl-h02: pass — Mbappé scored 13 goals in the league phase, breaking Ronaldo's record of 11 (2015/16); https://www.uefa.com/uefachampionsleague/news/02a5-20a9b1d54074-d4a2c11aa589-1000--champions-league-2025-26-season-in-numbers/
ucl-h03: pass — the record is 17 goals, by Ronaldo in 2013/14. Mbappé's 15 in 2025/26 did not beat it; https://olympics.com/en/news/most-goals-single-uefa-champions-league-season
ucl-h04: pass — Haaland reached 50 goals in 49 matches (previous record: Van Nistelrooy, 62 matches); https://www.uefa.com/uefachampionsleague/news/02a5-20a9b1d54074-d4a2c11aa589-1000--champions-league-2025-26-season-in-numbers/
ucl-h05: pass — Max Dowman (Arsenal) was 15 years 308 days old; https://www.uefa.com/uefachampionsleague/news/02a5-20a9b1d54074-d4a2c11aa589-1000--champions-league-2025-26-season-in-numbers/
ucl-h06: pass — 36 teams in the league phase; https://en.wikipedia.org/wiki/2026%E2%80%9327_UEFA_Champions_League
ucl-h07: pass — 8 matches per team (4 home, 4 away); https://en.wikipedia.org/wiki/2026%E2%80%9327_UEFA_Champions_League
ucl-h08: pass — renamed in 1992, so 1992/93 was the first season under the name; a group stage was added in 1991; https://en.wikipedia.org/wiki/UEFA_Champions_League
ucl-h09: pass — 16 teams in 1955/56; https://en.wikipedia.org/wiki/UEFA_Champions_League
ucl-h10: pass — Real Madrid 7-3 Eintracht at Hampden Park in 1960, 10 goals, still the record; https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
ucl-h11: pass — Juventus have 2 titles from 9 finals (7 lost); https://www.uefa.com/uefachampionsleague/news/0275-1541637ad1db-88aeeefefefd-1000--champions-league-winners-list-which-teams-have-won-the-eu/
ucl-h12: pass — Spain 20, England 15, Italy 12 (Germany 8); https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
ucl-h13: pass — 6 English clubs (Arsenal, Liverpool, Man City, Chelsea, Spurs, Newcastle), the first time any country has had six; the previous English high was 5 (2017/18); https://www.tottenhamhotspur.com/news/983867/uefa-champions-league-football-secured-for-202526
ucl-h14: pass — 5 goals (PSG 5-0 Inter, 2025). Before that the record was 4 (1974 replay, 1989, 1994 and the 1960 7-3); https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
ucl-h15: pass — 1-1 (Müller 83', Drogba 88'), then Chelsea won 4-3 on penalties at the Allianz Arena; https://en.wikipedia.org/wiki/2012_UEFA_Champions_League_final
ucl-h16: pass — Doué scored at 20' and 63'; Hakimi, Kvaratskhelia and Mayulu scored once each; https://www.thescore.com/epl/news/3294092
ucl-h17: pass — Crespo scored at 39' and 44'; Maldini at 1' (about 51 seconds); https://africa.espn.com/football/match/_/gameId/183634/liverpool-ac-milan
ucl-h18: pass — the trophy is 73.5 cm tall and weighs about 7.5 kg; https://www.uefa.com/uefachampionsleague/news/022a-0e6a4115e42c-7a8e91e430ec-1000--uefa-champions-league-trophy-all-you-need-to-know/
ucl-h19: fix (source only) — the fact is correct: Ronaldo 183, Casillas 177, Messi and Müller 163, Raúl 142, Lewandowski fewer. The cited source is a legacy uefa.com "newsid=" URL that can't be verified (these old links now redirect). Replace it with the current UEFA appearances page; https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-games/
ucl-h20: pass — the lyrics are in English, German and French (UEFA's official languages); https://en.wikipedia.org/wiki/UEFA_Champions_League

## Re-check

Scoped re-check of the 9 changed ids. I read `game/data/champions-league.json` again from scratch (50 questions) and ran new searches. All 9 are addressed, and the edits introduced no new issues.

ucl-r01: ADDRESSED — PSG is still correct. The distractors are now ליברפול, ריאל מדריד and באיירן מינכן; Arsenal has been removed. r19 no longer names PSG. r27, h01 and r20 still say Arsenal reached the final, but Arsenal is no longer an option, so the clue can't reduce r01 to a 50/50. The detail names Arsenal, which is fine because it only shows after answering; https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
ucl-r03: ADDRESSED — the new detail is verified. Ronaldo was the first player to reach 100 Champions League goals (18 Apr 2017, hat-trick against Bayern), and UEFA's milestone article lists him on "100 (137 games)", qualifying excluded; https://uefa.com/uefachampionsleague/news/0238-0e8e35d9b3f3-1f1dfd59b9f9-1000--ronaldo-s-100-ten-of-his-greatest-champions-league-hits (milestone date: https://www.guinnessworldrecords.com/world-records/477767-first-player-to-score-100-uefa-champions-league-goals). Optional wording tweak: "(נכון לאוקטובר 2026)" at the end now attaches to a 2017 fact, so it could move to just after the first clause.
ucl-r05: ADDRESSED — the answer is now just "אוזניים גדולות", with no gloss in parentheses, so it no longer stands out from the other options; https://www.uefa.com/uefachampionsleague/news/022a-0e6a4115e42c-7a8e91e430ec-1000--uefa-champions-league-trophy-all-you-need-to-know/
ucl-r07: ADDRESSED — the stem is not ambiguous. Read either way, "a London club won its first title" or "the first London club to win", the only correct answer is Chelsea (2012). Arsenal, Tottenham and West Ham are all London clubs and none has ever won the European Cup/Champions League (Arsenal lost the 2006 final, Spurs lost in 2019). One possible snag: Tottenham (Europa League 2025) and West Ham (Conference League 2023) have won other European cups, but not in 2012, so "בשנת 2012" rules them out. Optional hardening: "זכתה בגביע ליגת האלופות"; https://www.uefa.com/uefachampionsleague/news/0275-1541637ad1db-88aeeefefefd-1000--champions-league-winners-list-which-teams-have-won-the-eu/
ucl-r11: ADDRESSED — the stem now says "הייתה". The fact is still correct: Be'er Sheva went out to Sabah in the play-off round; https://www.jns.org/news/israel-news/hapoel-beer-sheva-falls-short-of-champions-league-qualification-in-baku
ucl-r19: ADDRESSED — the new stem "מי הבקיע מנקודת הפנדל את שער השוויון בגמר 2026?" names no team and reads naturally. Dembélé (65', penalty) is correct. Havertz scored Arsenal's opener, not the equaliser; Vitinha and Hakimi did not score; https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
ucl-r22: ADDRESSED — "במחזור השני" reads naturally. The cited fixtures article now shows results, "Manchester City 2-4 Paris Saint-Germain" (14 Oct 2026) and PSG 6-1 Slovan on MD1, so it supports both the claim and the 6 points in the detail. The source can stay; https://www.uefa.com/uefachampionsleague/news/02a8-2174c9e9019d-f909a77bd77a-1000--2026-27-champions-league-all-the-league-phase-fixtures-a/
ucl-r26: ADDRESSED — Kane's 14 goals is correct, and UEFA says it is the most ever by an English player in one season, so no other English player matches the stem. Saka, Bellingham and Gordon are all English, and all scored fewer (Gordon had 10, the most of the three); https://www.uefa.com/uefachampionsleague/news/02a5-20a9b1d54074-d4a2c11aa589-1000--champions-league-2025-26-season-in-numbers/
ucl-h19: ADDRESSED — the new UEFA URL (updated 14 Oct 2026) lists Ronaldo 183, Casillas 177, Messi 163, Müller 163, Neuer 162 and Benzema 152, which supports the answer and the detail; https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-games/

New Hebrew spellings are all confirmed against Israeli outlets, with no changes needed:
- טוטנהאם and ווסטהאם: https://sport1.maariv.co.il/?p=567417
- ג'וד בלינגהאם and אנתוני גורדון: https://sport1.maariv.co.il/?p=1870894
- בוקאיו סאקה (ONE via ynet): https://www.ynet.co.il/sport/article/one488823
