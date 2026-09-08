/* ================================================================
   THE CATALOGUE
   One file drives the listings grid, the home page strips and every
   property page. To add a unit, copy the block that matches its deal
   type and change the values. Nothing else in the site needs editing.

   Full instructions live in README.md.

   deal   "Off plan" | "Resale" | "Rental"   <- decides which fields
                                                the property page shows
   ================================================================ */
window.BRAMWELL_MEDIA = "https://d8j0ntlcm91z4.cloudfront.net/user_3J0AN8z7b7JA7Uva28ByfaqQjYW/";

/* Images used by the pages themselves rather than by a listing.
   Replace any filename here to swap that picture. */
window.BRAMWELL_SITE = {
  heroHome:      "hf_20260908_123944_f9643ce6-f518-4236-b96c-e66f24dbc753.png", // villa at golden hour
  livingWide:    "hf_20260908_123944_e341086e-a6ef-44ee-9956-f420b5beae08.png", // bright living room
  aerial:        "hf_20260908_123945_dceab3e0-de7f-4dd7-bfc1-5b394a89d2e8.png", // waterfront community aerial
  masterplan:    "hf_20260908_132903_25180e65-ff5b-4707-a15c-c312e7a04489.png", // masterplan render
  showHome:      "hf_20260908_132903_d2039d81-dfc6-4789-be4b-f8b5e11a4c1a.png", // show apartment
  amenityDeck:   "hf_20260908_132903_6d6cea0b-2297-424f-9860-42f0796c3b1b.png", // rooftop pool deck
  construction:  "hf_20260908_132903_e55ae326-f916-4893-8910-73441bb9a7e3.png", // tower under construction
  skyline:       "hf_20260908_132903_135d02cc-3e03-4918-9783-090faea04d6a.png", // financial district skyline
  cultural:      "hf_20260908_132903_3553b9fa-6a7a-49b9-892d-ab7f36eb374d.png", // Saadiyat cultural architecture
  desk:          "hf_20260908_132903_7064e3a0-b1c6-419e-8590-79b1048517f3.png", // site plan and model on a desk
  meetingRoom:   "hf_20260908_132903_8cd5aa93-2001-4b02-94a6-d711e62dde7c.png", // advisory meeting room
  model:         "hf_20260908_133029_e6ea60ec-f2b9-49c0-8a1a-249c2f04590a.png", // architectural scale model
  villaStreet:   "hf_20260908_133029_acf8f19f-132c-46d2-bab0-6e9485cdadf9.png", // villa community street
  reception:     "hf_20260908_133029_2f9ad799-c767-442e-b3df-85a4b3b356e8.png", // office reception
  furnished:     "hf_20260908_133029_0bf50508-751b-4519-aa40-f5f6d87e9282.png", // furnished rental interior
  towerDusk:     "hf_20260908_133029_5e420d63-cd10-4ff7-8153-0709ea2aaaa4.png", // completed tower at dusk
  materials:     "hf_20260908_133029_3be7d0e6-f671-49f8-87cb-2ee154767722.png", // material sample flat lay
  marinaAerial:  "hf_20260908_133029_4bcc9fb0-76ae-4a3f-8f60-6ea4c255a94b.png"  // marina district aerial
};

