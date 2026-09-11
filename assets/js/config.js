/* ==========================================================================
   AL GHADEER - LANDING PAGE CONFIGURATION
   ==========================================================================

   THIS IS THE ONLY FILE YOU NEED TO EDIT TO MAKE THE PAGE WORK.
   Fill in the values below, save, upload. Nothing else required.

   Every setting is explained. Where a value is a placeholder you must
   replace, it is written in CAPITALS so it is easy to spot.

   Quick checklist:
     1. EmailJS ....... section 1   (sends the lead to your inbox)
     2. Zapier ........ section 2   (sends the lead to your CRM / sheet)
     3. reCAPTCHA ..... section 3   (invisible v3 bot protection)
     4. Meta Pixel .... section 4   (conversion tracking)
     5. WhatsApp ...... section 5   (where the lead lands after submitting)
     6. Images ........ section 7   (swap the photos)
   ========================================================================== */

window.LP_CONFIG = {

  /* ------------------------------------------------------------------------
     1. EMAILJS  -  delivers every lead to your email inbox
     ------------------------------------------------------------------------
     Setup (about 5 minutes, free plan is enough):

     a) Create an account at https://www.emailjs.com
     b) Email Services  ->  Add New Service  ->  connect the Gmail account
        emmahulks123@gmail.com. Copy the SERVICE ID (looks like service_ab12cde).
     c) Email Templates ->  Create New Template. In the template body paste
        the variables listed under "templateParams" further down, for example:

            New lead from the Al Ghadeer landing page

            Name:      {{lead_name}}
            Phone:     {{lead_phone}}
            Email:     {{lead_email}}
            Timeline:  {{lead_timeline}}

            Source:    {{page_source}}
            Campaign:  {{utm_campaign}}
            Ad set:    {{utm_content}}
            Submitted: {{submitted_at}}

        Set the template "To email" field to {{to_email}} so it always
        delivers to the address configured below.
        Copy the TEMPLATE ID (looks like template_xy34fgh).
     d) Account -> General -> copy your PUBLIC KEY.
     ---------------------------------------------------------------------- */
  emailjs: {
    enabled:    true,
    publicKey:  "WVHa4a0KSVco3OG1_",
    serviceId:  "service_eb4npk8",
    templateId: "template_c9r6mjs",
    toEmail:    "emmahulks123@gmail.com"     // where leads are delivered
  },


  /* ------------------------------------------------------------------------
     2. ZAPIER  -  posts the same lead to a Zap (CRM, Google Sheet, Slack...)
     ------------------------------------------------------------------------
     Setup:
     a) In Zapier create a new Zap.
     b) Trigger  ->  "Webhooks by Zapier"  ->  "Catch Hook".
     c) Copy the custom webhook URL Zapier gives you and paste it below.
     d) Submit the form once so Zapier can read the field names, then map
        them to your CRM / sheet / Slack action.

     RECOMMENDED: add a "Webhooks by Zapier -> POST" step inside your Zap
     that verifies the reCAPTCHA token. See section 3 for why this matters.
     ---------------------------------------------------------------------- */
  zapier: {
    enabled:    true,
    webhookUrl: "https://hooks.zapier.com/hooks/catch/17940745/4hc3l78/"
  },


  /* ------------------------------------------------------------------------
     3. GOOGLE reCAPTCHA v3  -  invisible. The lead never sees a checkbox.
     ------------------------------------------------------------------------
     Setup:
     a) Go to https://www.google.com/recaptcha/admin/create
     b) Label:      Al Ghadeer Landing
        Type:       reCAPTCHA v3   (this is the invisible score-based one)
        Domains:    add your live domain, plus "localhost" while testing
     c) Copy the SITE KEY into siteKey below.
     d) Copy the SECRET KEY and keep it safe. Do NOT put it in this file.
        The secret key belongs in your Zapier verification step only. Anything
        in this file is public and visible to anyone who views the page source.

     HOW VERIFICATION WORKS HERE
     reCAPTCHA v3 returns a score from 0.0 (almost certainly a bot) to 1.0
     (almost certainly human). Scoring the token requires a server call to
     Google using your SECRET key, which a static page cannot do safely.
     So this page does the part it can do securely:
       - it generates a genuine v3 token on every submission
       - it sends that token to Zapier as "recaptcha_token"
     Then in your Zap, add a "Webhooks by Zapier -> POST" step:
       URL:  https://www.google.com/recaptcha/api/siteverify
       Payload type: form
       Data:  secret = YOUR_SECRET_KEY
              response = {{recaptcha_token}}
     Follow it with a Filter step: only continue if "success" is true and
     "score" is greater than or equal to 0.5. That gives you real, enforced
     v3 protection with the secret key never exposed.

     Two extra defences run on the page itself and need no setup at all:
     a hidden honeypot field that only bots fill in, and a minimum time on
     form check, since scripts submit far faster than people type.
     ---------------------------------------------------------------------- */
  recaptcha: {
    enabled: true,
    siteKey: "6LewY6wtAAAAALi2Lk7Mlp0W39rgj_C1S-AaOUge",
    action:  "lead_submit",   // shows up in your reCAPTCHA admin analytics
    // With a siteKey set, a valid token is REQUIRED. If reCAPTCHA cannot be
    // reached the form refuses to submit and nothing is sent anywhere.
    // Set enabled to false only if you deliberately want the form unprotected.

    // Page-side spam traps. Leave these on.
    honeypot:      true,      // hidden field named hp_field, only bots fill it
    minSecondsOnForm: 3       // faster than this and the visitor is asked to
                              // send again, rather than being silently dropped
  },


  /* ------------------------------------------------------------------------
     4. META PIXEL  -  conversion tracking for your ads
     ------------------------------------------------------------------------
     Put your Pixel ID below. The pages then fire:
       index.html       ->  PageView
       thank-you.html   ->  PageView  +  Lead   (this is your conversion)

     In Meta Events Manager the "Lead" event will start showing up within a
     few minutes of the first real submission. Use "Lead" as the conversion
     event when you build the campaign, and the landing page will optimise
     far better than Click to WhatsApp ever could, because Meta finally gets
     a clean conversion signal instead of a click.
     ---------------------------------------------------------------------- */
  meta: {
    enabled: true,
    pixelId: "2029165057806823",   // Meta dataset ID
    // Optional. If you also run Conversions API through a tool that reads
    // an event ID for deduplication, this page generates one per lead and
    // passes it to Zapier as "event_id".
    sendEventId: true
  },

  // Optional: Google Analytics 4. Leave measurementId empty to skip it.
  ga4: {
    enabled: false,
    measurementId: ""   // e.g. "G-XXXXXXXXXX"
  },


  /* ------------------------------------------------------------------------
     5. WHATSAPP  -  where the lead is pushed after they submit
     ------------------------------------------------------------------------
     Number must be in full international format with no +, no spaces,
     no dashes. UAE example: 971501234567
     ---------------------------------------------------------------------- */
  whatsapp: {
    number: "971502647803",
    // {{name}} is replaced with whatever the lead typed into the form.
    message: "Hi, I just asked for the Al Ghadeer prices and sizes on your website. My name is {{name}}. Please send me the prices, the unit sizes in sqft, the floor plans and what is available."
  },


  /* ------------------------------------------------------------------------
     6. BEHAVIOUR
     ---------------------------------------------------------------------- */
  behaviour: {
    // Page the lead is sent to after a successful submission.
    // This page is what Meta counts as the conversion, so do not remove it.
    thankYouUrl: "thank-you.html",

    // Desktop hero layout. "right" puts the form on the right hand side and
    // the offer on the left. Change to "left" to mirror it.
    heroFormSide: "right",

    // Show the fixed "Get Prices & Sizes" bar at the bottom on mobile.
    mobileStickyBar: true,

    // On the thank you page, open WhatsApp automatically after this many
    // seconds. Set to 0 to disable and let the lead tap the button instead.
    autoRedirectSeconds: 6
  },


  /* ------------------------------------------------------------------------
     7. IMAGES
     ------------------------------------------------------------------------
     HOW TO CHANGE THE PHOTOS
     Easiest way: save your images with exactly these file names into the
     assets/img/ folder. The page picks them up with no code changes.

         hero.jpg            wide shot of the community or a townhouse row
         gallery-1.jpg       townhouse exterior
         gallery-2.jpg       living room interior
         gallery-3.jpg       community park or green space
         gallery-4.jpg       swimming pool
         gallery-5.jpg       kitchen or dining interior
         gallery-6.jpg       kids play area or splash pad
         gallery-7.jpg       street view or aerial
         gallery-8.jpg       private garden or terrace
         offer.jpg           the townhouse you are leading the offer with
         location.jpg        map, masterplan or aerial context shot

     Recommended: JPG or WebP, roughly 1600px wide, under 300KB each.
     Save hero.jpg at about 1920x1280 for a crisp full width hero.

     demoImages below controls what shows while a real photo is missing:
       true   ->  a stand-in photograph, so you can see the finished layout
       false  ->  a clean branded panel labelled with the shot required

     Set this to false before you send traffic to the page.
     ---------------------------------------------------------------------- */
  images: {
    demoImages: true,
    basePath:   "assets/img/"
  }

};
