# Zlato vs S&P 500

Statična stranica: realni povrat zlata i S&P 500 (s reinvestiranim dividendama) od 1971. do rujna 2026.

## Datoteke

- `index.html` – struktura stranice
- `style.css` – izgled, svijetla i tamna tema, prilagodba za mobitel
- `app.js` – crtanje grafova, tooltip, statistika, tablica
- `data.js` – mjesečni podaci
- `.nojekyll` – GitHub Pages poslužuje datoteke bez Jekyll obrade

## Lokalno

Otvori `index.html` u pregledniku. Server nije potreban.

## GitHub Pages

1. Stavi sadržaj ove mape u root repozitorija (ili u `/docs`).
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)` ili `/docs`.
3. Stranica je na `https://<korisnik>.github.io/<repo>/`.

## Izvori podataka

- S&P 500 realni ukupni povrat: Robert Shiller, Yale (ie_data) do 2023-08, zatim FRED SP500 mjesečni prosjek uz pretpostavljeni prinos dividende 1,4 % godišnje.
- CPI: Shiller do 2023-08, zatim FRED CPIAUCSL. Listopad 2025. interpoliran (nije objavljen), rujan 2026. procjena.
- Zlato: github.com/datasets/gold-prices, mjesečno.

Bez poreza, naknada i troškova čuvanja. Nije financijski savjet.
