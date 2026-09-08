/* ================================================================
   SITE CONFIG
   The three values you are most likely to change. Edit them here
   and every page picks them up.
   ================================================================ */
window.BRAMWELL_CONFIG = {

  /* Where the lead forms post to. Leave as is for the PHP backend in
     /api. If you move the site to a subfolder, make this an absolute
     path such as "/api/lead.php". */
  endpoint: "api/lead.php",

  /* Your reCAPTCHA v2 "I am not a robot" SITE key (the public one).
     Get it at https://www.google.com/recaptcha/admin
     Choose: reCAPTCHA v2 -> "I'm not a robot" Checkbox.
     Add your domain, plus "localhost" if you want it to work locally.

     Leave this placeholder in place and the forms still work, they
     simply skip the captcha check. Put the real key in before you go
     live, and put the matching SECRET key in api/config.php. */
  recaptchaSiteKey: "REPLACE_WITH_YOUR_RECAPTCHA_SITE_KEY"
};
