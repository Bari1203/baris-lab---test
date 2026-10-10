# BARI'S LAB (דמו)

לקרוא את המחיר. לפתח שיקול דעת. / Read price. Think independently.

דמו חי של מרחב מחקר ולמידה על פעולת מחיר (Price Action, בלי אינדיקטורים).

## חשוב
- **שיתוף ידע בלבד. לא המלצה, לא ייעוץ ולא הצעה לבצע פעולה.**
- כל החברות, המחירים, הנרות, האירועים והתרחישים בדמו הם **נתוני דוגמה פיקטיביים**.
- אין שרת, אין חשבונות ואין חיבור לברוקר. הנתונים נשמרים רק בדפדפן (localStorage).
- מודל הציון (v0.1) הוא הצעה שלא הוכחה.

## הרצה
אתר סטטי. פותחים את `index.html` דרך שרת סטטי כלשהו (למשל `python3 -m http.server`).

## מבנה
`index.html` · `styles.css` · `i18n.js` (מילון עברית/אנגלית) · `data.js` (נתוני דוגמה) · `audio.js` · `app-core.js` · `views-a.js` · `views-b.js`

`index.html` הוא עמוד מלא ומוכן לפרסום כאתר סטטי (GitHub Pages, Vercel ודומיהם), בלי שלב בנייה.

## עדכון 9/10/2026: השיטה של ברי באתר
- **למידה:** מסלול "השיטה של ברי" (11 פרקים: עמודי התווך, זמן, נזילות, מומנטום, ביסוס וסגירות a–d, תשעת עקרונות הנר, NQ מול ES, תרחישים, מקרים אמיתיים, מה עוד לא נכתב). המקור: הבריף של ברי. אינטואיציה, לא חוק.
- **מדד הרדאר:** מודל ציון v0.2 עם תשעת הפרמטרים. המשקלות זמניות ולא מכוילות.
- **יומן:** שדות עסקה מובנים (חשבון נוסטרו/אישי, דירוג, סוג סגירה, SMT, TP, R:R מחושב) וסטטיסטיקה, עם אזהרת מדגם קטן.
- **סקירה שבועית:** קטע NQ מול ES. **אירועים:** שעות קריטיות לפי ניו יורק.
- כל הנתונים באתר הם דוגמה, פרט למקרים שברי תיעד בעצמו (מסומנים). לא המלצה.

## עדכון 10/10/2026
- שיעור חדש (עקרונות 10–13), הציון עבר ל-10 פרמטרים (v0.3, משקלות זמניות).
- סקירה שבועית בפורמט סיעור מוחות, שבוע ראשון–שישי בשם "חודש · תאריכים", וקיפול "תוכנית מול מה שקרה" (נשמר מקומית).
- יומן סווינג (WATCHING/OPEN/CLOSED, SMT מול מדד, תאריך דוחות, ימי החזקה ו-P&L באחוזים), כרטיס WATCHING ברדאר, אזהרת דוחות על כרטיס מניה (נתוני דוגמה).
- עדיין לא נבנה: מנוע סריקה, נתוני שוק, סקירה אוטומטית, סנכרון Notion, Pine Script, שרת. פתוחים ולא הומצאו: ניהול סיכון, סשנים, תהליך הכנה מלא, חובה/בונוס בסטאפ, לונג מלא, עסקאות הפסד, פרמטרי רדאר בסיסיים.

## Session cleanup (Oct 10)
- Journal: only two trading journals (day, swing), each with a stat strip, results calendar, day panel, week and list views. Everything is sample data until real trades are entered; stored in the browser only.
- Intro: first visit must be read to the end before the site opens; personalization lives in Settings.
- Removed the 9-step wizard, the old general journal code and unused text keys; slower infinite animations now stop or run on hover only.
- Fixed: global `[hidden]` rule (the page no longer depends on the host), phone header overflow, missing `sec.futures` label.
