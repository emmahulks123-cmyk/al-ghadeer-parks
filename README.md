# Bramwell & Partners

A property advisory site for Dubai and Abu Dhabi. Plain HTML, CSS and
JavaScript with a small PHP endpoint for the lead forms. No build step,
no framework, no npm. You edit a file and refresh the page.

---

## What is where

```
index.html          Home
properties.html     Listings, with filters
property.html       One property         -> property.html?id=THE-ID
insights.html       Market insights index
post.html           One article          -> post.html?id=THE-ID
about.html          About the firm
contact.html        Contact and the lead form

assets/
  config.js         Form endpoint + reCAPTCHA site key   <- edit this
  data.js           EVERY PROPERTY                       <- edit this
  posts.js          EVERY ARTICLE                        <- edit this
  site.css          All styling
  site.js           All behaviour
  fonts.css         Self hosted fonts
  fonts/            The font files
  img/              Local images, after you run the fetch script

api/
  lead.php          Receives the form, checks the captcha, emails you
  config.php        Your email + reCAPTCHA secret        <- edit this
  leads.csv         Every lead, created automatically as a backup

tools/
  fetch-images.sh   Downloads the images and serves them locally
```

The three files you will actually touch day to day are
**`assets/data.js`**, **`assets/posts.js`** and **`api/config.php`**.

---

## Adding a property

Open `assets/data.js`. Copy an existing block, paste it, change the
values. Order in the file is the order on the site.

Pick the block that matches the deal, because **the property page shows
different things for each one**:

| Deal | What the page leads with |
|---|---|
| `Off plan` | Payment plan, handover date, construction %, developer, escrow, registration |
| `Resale` | Service charge, tenancy, price per sq ft, gross vs our net estimate, transfer fee |
| `Rental` | Annual rent, cheques, deposit, furnishing, available from, what is included |

### Fields every property needs

```js
{
  id: "palm-jumeirah-signature-villa",  // the URL. lowercase, dashes, unique
  deal: "Resale",                       // "Off plan" | "Resale" | "Rental"
  title: "Signature Villa, Frond K",
  type: "Villa",                        // Villa | Apartment | Townhouse | Duplex
  community: "Palm Jumeirah",
  emirate: "Dubai",                     // "Dubai" | "Abu Dhabi"
  price: 32000000,                      // plain number, no commas.
                                        // Off plan = the "from" price
                                        // Rental   = the annual rent
  beds: 5, baths: 6, area: 8200,        // area in square feet
  tenure: "Freehold",
  outlook: "Private beach and open sea",
  parking: 3,
  images: ["one.png", "two.png", "three.png"],   // first one is the card image
  summary: "One or two sentences. Shows on the page and in the meta description.",
  detail:  "A second paragraph with the context behind it.",
  highlights: ["A bullet", "Another bullet"],
  note: "Your honest view, including the downside."
}
```

### Then add ONE of these blocks

**Off plan**, which also needs `bedsRange: "1 to 4"`:

```js
  offplan: {
    developer: "Tier one master developer",
    handover: "Q2 2028",
    completionPct: 18,          // a number, shown as "18% built"
    bookingPct: 20,
    paymentPlan: [              // these must add up to 100
      { stage: "On booking", pct: 20 },
      { stage: "During construction", pct: 50 },
      { stage: "On handover", pct: 30 }
    ],
    postHandover: "None. Full balance falls due at handover.",
    escrow: "Registered project escrow account, DLD supervised",
    registration: "Oqood registered at full value on booking",
    unitMix: "1, 2, 3 and 4 bedroom",
    launchPremium: "Currently 6% above launch pricing",
    amenities: ["Infinity pool deck", "Residents gym", "Private beach access"]
  }
```

**Resale**:

```js
  resale: {
    completed: "2021",
    tenancy: "Vacant on transfer",     // or "Tenanted until March 2027 at AED 210,000"
    serviceCharge: 22,                 // dirhams per square foot per year
    grossYield: 5.1,                   // the advertised figure
    noc: "Developer NOC required, typically 10 working days",
    mortgageable: "Yes, up to 50% for non residents",
    chiller: "Free hold, paid to the community",
    lastSold: "2021 at AED 24,500,000"
  }
```

The page works out the **net yield estimate** itself from
`price`, `grossYield`, `area` and `serviceCharge`, deducting the service
charge, 5% management and 5% vacancy. You do not enter it.

**Rental**:

```js
  rental: {
    annualRent: 320000,                // same number as `price` above
    cheques: "1, 2 or 4",
    deposit: "5% of annual rent, refundable",
    furnished: "Unfurnished",          // or "Fully furnished"
    availableFrom: "Immediately",      // or a date
    minTerm: "12 months",
    chillerIncluded: false,            // true or false, no quotes
    dewa: "Paid by tenant",
    agencyFee: "5% of annual rent"
  }
```

