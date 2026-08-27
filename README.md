# SIR 2026-27 — Field Inspection Form

PUVVNL Azamgarh ka Substation Inspection Report (SIR) field entry form. Submit hone par
data seedha Google Sheet me save hota hai aur photo Google Drive folder me. Ek "Submitted
Reports" tab bhi hai jisme Division / Substation / Place / PR No dikhta hai, aur jab
sheet me PDF auto-merge ho jata hai to "Download PDF" button bhi wahi se milta hai.

## Files
| File | Kaam |
|---|---|
| `index.html` | Main form (yahi khulega browser me) |
| `icon.svg`, `icon-192.png`, `icon-512.png`, `favicon-32.png` | App icon / favicon |
| `manifest.json` | Phone home-screen par "app jaisa" add karne ke liye |
| `google-apps-script.gs` | Google Sheet backend (Apps Script me paste karna hai) |

## GitHub Pages par Deploy Karna (Step by Step)

1. **GitHub par naya repository banayein**
   - github.com par login karein → top-right `+` → **New repository**
   - Naam dein, e.g. `sir-inspection-form` → **Public** rakhein → Create repository

2. **Files upload karein**
   - Nayi repo ke andar **Add file → Upload files** par click karein
   - Is folder ke saare files (`index.html`, `icon.svg`, `icon-192.png`, `icon-512.png`,
     `favicon-32.png`, `manifest.json`) drag-drop karein
   - Neeche **Commit changes** par click karein
   - (`google-apps-script.gs` upload karna zaroori nahi — wo sirf Google Sheet ke
     Apps Script editor me paste hota hai, GitHub par nahi)

3. **GitHub Pages ON karein**
   - Repo ke andar **Settings** tab kholein
   - Left sidebar me **Pages** par click karein
   - **Source** me `Deploy from a branch` select karein
   - **Branch**: `main` aur folder `/ (root)` select karke **Save** karein

4. **Live link milega**
   - 1-2 minute wait karein, phir upar wahi Pages section me link dikhega, jaise:
     `https://<aapka-username>.github.io/sir-inspection-form/`
   - Yahi link JE staff ko bhej dein — mobile browser me khulega

5. **Baad me koi field/text change karna ho** to us file ko GitHub par edit karke
   commit kar dein — Pages 1-2 minute me automatically update ho jayega.

## Google Sheet Backend (agar pehle se setup nahi hai)

1. Apni Google Sheet kholein → **Extensions → Apps Script**
2. `google-apps-script.gs` ka pura code paste karke save karein
3. **Deploy → New deployment → Web app** → Execute as: *Me*, Access: *Anyone* → Deploy
4. Milne wala URL `index.html` ke andar `SCRIPT_URL` constant me already daala hua hai —
   agar naya deployment banayein to naya URL wahan update kar dena.
5. **Important**: Har baar `google-apps-script.gs` update karne ke baad, Apps Script me
   **Deploy → Manage deployments → ✏️ Edit → Version: New → Deploy** zaroor karein,
   warna naya code (jaise "Submitted Reports" list wala `doGet`) live nahi hoga.

### PDF download kaise kaam karta hai
"Submitted Reports" tab sheet ke column **AG (Merged Doc URL - SIR FORM)** ko check karta
hai. Jab tak aapka existing PDF-merge process (jo already sheet me set hai) us row ke liye
nahi chal jata, tab tak "PDF pending…" dikhega. Merge hone ke baad, list me automatically
"⬇ Download PDF" button aa jayega (Refresh button dabakar bhi check kar sakte hain).

## Home Screen par App Icon (optional)

Phone se GitHub Pages link kholne ke baad, browser ke menu me
**"Add to Home Screen"** choose karein — `manifest.json` ki wajah se ye custom
icon ke saath ek app jaisa shortcut ban jayega.
