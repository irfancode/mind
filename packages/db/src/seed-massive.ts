import { PrismaClient, AgeGroup, FeedVibe, ThoughtType, Language, ReactionType, ShareIntent, ContentClassification, ModerationLayer, ModerationAction, ContentProvenance, TrustSignal } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// SYNTHETIC DATA GENERATORS
// ============================================================

const SINGAPORE_NAMES = {
  chinese: {
    first: ["Wei Ming", "Jia Li", "Xin Yi", "Hao Wei", "Yu Ting", "Zi Yang", "Hui Min", "Jun Wei", "Yi Xuan", "Zhi Hao", "Mei Ling", "Chen Xi", "Wen Jie", "Jing Yi", "Kai Xin", "Li Wei", "Xiao Mei", "Da Wei", "Xiao Ling", "Ming Hui", "Ah Huat", "Ah Kow", "Ah Beng", "Ah Lian", "Ah Seng", "Ah Hock", "Ah Tee", "Ah Teck", "Ah Siong", "Ah Boon"],
    last: ["Tan", "Wong", "Lee", "Ng", "Ong", "Lim", "Chua", "Koh", "Teo", "Sim", "Goh", "Yeo", "Tay", "Foo", "Chong", "Yap", "Heng", "Foo", "Cheong", "Lau"],
  },
  malay: {
    first: ["Muhammad", "Muhammad Ali", "Ahmad", "Mohammad", "Rosli", "Siti", "Fatimah", "Nurul", "Aisyah", "Farah", "Hafiz", "Amir", "Rizal", "Faisal", "Haziq", "Nabil", "Danial", "Imran", "Syafiq", "Akmal", "Zul", "Abu", "Bakar", "Ismail", "Karim", "Rahman", "Salleh", "Yusof", "Hassan", "Hussein"],
    last: ["bin Hassan", "bin Abdullah", "bin Ibrahim", "bin Ismail", "binti Mohammed", "binti Ali", "bin Ahmad", "bin Yusof", "bin Karim", "bin Rahman"],
  },
  indian: {
    first: ["Priya", "Raj", "Ananya", "Vikram", "Deepa", "Arjun", "Kavitha", "Suresh", "Lakshmi", "Ravi", "Meera", "Kumar", "Anita", "Suresh", "Priya", "Rajesh", "Sunita", "Manoj", "Geeta", "Sanjay", "Muthu", "Subramaniam", "Letchimi", "Krishnan", "Parvathi", "Selvi", "Rajendran", "Kannan", "Venkatesh", "Ganesh"],
    last: ["s/o Ramasamy", "d/o Krishnan", "s/o Murugan", "s/o Subramaniam", "d/o Sundaram", "s/o Pillai", "s/o Nair", "d/o Menon", "s/o Iyer", "s/o Sharma"],
  },
};

const SINGLISH_PHRASES = [
  "Wah, damn shiok sia!", "Can or not?", "Don't play play lah!", "Act blur, live longer.",
  "Last time police catch you, now you catch police.", "Like that also can ah?", "Confirm plus chop!",
  "Cannot tahan already!", "Eh, where you want to makan?", "Shiok ah, this one!", "Aiyah, never mind lah.",
  "Wah lau, so expensive!", "Chope seat ah!", "Can share or not?", "Very the good lah!",
  "Like what?", "Like that lah.", "Not bad lah!", "Wah, steady pom pi pi!", "Roti prata also can ah?",
  "Auntie, more chilli please!", "Uncle, one teh tarik!", "Eh, this one very power lah!",
  "Chey, like that only ah?", "Alamak, forgot already!", "Sian, Monday again...",
  "Wah, hawker centre damn crowded today!", "Eh, you eating here or dabao?", "Bro, this one damn good lah!",
  "Eh, come sit here!", "Wah, you very steady ah!", "Alamak, MRT breakdown again!",
  "Lah, can lah!", "Don't play play lah!", "Wah, so many people!", "Eh, wait for me ah!",
];

const SINGAPORE_FOOD = [
  "chicken rice", "char kway teow", "laksa", "roti prata", "bak chor mee",
  "hokkien mee", "nasi lemak", "satay", "kaya toast", "kopi o",
  "teh tarik", "ice kachang", "chendol", "rojak", "fish head curry",
  "otleh", "mee rebus", "nasi padang", "Hainanese curry rice", "yong tau foo",
  "wanton mee", "dim sum", "bak kut teh", "lor mee", "fried carrot cake",
  "ang ku kueh", "ondeh-ondeh", "pandan cake", "tau sar piah", "kueh lapis",
];

const SINGAPORE_LOCATIONS = [
  "Tampines", "Jurong", "Woodlands", "Toa Payoh", "Ang Mo Kio",
  "Bedok", "Bukit Merah", "Queenstown", "Marina Bay", "Orchard",
  "Sentosa", "Changi", "Punggol", "Hougang", "Bishan",
  "Clementi", " Bukit Batok", "Sengkang", "Pasir Ris", "Yishun",
  "Kallang", "Lavender", "Bugis", "Chinatown", "Little India",
  "Kampong Glam", "Maxwell", "Tiong Bahru", "Holland Village", "Dempsey Hill",
];