### Property images

Put the files in `assets/img/` and list the filenames in `images`.
Landscape, ideally 2000px wide. Three per property works best: the
first fills the large frame, the other two stack beside it.

---

## Adding an article

Open `assets/posts.js`. Newest goes at the **top** of the array, because
the home page and the insights page both take the first few.

```js
{
  id: "gross-versus-net-dubai-yields",   // the URL
  title: "The yield on the brochure is not the yield you receive",
  excerpt: "One or two sentences. Shows on the cards and under the headline.",
  category: "Yields",                    // free text, shows above the title
  date: "2026-08-28",                    // YYYY-MM-DD, formatted automatically
  readMins: 6,
  image: "some-image.png",
  body: [ ... ]
}
```

`body` is a list of blocks. Mix them in any order:

```js
{ h: "A subheading" }
{ p: "A paragraph of text." }
{ list: ["First point", "Second point"] }
{ quote: "A line worth pulling out.", by: "Optional attribution" }
{ img: "filename.png", caption: "Optional caption" }
{ stat: [ { n: "7.5%", l: "Advertised gross" },
          { n: "5.4%", l: "Net after costs" } ] }
```

`stat` numbers count up when they scroll into view.

---

## Turning the lead forms on

Leads go to **bramwellmarketing@gmail.com** and are also appended to
`api/leads.csv` as a backup.

**1. Set your sending address.** Open `api/config.php` and set `from` to
an address on your own domain, for example `website@bramwellre.com`.
Create that mailbox in your hosting panel first. Gmail rejects mail that
claims to come from a gmail.com address it did not send.

**2. Get your reCAPTCHA keys.** Go to
<https://www.google.com/recaptcha/admin>, add a site, choose
**reCAPTCHA v2 → "I'm not a robot" Checkbox**. Add `bramwellre.com`,
`www.bramwellre.com`, and `localhost` if you want it working locally.
You get two keys.

**3. Put them in.**

- The **site key** (public) goes in `assets/config.js` → `recaptchaSiteKey`
- The **secret key** (private) goes in `api/config.php` → `recaptchaSecret`

Until you do this the form still works, it just skips the captcha. The
honeypot field and the rate limit are active either way.

**4. Check it.** Submit the form on the live site. You should get an
email within a minute, and a new row in `api/leads.csv`.

### If email does not arrive

- Check spam first, and check `api/leads.csv`. If the row is there, the
  form worked and only the email failed.
- The `from` address must be on your own domain and should exist.
- Some hosts disable PHP `mail()`. If yours has, ask them to enable it,
  or tell me and I will switch the endpoint to SMTP.

### Security already in place

- reCAPTCHA v2 checkbox, verified server side
- A hidden honeypot field that bots fill in and people never see
- Eight submissions per IP per hour
- Length caps on every field, and a header injection guard
- `api/.htaccess` blocks web access to `leads.csv` and `config.php`

---

## Serving the images from your own site

Right now the images load from the Higgsfield CDN. That is fine for
review, but before you launch you want them on your own domain: faster,
under your control, and they cannot disappear.

From the project folder, on your own machine:

```bash
bash tools/fetch-images.sh
```

It downloads every image, converts it to WebP if you have `cwebp`
installed, saves them in `assets/img/`, and repoints the site at the
local copies. Run it once. It skips anything already downloaded, so it
is safe to run again if your connection drops.

---

## Previewing locally

Double clicking `index.html` mostly works, but the pages that read the
query string behave better over a real server:

```bash
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000>. The PHP form needs PHP, so use
`php -S localhost:8000` instead if you want to test the endpoint.

---

## Going live

Upload the whole folder to your web host. That is it. It works on any
host that serves static files, and the form needs PHP, which every
shared host including Hostinger provides.

Checklist before you announce it:

- [ ] `api/config.php` has your real `from` address
- [ ] Both reCAPTCHA keys are in
- [ ] Submitted the form and received the email
- [ ] `tools/fetch-images.sh` has been run
- [ ] The placeholder email `enquiries@bramwellre.com` is right, or changed
- [ ] Replaced the two decorative images noted below, if you want real ones

---

## Images you may want to replace

Everything on the site is a generated render. These are the ones a real
photograph would improve most, in priority order:

1. **Home hero.** A real villa or tower you have sold, golden hour,
   wide and landscape. This is the first thing anyone sees.
2. **Office reception and meeting room** (About, Contact). Your actual
   offices, if they photograph well.
3. **The team.** There is no team photograph anywhere on the site yet.
   Head shots against a plain wall would slot into the About page.
4. **Property photography.** Anything you have real shots of should
   replace the generated set for that listing.

To swap one, put the file in `assets/img/` and change the filename in
`assets/data.js`. Page level images are all listed together at the top
of that file under `BRAMWELL_SITE`.
