/* ================================================================
   MARKET INSIGHTS
   One file holds every article. To publish, copy a block, change the
   values, and put it at the top of the array. Newest first.

   Full instructions live in README.md.

   body   an array of blocks. Each block is one of:
          { h: "A subheading" }
          { p: "A paragraph." }
          { list: ["point one", "point two"] }
          { quote: "A pulled out line.", by: "Optional attribution" }
          { img: "filename.png", caption: "Optional caption" }
          { stat: [{ n: "4 to 6%", l: "Typical net yield" }, ...] }
   ================================================================ */
window.BRAMWELL_POSTS = [

  {
    id: "gross-versus-net-dubai-yields",
    title: "The yield on the brochure is not the yield you receive",
    excerpt: "Every listing in this market quotes a gross figure. Here is the arithmetic that turns seven and a half percent into five, and why nobody selling you a unit is paid to run it.",
    category: "Yields",
    date: "2026-08-28",
    readMins: 6,
    image: "hf_20260908_132903_7064e3a0-b1c6-419e-8590-79b1048517f3.png",
    body: [
      { p: "Open any Dubai property listing and you will find a yield between seven and ten percent. The number is not invented. It is simply gross, which means it describes the rent a tenant pays rather than the money that reaches your account." },
      { p: "The distance between those two figures is not small, and it is entirely predictable. It is arithmetic, not luck, and it can be run before you commit rather than discovered in year two." },
      { h: "What comes out before you see any of it" },
      { p: "Four deductions sit between the advertised gross and your net position. None of them is unusual and none of them is hidden. They are simply left out of the headline." },
      { list: [
        "Service charge. Billed per square foot per year, set by the building rather than by you. Prime Dubai towers commonly run 20 to 28 dirhams. Abu Dhabi is materially cheaper.",
        "Management. Roughly five percent of collected rent if you use an agent, which most overseas owners do.",
        "Vacancy. No unit is occupied fifty two weeks a year forever. A five percent allowance is realistic rather than pessimistic.",
        "The transfer fee. Four percent to the Dubai Land Department, paid once, on the way in. It does not touch your annual yield but it changes your first year badly."
      ]},
      { h: "The same unit, both ways" },
      { p: "Take a four million dirham apartment advertised at seven and a half percent gross. The gross rent is three hundred thousand. Service charges at roughly 1.4 percent of value take fifty six thousand. Management and vacancy together take another thirty thousand. What lands is around two hundred and fourteen thousand." },
      { stat: [
        { n: "7.5%", l: "Advertised gross" },
        { n: "5.4%", l: "Net after costs" },
        { n: "AED 160k", l: "Transfer fee, once" }
      ]},
      { p: "Five point four percent is a perfectly good return. It is also two full percentage points below the number that persuaded you to look, and that gap compounds across a holding period." },
      { quote: "The figure worth comparing between two buildings is never the one on the brochure. It is the one left after the building has taken its share." },
      { h: "Where the gap gets wider" },
      { p: "Service charge is the variable that moves most between buildings, and it is the one buyers check last. A tower at twenty six dirhams and a tower at fourteen can advertise the identical gross yield and deliver net figures more than a percentage point apart." },
      { p: "This is the main reason Abu Dhabi stock often nets better than Dubai stock on a worse looking headline. Al Reem service charges commonly sit near sixteen dirhams. The gross yield looks similar. The net does not." },
      { h: "What to ask for" },
      { p: "Ask any agent for the building's current service charge per square foot, in writing, and the last two years of it. A building whose charge has risen twice is telling you something about its reserve fund." },
      { p: "Then ask them to show you the net calculation with those numbers in it. If the answer is a range rather than a figure, the work has not been done." }
    ]
  },

  {
    id: "off-plan-golden-visa-timing",
    title: "Off plan and the Golden Visa: the registration detail that decides your timeline",
    excerpt: "Two buyers purchase the same off plan unit in the same tower. One can apply for residency this month. The other waits until 2028. The difference is paperwork, not price.",
    category: "Residency",
    date: "2026-08-14",
    readMins: 7,
    image: "hf_20260908_132903_e55ae326-f916-4893-8910-73441bb9a7e3.png",
    body: [
      { p: "The two million dirham property threshold for the UAE Golden Visa is widely understood. What is far less understood is when an off plan purchase actually crosses it." },
      { p: "We have seen the same tower, the same floor and the same unit type produce two completely different residency timelines for two buyers, purely because of how the purchase was registered." },
      { h: "The mechanism" },
      { p: "For a ready property the position is simple. The title deed is issued in your name, it states a value, and if that value clears the threshold you can apply." },
      { p: "Off plan has no title deed yet. What exists instead is an Oqood registration, the Dubai Land Department's record of a pre completion sale. Whether your residency application can proceed depends on what that Oqood record says." },
      { list: [
        "Registered at full purchase value: the threshold is assessed against the full price, and an application can usually proceed once the initial payment and fees are made.",
        "Registered at amount paid to date: the threshold is assessed against what you have actually paid, so a twenty percent booking on a two million unit clears nothing.",
        "Not yet registered: nothing can proceed at all."
      ]},
      { quote: "Ask the developer, before you sign, whether Oqood will be registered at full value or at amount paid. The answer changes your residency timeline by years." },
      { h: "Why developers differ" },
      { p: "This is not a trick. Registration practice varies by developer and sometimes by project, and it is rarely volunteered because most buyers never ask. A sales agent focused on closing the unit has no particular reason to raise it." },
      { p: "The result is that two buyers can pay the same price for adjacent units and end up on different sides of a three year wait." },
      { h: "What to confirm in writing" },
      { list: [
        "That the project is DLD registered and holds a supervised escrow account.",
        "Whether Oqood registration will reflect the full purchase value or only amounts paid.",
        "The expected date of Oqood registration relative to your booking.",
        "Which payments and fees must clear before registration is filed."
      ]},
      { p: "All four are ordinary questions. A developer who cannot answer them quickly is telling you something useful about how the rest of the process will go." },
      { h: "The practical shape of it" },
      { p: "Where a project registers at full value, a twenty percent payment plus the four percent transfer fee on a two million dirham unit is often enough for an application to begin. Where it registers at amounts paid, you are waiting until your cumulative payments cross the threshold, which on a handover weighted plan may not happen until handover itself." },
      { p: "If residency is part of why you are buying, this single detail deserves more attention than the floor plan." }
    ]
  },

  {
    id: "supply-pipeline-community-risk",
    title: "Everyone is building. That only matters in some communities",
    excerpt: "Dubai completions are running at record volume, but supply risk is local rather than citywide. The number that matters is what completes within eighteen months of your handover, in your district.",
    category: "Market",
    date: "2026-07-31",
    readMins: 5,
    image: "hf_20260908_132903_135d02cc-3e03-4918-9783-090faea04d6a.png",
    body: [
      { p: "Ask whether Dubai is oversupplied and you will get a confident answer in both directions, usually from people with something to sell. The question is close to meaningless at city scale." },
      { p: "Rent is not set by the emirate. It is set by what a tenant can choose between within a short radius of your front door, at roughly your price, in roughly your month." },
      { h: "The eighteen month window" },
      { p: "The figure worth knowing for any purchase is how many comparable units complete in the same district within about eighteen months either side of your own handover." },
      { p: "When several towers hand over into one community inside a single year, the effect is not gradual. A wave of simultaneously vacant units competes for the same tenant pool, and asking rents soften precisely when your unit is coming online and you most need income." },
      { stat: [
        { n: "8%", l: "Modelled at launch" },
        { n: "5%", l: "Achieved at handover" },
        { n: "18 mo", l: "The window that decides it" }
      ]},
      { h: "Why launch models miss it" },
      { p: "A yield projection made at launch uses the rents being achieved at launch, in a district that has not yet absorbed the units being launched. It is not dishonest. It is simply describing a market that will have changed by the time the keys exist." },
      { h: "Where the risk concentrates" },
      { p: "Large master planned districts still filling out carry the most exposure, because multiple developers are completing into the same catchment on overlapping schedules. Established communities with little remaining developable land carry the least, for the same reason in reverse." },
      { list: [
        "Finite masterplans, where the plots are allocated and the boundary is fixed, constrain supply structurally.",
        "Expanding districts with continuing launches can absorb several waves before demand catches up.",
        "Single tower additions to a mature area rarely move the rent at all."
      ]},
      { quote: "Supply risk is a question about your district and your handover quarter. Answered at city scale it tells you nothing." },
      { h: "How to check it" },
      { p: "Completion schedules for registered projects are public. Any adviser can map what completes around a given community and when. Ask for that map before you commit, and be suspicious of a projection that does not reference it." }
    ]
  },

  {
    id: "abu-dhabi-versus-dubai-net-position",
    title: "Abu Dhabi often nets better than Dubai on a worse looking headline",
    excerpt: "Dubai advertises the higher gross yield almost every time. Once service charges are in the calculation, the ranking frequently reverses.",
    category: "Market",
    date: "2026-07-16",
    readMins: 5,
    image: "hf_20260908_132903_3553b9fa-6a7a-49b9-892d-ab7f36eb374d.png",
    body: [
      { p: "Investors arriving in the UAE tend to look at Dubai first, and the headline numbers reward that instinct. Gross yields are higher, transaction volume is higher, and the market is easier to read from abroad." },
      { p: "The picture changes once you put running costs into the comparison, and it changes often enough that we now model both emirates on every income led brief." },
      { h: "The service charge gap" },
      { p: "Prime Dubai towers commonly charge between twenty and twenty eight dirhams per square foot per year. Comparable Abu Dhabi stock frequently sits between twelve and eighteen, and chiller is more often included rather than billed separately." },
      { p: "On a two thousand square foot apartment that difference is twenty thousand dirhams a year, every year, before anything else is deducted." },
      { h: "A worked comparison" },
      { p: "A Downtown Dubai two bedroom advertised at 6.8 percent gross, carrying a twenty six dirham service charge, nets a little over five. An Al Reem three bedroom advertised at 7.2 percent, carrying sixteen dirhams with chiller included, nets around 5.5." },
      { p: "The Abu Dhabi unit wins on net despite the smaller gap in gross, and it does so with a lower entry price and a steadier tenant profile." },
      { h: "The tenant base difference" },
      { p: "Abu Dhabi's rental demand skews toward long let professional and government linked tenants. Turnover is lower, void periods are shorter, and management is lighter. Dubai's short let upside is real but it arrives with more volatility and more work." },
      { quote: "Dubai wins on liquidity and on capital growth. Abu Dhabi wins more often than people expect on the number that actually reaches your account." },
      { h: "Where Dubai still wins clearly" },
      { list: [
        "Resale liquidity. Dubai stock sells faster and to a deeper buyer pool.",
        "Capital appreciation, historically stronger across most cycles.",
        "Short let income, where regulation and demand both favour Dubai.",
        "Choice. The sheer volume of stock means more chances to find a scarce floor plan."
      ]},
      { p: "The point is not that one emirate beats the other. It is that the comparison is worthless until both sides are stated net." }
    ]
  },

  {
    id: "reading-a-developer-track-record",
    title: "How to read a developer's track record before you buy off plan",
    excerpt: "Renders tell you nothing about delivery. Four public checks separate a developer who hands over on time from one who has never handed over at all.",
    category: "Off plan",
    date: "2026-06-30",
    readMins: 6,
    image: "hf_20260908_133029_e6ea60ec-f2b9-49c0-8a1a-249c2f04590a.png",
    body: [
      { p: "Off plan buying is, in practice, a bet on a company rather than on a building. The building does not exist yet. What exists is a balance sheet, a delivery history and an escrow arrangement." },
      { p: "All three are checkable before you pay anything, and the checks are not difficult. They are simply skipped, because the render is more persuasive than the record." },
      { h: "One: promised dates against actual dates" },
      { p: "For every project the developer has completed, compare the handover date in the original sales material against the date keys were actually issued. A developer consistently landing within a quarter of target is telling you something. So is one running eighteen months late across three projects." },
      { p: "This is the single most reliable predictor available, and it is public." },
      { h: "Two: escrow standing" },
      { p: "Registered projects hold buyer funds in a supervised escrow account released against construction milestones. Confirm the account exists, is registered, and that your payments go into it rather than to the developer directly." },
      { h: "Three: build quality on delivered stock" },
      { p: "Visit something they have finished and handed over three or more years ago. Renders are uniform across the industry. Corridors, lift lobbies and service areas after a few years of use are not, and they show you what the specification actually was." },
      { list: [
        "How have common areas aged, not how do they look on day one.",
        "What has the service charge done since handover, and why.",
        "Are there open disputes between the owners association and the developer.",
        "How quickly were snagging items closed after handover."
      ]},
      { h: "Four: behaviour in a soft market" },
      { p: "Any developer looks capable in a rising market. The useful question is what happened during the last downturn. Did they continue building, renegotiate payment plans, pause projects, or simply stop communicating with buyers." },
      { quote: "A developer with one launch and an excellent render is not comparable to one with twenty delivered towers, whatever the price per square foot says." },
      { h: "What this rules out" },
      { p: "None of this makes a new or smaller developer automatically wrong. It does mean the discount you are being offered has to be large enough to pay you for carrying delivery risk that a tier one buyer is not carrying." },
      { p: "Usually it is not, which is why our off plan shortlists lean heavily toward developers with long records. Occasionally it is, and then we say so." }
    ]
  },

  {
    id: "what-first-year-actually-costs",
    title: "What the first year of ownership actually costs",
    excerpt: "The purchase price is the number everyone plans for. The transfer fee, agency commission, registration and furnishing are the ones that decide whether year one feels comfortable.",
    category: "Buying",
    date: "2026-06-12",
    readMins: 5,
    image: "hf_20260908_133029_2f9ad799-c767-442e-b3df-85a4b3b356e8.png",
    body: [
      { p: "Most buyers arrive with the purchase price funded and very little allowance beyond it. The costs that follow are neither hidden nor unusual, but together they routinely add six to eight percent on top, and they all fall inside the first few months." },
      { h: "The fixed items" },
      { list: [
        "Dubai Land Department transfer fee, four percent of purchase price, paid once at transfer.",
        "Agency commission, typically two percent plus VAT on a resale purchase.",
        "Registration trustee fee, a few thousand dirhams depending on price band.",
        "Title deed issuance, a small fixed charge.",
        "Mortgage registration, where applicable, 0.25 percent of the loan."
      ]},
      { stat: [
        { n: "4%", l: "Transfer fee" },
        { n: "2%", l: "Agency, plus VAT" },
        { n: "6 to 8%", l: "Realistic total" }
      ]},
      { h: "The items people forget" },
      { p: "Service charge is usually payable in advance for the year, so a unit transferring in January can require a full year of charges immediately. On a prime tower that is a meaningful sum arriving in the same month as the transfer fee." },
      { p: "If you intend to let the unit, add furnishing where the market expects it, a chiller account activation and deposit, and the first management fee. If you intend to occupy it, add DEWA connection and deposit." },
      { h: "Why it matters more off plan" },
      { p: "On a handover weighted payment plan the final instalment, the transfer fee and the first year of service charges can all arrive within the same quarter. We have seen otherwise well planned purchases become uncomfortable purely because those three were modelled as separate events." },
      { quote: "Plan the first year, not the purchase. The purchase is the part everyone gets right." },
      { h: "A simple test" },
      { p: "Take your purchase price, add eight percent, and add one year of service charges. If that total still works comfortably, the purchase is properly funded. If it only works at the headline price, it is not." }
    ]
  }
];