const TOPICS = [
  // COST OF LIVING
  { title: "Hawker centre meal prices have gone up so much. Is $6 for chicken rice normal now?", type: ThoughtType.QUESTION, category: "cost_of_living" },
  { title: "COE hitting $100k again. Is owning a car in Singapore a luxury or a necessity?", type: ThoughtType.THOUGHT, category: "cost_of_living" },
  { title: "My HDB town council just raised maintenance fees. Anyone else feeling the pinch?", type: ThoughtType.THOUGHT, category: "cost_of_living" },
  { title: "Grocery bills keep climbing. Wet market or supermarket — which is cheaper now?", type: ThoughtType.QUESTION, category: "cost_of_living" },
  { title: "Is $5,000 monthly salary enough to live comfortably in Singapore in 2026?", type: ThoughtType.QUESTION, category: "cost_of_living" },

  // HOUSING
  { title: "BTO wait times are getting ridiculous. 5-6 years now. What happened to the 4-year promise?", type: ThoughtType.THOUGHT, category: "housing" },
  { title: "Resale HDB prices keep breaking records. Is the bubble going to burst?", type: ThoughtType.QUESTION, category: "housing" },
  { title: "Just collected keys to my BTO after 5 years. Finally! Here's what I learned about the process.", type: ThoughtType.MOMENT, category: "housing" },
  { title: "Should Singaporeans priority get bigger flats or is the new compact design the way forward?", type: ThoughtType.QUESTION, category: "housing" },
  { title: "EC vs BTO vs resale — what's the real difference in 2026?", type: ThoughtType.QUESTION, category: "housing" },

  // HEALTHCARE
  { title: "Medical inflation hitting 16.9% in Singapore. How are ordinary Singaporeans supposed to cope?", type: ThoughtType.THOUGHT, category: "healthcare" },
  { title: "Polyclinic wait times are getting worse. 3 hours for a 10-minute consultation. Is this acceptable?", type: ThoughtType.THOUGHT, category: "healthcare" },
  { title: "Just had a $2,000 hospital bill even with insurance. The system needs fixing.", type: ThoughtType.MOMENT, category: "healthcare" },
  { title: "Mental health support in Singapore — are we doing enough? Share your experience.", type: ThoughtType.QUESTION, category: "healthcare" },
  { title: "Elderly parents and healthcare costs — how are you managing?", type: ThoughtType.QUESTION, category: "healthcare" },

  // EDUCATION
  { title: "PSLE stress is real. My Primary 4 child is already having tuition for 4 subjects. Is this normal?", type: ThoughtType.THOUGHT, category: "education" },
  { title: "University fees hitting $38,000+. Is a local degree still worth the investment?", type: ThoughtType.QUESTION, category: "education" },
  { title: "Tuition culture in Singapore — are we creating robots or thinkers?", type: ThoughtType.THOUGHT, category: "education" },
  { title: "Poly vs JC vs ITE — does the path really determine your future?", type: ThoughtType.QUESTION, category: "education" },
  { title: "AI is changing education. Should schools teach coding or critical thinking?", type: ThoughtType.QUESTION, category: "education" },

  // EMPLOYMENT & ECONOMY
  { title: "Fresh grad salaries in Singapore — $3,500 or $5,000? What's realistic?", type: ThoughtType.QUESTION, category: "employment" },
  { title: "Foreign talent vs local workers — are Singaporeans being replaced in their own country?", type: ThoughtType.THOUGHT, category: "employment" },
  { title: "Gig economy workers in Singapore — no CPF, no benefits. Is this the future of work?", type: ThoughtType.THOUGHT, category: "employment" },
  { title: "Work-life balance in Singapore — is it just a buzzword?", type: ThoughtType.QUESTION, category: "employment" },
  { title: "AI replacing jobs in Singapore. Which industries are most at risk?", type: ThoughtType.QUESTION, category: "employment" },

  // TRANSPORT
  { title: "MRT breakdowns are becoming too frequent. What's going on with SMRT?", type: ThoughtType.THOUGHT, category: "transport" },
  { title: "New MRT lines are great but coverage in the east is still lacking. Thoughts?", type: ThoughtType.THOUGHT, category: "transport" },
  { title: "Grab prices have gone crazy. $25 for a 10-minute ride. Any alternatives?", type: ThoughtType.THOUGHT, category: "transport" },
  { title: "Cycling in Singapore — great initiative or death trap?", type: ThoughtType.QUESTION, category: "transport" },

  // FOOD & CULTURE
  { title: "Hawker culture is dying. Young hawkers are rare. How do we save it?", type: ThoughtType.THOUGHT, category: "food_culture" },
  { title: "Best hawker centre in Singapore? Fight me. I say Maxwell.", type: ThoughtType.THOUGHT, category: "food_culture" },
  { title: "Kopi o or teh tarik? The great Singapore debate.", type: ThoughtType.QUESTION, category: "food_culture" },
  { title: "Singlish — should we preserve it or let it evolve?", type: ThoughtType.QUESTION, category: "food_culture" },

  // WEATHER & ENVIRONMENT
  { title: "Singapore weather is getting worse. 36°C in September? Climate change is real.", type: ThoughtType.THOUGHT, category: "weather" },
  { title: "Is Singapore doing enough for sustainability? We import everything.", type: ThoughtType.QUESTION, category: "weather" },
  { title: "Rain or shine — Singaporeans and our umbrellas. A love story.", type: ThoughtType.MOMENT, category: "weather" },

  // GOVERNMENT & POLICY
  { title: "Budget 2026 — did the cost-of-living measures actually help you?", type: ThoughtType.QUESTION, category: "government" },
  { title: "CPF at 55 — should we be able to withdraw more?", type: ThoughtType.QUESTION, category: "government" },
  { title: "NS for women — should it happen? Discuss respectfully.", type: ThoughtType.QUESTION, category: "government" },
  { title: "Singapore's foreign policy — how should we navigate US-China tensions?", type: ThoughtType.QUESTION, category: "government" },

  // SOCIAL ISSUES
  { title: "Social media and youth mental health in Singapore — what's the real impact?", type: ThoughtType.THOUGHT, category: "social" },
  { title: "Elderly loneliness in Singapore — are we doing enough for our seniors?", type: ThoughtType.THOUGHT, category: "social" },
  { title: "Dating in Singapore — why is it so hard? 30s and still single.", type: ThoughtType.THOUGHT, category: "social" },
  { title: "Racial harmony in 2026 — are we truly integrated or just coexisting?", type: ThoughtType.QUESTION, category: "social" },

  // TECHNOLOGY
  { title: "AI in Singapore — are we embracing it or falling behind?", type: ThoughtType.QUESTION, category: "technology" },
  { title: "Singpass is amazing. Other countries should learn from us.", type: ThoughtType.THOUGHT, category: "technology" },
  { title: "Digital payments in Singapore — still using cash? Really?", type: ThoughtType.QUESTION, category: "technology" },

  // GENERAL LIFE
  { title: "What makes Singapore home for you? Share your favourite thing about this little red dot.", type: ThoughtType.QUESTION, category: "general" },
  { title: "Weekend plans — hawker food, mall walking, or nature trail? What's your vibe?", type: ThoughtType.QUESTION, category: "general" },
];