window.BRAMWELL_PROPERTIES = [

  /* ==============================================================
     OFF PLAN
     Sold before completion. The buyer is choosing a developer and a
     payment plan as much as a home, so those fields lead.
     ============================================================== */
  {
    id: "marina-vista-residences",
    deal: "Off plan",
    title: "Marina Vista Residences",
    type: "Apartment",
    community: "Dubai Harbour",
    emirate: "Dubai",
    price: 1900000,          // from price
    beds: 1, baths: 2, area: 780,
    bedsRange: "1 to 4",
    tenure: "Freehold",
    outlook: "Marina and sea",
    parking: 1,
    images: ["hf_20260908_132903_25180e65-ff5b-4707-a15c-c312e7a04489.png",
             "hf_20260908_132903_d2039d81-dfc6-4789-be4b-f8b5e11a4c1a.png",
             "hf_20260908_132903_6d6cea0b-2297-424f-9860-42f0796c3b1b.png"],
    offplan: {
      developer: "Tier one master developer",
      handover: "Q2 2028",
      completionPct: 18,
      bookingPct: 20,
      paymentPlan: [
        { stage: "On booking", pct: 20 },
        { stage: "During construction", pct: 50 },
        { stage: "On handover", pct: 30 }
      ],
      postHandover: "None. Full balance falls due at handover.",
      escrow: "Registered project escrow account, DLD supervised",
      registration: "Oqood registered at full value on booking",
      unitMix: "1, 2, 3 and 4 bedroom, plus podium townhouses",
      launchPremium: "Currently 6% above launch pricing",
      amenities: ["Infinity pool deck", "Residents gym and spa", "Private beach access", "Concierge"]
    },
    summary: "A marina facing tower on Dubai Harbour, eighteen percent built, handing over Q2 2028. Registered at full value on booking, which is the detail that decides whether your residency application can start now or in three years.",
    detail: "Dubai Harbour has the advantage of being finite. The waterfront plots are allocated and the surrounding masterplan is largely fixed, so the supply question here is narrower than it is in the inland districts where launches keep arriving.",
    highlights: [
      "Oqood registered at full value on booking, so residency can proceed now",
      "Payment plan weighted to handover rather than front loaded",
      "Developer has delivered its last four towers within one quarter of target",
      "Waterfront plots in this masterplan are allocated and finite",
      "Beach access and marina berth rights included at this tier"
    ],
    note: "The payment plan is the reason we rate this one. Thirty percent falling due only at handover means less capital exposed during the build than most competing launches ask for."
  },

  {
    id: "creek-horizon-tower",
    deal: "Off plan",
    title: "Creek Horizon Tower",
    type: "Apartment",
    community: "Dubai Creek Harbour",
    emirate: "Dubai",
    price: 1650000,
    beds: 1, baths: 2, area: 720,
    bedsRange: "1 to 3",
    tenure: "Freehold",
    outlook: "Creek and skyline",
    parking: 1,
    images: ["hf_20260908_132903_e55ae326-f916-4893-8910-73441bb9a7e3.png",
             "hf_20260908_133029_5e420d63-cd10-4ff7-8153-0709ea2aaaa4.png",
             "hf_20260908_132903_d2039d81-dfc6-4789-be4b-f8b5e11a4c1a.png"],
    offplan: {
      developer: "Tier one master developer",
      handover: "Q4 2027",
      completionPct: 41,
      bookingPct: 10,
      paymentPlan: [
        { stage: "On booking", pct: 10 },
        { stage: "During construction", pct: 50 },
        { stage: "On handover", pct: 20 },
        { stage: "Post handover, 24 months", pct: 20 }
      ],
      postHandover: "20% spread over 24 months after handover, interest free.",
      escrow: "Registered project escrow account, DLD supervised",
      registration: "Oqood registered at full value on booking",
      unitMix: "1, 2 and 3 bedroom",
      launchPremium: "Currently 11% above launch pricing",
      amenities: ["Creek promenade access", "Pool and gym", "Retail podium", "Children's play deck"]
    },
    summary: "Forty one percent built with a Q4 2027 handover, and a ten percent booking with twenty percent payable after you have the keys. The lowest capital exposure of anything we currently hold.",
    detail: "Creek Harbour is a large masterplan and the supply picture matters more here than at Dubai Harbour. We map completions within eighteen months either side of handover before recommending any unit in this district.",
    highlights: [
      "Ten percent booking, the lowest entry of our current off plan list",
      "Twenty percent payable across two years after handover, interest free",
      "Forty one percent complete, so construction risk is materially reduced",
      "Oqood registered at full value on booking",
      "Creek promenade frontage at podium level"
    ],
    note: "Heavy supply completes into this district across 2027 and 2028. The payment plan is excellent, but model your rent on a softer year one than the brochure assumes."
  },

  {
    id: "saadiyat-beach-duplex",
    deal: "Off plan",
    title: "Beach Duplex, Saadiyat",
    type: "Duplex",
    community: "Saadiyat Island",
    emirate: "Abu Dhabi",
    price: 12500000,
    beds: 3, baths: 4, area: 4100,
    bedsRange: "3 and 4",
    tenure: "Freehold",
    outlook: "Beach and open sea",
    parking: 2,
    images: ["hf_20260908_124319_62185042-5ee6-4a7f-b8b7-a5a5626935b9.png",
             "hf_20260908_124319_09199214-927b-4505-953b-f2e391fe543e.png",
             "hf_20260908_124319_5c77f792-920c-4ca4-8993-e46ffce57cd1.png"],
    offplan: {
      developer: "Established Abu Dhabi developer",
      handover: "Q4 2027",
      completionPct: 27,
      bookingPct: 10,
      paymentPlan: [
        { stage: "On booking", pct: 10 },
        { stage: "During construction", pct: 40 },
        { stage: "On handover", pct: 50 }
      ],
      postHandover: "None. Fifty percent falls due at handover.",
      escrow: "Registered escrow account, ADRE supervised",
      registration: "Registered at full value on contract",
      unitMix: "3 and 4 bedroom beachfront duplexes only",
      launchPremium: "At launch pricing",
      amenities: ["Direct beach access", "Residents beach club", "Pool", "Cultural district on the doorstep"]
    },
    summary: "A low rise beachfront duplex in the cultural district, twenty seven percent built, handing over Q4 2027. Still at launch pricing, and beachfront plots on Saadiyat are effectively finite.",
    detail: "Saadiyat is the one Abu Dhabi address that trades on cultural pull as much as on beach. The low rise beachfront plots are limited by the masterplan itself, which is a firmer supply constraint than a developer's forward guidance.",
    highlights: [
      "Direct beach access, low rise, in the cultural district",
      "Developer with a long on time delivery record in this emirate",
      "Still selling at launch pricing rather than at a resale premium",
      "Beachfront plots in this district are finite by masterplan",
      "Comfortably above the residency threshold"
    ],
    note: "Fifty percent falls due at handover, which is a heavy final payment. Have that funding arranged and confirmed well before Q4 2027 rather than assuming a mortgage will cover it."
  },

  /* ==============================================================
     RESALE
     Completed stock, sold by an owner. The buyer is choosing a
     building and a yield, so running costs and tenancy lead.
     ============================================================== */
  {
    id: "palm-jumeirah-signature-villa",
    deal: "Resale",
    title: "Signature Villa, Frond K",
    type: "Villa",
    community: "Palm Jumeirah",
    emirate: "Dubai",
    price: 32000000,
    beds: 5, baths: 6, area: 8200,
    tenure: "Freehold",
    outlook: "Private beach and open sea",
    parking: 3,
    images: ["hf_20260908_123945_a41f3507-b070-4d05-9ed2-b80fe3193812.png",
             "hf_20260908_123945_a735baf5-dbb0-42bb-b1af-07d9345678d6.png",
             "hf_20260908_123945_a339c626-b2fc-4b09-9a89-9058515b9029.png"],
    resale: {
      completed: "2021",
      tenancy: "Vacant on transfer",
      serviceCharge: 22,
      grossYield: 5.1,
      noc: "Developer NOC required, typically 10 working days",
      mortgageable: "Yes, up to 50% for non residents",
      chiller: "Free hold, paid to the community",
      lastSold: "2021 at AED 24,500,000"
    },
    summary: "A signature villa on one of the quieter fronds, with private beach frontage and a west facing pool terrace. Rebuilt internally in 2021, so the layout reads as a modern house rather than a renovated original.",
    detail: "Frond K sits away from the busier stretches of the Palm, which matters more for daily life than a floor plan suggests. The house has been taken back to shell internally and reworked into a single open ground floor that runs the full width of the plot.",
    highlights: [
      "Direct private beach frontage, west facing for evening sun",
      "Full internal rebuild completed in 2021, not a cosmetic refresh",
      "Ground floor opens across its full width to the pool terrace",
      "Vacant on transfer, so no tenancy to inherit or buy out",
      "Held freehold, eligible for the residency threshold on its own"
    ],
    note: "Villa resale on the Palm is liquid but price sensitive at this level. We would want to see three comparable frond sales before advising on an offer."
  },

  {
    id: "emirates-hills-lakeside-mansion",
    deal: "Resale",
    title: "Lakeside Mansion, Sector E",
    type: "Villa",
    community: "Emirates Hills",
    emirate: "Dubai",
    price: 48000000,
    beds: 6, baths: 8, area: 14500,
    tenure: "Freehold",
    outlook: "Lake and golf course",
    parking: 4,
    images: ["hf_20260908_123945_a73918ac-85f9-4877-a8c3-fcf43182e3b9.png",
             "hf_20260908_123944_9c366e6b-6180-4e39-bc6a-ac235a48ad13.png",
             "hf_20260908_124057_98f6a60f-ed2d-4cc9-b458-fb741217cf71.png"],
    resale: {
      completed: "2019",
      tenancy: "Vacant on transfer",
      serviceCharge: 9,
      grossYield: 3.4,
      noc: "Community NOC required, typically 5 working days",
      mortgageable: "Yes, up to 50% for non residents",
      chiller: "Individual, paid by the occupier",
      lastSold: "2019 at AED 39,000,000"
    },
    summary: "A large family mansion on a lake plot in Sector E, with the golf course beyond the water. Low service charges for the size, and one of the few plots where the lawn runs uninterrupted to the water's edge.",
    detail: "Emirates Hills trades on plot and outlook rather than building age, and this plot is among the better ones in the sector. The house is generous and conventionally laid out, with a formal entrance hall, separate majlis and a family wing above.",
    highlights: [
      "Uninterrupted lawn to the lake edge, a genuinely scarce plot type",
      "Golf course outlook beyond the water, protected from future build",
      "Service charge low relative to plot size at nine dirhams per square foot",
      "Formal majlis and family wing separated, as the market here expects",
      "Comfortably above the residency threshold"
    ],
    note: "Yield here is low and always has been. This is a capital and lifestyle asset, and we would not present it as an income play."
  },

  {
    id: "al-reem-marina-residence",
    deal: "Resale",
    title: "Marina Residence, Shams",
    type: "Apartment",
    community: "Al Reem Island",
    emirate: "Abu Dhabi",
    price: 3200000,
    beds: 3, baths: 4, area: 1960,
    tenure: "Freehold",
    outlook: "Marina and channel",
    parking: 2,
    images: ["hf_20260908_124057_e4adc786-bf66-43aa-9464-df974d08ec86.png",
             "hf_20260908_124057_951174f6-91c2-4ac1-ab21-db75f75455e7.png",
             "hf_20260908_124057_648c9b67-58d1-40e5-adc2-21715ebec353.png"],
    resale: {
      completed: "2018",
      tenancy: "Tenanted until March 2027 at AED 210,000",
      serviceCharge: 16,
      grossYield: 7.2,
      noc: "Developer NOC required, typically 7 working days",
      mortgageable: "Yes, up to 50% for non residents",
      chiller: "Included in the service charge",
      lastSold: "2018 at AED 2,750,000"
    },
    summary: "A three bedroom with a wide marina outlook and a deep terrace, tenanted until March 2027. Abu Dhabi service charges run well below Dubai equivalents, which is most of the reason the net figure holds up here.",
    detail: "Al Reem is the closest thing Abu Dhabi has to a pure yield market, and the tenant base is largely long let professional rather than short stay. That makes income steadier and management lighter than a comparable Dubai unit.",
    highlights: [
      "Wide marina and channel outlook from a deep covered terrace",
      "Service charge at sixteen dirhams, low against Dubai equivalents",
      "Income in place from day one, tenanted to March 2027",
      "Chiller included in the service charge, so no separate cooling bill",
      "Clears the residency threshold on its own"
    ],
    note: "This is the strongest net figure of our resale list, and the one we would put in front of a pure income buyer first. Note you inherit the tenancy, so vacant possession is not available until March 2027."
  },

  {
    id: "yas-island-waters-edge-townhouse",
    deal: "Resale",
    title: "Water's Edge Townhouse",
    type: "Townhouse",
    community: "Yas Island",
    emirate: "Abu Dhabi",
    price: 2950000,
    beds: 3, baths: 4, area: 2140,
    tenure: "Freehold",
    outlook: "Canal",
    parking: 2,
    images: ["hf_20260908_124209_bce681f6-f7fa-4c12-a7cd-4c543dbea1cb.png",
             "hf_20260908_124209_27534b07-b946-47dd-b45d-7b32f16c1dbd.png",
             "hf_20260908_124209_0d156869-9d83-4987-93a6-3837a9f99491.png"],
    resale: {
      completed: "2021",
      tenancy: "Vacant on transfer",
      serviceCharge: 7,
      grossYield: 6.4,
      noc: "Developer NOC required, typically 7 working days",
      mortgageable: "Yes, up to 50% for non residents",
      chiller: "Individual, paid by the occupier",
      lastSold: "2021 at AED 2,340,000"
    },
    summary: "A canal fronting three bedroom with a private terrace to the water, vacant on transfer. Modest entry price for waterfront, and running costs among the lowest of anything we hold.",
    detail: "Yas has matured from a leisure destination into a genuine residential community, and the waterfront rows were the first to hold value through the last soft patch. The terrace faces the canal directly with no walkway between.",
    highlights: [
      "Terrace faces the canal directly with no public walkway between",
      "Service charge of seven dirhams per square foot",
      "Vacant on transfer, so you can let it or occupy it immediately",
      "Mixed local and expatriate tenant base, so demand is not one sided",
      "Clears the residency threshold on its own"
    ],
    note: "The lowest entry price of our resale list and a sound first Abu Dhabi position. Capital growth here has been steady rather than dramatic."
  },

  {
    id: "bluewaters-duplex-penthouse",
    deal: "Resale",
    title: "Duplex Penthouse, Bluewaters",
    type: "Duplex",
    community: "Bluewaters Island",
    emirate: "Dubai",
    price: 21000000,
    beds: 4, baths: 5, area: 5600,
    tenure: "Freehold",
    outlook: "Sea, marina and wheel",
    parking: 3,
    images: ["hf_20260908_124319_589e1e2d-31f3-40a2-bb6b-140cdd45107f.png",
             "hf_20260908_124319_b611031e-76b9-4d8a-8636-ee7474103b68.png",
             "hf_20260908_124319_efb2ba58-b070-41fd-96f6-5c3405857d8e.png"],
    resale: {
      completed: "2020",
      tenancy: "Vacant on transfer",
      serviceCharge: 24,
      grossYield: 4.9,
      noc: "Developer NOC required, typically 10 working days",
      mortgageable: "Yes, up to 50% for non residents",
      chiller: "Included in the service charge",
      lastSold: "2020 at AED 17,200,000"
    },
    summary: "A double height duplex with a wraparound terrace and three way outlook, vacant on transfer. Scarce floor plan, and scarcity is what protects resale in a market where most stock is repeatable.",
    detail: "The value here is the volume. A double height living space with a mezzanine above is rare in Dubai apartment stock, and the buyers who want one have very few alternatives when they come to look.",
    highlights: [
      "Double height living volume with mezzanine, a scarce plan type",
      "Wraparound terrace with sea, marina and island outlook",
      "Three allocated parking bays and a private lobby entrance",
      "Island location, walkable and separated from mainland traffic",
      "Comfortably above the residency threshold"
    ],
    note: "Scarce floor plans hold price in soft markets far better than standard stock. That is the main argument for this one, and it is a real one. The twenty four dirham service charge is the counterweight."
  },

  /* ==============================================================
     RENTAL
     Let rather than sold. The tenant is choosing a term, a cheque
     count and what is included, so those fields lead.
     ============================================================== */
  {
    id: "downtown-burj-view-residence",
    deal: "Rental",
    title: "Burj View Residence",
    type: "Apartment",
    community: "Downtown Dubai",
    emirate: "Dubai",
    price: 320000,           // annual rent
    beds: 2, baths: 3, area: 1480,
    tenure: "Leasehold",
    outlook: "Tower and fountain",
    parking: 2,
    images: ["hf_20260908_124057_399e88e6-c296-4d4c-aa4c-c38f9533c61d.png",
             "hf_20260908_124058_1b382556-3385-407a-bd5c-fdbfc1db2bbb.png",
             "hf_20260908_124057_6afc3800-b710-4ee5-b58e-8a2abe02a132.png"],
    rental: {
      annualRent: 320000,
      cheques: "1, 2 or 4",
      deposit: "5% of annual rent, refundable",
      furnished: "Unfurnished",
      availableFrom: "Immediately",
      minTerm: "12 months",
      chillerIncluded: false,
      dewa: "Paid by tenant",
      agencyFee: "5% of annual rent"
    },
    summary: "A high floor two bedroom with a direct tower and fountain outlook, available immediately on one to four cheques. Unfurnished, with two allocated bays, which is unusual for a two bedroom in this building.",
    detail: "Downtown two bedrooms with a protected view let quickly and at a premium. The cheque flexibility here is wider than most landlords in the building offer, which matters if you would rather not commit a year of rent up front.",
    highlights: [
      "High floor with a protected tower and fountain outlook",
      "One, two or four cheques accepted",
      "Two allocated parking bays, unusual for a two bedroom here",
      "Available immediately, no waiting on an outgoing tenant",
      "Building holds a well funded reserve, so common areas are maintained"
    ],
    note: "Chiller is not included and runs high in this tower over summer. Budget roughly AED 9,000 to 12,000 a year on top of the rent."
  },

  {
    id: "dubai-hills-garden-townhouse",
    deal: "Rental",
    title: "Garden Townhouse, Maple",
    type: "Townhouse",
    community: "Dubai Hills Estate",
    emirate: "Dubai",
    price: 285000,
    beds: 4, baths: 5, area: 3300,
    tenure: "Leasehold",
    outlook: "Park and boulevard",
    parking: 2,
    images: ["hf_20260908_124209_012ff204-7c88-4281-80e9-1952f7dd58f5.png",
             "hf_20260908_124209_68802a8b-dcf0-46e6-8945-5cdae703d916.png",
             "hf_20260908_124209_19fc2100-3fb9-485b-b259-25355124b936.png"],
    rental: {
      annualRent: 285000,
      cheques: "2 or 4",
      deposit: "5% of annual rent, refundable",
      furnished: "Unfurnished",
      availableFrom: "1 November",
      minTerm: "12 months",
      chillerIncluded: false,
      dewa: "Paid by tenant",
      agencyFee: "5% of annual rent"
    },
    summary: "A four bedroom backing onto park rather than another row, available from 1 November on two or four cheques. Family tenants here typically renew for years rather than months.",
    detail: "Dubai Hills townhouses are close to a commodity, with one exception: the units backing directly onto green space re let far faster and hold rent better. This is one of those.",
    highlights: [
      "Backs directly onto park, not onto a facing row",
      "Two or four cheques accepted",
      "Schools and the mall inside the community boundary",
      "Landlord maintains the garden as part of the lease",
      "Available 1 November, viewings from mid October"
    ],
    note: "Park backing stock in this community lets within days of listing. If it suits, move quickly rather than waiting to compare against three more."
  },

  {
    id: "marina-furnished-two-bed",
    deal: "Rental",
    title: "Furnished Two Bed, Marina",
    type: "Apartment",
    community: "Dubai Marina",
    emirate: "Dubai",
    price: 210000,
    beds: 2, baths: 2, area: 1180,
    tenure: "Leasehold",
    outlook: "Marina",
    parking: 1,
    images: ["hf_20260908_133029_0bf50508-751b-4519-aa40-f5f6d87e9282.png",
             "hf_20260908_132903_d2039d81-dfc6-4789-be4b-f8b5e11a4c1a.png",
             "hf_20260908_133029_5e420d63-cd10-4ff7-8153-0709ea2aaaa4.png"],
    rental: {
      annualRent: 210000,
      cheques: "1, 2, 4 or 12",
      deposit: "5% of annual rent, refundable",
      furnished: "Fully furnished",
      availableFrom: "Immediately",
      minTerm: "6 months",
      chillerIncluded: true,
      dewa: "Paid by tenant",
      agencyFee: "5% of annual rent"
    },
    summary: "A fully furnished two bedroom with a marina outlook, available immediately on terms from six months. Chiller is included, and twelve cheques are accepted, which is rare in this building.",
    detail: "Furnished stock in the Marina turns over quickly and is priced accordingly. What makes this one worth a look is the terms rather than the unit: a six month minimum and twelve cheques suit people arriving without a full year of rent to hand over on day one.",
    highlights: [
      "Fully furnished and ready to move into",
      "Twelve cheques accepted, unusual in this building",
      "Six month minimum term rather than the standard twelve",
      "Chiller included in the rent, so cooling is not a separate bill",
      "Walking distance to the marina walk and the tram"
    ],
    note: "Furnished units carry a premium of roughly fifteen percent over the equivalent unfurnished unit here. If you are staying more than a year, unfurnished plus your own furniture usually costs less overall."
  }
];
