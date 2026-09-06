# Al Ghadeer Parks - Lead Generation Landing Page

A two page funnel built to replace Click to WhatsApp campaigns with something
Meta can actually optimise against.

```
index.html  ->  lead form  ->  thank-you.html  ->  WhatsApp
                                    |
                                    +-- fires the Meta "Lead" conversion event
```

**Why this fixes the unqualified lead problem.** A Click to WhatsApp campaign
optimises for the cheapest click, so Meta finds people who tap adverts, not
people who buy houses. This funnel gives Meta a real conversion event on a real
page, plus one qualifying question, so the algorithm starts hunting for buyers
instead of tappers. The timeline answer reaches your inbox before you have
spent a minute on the chat.

---

## Files

| File | What it is |
|---|---|
| `index.html` | The landing page. All visible text is editable in place. |
| `thank-you.html` | Conversion page. Fires the Meta Lead event, then opens WhatsApp. |
| `privacy.html` | Privacy policy. Meta requires one for lead campaigns. |
| `assets/js/config.js` | **The only file you must edit.** All keys and settings. |
| `assets/js/main.js` | Form validation, spam protection, sending. No edits needed. |
| `assets/js/tracking.js` | Pixel and UTM capture. No edits needed. |
| `assets/css/styles.css` | All styling. |
| `assets/img/` | Drop your photos here. |

---

## Setup, in order

### 1. EmailJS  (leads to your inbox)

1. Sign up at [emailjs.com](https://www.emailjs.com) and connect
   `emmahulks123@gmail.com` as an email service.
2. Create a template. Paste this into the template body:

   ```
   New lead from the Al Ghadeer Parks landing page

   Name:      {{lead_name}}
   Phone:     {{lead_phone}}
   Email:     {{lead_email}}
   Timeline:  {{lead_timeline}}

   Source:    {{page_source}}
   Campaign:  {{utm_campaign}}
   Ad set:    {{utm_content}}
   Submitted: {{submitted_at}}
   ```

   Set the template's **To email** field to `{{to_email}}` and the
   **Reply to** field to `{{reply_to}}`, so you can reply straight to the lead.
3. Copy the Service ID, Template ID and Public Key into the `emailjs` block in
   `assets/js/config.js`.

### 2. Zapier  (leads to your CRM or sheet)

1. New Zap, trigger **Webhooks by Zapier -> Catch Hook**.
2. Paste the webhook URL into the `zapier` block in `config.js`.
3. Submit the form once so Zapier learns the field names, then map them.

Fields sent: `name`, `email`, `phone`, `country_code`, `timeline`,
`timeline_label`, `form_location`, `project`, `page_url`, `submitted_at`,
`event_id`, `recaptcha_token`, `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, `fbclid`, `referrer`.

### 3. reCAPTCHA v3  (invisible, no checkbox)

1. Create a key at
   [google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create).
   Choose **reCAPTCHA v3**. Add your domain, and `localhost` for testing.
2. Put the **site key** in `config.js`. Keep the **secret key** out of it, that
   file is public.
3. Verify the score inside your Zap. Add a step after the trigger:

   - **Webhooks by Zapier -> POST**
   - URL: `https://www.google.com/recaptcha/api/siteverify`
   - Payload type: `form`
   - Data: `secret` = your secret key, `response` = `{{recaptcha_token}}`
   - Then a **Filter**: continue only if `success` is true and `score` is at
     least `0.5`.

   This is the part that actually blocks bots. A static page cannot score the
   token itself without exposing your secret key, so the scoring happens in
   Zapier where the key stays private.

   Two more defences already run on the page and need no setup: a hidden
   honeypot field, and a minimum time on form check. Bots trip both.

### 4. Meta Pixel

1. Put your Pixel ID in the `meta` block in `config.js`.
2. In Events Manager confirm you see `PageView` on the landing page and
   `Lead` on the thank you page.
3. Build the campaign with **Leads** as the objective and **Lead** as the
   conversion event. Not link clicks.

### 5. WhatsApp

Put your number in the `whatsapp` block in full international format, no plus
sign and no spaces, for example `971501234567`.

### 6. Your own details

Search `index.html` and `privacy.html` for these and replace them:

- `Your Company Name`
- `ORN 00000`
- `YOUR@EMAIL.COM`, `YOUR ADDRESS`, `YOUR PHONE NUMBER`, `SET THE DATE`

---

## Images

Save your photos into `assets/img/` using exactly these names. No code changes
needed.

| File | Shot |
|---|---|
| `hero.jpg` | Wide view of the community or a townhouse row. About 1920x1280. |
| `offer.jpg` | The townhouse you are leading the offer with. |
| `gallery-1.jpg` | Townhouse exterior, street facing |
| `gallery-2.jpg` | Living room interior |
| `gallery-3.jpg` | Park or landscaped green space |
| `gallery-4.jpg` | Swimming pool |
| `gallery-5.jpg` | Kitchen or dining interior |
| `gallery-6.jpg` | Kids play area or splash pad |
| `gallery-7.jpg` | Street view or aerial |
| `gallery-8.jpg` | Private garden or terrace |
| `location.jpg` | Map, masterplan or aerial context shot |

Keep each one under about 300KB. JPG or WebP.

While a photo is missing, `images.demoImages: true` in `config.js` shows a
stand in photograph so you can judge the layout. **Set it to `false` before you
send any traffic**, so a missing file shows a labelled panel rather than an
unrelated stock photo.

---

## Editing the text

Every editable block in `index.html` is marked with a comment:

```html
<!-- EDIT: the offer headline and the paragraph under it -->
```

Change the text between the tags. Do not remove `data-` attributes, the
scripts use them.

To change an amenity icon, edit the class name, for example
`ph ph-tree` becomes `ph ph-flower`. Names are at
[phosphoricons.com](https://phosphoricons.com).

---

## Before you go live

- [ ] All `YOUR_...` values replaced in `config.js`
- [ ] `images.demoImages` set to `false`
- [ ] Real photos in `assets/img/`
- [ ] Company name, ORN and contact details replaced
- [ ] Drive times in the Location section checked against your own sources
- [ ] Test submission received by email **and** in Zapier
- [ ] `Lead` event visible in Meta Events Manager
- [ ] Page opened on a real phone

---

## Hosting

Static files. Upload the whole folder to any host and point the domain at it.
It runs on Netlify, Vercel, Cloudflare Pages, GitHub Pages or ordinary cPanel
hosting with no build step.

Serve it over HTTPS. reCAPTCHA and the Meta Pixel both require it.