// Reply templates for each topic category
const REPLY_TEMPLATES: Record<string, string[]> = {
  cost_of_living: [
    "I remember when chicken rice was $3. Now it's $6-7 at some places. Inflation is real lah.",
    "Wet market still cheaper. I can get a week's vegetables for $15.",
    "The government gave some rebates but honestly it doesn't cover much.",
    "My family of 4 spends about $800/month on groceries. That's not cheap.",
    "Food court prices have gone up because rent went up. Simple as that.",
    "Coffee shop near my house increased kopi by 30 cents. Every cent counts.",
    "Eating out every day is a luxury now. I cook more at home.",
    "COE is ridiculous. $100k for a piece of paper to own a car?",
    "Public transport is still affordable though. Can't complain about that.",
    "The GST increase hit everyone. Even small purchases feel different now.",
    "Hawker food is our heritage. If prices keep going up, people will stop going.",
    "I switched from supermarket to wet market. Saving about $200/month.",
    "Subscription fees, insurance, bills — everything goes up, salary stays.",
    "My colleagues in other countries pay less for meals. SG is expensive.",
    "Budget 2026 help was okay but temporary. Need long-term solutions.",
    "Grab prices are insane now. I just walk or take MRT.",
    "Rent is the biggest killer. Can't afford to live near work anymore.",
    "The $200 cost-of-living payment helped a bit. Every bit counts.",
    "Single income family here — it's really tight every month.",
    "Eating at hawker centres is still the most affordable option lah.",
    "Wah, my electricity bill went up 20% this quarter. Power hungry!",
    "Insurance premiums going up every year. Medical inflation is scary.",
    "I've started meal prepping. Saves money and time.",
    "The rich don't feel it but middle class is getting squeezed.",
    "Public housing is still a blessing compared to other countries.",
  ],
  housing: [
    "BTO wait times are a joke now. 5-6 years? My parents waited 3.",
    "Resale prices are crazy. A 4-room in Tampines just sold for $650k.",
    "The new compact flats are okay for singles but families need space.",
    "EC is the sweet spot if you can afford it. Better amenities.",
    "I just got my BTO keys after 5 years. The wait was worth it though.",
    "HDB is doing a good job overall. Not perfect but better than most countries.",
    "Income ceiling raised to $16k — finally! Some families were priced out.",
    "My neighbour's resale flat just sold for $700k. BTO is the way to go.",
    "The new BTO designs are actually quite nice. Better than old ones.",
    "Wait time is long but at least the process is transparent now.",
    "Rent is killing me. $2,500 for a room in central area.",
    "Living with parents to save for BTO. Not ideal but necessary.",
    "The grant helps but you still need substantial savings.",
    "Proximity grant is great if you want to live near parents.",
    "Resale levy makes it hard to upgrade. Need to think carefully.",
    "5-room BTO is spacious. Worth the wait if you have a family.",
    "The new classification system (Standard, Plus, Prime) is fair.",
    "My BTO just TOP-ed. The finishing is actually quite good.",
    "Down payment is still a challenge for young couples.",
    "HDB loan is more stable than bank loan. Safer choice.",
    "White sites and modular kitchens — HDB is innovating.",
    "The waiting time drove me crazy but the flat is worth it.",
    " neighbours make or break the experience. Choose your estate wisely.",
    "Some estates have better amenities. Do your research.",
    "The new Tooth Fairy and Playtime programmes for kids are nice.",
  ],
  healthcare: [
    "16.9% medical inflation is terrifying. How are ordinary people supposed to cope?",
    "Polyclinic wait times are 3-4 hours now. Is this acceptable?",
    "The new IP riders mean more out-of-pocket. Not happy about this.",
    "My mum's hospital bill was $15k before insurance. Scary stuff.",
    "Mental health support is still lacking in Singapore. Need more resources.",
    "CHAS card helps but doesn't cover everything.",
    "GP visits are $50-80 now without subsidy. Crazy.",
    "The tiered pricing system is good but the gap is widening.",
    "My child was sick, polyclinic had no appointments. Had to go A&E.",
    "Healthcare workers are overworked. Need more staffing.",
    "Preventive care should be prioritized. Not just treatment.",
    "Telemedicine is a game changer. So convenient.",
    "Insurance premiums going up every year. Hard to keep up.",
    "Elderly care is expensive. How are retirees supposed to manage?",
    "The government is spending billions but is it reaching the right people?",
    "MediSave limits need to be reviewed. Not enough for serious illness.",
    "I waited 6 months for a specialist appointment. Too long.",
    "Hospital food needs improvement. Patients deserve better.",
    "Nurses are underpaid for what they do. They deserve more.",
    "The new hospital in the east helps but still not enough beds.",
    "Mental health is health. Stop treating it differently.",
    "My friend couldn't afford therapy. We need more subsidized mental health services.",
    "The Community Health Assist Scheme is a lifesaver for lower income.",
    "Private hospitals are way too expensive. Public is the way to go.",
    "Elderly parents need more home care options.",
  ],
  education: [
    "PSLE stress is real. My kid is Primary 4 and already has 4 tuition subjects.",
    "Tuition culture needs to stop. Kids are burning out.",
    "University fees are crazy. $38k for a degree?",
    "SkillsFuture credits help but not enough for serious reskilling.",
    "The education system produces good test-takers but are we teaching thinking?",
    "JC is stressful but poly gives you practical skills. Both have value.",
    "ITE is not the end. Many ITE grads do well in life.",
    "AI in education is coming. Are teachers ready?",
    "My child's school teacher is great but class size is too big.",
    "International school fees are insane. $30k+ per year.",
    "Coding should be mandatory in schools. It's the future.",
    "The PSLE scoring system change helped reduce pressure a bit.",
    "Some schools are better than others. The ranking system creates anxiety.",
    "My niece got into Raffles Institution. So proud!",
    "Home-based learning during COVID showed the digital divide.",
    "Bilingual policy is good but stressful for kids.",
    "NUS and NTU are world-class. We should be proud.",
    "The youth mental health crisis is linked to academic pressure.",
    "Gap year should be normalized in Singapore.",
    "Financial literacy should be taught in schools.",
    "Every child learns differently. One size doesn't fit all.",
    "My daughter wants to be an artist. How to support her?",
    "The tuition industry is worth billions. That's a problem.",
    "Project work in JC teaches teamwork but adds stress.",
    "Scholarships are great but not everyone can get one.",
  ],
  employment: [
    "Fresh grad salary of $3,500 is too low for Singapore's cost of living.",
    "Foreign talent issue is complex. We need them but locals must come first.",
    "Gig workers have no protection. This needs to change.",
    "Work-life balance is a myth in Singapore. We work the longest hours.",
    "AI is going to replace many jobs. We need to prepare.",
    "My company just replaced 20 people with AI. Scary times.",
    "Remote work should be more common. It helps with work-life balance.",
    "The PMET problem is real. Mid-career workers struggle to find jobs.",
    "SkillsFuture is helpful but the courses need to be more practical.",
    "Starting your own business in Singapore is hard. Too much red tape.",
    "The wage gap between top and bottom is widening.",
    "Internships should be paid. Free labor is not okay.",
    "My friend got retrenched at 45. Finding a new job at that age is tough.",
    "The gig economy is here to stay. We need better regulations.",
    "Women face unique challenges in the workplace. More support needed.",
    "The 5-day work week should become 4-day. Productivity won't drop.",
    "Job security is declining. Contract work is becoming the norm.",
    "Our education system doesn't prepare students for the real job market.",
    "Progressive wages help but the implementation is slow.",
    "Migrant workers build our infrastructure. They deserve better treatment.",
    "Career switching is scary but sometimes necessary.",
    "The best jobs are in tech but not everyone can code.",
    "Networking matters more than qualifications in some industries.",
    "Workplace discrimination still exists. We need to address it.",
    "The future of work is hybrid. Companies that resist will lose talent.",
  ],
  transport: [
    "MRT breakdowns are getting too frequent. SMRT needs to step up.",
    "The new Thomson-East Coast line is a game changer.",
    "Grab prices have gone crazy. $25 for 10 minutes?",
    "Cycling infrastructure needs improvement. Too many accidents.",
    "Public transport is still the best option in SG.",
    "Bus services in some areas are terrible. Long wait times.",
    "The ERP system needs upgrading. The old gantries are outdated.",
    "Electric vehicles are the future but charging stations are limited.",
    "Walking in Singapore is hard. Too hot, not enough shade.",
    "The MRT crowd during peak hours is insane.",
    "New bus routes help but some areas are still underserved.",
    "Car ownership is a luxury, not a necessity in Singapore.",
    "The Seletar Expressway improvements help but traffic is still bad.",
    "Motorcycle parking is limited. Need more lots.",
    "The new fare system is simpler. Good move.",
    "Cross-border travel to JB is getting easier with the new bridge.",
    "Parking in CBD is crazy expensive. $6 per hour?",
    "The autonomous vehicle trials are interesting. When will they be ready?",
    "Rain covers at bus stops would be nice.",
    "The MRT station near my house changed my life. So convenient.",
    "Traffic jams at PIE are getting worse every year.",
    "The new cable car to Sentosa is great for tourists.",
    "Bicycle sharing services need better regulation.",
    "The LRT system in Bukit Panjang needs upgrading.",
    "Congestion pricing helps but hurts lower income drivers.",
  ],
  food_culture: [
    "Hawker culture needs saving. Not enough young hawkers.",
    "Maxwell is the best hawker centre. Fight me.",
    "Kopi o is the real deal. No fancy latte can compare.",
    "Singlish is part of our identity. We should preserve it.",
    "Hawker food prices going up because of rent.",
    "The hawker who sold me chicken rice has been there 30 years. Legend.",
    "Hawker centres are our cultural heritage. UNESCO recognition helped.",
    "New hawker centres need better design. Some are too hot.",
    "I learned to cook char kway teow from my grandma. Priceless.",
    "The coffee shop uncle knows my order by heart. That's Singapore.",
    "Food courts are not the same as hawker centres. Different vibes.",
    "The best char kway teow is at Geylang. Don't @ me.",
    "Hainanese curry rice is underrated. So comforting.",
    "Milo dinosaur is the best drink. Period.",
    "We need more halal hawker options in some areas.",
    "Hawker culture is about more than food. It's community.",
    "The hawker centre near my office is my second home.",
    "Chilli crab is overrated. Don't fight me.",
    "Roti prata with fish curry — the perfect breakfast.",
    "The best teh tarik is from the Malay coffee shop.",
    "Hawker centres bring all races together. That's beautiful.",
    "My kid loves ice kachang. A true Singaporean!",
    "The ang ku kueh at the old shop is the best.",
    "Kaya toast and soft-boiled eggs — the Singaporean breakfast.",
    "We should teach hawker skills in schools.",
  ],
  weather: [
    "36°C in September? Climate change is hitting us hard.",
    "Singapore needs to do more for sustainability.",
    "Rain every afternoon now. Climate change is real.",
    "The heat is unbearable. Can't go outside without sweating.",
    "We import everything. Food security is a concern.",
    "Green buildings help but we need bigger changes.",
    "The rain is actually nice. Cools things down.",
    "Haze season is the worst. Hope it doesn't come back.",
    "Solar panels on HDB rooftops are a good start.",
    "We need more green spaces in the city.",
    "The heat affects outdoor workers the most.",
    "Electric cars are good but we need more charging points.",
    "Recycling rates in Singapore are still low. Need to improve.",
    "Water conservation is important. NEWater is genius.",
    "The weather forecast is getting harder to predict.",
    "Air conditioning is a necessity, not a luxury.",
    "The new parks are beautiful. More green spaces please!",
    "Climate action needs to be faster. We're running out of time.",
    "The south coast is vulnerable to sea level rise.",
    "Plant more trees! We need shade.",
    "The government's sustainability targets are ambitious.",
    "Every small action counts. Reduce, reuse, recycle.",
    "The National Parks Board does great work.",
    "Community gardens are popping up everywhere. Nice!",
    "We need to eat less meat for the environment.",
  ],
  government: [
    "Budget 2026 helped but the effects are temporary.",
    "CPF at 55 — should we be able to withdraw more?",
    "NS is important but the benefits need improvement.",
    "Singapore's foreign policy is smart. We stay neutral.",
    "The government is efficient but could be more transparent.",
    "Elections bring out the best in our democracy.",
    "The opposition plays an important role in parliament.",
    "Singapore's governance model is studied worldwide.",
    "The Pioneer and Merdeka Generation packages are touching.",
    "We need more community feedback in policy-making.",
    "The government responds quickly to crises. That's a strength.",
    "GST increase was necessary but painful.",
    "The Support For You calculator is helpful.",
    "Digital government services are getting better.",
    "The PM's salary review was handled transparently.",
    "Singapore's corruption-free reputation is valuable.",
    "The rule of law is something we take for granted.",
    "Our small size allows for faster policy implementation.",
    "The government's long-term planning is impressive.",
    "We need to balance growth with social welfare.",
    "The meritocracy system works but has gaps.",
    "More support for lower-income families is needed.",
    "The government listens but sometimes acts too slowly.",
    "National service builds character and cohesion.",
    "Singapore's success is a team effort.",
  ],
  social: [
    "Youth mental health is a growing concern. We need to do more.",
    "Elderly loneliness is heartbreaking. Check on your neighbours.",
    "Dating in Singapore is tough. Everyone is too busy.",
    "Racial harmony takes effort. It doesn't happen automatically.",
    "Social media is both a blessing and a curse.",
    "Community bonds are weakening. We need to rebuild them.",
    "Volunteering makes a difference. Try it!",
    "The generation gap is real. Different values, different worldviews.",
    "Singaporeans are kind but sometimes too busy to show it.",
    "Neighbourhood events bring people together.",
    "The kampung spirit is still alive if you look for it.",
    "More mental health resources in schools are needed.",
    "Inter-racial marriages are becoming more common. That's progress.",
    "The elderly deserve respect and care.",
    "Social media addiction is affecting our youth.",
    "We need more public spaces for community activities.",
    "The stress of modern life is affecting everyone.",
    "Charity starts at home. Take care of your family first.",
    "Singaporeans are generous. The response to crises shows that.",
    "The community centres play an important role.",
    "Youth unemployment is a concern. Need more opportunities.",
    "The national identity is evolving. That's okay.",
    "We're a small country with a big heart.",
    "The SG United spirit is what makes us special.",
    "Everyone has a role to play in building community.",
  ],
  technology: [
    "AI is transforming Singapore. We need to embrace it.",
    "Singpass is world-class. Other countries should learn from us.",
    "Digital payments are convenient but some elderly struggle.",
    "Singapore is becoming a tech hub. Exciting times!",
    "Cybersecurity is a growing concern. Stay vigilant.",
    "The government's AI strategy is ambitious.",
    "Tech companies are choosing Singapore as their HQ.",
    "We need more tech talent in Singapore.",
    "Digital literacy programs for the elderly are important.",
    "Singapore's smart nation initiative is on track.",
    "5G coverage is expanding. Faster speeds for everyone.",
    "The fintech scene in Singapore is booming.",
    "We need to balance innovation with privacy.",
    "Tech education should start young.",
    "Singapore's digital infrastructure is world-class.",
    "The GovTech team does amazing work.",
    "AI governance is important. Singapore is leading the way.",
    "We need to bridge the digital divide.",
    "Tech can solve many of Singapore's challenges.",
    "Innovation needs support from the government and private sector.",
    "Singapore's tech ecosystem is growing rapidly.",
    "We need more women in tech.",
    "Digital transformation is happening across all sectors.",
    "Singapore is well-positioned for the AI revolution.",
    "The startup scene is vibrant but needs more funding.",
  ],
  general: [
    "Singapore is home. No matter where I go, I always come back.",
    "Weekend hawker food crawl is the best therapy.",
    "This little red dot has a special place in my heart.",
    "The people make Singapore special, not the buildings.",
    "I love how safe Singapore is. Can walk anywhere at night.",
    "The greenery in Singapore is underrated. So many parks!",
    "National Day celebrations make me so proud to be Singaporean.",
    "The multiculturalism here is beautiful. So much diversity.",
    "Singapore food is the best in the world. Not biased at all.",
    "The efficiency of everything here is amazing.",
    "I love the MRT. So convenient and clean.",
    "The hawker centres are like community living rooms.",
    "Singapore at night is beautiful. Marina Bay lights up!",
    "The Changi Airport is always a pleasure to transit through.",
    "Gardens by the Bay is a masterpiece.",
    "The hawker centre near my house is my happy place.",
    "Singapore is small but has everything you need.",
    "The people here are resilient. We always bounce back.",
    "I'm proud of how Singapore handled COVID.",
    "The future of Singapore looks bright.",
    "Living in Singapore is expensive but worth it.",
    "The best thing about Singapore is the food. Obviously.",
    "Singapore is proof that a small country can do big things.",
    "I wouldn't want to live anywhere else.",
    "This is home. This is Singapore.",
  ],
};

