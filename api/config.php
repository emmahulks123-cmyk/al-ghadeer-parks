<?php
/* ================================================================
   BACKEND CONFIG
   The only file you need to edit to make the lead forms live.
   Keep this file out of any public git repository once the secret
   key is in it.
   ================================================================ */

return [

  /* Where leads are emailed. */
  'to'        => 'bramwellmarketing@gmail.com',

  /* The From address on the notification email.
     IMPORTANT: this must be an address on YOUR OWN domain, otherwise
     Gmail and most other providers will reject or spam filter it.
     Create it in your hosting control panel first. */
  'from'      => 'website@bramwellre.com',
  'fromName'  => 'Bramwell & Partners Website',

  /* Your reCAPTCHA v2 SECRET key (the private one).
     Same admin page as the site key: https://www.google.com/recaptcha/admin
     Leave the placeholder and captcha verification is skipped, which is
     fine while you are testing and not fine once you are live. */
  'recaptchaSecret' => 'REPLACE_WITH_YOUR_RECAPTCHA_SECRET_KEY',

  /* Also append every lead to api/leads.csv as a backup, in case an
     email is ever lost. Set to false to turn this off. */
  'logToCsv'  => true,

  /* Reject more than this many submissions from one IP per hour. */
  'rateLimit' => 8,

  /* Domains allowed to post to this endpoint. Add your live domain.
     An empty array allows any origin, which is fine for testing. */
  'allowedOrigins' => [
    'https://bramwellre.com',
    'https://www.bramwellre.com',
  ],
];
