/* ================================================================
   THE CATALOGUE
   One file drives the listings grid and every property page.
   To add a unit, copy a block and change the values. Nothing else
   in the site needs touching.

   id       used in the URL: property.html?id=<id>. Keep it unique.
   type     Villa | Apartment | Townhouse | Duplex
   status   Ready | Off plan
   price    plain number in AED, formatted for display automatically
   area     internal area in square feet
   images   first one is the card image and the page hero
   ================================================================ */
window.BRAMWELL_MEDIA = "https://d8j0ntlcm91z4.cloudfront.net/user_3J0AN8z7b7JA7Uva28ByfaqQjYW/";

window.BRAMWELL_SITE = {
  heroHome:   "hf_20260908_123944_f9643ce6-f518-4236-b96c-e66f24dbc753.png",
  livingWide: "hf_20260908_123944_e341086e-a6ef-44ee-9956-f420b5beae08.png",
  aerial:     "hf_20260908_123945_dceab3e0-de7f-4dd7-bfc1-5b394a89d2e8.png"
};

window.BRAMWELL_PROPERTIES = [
  {
    id: "palm-jumeirah-signature-villa",
    title: "Signature Villa, Frond K",
    type: "Villa",
    community: "Palm Jumeirah",
    emirate: "Dubai",
    price: 32000000,
    beds: 5, baths: 6, area: 8200,
    status: "Ready",
    tenure: "Freehold",
    outlook: "Private beach and open sea",
    parking: 3,
    completed: "2021",
    serviceCharge: 22,
    grossYield: 5.1,
    images: [
      "hf_20260908_123945_a41f3507-b070-4d05-9ed2-b80fe3193812.png",
      "hf_20260908_123945_a735baf5-dbb0-42bb-b1af-07d9345678d6.png",
      "hf_20260908_123945_a339c626-b2fc-4b09-9a89-9058515b9029.png"
    ],
    summary: "A signature villa on one of the quieter fronds, with private beach frontage and a west facing pool terrace. Rebuilt internally in 2021, so the layout reads as a modern house rather than a renovated original.",
    detail: "Frond K sits away from the busier stretches of the Palm, which matters more for daily life than a floor plan suggests. The house has been taken back to shell internally and reworked into a single open ground floor that runs the full width of the plot, with sliding glass to the pool terrace and beach beyond.",
    highlights: [
      "Direct private beach frontage, west facing for evening sun",
      "Full internal rebuild completed in 2021, not a cosmetic refresh",
      "Ground floor opens across its full width to the pool terrace",
      "Staff accommodation and separate service entrance retained",
      "Held freehold, eligible for the residency threshold on its own"
    ],
    note: "Villa resale on the Palm is liquid but price sensitive at this level. We would want to see three comparable frond sales before advising on an offer."
  },

  {
    id: "emirates-hills-lakeside-mansion",
    title: "Lakeside Mansion, Sector E",
    type: "Villa",
    community: "Emirates Hills",
    emirate: "Dubai",
    price: 48000000,
    beds: 6, baths: 8, area: 14500,
    status: "Ready",
    tenure: "Freehold",
    outlook: "Lake and golf course",
    parking: 4,
    completed: "2019",
    serviceCharge: 9,
    grossYield: 3.4,
    images: [
      "hf_20260908_123945_a73918ac-85f9-4877-a8c3-fcf43182e3b9.png",
      "hf_20260908_123944_9c366e6b-6180-4e39-bc6a-ac235a48ad13.png",
      "hf_20260908_124057_98f6a60f-ed2d-4cc9-b458-fb741217cf71.png"
    ],
    summary: "A large family mansion on a lake plot in Sector E, with the golf course beyond the water. Low service charges for the size, and one of the few plots here where the lawn runs uninterrupted to the water's edge.",
    detail: "Emirates Hills trades on plot and outlook rather than building age, and this plot is among the better ones in the sector. The house itself is generous and conventionally laid out, with a formal entrance hall, separate majlis, and a family wing above.",
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
    id: "downtown-burj-view-residence",
    title: "Burj View Residence",
    type: "Apartment",
    community: "Downtown Dubai",
    emirate: "Dubai",
    price: 4600000,
    beds: 2, baths: 3, area: 1480,
    status: "Ready",
    tenure: "Freehold",
    outlook: "Tower and fountain",
    parking: 2,
    completed: "2020",
    serviceCharge: 26,
    grossYield: 6.8,
    images: [
      "hf_20260908_124057_399e88e6-c296-4d4c-aa4c-c38f9533c61d.png",
      "hf_20260908_124058_1b382556-3385-407a-bd5c-fdbfc1db2bbb.png",
      "hf_20260908_124057_6afc3800-b710-4ee5-b58e-8a2abe02a132.png"
    ],
    summary: "A high floor two bedroom with a direct tower and fountain outlook. Strong short let performance, though the service charge is high and materially changes the net figure.",
    detail: "Downtown two bedrooms with a protected view let quickly and at a premium, which is why the gross figure looks attractive. The number worth studying is the service charge, at twenty six dirhams per square foot among the highest in the city.",
    highlights: [
      "High floor with a protected tower and fountain outlook",
      "Two allocated parking bays, unusual for a two bedroom here",
      "Consistently strong short let occupancy in this tower",
      "Building holds a well funded reserve, so charges are stable",
      "Clears the residency threshold on its own"
    ],
    note: "Gross reads at 6.8 percent. After a twenty six dirham service charge, management and a realistic vacancy allowance, the net lands a little over five. Attractive, but a percentage point and a half below the headline, and the service charge is the line to watch at renewal."
  },

  {
    id: "al-reem-marina-residence",
    title: "Marina Residence, Shams",
    type: "Apartment",
    community: "Al Reem Island",
    emirate: "Abu Dhabi",
    price: 3200000,
    beds: 3, baths: 4, area: 1960,
    status: "Ready",
    tenure: "Freehold",
    outlook: "Marina and channel",
    parking: 2,
    completed: "2018",
    serviceCharge: 16,
    grossYield: 7.2,
    images: [
      "hf_20260908_124057_e4adc786-bf66-43aa-9464-df974d08ec86.png",
      "hf_20260908_124057_951174f6-91c2-4ac1-ab21-db75f75455e7.png",
      "hf_20260908_124057_648c9b67-58d1-40e5-adc2-21715ebec353.png"
    ],
    summary: "A three bedroom with a wide marina outlook and a deep terrace. Abu Dhabi service charges run well below Dubai equivalents, which is most of the reason the net figure holds up here.",
    detail: "Al Reem is the closest thing Abu Dhabi has to a pure yield market, and the tenant base is largely long let professional rather than short stay. That makes income steadier and management lighter than a comparable Dubai unit.",
    highlights: [
      "Wide marina and channel outlook from a deep covered terrace",
      "Service charge at sixteen dirhams, low against Dubai equivalents",
      "Long let tenant base, so turnover and void periods are lower",
      "Walking distance to the waterfront promenade and retail",
      "Clears the residency threshold on its own"
    ],
    note: "This is the strongest net figure of the eight, and the one we would put in front of a pure income buyer first."
  },

  {
    id: "dubai-hills-garden-townhouse",
    title: "Garden Townhouse, Maple",
    type: "Townhouse",
    community: "Dubai Hills Estate",
    emirate: "Dubai",
    price: 7400000,
    beds: 4, baths: 5, area: 3300,
    status: "Ready",
    tenure: "Freehold",
    outlook: "Park and boulevard",
    parking: 2,
    completed: "2022",
    serviceCharge: 5,
    grossYield: 5.4,
    images: [
      "hf_20260908_124209_012ff204-7c88-4281-80e9-1952f7dd58f5.png",
      "hf_20260908_124209_68802a8b-dcf0-46e6-8945-5cdae703d916.png",
      "hf_20260908_124209_19fc2100-3fb9-485b-b259-25355124b936.png"
    ],
    summary: "A four bedroom backing onto park rather than another row, which is the distinction that holds value in this community. Very low service charge, and a family tenant base that stays for years.",
    detail: "Dubai Hills townhouses are close to a commodity, with one exception: the units backing directly onto green space trade at a persistent premium and re-let far faster. This is one of those.",
    highlights: [
      "Backs directly onto park, not onto a facing row",
      "Service charge of five dirhams per square foot",
      "Family tenants here typically renew for three years or more",
      "Handed over in 2022, still inside developer warranty on structure",
      "Schools and the mall within the community boundary"
    ],
    note: "Supply in Dubai Hills is heavy, but park backing stock behaves quite differently from the rest. Worth insisting on that distinction in any comparison you are shown."
  },

  {
    id: "yas-island-waters-edge-townhouse",
    title: "Water's Edge Townhouse",
    type: "Townhouse",
    community: "Yas Island",
    emirate: "Abu Dhabi",
    price: 2950000,
    beds: 3, baths: 4, area: 2140,
    status: "Ready",
    tenure: "Freehold",
    outlook: "Canal",
    parking: 2,
    completed: "2021",
    serviceCharge: 7,
    grossYield: 6.4,
    images: [
      "hf_20260908_124209_bce681f6-f7fa-4c12-a7cd-4c543dbea1cb.png",
      "hf_20260908_124209_27534b07-b946-47dd-b45d-7b32f16c1dbd.png",
      "hf_20260908_124209_0d156869-9d83-4987-93a6-3837a9f99491.png"
    ],
    summary: "A canal fronting three bedroom with a private terrace to the water. The entry price is modest for waterfront, and the running costs are among the lowest of anything we hold.",
    detail: "Yas has matured from a leisure destination into a genuine residential community, and the waterfront rows were the first to hold value through the last soft patch. The terrace here faces the canal directly with no walkway between.",
    highlights: [
      "Terrace faces the canal directly with no public walkway between",
      "Service charge of seven dirhams per square foot",
      "Mixed local and expatriate tenant base, so demand is not one sided",
      "Community retail and beach club within walking distance",
      "Clears the residency threshold on its own"
    ],
    note: "The lowest entry price of the eight and a sound first Abu Dhabi position. Capital growth here has been steady rather than dramatic."
  },

  {
    id: "bluewaters-duplex-penthouse",
    title: "Duplex Penthouse, Bluewaters",
    type: "Duplex",
    community: "Bluewaters Island",
    emirate: "Dubai",
    price: 21000000,
    beds: 4, baths: 5, area: 5600,
    status: "Ready",
    tenure: "Freehold",
    outlook: "Sea, marina and wheel",
    parking: 3,
    completed: "2020",
    serviceCharge: 24,
    grossYield: 4.9,
    images: [
      "hf_20260908_124319_589e1e2d-31f3-40a2-bb6b-140cdd45107f.png",
      "hf_20260908_124319_b611031e-76b9-4d8a-8636-ee7474103b68.png",
      "hf_20260908_124319_efb2ba58-b070-41fd-96f6-5c3405857d8e.png"
    ],
    summary: "A double height duplex with a wraparound terrace and three way outlook. Scarce floor plan, and scarcity is what protects resale in a market where most stock is repeatable.",
    detail: "The value here is the volume. A double height living space with a mezzanine above is rare in Dubai apartment stock, and the buyers who want one have very few alternatives when they come to look.",
    highlights: [
      "Double height living volume with mezzanine, a scarce plan type",
      "Wraparound terrace with sea, marina and island outlook",
      "Three allocated parking bays and a private lobby entrance",
      "Island location, walkable and separated from mainland traffic",
      "Comfortably above the residency threshold"
    ],
    note: "Scarce floor plans hold price in soft markets far better than standard stock. That is the main argument for this one, and it is a real one."
  },

  {
    id: "saadiyat-beach-duplex",
    title: "Beach Duplex, Saadiyat",
    type: "Duplex",
    community: "Saadiyat Island",
    emirate: "Abu Dhabi",
    price: 12500000,
    beds: 3, baths: 4, area: 4100,
    status: "Off plan",
    tenure: "Freehold",
    outlook: "Beach and open sea",
    parking: 2,
    completed: "Q4 2027",
    serviceCharge: 14,
    grossYield: 5.6,
    images: [
      "hf_20260908_124319_62185042-5ee6-4a7f-b8b7-a5a5626935b9.png",
      "hf_20260908_124319_09199214-927b-4505-953b-f2e391fe543e.png",
      "hf_20260908_124319_5c77f792-920c-4ca4-8993-e46ffce57cd1.png"
    ],
    summary: "An off plan beachfront duplex in the cultural district, handing over Q4 2027. Low rise, direct beach access, and a developer with a long delivery record in this emirate.",
    detail: "Saadiyat is the one Abu Dhabi address that trades on cultural pull as much as on beach, and the low rise beachfront plots are effectively finite. The tradeoff is time: this is a 2027 handover, and the residency position depends on how the purchase is registered.",
    highlights: [
      "Direct beach access, low rise, in the cultural district",
      "Developer with a long on time delivery record in Abu Dhabi",
      "Payment plan weighted toward handover rather than front loaded",
      "Beachfront plots in this district are effectively finite",
      "Residency timing depends on registration, see the note"
    ],
    note: "Off plan, so two points matter. Golden Visa eligibility depends on Oqood registration reflecting full value, and the completion pipeline around it should be checked before you commit. We do both before this reaches a shortlist."
  }
];