const REACTION_TYPES = [
  ReactionType.APPRECIATE,
  ReactionType.USEFUL,
  ReactionType.INTERESTING,
  ReactionType.LEARNED_SOMETHING,
  ReactionType.RELATE,
  ReactionType.DISAGREE,
];

const SHARE_INTENTS = [
  ShareIntent.AGREE,
  ShareIntent.DISAGREE,
  ShareIntent.USEFUL,
  ShareIntent.INTERESTING,
  ShareIntent.ASKING_QUESTION,
  ShareIntent.ADDING_CONTEXT,
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

function generateDisplayName(): { name: string; ethnicity: string } {
  const ethnicities = ["chinese", "malay", "indian"] as const;
  const weights = [0.74, 0.13, 0.09]; // Approximate SG ethnic distribution
  const rand = Math.random();
  let cumulative = 0;
  let ethnicity: "chinese" | "malay" | "indian" = "chinese";
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      ethnicity = ethnicities[i];
      break;
    }
  }
  
  const first = randomItem(SINGAPORE_NAMES[ethnicity].first);
  const last = randomItem(SINGAPORE_NAMES[ethnicity].last);
  
  return { name: `${first} ${last}`, ethnicity };
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function main() {
  console.log("🧠 MIND Platform — Massive Synthetic Data Generator");
  console.log("=" .repeat(60));
  console.log("Generating 1000 users, 50 topics, 5000+ replies...\n");

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.reaction.deleteMany();
  await prisma.share.deleteMany();
  await prisma.contextSource.deleteMany();
  await prisma.context.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.report.deleteMany();
  await prisma.moderationRecord.deleteMany();
  await prisma.scamFlag.deleteMany();
  await prisma.thought.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleaned.\n");

  // Generate 1000 users
  console.log("👥 Generating 1000 users...");
  const users = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < 1000; i++) {
    let { name, ethnicity } = generateDisplayName();
    
    // Ensure unique names
    while (usedNames.has(name)) {
      ({ name, ethnicity } = generateDisplayName());
    }
    usedNames.add(name);
    
    const ageGroups = Object.values(AgeGroup);
    const ageWeights = [0.05, 0.08, 0.07, 0.15, 0.30, 0.20, 0.15];
    let ageRand = Math.random();
    let ageCumulative = 0;
    let ageGroup: AgeGroup = AgeGroup.AGE_25_39;
    
    for (let j = 0; j < ageWeights.length; j++) {
      ageCumulative += ageWeights[j];
      if (ageRand < ageCumulative) {
        ageGroup = ageGroups[j];
        break;
      }
    }
    
    const languages: Language[] = [Language.en];
    if (ethnicity === "chinese" && Math.random() > 0.3) languages.push(Language.zh);
    if (ethnicity === "malay" && Math.random() > 0.2) languages.push(Language.ms);
    if (ethnicity === "indian" && Math.random() > 0.3) languages.push(Language.ta);
    if (Math.random() > 0.7) languages.push(Language.zh);
    if (Math.random() > 0.8) languages.push(Language.ms);
    
    const vibes = Object.values(FeedVibe);
    const feedVibe = randomItem(vibes);
    
    const uiMode = ageGroup === AgeGroup.UNDER_13 || ageGroup === AgeGroup.AGE_13_15
      ? "CHILD"
      : ageGroup === AgeGroup.AGE_60_PLUS
      ? "SENIOR"
      : "STANDARD";
    
    const user = await prisma.user.create({
      data: {
        displayName: name,
        ageGroup,
        preferredLanguages: languages,
        feedVibe,
        uiMode: uiMode as any,
        isHumanVerified: true,
        trustSignals: randomItems(
          ["HUMAN_VERIFIED", "ACCOUNT_ESTABLISHED", "COMMUNITY_MEMBER", "SOURCES_FREQUENTLY_PROVIDED"] as any[],
          1,
          4
        ),
        humanPassportId: `hp_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: randomDate(180),
      },
    });
    
    users.push(user);
    
    if ((i + 1) % 100 === 0) {
      process.stdout.write(`   ${i + 1}/1000 users created\r`);
    }
  }
  console.log(`\n✅ Created ${users.length} users\n`);

  // Generate follow relationships (each user follows 5-50 random others)
  console.log("🔗 Generating follow relationships...");
  const followData: { followerId: string; followingId: string }[] = [];
  
  for (const user of users) {
    const followCount = randomBetween(5, 50);
    const potentialFollows = users
      .filter((u) => u.id !== user.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, followCount);
    
    for (const target of potentialFollows) {
      followData.push({ followerId: user.id, followingId: target.id });
    }
  }
  
  // Batch insert follows
  const BATCH_SIZE = 500;
  for (let i = 0; i < followData.length; i += BATCH_SIZE) {
    const batch = followData.slice(i, i + BATCH_SIZE);
    await prisma.follow.createMany({ data: batch, skipDuplicates: true });
    process.stdout.write(`   ${Math.min(i + BATCH_SIZE, followData.length)}/${followData.length} follows created\r`);
  }
  console.log(`\n✅ Created follow relationships\n`);

  // Generate topics and discussions
  console.log("💬 Generating topics and discussions...");
  const allThoughts: any[] = [];
  
  for (let topicIdx = 0; topicIdx < TOPICS.length; topicIdx++) {
    const topic = TOPICS[topicIdx];
    const repliesNeeded = randomBetween(100, 150);
    
    // Pick a random user to post the topic
    const topicAuthor = randomItem(users);
    
    // Create the topic thought
    const topicThought = await prisma.thought.create({
      data: {
        authorId: topicAuthor.id,
        type: topic.type,
        content: topic.title,
        language: Language.en,
        provenance: ContentProvenance.HUMAN_AUTHORED,
        classification: ContentClassification.OPINION,
        moderationLayer: ModerationLayer.CLEAN,
        moderationAction: ModerationAction.ALLOW,
        isAmplified: true,
        createdAt: randomDate(30),
      },
    });
    
    allThoughts.push(topicThought);
    
    // Generate replies
    const replies = [];
    const replyPool = REPLY_TEMPLATES[topic.category] || REPLY_TEMPLATES.general;
    
    for (let replyIdx = 0; replyIdx < repliesNeeded; replyIdx++) {
      const replyAuthor = randomItem(users);
      const replyContent = randomItem(replyPool);
      
      // Some replies add Singlish flavor
      const finalContent = Math.random() > 0.85
        ? `${replyContent} ${randomItem(SINGLISH_PHRASES)}`
        : replyContent;
      
      const reply = await prisma.thought.create({
        data: {
          authorId: replyAuthor.id,
          type: ThoughtType.THOUGHT,
          content: finalContent,
          language: Language.en,
          provenance: ContentProvenance.HUMAN_AUTHORED,
          classification: ContentClassification.OPINION,
          moderationLayer: ModerationLayer.CLEAN,
          moderationAction: ModerationAction.ALLOW,
          isAmplified: true,
          replyToId: topicThought.id,
          createdAt: new Date(topicThought.createdAt.getTime() + (replyIdx + 1) * randomBetween(60000, 3600000)),
        },
      });
      
      replies.push(reply);
      
      // Some replies get reactions
      if (Math.random() > 0.3) {
        const reactorCount = randomBetween(1, 10);
        const reactors = randomItems(users, 1, reactorCount);
        
        for (const reactor of reactors) {
          try {
            await prisma.reaction.create({
              data: {
                userId: reactor.id,
                thoughtId: reply.id,
                type: randomItem(REACTION_TYPES),
              },
            });
          } catch {
            // Skip duplicate reactions
          }
        }
      }
      
      // Some replies get shared
      if (Math.random() > 0.85) {
        const sharer = randomItem(users);
        try {
          await prisma.share.create({
            data: {
              userId: sharer.id,
              thoughtId: reply.id,
              intent: randomItem(SHARE_INTENTS),
            },
          });
        } catch {
          // Skip
        }
      }
    }
    
    // Add reactions to the topic itself
    const topicReactionCount = randomBetween(10, 50);
    const topicReactors = randomItems(users, 10, topicReactionCount);
    
    for (const reactor of topicReactors) {
      try {
        await prisma.reaction.create({
          data: {
            userId: reactor.id,
            thoughtId: topicThought.id,
            type: randomItem(REACTION_TYPES),
          },
        });
      } catch {
        // Skip
      }
    }
    
    // Add shares to topic
    const topicShareCount = randomBetween(5, 20);
    const topicSharers = randomItems(users, 5, topicShareCount);
    
    for (const sharer of topicSharers) {
      try {
        await prisma.share.create({
          data: {
            userId: sharer.id,
            thoughtId: topicThought.id,
            intent: randomItem(SHARE_INTENTS),
          },
        });
      } catch {
        // Skip
      }
    }
    
    // Update share count on topic
    await prisma.thought.update({
      where: { id: topicThought.id },
      data: { shareCount: topicShareCount },
    });
    
    console.log(`   Topic ${topicIdx + 1}/${TOPICS.length}: "${topic.title.substring(0, 50)}..." → ${replies.length} replies`);
  }

  // Generate some standalone thoughts (not replies)
  console.log("\n💭 Generating standalone thoughts...");
  const standaloneThoughts = [
    "Just finished a 10km run at East Coast Park. The weather was perfect!",
    "My neighbour brought me kueh today. Such a sweet gesture. This is Singapore.",
    "Had the best laksa of my life at a hawker centre in Toa Payoh. Amazing!",
    "Watching the NDP rehearsal from my void deck. So many fireworks!",
    "The new MRT line is a game changer for my commute. Thank you LTA!",
    "Just adopted a cat from the SPCA. Meet Mochi!",
    "Went to Gardens by the Bay at night. The light show was magical.",
    "My hawker uncle remembered my order after 2 years. That's Singapore hospitality.",
    "Rain just started. Everyone running for cover. Classic SG.",
    "Sunday morning kopi at the void deck. Simple pleasures.",
    "Just finished building my LEGO Changi Airport set. Took 3 days!",
    "The sunset from Marina Barrage was stunning tonight.",
    "Had a great conversation with my taxi uncle about Singapore politics.",
    "The hawker centre near my office is my second home. I know everyone there.",
    "Happy National Day everyone! SG59!",
  ];
  
  for (const thoughtContent of standaloneThoughts) {
    const author = randomItem(users);
    await prisma.thought.create({
      data: {
        authorId: author.id,
        type: ThoughtType.MOMENT,
        content: thoughtContent,
        language: Language.en,
        provenance: ContentProvenance.HUMAN_AUTHORED,
        classification: ContentClassification.PERSONAL_EXPERIENCE,
        moderationLayer: ModerationLayer.CLEAN,
        moderationAction: ModerationAction.ALLOW,
        isAmplified: true,
        createdAt: randomDate(14),
      },
    });
  }
  console.log(`✅ Created ${standaloneThoughts.length} standalone thoughts\n`);

  // Final summary
  const totalUsers = await prisma.user.count();
  const totalThoughts = await prisma.thought.count();
  const totalReactions = await prisma.reaction.count();
  const totalShares = await prisma.share.count();
  const totalFollows = await prisma.follow.count();
  const totalReplies = await prisma.thought.count({ where: { replyToId: { not: null } } });

  console.log("🎉 SEED COMPLETE!");
  console.log("=".repeat(60));
  console.log(`👥 Users:        ${totalUsers}`);
  console.log(`💭 Thoughts:     ${totalThoughts}`);
  console.log(`💬 Replies:      ${totalReplies}`);
  console.log(`👏 Reactions:    ${totalReactions}`);
  console.log(`↗️  Shares:       ${totalShares}`);
  console.log(`🔗 Follows:      ${totalFollows}`);
  console.log("=".repeat(60));
  console.log(`📈 Avg replies per topic: ~${Math.round(totalReplies / TOPICS.length)}`);
  console.log(`📈 Avg reactions per thought: ~${(totalReactions / totalThoughts).toFixed(1)}`);
  console.log("=".repeat(60));
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
