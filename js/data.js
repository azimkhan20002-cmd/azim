/* ============================================================
   SMARTER THAN YESTERDAY — curriculum data
   "Making Azim as smart as humanly possible — in all aspects of life."
   Six domains · 29 lessons · quizzes, flashcards, voice scripts.
   ============================================================ */

const COURSE = {
  title: "Smarter Than Yesterday",
  subtitle: "Making Azim as smart as humanly possible — in all aspects of life",
  accentNote: "All voice lessons use British English (en-GB) voices only. Nothing ever plays by itself — you press play.",
  domains: [
    /* -------------------------------------------------------- */
    {
      id: "mind",
      name: "Mind & Learning",
      icon: "🧠",
      color: "#6c8cff",
      tagline: "Upgrade the hardware and the software between your ears.",
      lessons: [
        {
          id: "mind-1",
          title: "How Learning Actually Works",
          minutes: 8,
          hook: "Everything you were taught about studying at school was probably wrong.",
          ideas: [
            { h: "Rereading is a placebo", b: "Rereading notes and highlighting feel productive, but they mostly train recognition — 'this looks familiar' — not recall. In controlled studies, students who reread do little better than students who do nothing. Familiarity is not knowledge." },
            { h: "Retrieval is the engine", b: "The single most powerful study act is trying to pull information out of your own head — a practice test, a blank page, explaining aloud. Every successful retrieval physically strengthens and rewires the memory trace. Struggling to remember is not a sign of failure; the struggle IS the learning." },
            { h: "Desirable difficulty", b: "Psychologist Robert Bjork showed that learning which feels harder (testing, spacing, mixing topics) produces stronger long-term memory than learning that feels smooth. If studying feels easy, be suspicious. If it feels like effortful recall, you're doing it right." },
            { h: "Metacognition", b: "The biggest predictor of how well someone learns is how well they can judge what they actually know. Experts constantly ask: 'Can I explain this from scratch? Where exactly does my understanding get fuzzy?' That habit — thinking about your thinking — is trainable." }
          ],
          action: "Pick something you learned this week. Close every tab and book. Write everything you can recall about it on a blank page for five minutes. Then check what you missed.",
          quiz: [
            { q: "Which study method produces the strongest long-term memory?", options: ["Rereading the chapter three times", "Highlighting key sentences", "Testing yourself from memory", "Copying notes neatly"], answer: 2, why: "Retrieval practice (testing) beats every passive method in controlled experiments — the struggle to recall is what strengthens the memory." },
            { q: "What does a 'desirable difficulty' mean?", options: ["Learning only hard subjects", "Practice that feels effortful but builds stronger memory", "Studying in a noisy room", "Taking difficult exams early"], answer: 1, why: "Difficulties like testing, spacing and interleaving feel worse in the moment but dramatically improve retention." },
            { q: "Why does rereading feel like it works?", options: ["It genuinely builds strong memories", "It creates fluency — the material feels familiar, which we mistake for knowing it", "It activates the hippocampus directly", "Because teachers recommend it"], answer: 1, why: "Familiarity (recognition) is not recall. The fluency illusion is the most common study trap." }
          ],
          voice: "Welcome to lesson one. Here is the uncomfortable truth: almost everything you were taught about studying was wrong. Rereading and highlighting feel productive, but they mostly train your eyes, not your memory. Real learning happens when you drag information out of your own head. Close the book. Ask yourself a question. Struggle with it. That struggle is not failure — that struggle is literally the learning happening. This week, take one thing you learned, put a blank page in front of you, and write down everything you remember. It will feel hard. That is exactly why it works."
        },
        {
          id: "mind-2",
          title: "Memory: Spacing, Interleaving & Mnemonics",
          minutes: 9,
          hook: "Memory champions don't have better brains. They have better systems.",
          ideas: [
            { h: "The forgetting curve", b: "Ebbinghaus measured how fast we forget: without review, most new information is gone within days. But each well-timed review flattens the curve. Review just as you're about to forget, and a fact can be made permanent in as few as 4–5 reviews." },
            { h: "Spaced repetition", b: "Instead of cramming, review on an expanding schedule: after 1 day, 3 days, 7, 16, 35. Ten minutes of spaced review beats two hours of cramming — permanently. This course's flashcard engine schedules reviews exactly this way." },
            { h: "Interleaving", b: "Mixing topics within a study session (A-B-C-A-B-C instead of A-A-A-B-B-B) feels confusing but builds far better discrimination and transfer. Your brain is forced to choose the right approach each time, which is exactly what real life demands." },
            { h: "Memory palaces & elaboration", b: "Every memory champion uses the same trick: attach vivid, bizarre images to familiar locations (a memory palace). Abstract facts are forgettable; weird sensory stories are not. Also: the more you connect a new fact to things you already know ('elaboration'), the more hooks it has." }
          ],
          action: "Choose the 10 facts you most want to remember from this course. Put them into the flashcards screen today, and let the scheduler tell you when to review.",
          quiz: [
            { q: "The best moment to review something is…", options: ["Immediately after learning, five times in a row", "Just as you're about to forget it", "Only the night before you need it", "Every hour"], answer: 1, why: "Reviewing at the edge of forgetting maximally re-strengthens the memory. The spacing effect is one of the most replicated findings in psychology." },
            { q: "Interleaving means…", options: ["Studying one topic until mastery before moving on", "Mixing different topics within a session", "Reading while listening to music", "Alternating between books and videos of the same topic"], answer: 1, why: "Mixing topics forces your brain to discriminate and select strategies — harder in the moment, far better for long-term transfer." },
            { q: "Memory champions primarily rely on…", options: ["Photographic memory", "Higher IQ", "Encoding facts as vivid images in familiar locations", "Repeating facts thousands of times"], answer: 2, why: "The memory palace (method of loci) exploits the brain's enormous capacity for spatial and visual memory. It's a learnable skill, not a gift." }
          ],
          voice: "Your memory is not weak — it is unscheduled. Without review, you forget most of what you learn within days. That is the forgetting curve, and it is brutal. But here is the secret: review something just as you are about to forget it, and the memory comes back stronger. One day, three days, a week, a month. A handful of well-timed reviews can make a fact permanent. And when something refuses to stick, make it weird. Memory champions do not have special brains. They turn dull facts into absurd images and place them along a familiar walk through their own home. Boring facts fade. A giant purple accountant dancing in your kitchen does not."
        },
        {
          id: "mind-3",
          title: "Focus & Deep Work",
          minutes: 8,
          hook: "Your attention is the most valuable asset you own. Everyone is bidding for it.",
          ideas: [
            { h: "Attention is the bottleneck", b: "You don't experience the world; you experience what you attend to. Two people in the same meeting absorb different realities. Skill at directing attention — not raw IQ — is what separates high performers in every cognitively demanding field." },
            { h: "Context switching has a real cost", b: "Every switch between tasks leaves 'attention residue' — part of your mind stays stuck on the previous task. Studies of office workers show it can take 20+ minutes to fully re-engage after an interruption. 'Quick checks' of your phone are never quick." },
            { h: "Deep work", b: "Cal Newport's term for long, uninterrupted blocks of cognitively demanding work. The recipe: pick one important thing, block 60–120 minutes, remove every interruption, and work on only that. Depth is increasingly rare, which makes it increasingly valuable." },
            { h: "Design beats willpower", b: "Willpower is unreliable; environment is not. Phone in another room, notifications off by default, website blockers during focus blocks, one clear task written down. People who seem disciplined mostly just arrange their environment so discipline isn't needed." }
          ],
          action: "Tomorrow, schedule one 90-minute deep work block on your most important task. Phone in another room. One sentence goal written on paper in front of you.",
          quiz: [
            { q: "'Attention residue' refers to…", options: ["Dust on your screen", "Part of your mind staying on the previous task after switching", "Forgetting why you opened an app", "Eye strain from long sessions"], answer: 1, why: "After any switch, a chunk of working memory remains stuck on the prior task — that's why constant checking is so expensive." },
            { q: "The most reliable focus strategy is…", options: ["Stronger willpower", "Motivational videos", "Designing your environment so distraction requires effort", "Multitasking to build stamina"], answer: 2, why: "Environment design beats willpower. Make distraction harder than focus and you win by default." },
            { q: "A typical deep work block should be…", options: ["10 minutes", "25 minutes with your phone nearby", "60–120 minutes on one task, interruptions removed", "A full day without breaks"], answer: 2, why: "Depth needs time to load the problem into your head — most people need 15+ minutes just to reach full focus." }
          ],
          voice: "Here is the scarcest resource in your life. It is not money. It is attention. You do not experience the world — you experience whatever you are attending to. And right now, some of the smartest engineers on Earth are paid to steal yours. The counter-attack is deep work: one important task, ninety uninterrupted minutes, phone in another room. It will feel uncomfortable at first, because your brain has been trained to snack on novelty. Push through. The ability to focus deeply is becoming rare at exactly the moment it is becoming valuable. That gap is your opportunity."
        },
        {
          id: "mind-4",
          title: "Thinking Tools: First Principles & Mental Models",
          minutes: 9,
          hook: "Smart isn't knowing more facts. Smart is having better lenses.",
          ideas: [
            { h: "First principles", b: "Reason like a physicist: strip a problem down to what is provably true, then rebuild from there — instead of reasoning by analogy ('this is how it's always done'). Elon Musk used it on rockets: what do the raw materials actually cost? First-principles thinking is slow but finds solutions analogy never can." },
            { h: "Second-order thinking", b: "Always ask: 'And then what?' Every decision has consequences, and those consequences have consequences. First-order thinking asks 'does this solve my problem now?'. Second-order thinking asks 'what does this cause next month?'. Most costly mistakes are first-order wins and second-order disasters." },
            { h: "Inversion", b: "Instead of asking how to succeed, ask what would guarantee failure — then avoid those things. 'How do I have a great career?' is hard. 'What would definitely ruin my career?' is easy: be unreliable, stop learning, burn trust. Avoiding stupidity is more reliable than seeking brilliance." },
            { h: "A latticework of models", b: "Charlie Munger's idea: the world doesn't organise itself by subject, so one discipline's lens isn't enough. Know the big ideas from many fields — compounding, incentives, feedback loops, supply and demand, evolution, entropy — and problems stop looking one-dimensional. 'To the man with a hammer, everything looks like a nail.'" }
          ],
          action: "Take one decision you're facing. Write: (1) What's definitely true here? (2) And then what? (3) What would guarantee the worst outcome? Answer all three honestly.",
          quiz: [
            { q: "Reasoning from first principles means…", options: ["Copying what the industry leader does", "Building conclusions only from provably true fundamentals", "Following your first instinct", "Reading the oldest book on the topic"], answer: 1, why: "First-principles thinking strips away analogy and convention to rebuild from bedrock truth — slower, but capable of breakthroughs." },
            { q: "'And then what?' is the core question of…", options: ["First principles", "Second-order thinking", "Wishful thinking", "Brainstorming"], answer: 1, why: "Second-order thinking traces consequences of consequences, catching the downstream disasters first-order thinking misses." },
            { q: "Inversion suggests the best way to be smart is often to…", options: ["Read more biographies", "Consistently avoid being stupid", "Take bigger risks", "Think faster"], answer: 1, why: "Avoiding guaranteed-failure behaviours is more reliable than trying to engineer brilliance. Invert the problem." }
          ],
          voice: "Being smart is not about stuffing in more facts. It is about owning better lenses. Three lenses will change how you see everything. One: first principles — ignore how things are usually done, ask what is actually true, and rebuild from there. Two: second-order thinking — for every decision, ask, and then what? Most disasters were first-order wins. Three: inversion — instead of asking how to succeed, ask what would guarantee failure, and simply never do those things. Collect lenses like these from every field, and problems that look impossible to other people start to look obvious to you."
        },
        {
          id: "mind-5",
          title: "Cognitive Biases: Debug Your Own Brain",
          minutes: 9,
          hook: "Your brain runs buggy software written for a savannah. Here are the top bugs.",
          ideas: [
            { h: "Confirmation bias", b: "You don't seek the truth; you seek to be right. You notice evidence that agrees with you and explain away the rest. Antidote: actively ask 'what would change my mind?' and seek out the smartest version of the opposing view (steel-manning)." },
            { h: "Sunk cost fallacy", b: "You persist with failing projects, bad investments and dead relationships because of what you've already spent. But past costs are gone regardless. The only question that matters: 'Knowing what I know now, would I choose this again today?'" },
            { h: "Dunning–Kruger effect", b: "The less you know about a field, the less you're able to see how much you don't know — so beginners are often overconfident, while experts are painfully aware of complexity. Guard: treat confidence as evidence of nothing, and ask what a real expert would worry about." },
            { h: "Availability heuristic", b: "You judge how common or risky something is by how easily examples come to mind — which is why vivid news stories distort everyone's fears. Plane crashes terrify; driving doesn't. Antidote: when it matters, look for base rates (actual statistics), not stories." }
          ],
          action: "Write down one belief you hold strongly. Then spend ten minutes building the strongest possible case AGAINST it. Notice how uncomfortable that is — and do it anyway.",
          quiz: [
            { q: "The best antidote to confirmation bias is to…", options: ["Trust your gut", "Read more news", "Actively seek the strongest opposing argument", "Ask friends who agree with you"], answer: 2, why: "Steel-manning the other side forces your brain past its default 'defend my view' programming." },
            { q: "Sunk cost thinking fails because…", options: ["Money doesn't matter", "Past costs are unrecoverable — only future outcomes should drive the decision", "Quitting is always right", "Big investments always succeed"], answer: 1, why: "What's spent is spent. The rational question is only: would I choose this again starting from today?" },
            { q: "The Dunning–Kruger effect warns that…", options: ["Experts are usually wrong", "Confidence peaks when knowledge is shallow", "Intelligence is fixed", "Practice makes perfect"], answer: 1, why: "Shallow knowledge hides the complexity that experts can see — so be most suspicious of your confidence when you're new to something." }
          ],
          voice: "Your brain is running ancient software, and it has bugs. Here are the four most expensive ones. Confirmation bias: you do not search for truth, you search for agreement. Sunk cost: you throw good time after bad because leaving feels like losing. Dunning and Kruger: the less you know, the less you can see how much you do not know — which is why beginners are so confident. And availability: you fear what is vivid, not what is common. You cannot delete these bugs. But you can learn to catch them mid-thought, and that one skill will save you more money and pain than almost any other."
        },
        {
          id: "mind-6",
          title: "IQ Is Not Fixed: The Growth Stack",
          minutes: 8,
          hook: "The most important belief about intelligence is your belief about intelligence.",
          ideas: [
            { h: "Growth mindset", b: "Carol Dweck's research: people who believe ability can be developed learn more, persist longer and recover from failure faster than people who believe it's fixed. Struggle means 'growing', not 'not smart enough'. The word 'yet' rewires self-talk: 'I can't do this… yet.'" },
            { h: "Deliberate practice", b: "Anders Ericsson studied experts in every field: what separates the best is not hours, but the type of practice — working at the edge of your ability, on your specific weaknesses, with feedback, fully focused. Mindless repetition just reinforces your current level." },
            { h: "Fluid vs crystallised intelligence", b: "Fluid intelligence (novel problem-solving) and crystallised intelligence (accumulated knowledge and skill) are different. Raw fluid ability may have some limits, but crystallised intelligence — the kind that makes you genuinely useful and wise — grows your entire life, and it's the one that matters most in the real world." },
            { h: "The compounding of small gains", b: "Improving 1% a day sounds like nothing. Compounded over a year it's ~37×. Learning compounds like money: what you know determines how fast you can learn more. The gap between daily learners and everyone else widens silently, then suddenly." }
          ],
          action: "Identify your single weakest professional skill. Design 30 minutes of deliberate practice for it: specific, at the edge of your ability, with a way to get feedback. Do it three times this week.",
          quiz: [
            { q: "Deliberate practice is characterised by…", options: ["Doing what you already enjoy for many hours", "Working at the edge of your ability on weaknesses, with feedback", "Practising only before competitions", "Watching experts perform"], answer: 1, why: "Hours alone don't create experts — targeted, uncomfortable, feedback-rich practice does." },
            { q: "Which type of intelligence grows throughout your entire life?", options: ["Fluid intelligence", "Crystallised intelligence", "Neither — IQ is fixed at birth", "Emotional intelligence only"], answer: 1, why: "Knowledge, skill and judgement (crystallised intelligence) keep accumulating for decades — this is the intelligence that matters most in real life." },
            { q: "1% improvement per day compounds to roughly…", options: ["37% better per year", "About twice as good per year", "About 37× better per year", "Nothing — small gains don't add up"], answer: 2, why: "1.01^365 ≈ 37.8. Learning compounds like interest, which is why tiny daily habits beat occasional heroic efforts." }
          ],
          voice: "Let us kill the most damaging idea in education: that smart is something you either are or are not. The research is clear. The people who get the furthest believe ability is built, not born — and they practise deliberately. Not more hours. Different hours: at the edge of their ability, on their weaknesses, with feedback, fully focused. Yes, some raw processing speed is genetic. But the intelligence that runs your life — knowledge, judgement, skill — compounds for your entire life, like money in an index fund. One percent better each day is thirty-seven times better in a year. That is not motivational fluff. That is arithmetic."
        }
      ]
    },
    /* -------------------------------------------------------- */
    {
      id: "money",
      name: "Money & Work",
      icon: "💷",
      color: "#3ddc97",
      tagline: "Financial intelligence and career leverage — the adulting cheat codes.",
      lessons: [
        {
          id: "money-1",
          title: "Wealth 101: Compounding & Assets",
          minutes: 8,
          hook: "Nobody gets rich from a salary. They get rich from what the salary buys.",
          ideas: [
            { h: "Assets vs liabilities", b: "An asset puts money in your pocket (index funds, rental property, a business, your skills). A liability takes money out (car loans, credit card debt, lifestyle upgrades). Wealthy people buy assets first and let the assets pay for luxuries. Everyone else does the reverse." },
            { h: "Compound interest is the eighth wonder", b: "£500/month invested at a historical ~7% average annual return is roughly: £85k in 10 years, £260k in 20, £600k in 30. Time in the market matters more than timing or brilliance — starting at 25 vs 35 can double your outcome with identical contributions." },
            { h: "Inflation is a silent tax", b: "Cash under the mattress loses purchasing power every year. At 3% inflation, prices double about every 24 years. Money must be invested to merely stand still in real terms. 'Saving' in cash alone is a slow-motion loss." },
            { h: "Boring wins", b: "The evidence is overwhelming: low-cost, diversified index funds, held for decades, beat the vast majority of professional stock-pickers after fees. The boring strategy — automate, diversify, hold, ignore the news — is the winning strategy. (This is education, not personal financial advice.)" }
          ],
          action: "Calculate your net worth today (assets minus debts — one number, honestly). Then write down what you'd need to save monthly to hit your 10-year number at 7% growth. Knowing the number changes the behaviour.",
          quiz: [
            { q: "Which of these is an asset?", options: ["A financed new car", "An index fund", "A credit card balance", "A bigger TV"], answer: 1, why: "Assets put money in your pocket over time; liabilities and consumption take it out." },
            { q: "The biggest factor in compound growth is…", options: ["Picking the best stocks", "Time in the market", "Watching financial news daily", "Trading frequently"], answer: 1, why: "Compounding is exponential — the later years do most of the work, so starting early beats being clever." },
            { q: "At 3% inflation, cash loses half its purchasing power in about…", options: ["5 years", "10 years", "24 years", "100 years"], answer: 2, why: "Rule of 72: 72 ÷ 3 ≈ 24 years. Uninvested cash is a slow, guaranteed loss." }
          ],
          voice: "Here is the money lesson school never gave you. You will not get rich from a salary. You get rich from what the salary buys — if it buys assets. An asset is anything that puts money into your pocket while you sleep: index funds, a business, your own skills. And the engine underneath is compounding. Invest five hundred pounds a month at seven percent, and in thirty years it is around six hundred thousand pounds. The maths is not the hard part. The hard part is that the strategy is boring, and boring does not feel like winning. Start early, automate it, diversify, and then — this is the crucial step — leave it alone."
        },
        {
          id: "money-2",
          title: "Career Capital & the Skill Stack",
          minutes: 8,
          hook: "Don't follow your passion. Build rare and valuable skills — passion follows.",
          ideas: [
            { h: "Career capital", b: "Cal Newport's research: satisfying careers aren't found, they're built. Rare and valuable skills are the currency that buys autonomy, impact, and interesting work. 'Follow your passion' fails because most people don't have a pre-existing passion for a job — passion grows from mastery." },
            { h: "The skill stack", b: "Scott Adams' insight: becoming top 1% at one thing is brutally hard. Becoming good (top ~20%) at three complementary things is achievable — and the combination is rare. Writing + your industry + basic statistics, or sales + coding + public speaking. Unique stacks create unique value." },
            { h: "T-shaped and compounding", b: "Go deep in one domain (the vertical bar of the T) so people know what to hire you for, and broad across adjacent domains so you can combine ideas others can't. Every skill you add multiplies the value of the ones you have." },
            { h: "Reputation compounds too", b: "Skills get you opportunities; reputation decides which ones. Reliability, honesty about what you don't know, and doing what you said you'd do — boring virtues that compound for decades. Careers are long games with repeated players." }
          ],
          action: "Write your current skill stack: your deep skill plus two supporting skills. Then identify the one complementary skill that would multiply the others — that's your next deliberate-practice target.",
          quiz: [
            { q: "'Career capital' is…", options: ["Your salary history", "Rare and valuable skills you can trade for autonomy and opportunity", "Your professional network size", "Your company's stock"], answer: 1, why: "Valuable skills are the currency that buys the things people actually want from work: autonomy, impact, interesting problems." },
            { q: "The skill stack strategy says it's smarter to be…", options: ["World-class at one thing", "Good at three complementary things", "Average at everything", "Focused on one narrow niche only"], answer: 1, why: "Top 20% at three complementary skills is achievable and creates a rare combination — top 1% at one thing is a lottery." },
            { q: "Passion in a career usually comes from…", options: ["Finding your one true calling", "Mastery — getting good at something valuable", "Higher pay alone", "Following childhood dreams"], answer: 1, why: "Research shows passion follows mastery and autonomy, not the other way around. Build skills; passion catches up." }
          ],
          voice: "Forget 'follow your passion' — it is the worst career advice ever given, because passion is not found, it is built. The research says satisfying careers come from career capital: rare and valuable skills that you trade for autonomy and interesting work. And here is the clever part. You do not need to be the best in the world at anything. Be good — properly good — at three things that combine well, and the combination becomes rare. A developer who writes clearly and understands sales is suddenly worth a fortune. Skills stack. Reputation stacks. Careers are long games with repeated players, so play the long game."
        },
        {
          id: "money-3",
          title: "Negotiation & Getting Paid",
          minutes: 8,
          hook: "One ten-minute conversation can be worth more than a year of hard work.",
          ideas: [
            { h: "Everything is negotiable", b: "Salaries, fees, deadlines, roles. Companies expect negotiation; recruiters are rarely offended by it. The average person leaves enormous lifetime value on the table simply by accepting first offers. A single negotiated £5k early in your career compounds across every future raise and percentage increase." },
            { h: "BATNA: your walk-away power", b: "Negotiation power comes from your Best Alternative To a Negotiated Agreement. The better your alternatives (other offers, savings, scarce skills), the stronger your position. Build alternatives BEFORE you need them — negotiate from abundance, not desperation." },
            { h: "Anchor high, then trade, don't concede", b: "The first number on the table pulls the whole conversation toward it (anchoring). Research your market rate and name a number at the top of the justifiable range. And when you give something, get something: 'If you can do X, I can do Y.' Concessions without trades teach the other side to push." },
            { h: "Silence and calm", b: "After you name a number, stop talking. Nervous filler weakens positions. Negotiation is not conflict — it's collaborative problem-solving between adults. Calm, warm, and firm beats aggressive every time." }
          ],
          action: "Research the market rate for your role (three sources). Write down your BATNA and one sentence you'll say the next time money is discussed. Rehearse it aloud — in your best voice — until it sounds casual.",
          quiz: [
            { q: "Your BATNA is…", options: ["Your minimum acceptable salary", "Your best alternative if the deal falls through", "A negotiation trick", "The first offer"], answer: 1, why: "Power in negotiation comes from the quality of your alternatives. Build options before you need them." },
            { q: "Anchoring means…", options: ["Staying calm under pressure", "The first number mentioned pulls the whole negotiation toward it", "Signing contracts quickly", "Refusing to budge"], answer: 1, why: "Initial numbers distort everything after them — which is why you should research your range and anchor deliberately." },
            { q: "The best way to make a concession is to…", options: ["Give it freely to seem nice", "Trade it for something in return", "Hide it", "Apologise for it"], answer: 1, why: "'If you can do X, I can do Y' keeps the exchange balanced. Free concessions just invite more demands." }
          ],
          voice: "A ten-minute conversation can be worth more than a year of overtime. That conversation is negotiation, and almost nobody does it. Here are the three ideas that matter. First: your power comes from alternatives. The best time to get a better offer is before you desperately need one. Second: the first number spoken bends the whole conversation toward it, so do your research and anchor at the top of your justifiable range. Third: never give — trade. If you can do this for me, I can do that for you. Then say your number and be silent. Calm, warm, and firm beats loud and aggressive every single time."
        },
        {
          id: "money-4",
          title: "Avoiding Financial Self-Sabotage",
          minutes: 7,
          hook: "Most people don't lose money to markets. They lose it to their own psychology.",
          ideas: [
            { h: "Lifestyle creep", b: "Every pay rise silently expands spending: nicer flat, newer car, more subscriptions. Income doubles, savings don't. The fix: save the raise. Automatically divert at least half of every increase before you ever see it." },
            { h: "The high-interest debt emergency", b: "Credit card debt at 20–40% APR is a financial house fire — no investment reliably outruns it. Before investing anything beyond a small emergency fund, extinguish toxic debt (avalanche: highest interest first). A guaranteed 25% 'return' by paying it off beats any stock tip." },
            { h: "Scams prey on smart people too", b: "Ponzi schemes, pump-and-dumps, 'guaranteed 15% monthly returns'. The tells are eternal: guaranteed high returns with no risk, urgency, secrecy, and complexity you can't explain. If you can't explain how it makes money, you ARE the money being made." },
            { h: "Your emergency fund is freedom", b: "3–6 months of expenses in boring, accessible cash isn't an investment — it's options. It's what lets you quit a bad job, survive a shock, and negotiate from strength instead of fear. Financial resilience is the foundation every other smart decision stands on." }
          ],
          action: "Audit the last three months: find your three biggest leaks (subscriptions, impulse categories, fees). Kill or cap one of them this week and set up an automatic transfer on payday.",
          quiz: [
            { q: "Lifestyle creep is best defeated by…", options: ["More willpower", "Automatically saving a share of every pay rise before you see it", "Buying quality items only", "Tracking expenses in your head"], answer: 1, why: "Automation beats discipline. Save the raise first and spending adjusts on its own." },
            { q: "Before serious investing, you should first…", options: ["Buy cryptocurrency", "Pay off high-interest debt and build an emergency fund", "Take a finance course", "Wait for a market dip"], answer: 1, why: "Paying off 25% APR debt is a guaranteed 25% return — no legitimate investment matches that." },
            { q: "The clearest sign of an investment scam is…", options: ["A professional website", "Guaranteed high returns with little or no risk", "A famous founder", "An overseas office"], answer: 1, why: "Return and risk are linked. 'High return, no risk, hurry up' is the eternal fingerprint of fraud." }
          ],
          voice: "Most people do not lose their money in the market. They lose it to their own psychology. Lifestyle creep turns every pay rise into more spending instead of more freedom. Toxic debt at twenty-five percent interest is a house fire — put it out before you invest a penny. And remember the oldest rule of fraud: if returns are guaranteed and risk-free, you are not the investor, you are the investment. Build three to six months of expenses in boring cash. It is not exciting. It is freedom — the power to say no, walk away, and negotiate without fear."
        }
      ]
    },
    /* -------------------------------------------------------- */
    {
      id: "body",
      name: "Body & Energy",
      icon: "⚡",
      color: "#ffd166",
      tagline: "Your brain is an organ. Upgrade the body and the mind follows.",
      lessons: [
        {
          id: "body-1",
          title: "Sleep: The Master Upgrade",
          minutes: 8,
          hook: "There is no cognitive enhancement as powerful as sleeping properly.",
          ideas: [
            { h: "Sleep is when learning saves", b: "During deep sleep, your brain transfers the day's learning into long-term storage and literally washes out metabolic waste (via the glymphatic system). Studying without sleep is like saving a document to a computer you never let finish writing to disk." },
            { h: "Sleep deprivation is a controlled-substance-level impairment", b: "After ~17–19 hours awake, reaction time and judgement resemble a blood-alcohol level over the legal driving limit. Chronic 6-hour sleepers show attention lapses equivalent to total sleep deprivation — while insisting they feel fine. You can't feel your own impairment. That's the impairment." },
            { h: "Consistency beats duration", b: "A regular sleep/wake time (even weekends) is one of the strongest levers on sleep quality, because it stabilises your circadian rhythm. Morning daylight within an hour of waking is the cheapest, most powerful tool for this." },
            { h: "The obvious levers actually work", b: "Cool, dark room. No caffeine within ~8 hours of bed. Screens dimmed in the last hour. Alcohol destroys deep sleep even in small doses. None of this is exotic — the exotic part is actually doing it." }
          ],
          action: "Pick a fixed wake time for the next 14 days — weekends included. Get outside light within 30 minutes of waking. Track how your afternoon focus changes.",
          quiz: [
            { q: "Deep sleep is critical for learning because it…", options: ["Rests the muscles", "Consolidates memories into long-term storage and clears brain waste", "Reduces appetite", "Makes you taller"], answer: 1, why: "Memory consolidation and glymphatic 'cleaning' happen primarily during deep sleep. All-nighters literally prevent learning from being saved." },
            { q: "Chronic 6-hour sleepers typically…", options: ["Adapt fully within a week", "Are impaired but feel fine — the impairment hides itself", "Need extra caffeine only", "Sleep deeper to compensate"], answer: 1, why: "Studies show performance keeps declining while subjective sleepiness plateaus. You can't feel your own impairment." },
            { q: "The strongest free lever for better sleep is…", options: ["Supplements", "A consistent wake time plus morning daylight", "Sleeping in on weekends", "Late-night exercise"], answer: 1, why: "Anchoring your circadian rhythm with a fixed wake time and morning light outperforms almost everything else." }
          ],
          voice: "If a drug improved memory, focus, mood, immunity and long-term health, you would queue for it. That drug exists. It is sleep, and most people are running on half a dose. Here is what matters. Deep sleep is when the day's learning gets saved — studying without sleep is typing on a computer that never writes to disk. After nineteen hours awake, your brain performs like it is over the drink-drive limit, and the cruellest part is you cannot feel it. The fix is not exotic: same wake time every day, morning daylight, cool dark room, no late caffeine. Boring, free, and more powerful than any supplement on Earth."
        },
        {
          id: "body-2",
          title: "Exercise Is Brain Medicine",
          minutes: 7,
          hook: "The single best thing you can do for your brain today involves your legs.",
          ideas: [
            { h: "Exercise grows the brain", b: "Aerobic exercise increases BDNF — brain-derived neurotrophic factor, essentially fertiliser for neurons — and has been shown to increase the size of the hippocampus (the memory centre) in older adults. Regular exercisers score better on memory, attention and processing speed." },
            { h: "The minimum effective dose", b: "The evidence sweet spot starts surprisingly low: ~150 minutes of moderate activity per week (brisk walking counts) plus 2 strength sessions. The biggest health jump is from zero to something — not from something to elite." },
            { h: "Strength is an insurance policy", b: "Muscle mass and grip strength predict longevity and independence better than almost anything else you can measure. Strength training twice a week is not vanity — it's your pension for your body." },
            { h: "Movement beats exercise snacks later", b: "Long uninterrupted sitting is independently harmful even if you exercise. Break it up: short walks, calls on foot, stairs. Daily non-exercise movement (NEAT) often burns more than workouts do." }
          ],
          action: "Do a 20-minute brisk walk today, ideally after lunch. Notice your focus and mood at 3pm. That's the effect you'll be buying with every future walk.",
          quiz: [
            { q: "BDNF, boosted by aerobic exercise, is best described as…", options: ["A stress hormone", "Fertiliser for brain cells that supports memory and learning", "A type of fat", "A sleep chemical"], answer: 1, why: "Exercise raises BDNF and can literally grow the hippocampus — the brain's memory centre." },
            { q: "The biggest health improvement comes from going…", options: ["From good to elite", "From zero exercise to some exercise", "From running to swimming", "From gym to home workouts"], answer: 1, why: "The steepest part of the benefit curve is the beginning. 150 minutes a week of moderate activity is the evidence-based starting dose." },
            { q: "Which pair best predicts long-term physical independence?", options: ["Flexibility and balance", "Muscle mass and grip strength", "Resting heart rate and BMI", "Speed and agility"], answer: 1, why: "Strength metrics predict longevity remarkably well — strength training is a pension for your body." }
          ],
          voice: "The single best thing you can do for your brain today is not a puzzle or a pill. It is a walk. Aerobic exercise floods the brain with B D N F — think of it as fertiliser for neurons — and studies show it can physically grow the memory centre of the brain. And the dose is humble: about a hundred and fifty minutes a week of brisk walking, plus lifting something heavy twice a week. The steepest benefits are at the start — from nothing to something. You are not doing this for your mirror. You are doing it for the organ you are using to listen to this sentence."
        },
        {
          id: "body-3",
          title: "Energy & Attention Nutrition",
          minutes: 7,
          hook: "You don't have a motivation problem. You have a blood-glucose and hydration problem.",
          ideas: [
            { h: "Glucose rollercoasters", b: "Big hits of refined carbohydrate spike blood glucose, which then crashes — taking energy, focus and mood with it. Flatter glucose curves (protein/fibre at breakfast, veg before carbs, fewer liquid calories) mean steadier attention all afternoon." },
            { h: "Caffeine: a loan, not a gift", b: "Caffeine blocks adenosine (the sleep-pressure signal) rather than creating energy — you're borrowing alertness from later. Use it strategically: delay your first coffee 60–90 minutes after waking to avoid the afternoon crash, and none within ~8 hours of bed." },
            { h: "Hydration and the basics", b: "Even mild dehydration measurably degrades attention and memory. Most 'brain fog' is boring: too little water, too little sleep, too much sitting. Check the basics before blaming anything exotic." },
            { h: "Eat for the boring wins", b: "The dietary patterns with the strongest evidence (Mediterranean-style: vegetables, legumes, fish, olive oil, nuts, minimal ultra-processed food) are associated with better cognitive ageing. No single superfood — patterns, not products." }
          ],
          action: "For the next 3 days: protein at breakfast, water within reach all day, first coffee 90 minutes after waking. Rate your 3pm energy each day and compare.",
          quiz: [
            { q: "Caffeine primarily works by…", options: ["Creating energy", "Blocking the sleepiness signal — borrowing alertness from later", "Feeding neurons glucose", "Increasing oxygen"], answer: 1, why: "Caffeine blocks adenosine receptors. The tiredness is still being generated — you just can't feel it until the loan comes due." },
            { q: "The most common cause of afternoon 'brain fog' is…", options: ["A rare deficiency", "Boring basics: sleep, hydration, blood-sugar swings and sitting", "Too much protein", "Screen brightness"], answer: 1, why: "Fix sleep, water, glucose stability and movement before chasing exotic explanations." },
            { q: "Which eating pattern has the strongest evidence for long-term brain health?", options: ["Extreme elimination diets", "Mediterranean-style: vegetables, fish, legumes, olive oil, minimal ultra-processed food", "Juice cleanses", "High-sugar 'energy' diets"], answer: 1, why: "Patterns beat products — Mediterranean-style eating is consistently associated with better cognitive ageing." }
          ],
          voice: "You probably do not have a motivation problem. You have a blood sugar and hydration problem. Big hits of refined carbohydrate spike your glucose and the crash takes your focus with it — so put protein and fibre at the start of the day and your afternoon sharpens. Caffeine is a loan, not a gift: it blocks the tiredness signal rather than creating energy, so delay your first coffee ninety minutes and never within eight hours of bed. And before blaming anything exotic for brain fog, drink water, sleep properly, and go for a walk. The boring basics are the entire game."
        },
        {
          id: "body-4",
          title: "Stress, Recovery & Emotional Regulation",
          minutes: 8,
          hook: "Stress isn't the enemy. Unrecovered stress is.",
          ideas: [
            { h: "Stress is a resource — with a dose", b: "Acute stress sharpens attention and consolidates memory (you remember the exam hall, not the sofa). Chronic unrecovered stress does the opposite: it impairs the prefrontal cortex and strengthens threat circuitry. The variable that matters is recovery, not exposure." },
            { h: "The physiological sigh", b: "The fastest known way to down-shift your nervous system in real time: two quick inhales through the nose, one long exhale through the mouth, repeated 1–3 times. Real-time tools beat vague advice to 'relax'." },
            { h: "Name it to tame it", b: "Affect labelling — putting feelings into precise words ('I'm anxious about the deadline, and a bit embarrassed') — measurably reduces amygdala activation. Vague dread has power; precise emotion is manageable." },
            { h: "Recovery is scheduled, not found", b: "Recovery works like training: it must be deliberate. Sleep, walks without input (no podcast), genuine social time, and one proper day-ish off per week. High performers aren't less stressed; they recover on purpose." }
          ],
          action: "Next time you feel stress rising this week: do 3 physiological sighs, then say aloud precisely what you're feeling and what specifically it's about. Notice the intensity drop.",
          quiz: [
            { q: "The key variable in whether stress harms you is…", options: ["How much stress you have", "Whether you recover from it", "Your personality type", "Your job title"], answer: 1, why: "Acute stress with recovery can build capacity; chronic unrecovered stress degrades it. Dose and recovery make the poison." },
            { q: "The physiological sigh is…", options: ["One long deep breath in", "Two quick nasal inhales followed by one long mouth exhale", "Holding your breath for a minute", "Breathing into a paper bag"], answer: 1, why: "Double-inhale, long exhale is the fastest validated way to calm the nervous system in real time." },
            { q: "'Name it to tame it' works because labelling emotions…", options: ["Distracts you from them", "Reduces amygdala activation and makes feelings precise and manageable", "Is a form of denial", "Only works for children"], answer: 1, why: "Putting feelings into precise words measurably calms the brain's threat response. Vague dread is powerful; precise emotion is workable." }
          ],
          voice: "Stress is not the enemy — unrecovered stress is. A burst of stress sharpens you; months of it without recovery rewires your brain towards threat and away from thinking. So the skill is regulation, not avoidance. Two tools. First, the physiological sigh: two quick inhales through the nose, one long exhale through the mouth. Do three. It is the fastest brake pedal your nervous system has. Second, name it to tame it: say precisely what you feel, and what it is about. Vague dread controls you. A precisely labelled problem is just a problem — and you solve problems for a living."
        }
      ]
    },
    /* -------------------------------------------------------- */
    {
      id: "people",
      name: "People & Communication",
      icon: "🗣️",
      color: "#ff8fa3",
      tagline: "Social intelligence is the highest-leverage intelligence there is.",
      lessons: [
        {
          id: "people-1",
          title: "How to Talk So People Listen",
          minutes: 8,
          hook: "Nobody remembers your points. They remember your stories and how you made them feel.",
          ideas: [
            { h: "Structure beats eloquence", b: "Confident speakers aren't winging it — they're using structures. The simplest: Point → Reason → Example → Point (PREP). State your conclusion first, then support it. Busy people listen to people who get to the point." },
            { h: "Stories are the data format of human brains", b: "Facts inform; stories persuade and stick. Any important message can be wrapped in: a person, a problem, a turning point, a result. Before a presentation or difficult conversation, find the 30-second story that carries your point." },
            { h: "The curse of knowledge", b: "Once you know something, you can't imagine not knowing it — so experts explain badly. The fix: use the listener's vocabulary, concrete examples over abstractions, and check understanding with 'Does that make sense the way I explained it?' — owning the burden of clarity." },
            { h: "Slow down and pause", b: "Nervous speakers rush. Deliberate pace and comfortable silence read as confidence and give listeners time to absorb. A pause before answering a question signals thoughtfulness, not weakness." }
          ],
          action: "Take one idea you need to communicate this week. Write it as PREP (point, reason, example, point) in under 100 words, plus one 30-second story. Use it.",
          quiz: [
            { q: "The PREP structure stands for…", options: ["Prepare, Rehearse, Execute, Polish", "Point, Reason, Example, Point", "Pause, Reflect, Engage, Probe", "Problem, Result, Evidence, Plan"], answer: 1, why: "Leading with your point, then supporting it, is the simplest upgrade to everyday clarity." },
            { q: "The 'curse of knowledge' means experts often…", options: ["Know too much to teach", "Can't imagine what it's like not to know, so they explain badly", "Refuse to share knowledge", "Use too many stories"], answer: 1, why: "Once you know something, you lose access to the beginner's perspective — great explainers consciously rebuild it." },
            { q: "Which makes a message most memorable?", options: ["More data", "A story with a person, a problem and a turning point", "Longer meetings", "Precise jargon"], answer: 1, why: "Human brains are wired for narrative. Stories are remembered; raw facts are not." }
          ],
          voice: "Here is the truth about communication: people do not remember your points. They remember your stories, and how you made them feel. Three upgrades. One: lead with the point. Point, reason, example, point. Busy people reward people who get to it. Two: wrap important ideas in a story — a person, a problem, a turning point. Thirty seconds is enough. Three: beware the curse of knowledge. Once you know something, you cannot imagine not knowing it, so you explain too fast. Slow down. Use their vocabulary. Pause. Silence, used calmly, reads as confidence."
        },
        {
          id: "people-2",
          title: "How to Listen So People Talk",
          minutes: 7,
          hook: "The most charismatic people in the room talk the least.",
          ideas: [
            { h: "Listen to understand, not to reply", b: "Most people 'listen' by waiting for their turn, silently rehearsing their response. Real listening means tracking what the other person means and feels. The giveaway of bad listening: your reply could have been written before they spoke." },
            { h: "Questions outperform advice", b: "People trust conclusions they reach themselves. 'What options have you considered?' beats 'Here's what you should do.' Advice creates resistance; good questions create ownership — and make you the person everyone wants to think out loud with." },
            { h: "Label and summarise", b: "From FBI negotiation training (Chris Voss): name what you hear — 'Seems like you're frustrated the deadline moved' — then summarise their position so well they say 'that's right'. Not 'you're right': 'THAT'S right'. It's the moment people feel understood, and it's when real information starts flowing." },
            { h: "The 43/57 rule", b: "Research on top sales performers found they talk about 43% of the time and listen 57%. Being interested is more persuasive than being interesting. Everyone's favourite subject is themselves — let them study it." }
          ],
          action: "In your next real conversation: ask two open questions, label one emotion you hear ('Seems like…'), and summarise their view back to them before offering any opinion.",
          quiz: [
            { q: "The clearest sign someone is 'listening to reply' is…", options: ["They nod a lot", "Their response could have been written before you finished speaking", "They take notes", "They ask questions"], answer: 1, why: "Pre-rehearsed responses mean the listening stopped long before you finished." },
            { q: "Why do questions usually outperform advice?", options: ["Questions are quicker", "People trust and own conclusions they reach themselves", "Advice is always wrong", "Questions avoid responsibility"], answer: 1, why: "Self-generated conclusions create ownership; imposed advice creates resistance." },
            { q: "In Voss's method, the target response to your summary is…", options: ["'You're right'", "'That's right'", "'I suppose so'", "'Maybe'"], answer: 1, why: "'That's right' signals the person feels genuinely understood — the turning point of any difficult conversation." }
          ],
          voice: "Want to be the most interesting person in any room? Talk the least. Most people do not listen — they reload. They wait for a gap to fire their prepared response. Real listening has three moves. Ask open questions instead of giving advice, because people only trust conclusions they reach themselves. Label what you hear: seems like you are frustrated the plan changed. And before you give any opinion, summarise their view so accurately they say the magic words: that is right. Top performers in every people-profession listen more than they talk. Being interested beats being interesting. Every time."
        },
        {
          id: "people-3",
          title: "Difficult Conversations & Boundaries",
          minutes: 8,
          hook: "The quality of your life is roughly the quality of the difficult conversations you're willing to have.",
          ideas: [
            { h: "Separate intent from impact", b: "Most conflicts are arguments about intent ('I didn't mean it that way!') when the issue is impact ('That's how it landed'). You can't argue someone out of their experience. Acknowledge impact first, explain intent second — or the conversation never starts." },
            { h: "Use 'I' statements and specifics", b: "'You never listen' starts a trial. 'When I was interrupted twice in the meeting, I felt dismissed' starts a conversation. Structure: observation (no judgement) → feeling → need → request. Vague complaints get vague defensiveness; specific requests get change." },
            { h: "Boundaries are instructions, not punishments", b: "A boundary is 'If X happens, I'll do Y' — information about your behaviour, not control of theirs. 'If the meeting runs over, I'll leave at 3.' Stated calmly, held consistently. Boundaries you don't enforce are just complaints." },
            { h: "Short and kind beats long and clever", b: "We over-script difficult conversations to manage our own anxiety. In practice: one clear sentence about the issue, delivered early and kindly, beats a ten-minute preamble. The dread tax of avoiding the conversation always exceeds the cost of having it." }
          ],
          action: "Identify the difficult conversation you've been avoiding longest. Write your one opening sentence (observation + feeling + request). Schedule the conversation within 7 days.",
          quiz: [
            { q: "In conflict, arguing about intent ('I didn't mean it!') fails because…", options: ["Intent never matters", "The other person's experience of the impact is real regardless of intent", "Impact is irrelevant", "People enjoy arguing"], answer: 1, why: "You can't argue someone out of how your actions landed. Acknowledge impact first, then discuss intent." },
            { q: "The most constructive complaint format is…", options: ["'You always…'", "'You never…'", "Observation → feeling → need → specific request", "Silence and hints"], answer: 2, why: "Specific, non-judgemental structure keeps the other person out of defence mode and focused on change." },
            { q: "A boundary is best described as…", options: ["A punishment for bad behaviour", "Information about what you will do, stated calmly and held consistently", "A threat", "A wall around your emotions"], answer: 1, why: "'If X, I'll do Y' controls your own behaviour, not theirs — and unenforced boundaries are just complaints." }
          ],
          voice: "The quality of your life is roughly proportional to the number of difficult conversations you are willing to have. Here is how to have them well. First: impact before intent. Nobody was ever argued out of how something made them feel, so acknowledge the impact before explaining what you meant. Second: observation, feeling, need, request. Not you never listen, but: when I was interrupted twice in that meeting, I felt dismissed — I need to finish my points. Third: boundaries are instructions, not punishments. If this happens, I will do that. Stated calmly, held every time. The dread of the conversation always costs more than the conversation itself."
        },
        {
          id: "people-4",
          title: "Influence Without Manipulation",
          minutes: 8,
          hook: "Understanding persuasion is a vaccine: it makes you ethical and immune at once.",
          ideas: [
            { h: "Reciprocity & liking", b: "Cialdini's principles: people return favours and say yes to people they like. Used ethically: be genuinely helpful first, be warm, find real common ground. Used on you: the free sample, the gift before the ask. Notice the mechanism, keep your ethics, keep your wallet." },
            { h: "Social proof & authority", b: "People follow crowds and credentials — often wisely, often blindly. Ethically: show real evidence that people like them chose this. On guard: 'Bestseller!', 'Experts agree!', rented Lamborghinis. Ask: is this evidence, or theatre?" },
            { h: "Scarcity & urgency", b: "Things feel more valuable when rare or expiring — which is why every sales page has a countdown timer. Ethically: honest constraints are fine ('3 spots left' when true). On guard: manufactured urgency exists to stop you thinking. Any deal that requires you to decide NOW is priced against you." },
            { h: "Commitment & consistency", b: "People strive to act consistently with what they've already said or done. Ethically: ask for small genuine commitments before big ones. On guard: the foot-in-the-door, the sunk-cost upsell. You are allowed to change your mind when the facts change — consistency with a mistake is still a mistake." }
          ],
          action: "This week, spot one persuasion principle being used ON you (an ad, a sales page, a colleague). Name it out loud. Naming the mechanism is the immunity.",
          quiz: [
            { q: "A countdown timer on a sales page exploits…", options: ["Reciprocity", "Scarcity and urgency", "Authority", "Liking"], answer: 1, why: "Manufactured urgency exists to stop you deliberating. Any deal that demands an instant decision is priced against you." },
            { q: "The ethical use of reciprocity is…", options: ["Giving gifts to create obligation", "Being genuinely helpful first, with no strings", "Free samples with hidden terms", "Keeping score of favours"], answer: 1, why: "The same principle that powers manipulation powers genuine generosity — the difference is intent and transparency." },
            { q: "'Consistency' pressure is dangerous because…", options: ["People are inconsistent", "It can trap you in past commitments even when facts have changed", "It only affects weak people", "It's illegal"], answer: 1, why: "Consistency with a mistake is still a mistake. You're allowed to update." }
          ],
          voice: "Learning persuasion is a vaccine: it makes you more influential and impossible to manipulate at the same time. The classic principles, in one breath. Reciprocity: people return favours, so be genuinely helpful first — and notice when a free gift is quietly buying you. Social proof: crowds are evidence until they are theatre. Authority: credentials matter until they are costumes. Scarcity: countdown timers exist to stop you thinking, so any deal that must be signed now is priced against you. Consistency: people stay loyal to past decisions, even bad ones. Remember the difference between the honest version and the weaponised version of each — and you can use the first and dodge the second."
        }
      ]
    },
    /* -------------------------------------------------------- */
    {
      id: "ai",
      name: "AI & the Future",
      icon: "🤖",
      color: "#b388ff",
      tagline: "Understand the most important technology of your lifetime — and use it better than anyone you know.",
      lessons: [
        {
          id: "ai-1",
          title: "How AI Actually Works (No Maths Degree Required)",
          minutes: 9,
          hook: "AI is not a brain, not a database, and not magic. Here's what it actually is.",
          ideas: [
            { h: "Prediction machines", b: "Large language models are trained to predict the next piece of text, over and over, across an enormous chunk of human writing. That simple objective, at absurd scale, produces systems that can reason, write, code and explain. Understanding emerges from prediction — like evolution producing flight without planning it." },
            { h: "Patterns, not facts", b: "An LLM doesn't store facts like a database; it stores statistical patterns — compressed regularities of how humans write and reason. This explains both its brilliance (flexible, general, creative) and its failure modes (confident, fluent, and occasionally wrong). It knows what sounds true, which usually is true — but not always." },
            { h: "Why scale surprised everyone", b: "Abilities like translating languages, writing code and doing multi-step reasoning weren't programmed in — they emerged as models got bigger and trained on more data. Each scale jump unlocked qualitatively new skills. That's why progress has repeatedly beaten expert predictions, and why forecasting AI is genuinely hard." },
            { h: "Jagged intelligence", b: "AI capability is not human-shaped. The same system can pass a bar exam and miscount letters in a word, solve olympiad maths and fail a child's logic puzzle. Never assume competence in one area implies competence in another — always verify the specific thing you care about." }
          ],
          action: "Open any AI chatbot. Ask it something you know deeply (your profession or hobby). Find one impressive insight and one subtle confident error. Congratulations — you now understand jaggedness better than most executives.",
          quiz: [
            { q: "Large language models are fundamentally trained to…", options: ["Look up facts in a database", "Predict the next piece of text", "Follow hard-coded grammar rules", "Search the internet"], answer: 1, why: "Next-token prediction at massive scale is the entire training objective — everything else emerges from it." },
            { q: "Why do LLMs sometimes state falsehoods fluently?", options: ["They're lying deliberately", "They model what sounds true based on patterns, not what's verified true", "They have no training data", "Bugs in the internet"], answer: 1, why: "LLMs store statistical patterns of human writing. Fluent and true usually coincide — but not always. Verification is your job." },
            { q: "'Jagged intelligence' means…", options: ["AI is equally good at everything", "AI capability is uneven — superhuman at some tasks, weak at seemingly simple others", "AI improves smoothly", "AI is getting slower"], answer: 1, why: "AI skills don't map onto human-shaped competence. Verify each specific task instead of generalising." }
          ],
          voice: "Let me explain the most important technology of your lifetime in plain English. A large language model is a prediction machine: it was trained to guess the next word, trillions of times, across most of what humanity has written. And something strange happened — to predict text perfectly, it had to learn grammar, facts, logic, code, even a kind of reasoning. Nobody programmed those in; they emerged from scale. Two consequences you must internalise. First: it knows what sounds true, which is usually true, but not always — verification is your job. Second: its intelligence is jagged. It can pass the bar exam and fumble a puzzle a child would get. Never assume; always test the specific thing you care about."
        },
        {
          id: "ai-2",
          title: "Using AI Like the Top 1%",
          minutes: 9,
          hook: "The gap between AI users isn't the tool. It's the prompting.",
          ideas: [
            { h: "Context is everything", b: "Weak prompt: 'Write a marketing email.' Strong prompt: who you are, who the audience is, the goal, the constraints, the tone, an example of what good looks like, and the format you want. You're not asking a search engine — you're briefing a brilliant but amnesiac new employee. Brief them properly." },
            { h: "Iterate, don't accept", b: "The top pattern of expert users: treat the first output as a draft to steer. 'Shorter. More sceptical. Give me three contrasting options. Now argue against the best one.' The value is in the dialogue, not the single shot. 10× users do 3–5 rounds by default." },
            { h: "Use it for thinking, not just typing", b: "The highest-leverage uses aren't 'write this for me' but 'stress-test this': critique my plan, steel-man the opposing view, quiz me on this material, what am I not seeing, what would an expert worry about? AI as a tireless sparring partner upgrades your judgement, not just your output." },
            { h: "Always verify what matters", b: "Use AI to draft, explore, summarise and generate options; use your own judgement (and primary sources) for facts that matter, especially numbers, citations, code edge-cases and anything legal/medical/financial. The professional standard: AI produces the first 80%, humans own the final 20% and 100% of the responsibility." }
          ],
          action: "Take a real task from this week. Prompt AI with full context (role, audience, goal, constraints, example, format), then iterate at least three times, including one round of 'critique this'. Compare to your old way.",
          quiz: [
            { q: "The single biggest upgrade to most people's prompts is…", options: ["Using more technical words", "Adding rich context: role, audience, goal, constraints, examples", "Writing longer essays to the AI", "Asking nicely"], answer: 1, why: "Brief the AI like a brilliant new employee who knows nothing about your situation — context determines quality." },
            { q: "Expert AI users differ from average users mainly by…", options: ["Knowing secret prompts", "Iterating — steering the output through multiple rounds", "Paying more", "Using it less"], answer: 1, why: "The value is in the dialogue. First outputs are drafts; 3–5 rounds of steering is where quality comes from." },
            { q: "The highest-leverage use of AI is…", options: ["Writing emails faster", "Stress-testing your thinking: critiques, steel-men, blind spots, quizzing you", "Generating images", "Autocomplete"], answer: 1, why: "AI as a sparring partner upgrades your judgement; AI as a typist only upgrades your speed." }
          ],
          voice: "Here is the open secret: the gap between AI users is not the tool, it is the briefing. A weak user types: write me a marketing email. A strong user says who they are, who the audience is, what the goal is, what tone, what constraints, and shows an example of what good looks like. You are not querying a search engine — you are briefing a brilliant new employee with no memory. Then iterate. First answer is a draft: shorter, more sceptical, three options, now critique the best one. And use it for thinking, not just typing: stress-test my plan, steel-man the other side, quiz me, what am I missing. Finally — verify anything that matters. The AI writes the first eighty percent. You own the last twenty, and all of the responsibility."
        },
        {
          id: "ai-3",
          title: "AI, Jobs & Your Career Strategy",
          minutes: 8,
          hook: "AI won't take your job. Someone using AI better than you might.",
          ideas: [
            { h: "Tasks, not jobs", b: "Jobs are bundles of tasks. AI eats tasks — drafting, summarising, first-pass code, routine analysis — not whole jobs, at least at first. History's pattern (ATMs, spreadsheets): automating part of a job often expands demand for the rest. The question for any career: which of my tasks are exposed, and which become more valuable?" },
            { h: "The premium moves up the stack", b: "As routine production gets cheaper, value shifts to what AI can't easily do: defining the right problem, judgement under ambiguity, trust and relationships, taste, accountability, and cross-domain synthesis. Being the person who verifies, directs and owns outcomes beats being the person who types." },
            { h: "Become the AI leverage point", b: "In every team, someone becomes the person who figures out how to do 10× with AI. That person gets the interesting work, the visibility and the security. It's a skill race, and the skill is learnable: brief well, iterate, verify, systematise." },
            { h: "Optionality beats prediction", b: "Nobody — including the labs building it — can reliably forecast AI's trajectory. So build a career that wins under many futures: strong fundamentals (writing, statistics, domain depth), visible AI fluency, savings that buy you room to adapt, and a network that surfaces opportunities. Robust beats optimal when the future is uncertain." }
          ],
          action: "List your job's five most frequent tasks. Mark each: 'AI does it', 'AI accelerates it', or 'deeply human'. Double down on the third category and become the best AI operator in the second.",
          quiz: [
            { q: "AI primarily automates…", options: ["Whole jobs at once", "Tasks within jobs", "Only manual labour", "Only creative work"], answer: 1, why: "Jobs are bundles of tasks — AI eats the routine tasks first, changing rather than instantly deleting most roles." },
            { q: "As AI makes routine production cheaper, value shifts toward…", options: ["Faster typing", "Judgement, problem-framing, trust and accountability", "Memorising facts", "Doing more of the same tasks"], answer: 1, why: "When generating is cheap, choosing, verifying and owning outcomes become the premium skills." },
            { q: "The best career strategy under AI uncertainty is…", options: ["Bet everything on one prediction", "Build optionality: fundamentals + AI fluency + financial resilience + network", "Ignore AI entirely", "Wait for clarity"], answer: 1, why: "When the future is uncertain, robust strategies that win under many scenarios beat single bets." }
          ],
          voice: "Will AI take your job? Wrong question. Jobs are bundles of tasks, and AI eats tasks — the drafting, the summarising, the first-pass code. Your real question is: which of my tasks are exposed, and which just became more valuable? Because when generating becomes cheap, choosing becomes expensive. Judgement, taste, trust, problem-framing, accountability — the premium moves up the stack. Meanwhile, in every team, one person becomes the ten-times-leverage person with AI, and that person gets the interesting work. Be that person; it is a learnable skill. And since nobody can honestly predict this technology's path, build a career that wins under many futures: strong fundamentals, visible AI fluency, savings, and a network. Robust beats optimal."
        },
        {
          id: "ai-4",
          title: "AI Safety & Epistemics: Trust Nothing, Verify Everything",
          minutes: 8,
          hook: "In a world where any text, photo or voice can be faked, verification is the new literacy.",
          ideas: [
            { h: "Hallucination is a feature of the architecture", b: "LLMs generate plausible text, not verified fact. They can invent citations, dates and details with total fluency. Treat AI output like a smart colleague's first draft: excellent starting point, never the final source for anything consequential." },
            { h: "The deepfake era", b: "Synthetic voice, video and text are now cheap and convincing — including voice-cloned 'family emergency' scams and fake video calls. New household rule: for any urgent request involving money or secrets, verify via a second channel you already trust (call them back on the known number). Establish family code words." },
            { h: "Your data is the price", b: "Anything you type into a cloud AI may be stored or reviewed. Never paste confidential work documents, personal data, credentials or sensitive health/financial details into tools you haven't vetted. Convenience is real; so is the trade. Decide consciously." },
            { h: "Alignment in one paragraph", b: "The safety problem: we can train AI to be useful, but precisely specifying and verifying 'good behaviour' in a system more capable than us is an unsolved problem being worked on in real time. You don't need to solve it — but you should be a literate citizen about it, because it will shape policy, jobs and risk for the rest of your life." }
          ],
          action: "Set two rules today: (1) a family code word for verifying urgent requests; (2) a personal red-line list of what you never paste into AI tools. Tell one other person about both.",
          quiz: [
            { q: "The safest way to treat AI output on consequential matters is…", options: ["Trust it if it sounds confident", "As a strong first draft that must be verified against primary sources", "As always wrong", "As legal advice"], answer: 1, why: "Fluency is not accuracy. Hallucination is architectural, so verification is your job." },
            { q: "If a 'family member' calls urgently asking for money, you should…", options: ["Send it quickly if the voice matches", "Verify via a second trusted channel or a pre-agreed code word", "Ask them personal questions only", "Video call them to be sure"], answer: 1, why: "Voice and video can now be cloned. Out-of-band verification is the new basic hygiene." },
            { q: "Before pasting work documents into a cloud AI, you should…", options: ["Assume it's private", "Check the tool's data policy and never paste confidential data into unvetted tools", "Remove only the headings", "Use incognito mode"], answer: 1, why: "Anything typed into a cloud service may be stored or reviewed. Decide data boundaries consciously." }
          ],
          voice: "Here is your survival guide for the deepfake era, in three rules. Rule one: AI sounds right by design. It generates plausible text, not verified truth, and it can invent citations with total confidence. Treat its output as a brilliant first draft, never the final source. Rule two: voices and faces can now be faked for pennies. So any urgent request involving money or secrets gets verified on a second channel you already trust — call the number you have, or use the family code word you are going to set up this week. Rule three: anything you paste into a cloud tool may live forever. Draw your data red lines now, while you are calm, not mid-crisis. Trust nothing, verify everything, and you will be harder to fool than ninety-nine percent of the population."
        },
        {
          id: "ai-5",
          title: "The Next Decade: What to Watch",
          minutes: 9,
          hook: "Nobody knows the future. But you can know the signposts better than 99% of people.",
          ideas: [
            { h: "Agents: from chat to action", b: "AI is shifting from answering questions to doing multi-step work — booking, coding, researching, operating software (like the computer-use agent in this very repository). Watch how quickly 'AI did the task' replaces 'AI drafted the text'. The economy reorganises around whoever can direct fleets of agents well." },
            { h: "The cost curve", b: "The price of a given level of AI capability has been falling roughly 10× per year, while capability rises. Anything 'too expensive to automate' should be re-examined annually. Businesses and careers built on expensive human routine work are sitting on melting ice." },
            { h: "Energy and compute are the chokepoints", b: "AI progress now depends on chips, data centres and electricity as much as algorithms. Watch energy deals, chip policy and datacentre buildouts — the physical layer tells you about the future before the headlines do. Geopolitics of compute is the geopolitics of the century." },
            { h: "Timelines are uncertain — live with it", b: "Honest experts disagree wildly about when (or whether) AI reaches human-level generality, and the track record of confident prediction is poor on all sides. Your strategy shouldn't depend on any single timeline. Stay informed, stay adaptive, keep skills compounding — you'll outrun both the doomers and the hype-men." }
          ],
          action: "Pick three signposts to check quarterly: agent capability benchmarks, AI price/performance trends, and one policy/energy story. Put a recurring reminder in your calendar — staying calibrated is a habit, not an event.",
          quiz: [
            { q: "The biggest near-term shift in AI is from…", options: ["Text to images", "Answering questions to autonomously completing multi-step tasks", "Big models to small ones", "Research to marketing"], answer: 1, why: "Agents that act — not just chat — are the frontier, and they'll reorganise work around whoever directs them well." },
            { q: "The cost of a fixed level of AI capability is currently…", options: ["Rising steadily", "Falling dramatically, roughly an order of magnitude per year", "Stable", "Impossible to measure"], answer: 1, why: "Capability-per-cost improves relentlessly — re-examine 'too expensive to automate' assumptions every year." },
            { q: "The most robust stance on AI timelines is…", options: ["Trust the most confident prediction", "Assume nothing and stop planning", "Build skills and adaptability that pay off under many different timelines", "Only follow sceptics"], answer: 2, why: "Expert timelines disagree wildly — strategies robust to uncertainty beat bets on any single forecast." }
          ],
          voice: "How do you think about the next ten years without a crystal ball? Watch signposts, not predictions. Signpost one: agents. AI is moving from answering questions to doing whole tasks — booking, coding, researching, driving real software. The winners will be the people who can direct fleets of agents. Signpost two: the cost curve. The price of a fixed level of intelligence is collapsing, roughly ten-fold a year, so anything labelled too expensive to automate deserves an annual rethink. Signpost three: the physical layer — chips, datacentres, energy. The future shows up there before the headlines. And hold every timeline loosely: the honest experts disagree wildly, so build a life that wins under many futures. Calibrated beats confident."
        },
        {
          id: "ai-6",
          title: "Building Your Personal AI Stack",
          minutes: 8,
          hook: "The final lesson: turn everything in this domain into a working daily system.",
          ideas: [
            { h: "The five core use-cases", b: "A complete personal AI stack covers: (1) Learning — explain anything at your level, quiz you; (2) Thinking — stress-test decisions and plans; (3) Creating — drafts, code, designs, then iterate; (4) Deciding — summarise options, surface trade-offs; (5) Automating — repetitive digital chores. Audit your week: which of the five are you actually using?" },
            { h: "Prompts as assets", b: "Your best prompts are reusable intellectual property. Keep a personal prompt library: your briefing template, your 'critique this' prompt, your 'quiz me' prompt, your 'explain like I'm smart but new to this' prompt. Refine them over months — they compound like any other asset." },
            { h: "The verification habit", b: "Build verification into the workflow, not as an afterthought: numbers get checked, citations get opened, code gets run, claims get a second source. The people who get burned by AI aren't the ones who use it — they're the ones who skip this step." },
            { h: "A weekly AI review", b: "Fifteen minutes, weekly: What did I use AI for? What did I do manually that AI could have accelerated? What new capability should I test? The technology improves monthly; your usage should too. The gap between AI's ability and the average person's use of it is the largest free lunch in the modern economy." }
          ],
          action: "Do the five-use-case audit right now. Then create your prompt library document with your first three saved prompts. That's your AI stack, version 1.",
          quiz: [
            { q: "A complete personal AI stack covers which five uses?", options: ["Gaming, shopping, dating, news, memes", "Learning, thinking, creating, deciding, automating", "Email, email, email, email, email", "Coding only"], answer: 1, why: "Audit across all five — most people use one or two and leave the rest of the value on the table." },
            { q: "Your best prompts should be treated as…", options: ["One-off conversations", "Reusable assets kept in a personal library", "Secrets to forget", "Things only developers need"], answer: 1, why: "Refined prompts compound like any asset — save them, improve them, reuse them." },
            { q: "The largest free lunch in the modern economy is…", options: ["Index funds", "The gap between what AI can do and what the average person uses it for", "Credit card points", "Free trials"], answer: 1, why: "The technology improves monthly while most usage stays shallow — closing that gap is nearly pure upside." }
          ],
          voice: "Final lesson of the AI domain: build your stack. Five uses — learning, thinking, creating, deciding, automating. Most people use one. You will audit your week and use all five. Then, keep a prompt library: your briefing template, your critique-this prompt, your quiz-me prompt. Prompts are intellectual property — save them and refine them. Bake verification into the workflow: check numbers, open citations, run the code. And once a week, fifteen minutes, ask: what did I do by hand that AI could have accelerated? The technology improves every month; your usage should too. The gap between what AI can do and what the average person does with it is the biggest free lunch in the modern economy. Eat it."
        }
      ]
    },
    /* -------------------------------------------------------- */
    {
      id: "life",
      name: "Life Operating System",
      icon: "🧭",
      color: "#4cc9f0",
      tagline: "Decisions, habits and systems — the layer everything else runs on.",
      lessons: [
        {
          id: "life-1",
          title: "Decision-Making Under Uncertainty",
          minutes: 9,
          hook: "You make thousands of decisions a week with incomplete information. Here's how the pros do it.",
          ideas: [
            { h: "Think in bets", b: "Poker-pro-turned-decision-researcher Annie Duke's core idea: every decision is a bet on an uncertain future. Judge decisions by the quality of the process at the time, not the outcome ('resulting'). Good decisions can have bad outcomes and vice versa — conflating them is how people learn the wrong lessons." },
            { h: "Reversible vs irreversible doors", b: "Bezos's framework: Type 2 decisions (reversible, two-way doors) should be made FAST with ~70% of the information — waiting costs more than being wrong. Type 1 decisions (irreversible, one-way doors) deserve slowness, data and sleep. Most decisions are Type 2, yet people agonise over all of them equally." },
            { h: "Expected value thinking", b: "Multiply outcomes by probabilities: a 20% chance of £100k is worth more than a 90% chance of £10k, even though the second feels safer. You don't need precise numbers — the habit of asking 'what are the realistic outcomes, and roughly how likely is each?' transforms fuzzy choices." },
            { h: "Pre-mortems and tripwires", b: "Before a big decision: 'It's 12 months later and this failed — why?' The pre-mortem surfaces risks that optimism hides. Then set tripwires in advance: 'If X hasn't happened by date Y, I'll change course.' Deciding your exit criteria in advance protects you from sunk-cost thinking in the moment." }
          ],
          action: "Take your biggest current decision. Classify it: reversible or irreversible? If reversible — decide this week with the info you have. If irreversible — run a pre-mortem and set tripwires.",
          quiz: [
            { q: "'Resulting' is the error of…", options: ["Deciding too fast", "Judging a decision's quality by its outcome rather than its process", "Asking for results", "Copying others' decisions"], answer: 1, why: "Good bets can lose and bad bets can win. Judge the process, or you'll learn the wrong lessons." },
            { q: "Reversible decisions should generally be made…", options: ["After months of analysis", "Fast, with roughly 70% of the information", "By committee", "Never"], answer: 1, why: "For two-way doors, the cost of delay usually exceeds the cost of being wrong — you can walk back through." },
            { q: "A pre-mortem is…", options: ["An autopsy of a failed project", "Imagining failure in advance to surface hidden risks", "A risk register", "A legal document"], answer: 1, why: "'It's a year later and this failed — why?' unlocks honest risk-spotting that optimism suppresses." }
          ],
          voice: "You make thousands of decisions a week with incomplete information, so you need a professional's toolkit. Tool one: think in bets. Judge every decision by the quality of the process, not the outcome — good bets lose sometimes, and conflating the two teaches you the wrong lessons. Tool two: sort your doors. Reversible decisions get made fast, at seventy percent information; irreversible ones earn slowness and sleep. Most people agonise equally over both. Tool three: think in expected value — what are the realistic outcomes and roughly how likely is each? And before anything big, run a pre-mortem: it is a year from now and it failed — why? Then set tripwires, so future-you knows exactly when to change course."
        },
        {
          id: "life-2",
          title: "Habits: The Automation Layer",
          minutes: 8,
          hook: "You don't rise to your goals. You fall to your systems.",
          ideas: [
            { h: "Identity before behaviour", b: "James Clear's deepest insight: lasting habits stick when they become identity votes. Not 'I'm trying to study' but 'I'm someone who learns daily.' Every repetition is a vote for the kind of person you're becoming. Change who you believe you are, and behaviour follows." },
            { h: "The habit loop and design", b: "Habits run on cue → craving → response → reward. To build one: make the cue obvious (put it in your path), the action small (2-minute version first), and the reward immediate. To break one: make the cue invisible and the action hard. Design beats discipline, every time." },
            { h: "Habit stacking", b: "Anchor new habits to existing ones: 'After I pour my morning coffee, I'll review one flashcard.' Existing routines are stable hooks. The stack — coffee, flashcards, lesson — turns scattered intentions into an automatic sequence." },
            { h: "Never miss twice", b: "Perfectionism kills habits: miss once and the all-or-nothing brain declares failure. The actual rule of habit masters: never miss twice. One miss is an accident; two is the start of a new (bad) habit. Recovery speed matters more than streak length." }
          ],
          action: "Design one learning habit: pick the smallest version (5 minutes), the existing habit it stacks onto, and where it happens. 'After [existing habit], I will [tiny new habit] in [place].'",
          quiz: [
            { q: "The most durable habits are built on…", options: ["Willpower challenges", "Identity — votes for the person you're becoming", "Guilt", "Deadlines"], answer: 1, why: "Behaviour that expresses identity sustains itself; behaviour imposed on identity gets rejected." },
            { q: "To build a new habit you should make it…", options: ["Ambitious and impressive", "Obvious, tiny and immediately rewarding", "Secret", "Daily for exactly 21 days"], answer: 1, why: "Cue visible, action small, reward immediate. Shrink the habit until starting is trivial." },
            { q: "'Never miss twice' means…", options: ["Never start a habit you can't keep", "One miss is fine — the danger is the second consecutive miss", "Missing twice ends the habit forever", "Habits need exactly two daily sessions"], answer: 1, why: "Recovery speed, not perfection, predicts long-term habit success." }
          ],
          voice: "You do not rise to the level of your goals — you fall to the level of your systems. Habits are the automation layer of your life, and they follow rules. Rule one: identity first. Every session is a vote for the kind of person you are becoming; cast enough votes and the election is not close. Rule two: design beats discipline. Make the cue obvious, the action tiny — five minutes counts — and the reward immediate. Rule three: stack it onto something you already do. After I pour my coffee, I review one flashcard. And rule four, the one that saves everything: never miss twice. Missing once is an accident. Missing twice is a new habit. Fall off, get back on, keep the votes coming."
        },
        {
          id: "life-3",
          title: "Goals & Systems That Actually Work",
          minutes: 8,
          hook: "Winners and losers have the same goals. They have different systems.",
          ideas: [
            { h: "Goals set direction; systems create progress", b: "Every Olympian wants the gold medal — the goal doesn't differentiate them. The training system does. Fixating on outcomes you can't fully control creates anxiety; building daily systems you CAN control creates progress. Fall in love with the system, and the goal takes care of itself." },
            { h: "Implementation intentions", b: "'I will [behaviour] at [time] in [place]' doubles to triples follow-through versus vague intentions, across dozens of studies. Vague plans rely on future motivation; specific plans pre-load the decision so no motivation is required." },
            { h: "Keystone habits", b: "Some habits trigger cascades: exercise tends to improve eating, sleep, mood and focus without extra willpower; making your bed correlates with productivity; family dinners correlate with everything good. Find the 1–2 keystone habits that move five other things, and protect them ruthlessly." },
            { h: "Track the process, not just the outcome", b: "Outcomes lag behaviour by weeks or months — weight lags diet, skill lags practice, wealth lags saving. Track the LEADING indicators (sessions done, pages read, hours practised) that you control daily. This course's XP and streaks are process metrics for exactly this reason." }
          ],
          action: "Convert your biggest goal into: one keystone habit, one implementation intention ('I will… at [time] in [place]'), and one leading indicator you'll track weekly.",
          quiz: [
            { q: "Why do winners and losers often have the same goals?", options: ["Goals don't matter at all", "Goals set direction but systems — daily processes — determine who progresses", "Losing is random", "Winners want it more"], answer: 1, why: "Everyone at the Olympics wants gold. The training system is the differentiator." },
            { q: "An implementation intention looks like…", options: ["'I'll try to exercise more'", "'I will exercise at 7am in the garage, Monday Wednesday Friday'", "'Exercise is important to me'", "'Soon I'll start'"], answer: 1, why: "Specific when-where plans pre-load the decision and dramatically raise follow-through." },
            { q: "Leading indicators are better to track because…", options: ["They're easier to fake", "They're behaviours you control daily, while outcomes lag by weeks", "They sound professional", "Outcomes don't matter"], answer: 1, why: "Track what you control today — sessions, pages, hours — and let the lagging outcomes catch up." }
          ],
          voice: "Winners and losers have the same goals — every Olympian wants gold. The difference is systems. So here is the upgrade. Goals set the direction, then you forget them and run the system. Make plans stupidly specific: I will do this behaviour, at this time, in this place — that single sentence triples follow-through. Find your keystone habits, the ones that pull five others along: exercise, sleep, a daily review. Protect those like your life depends on them, because in a way it does. And track leading indicators — the sessions and hours you control today — not the outcomes that lag months behind. Master the process, and the scoreboard takes care of itself."
        },
        {
          id: "life-4",
          title: "Relationships & Networks",
          minutes: 8,
          hook: "Your network isn't who you know. It's who would take your call.",
          ideas: [
            { h: "Relationships are compounding assets", b: "Like money, relationships grow through small regular deposits: check-ins, introductions, congratulations, remembered details. And like money, you can't make a large withdrawal (asking for a big favour) from an account you never deposited into. Give long before you need." },
            { h: "Weak ties carry the opportunities", b: "Granovetter's famous finding: most jobs and opportunities come through weak ties — acquaintances, not close friends — because your close circle knows the same things you do. Weak ties are bridges to other information worlds. Maintain them cheaply: occasional genuine messages, no agenda." },
            { h: "Be the connector", b: "The highest-status, most-loved network position is the person who makes useful introductions. It costs you two minutes and creates value for two people who both remember you for it. Ask everyone you meet: 'Who should I introduce you to?' — then actually do it." },
            { h: "The five-people idea, done honestly", b: "'You're the average of the five people you spend the most time with' is overstated — but the direction is real: norms, ambition and standards are contagious. Audit your information diet and your calendar. Add one relationship with someone whose standards raise yours, even if it costs some comfort." }
          ],
          action: "Send three messages today: one check-in to an old contact, one thank-you, one introduction connecting two people who should know each other. Total time: 15 minutes.",
          quiz: [
            { q: "According to Granovetter's research, most opportunities come through…", options: ["Close friends", "Weak ties — acquaintances who bridge to other networks", "Job boards", "Family"], answer: 1, why: "Close circles share your information; acquaintances connect you to different worlds of opportunity." },
            { q: "The 'relationship account' metaphor means…", options: ["Keep score of favours precisely", "Make small regular deposits of goodwill long before you need to withdraw", "Only network upwards", "Relationships are transactional"], answer: 1, why: "Generosity first, asks much later. You can't withdraw from an account you never funded." },
            { q: "The most valuable networking behaviour is…", options: ["Collecting business cards", "Making useful introductions between others", "Attending every event", "Asking for favours early"], answer: 1, why: "Connectors create value for two people at two minutes' cost — and both remember who connected them." }
          ],
          voice: "Your network is not who you know — it is who would take your call. And the research has a surprise: most opportunities arrive through weak ties, the acquaintances, because your close friends already know everything you know. So maintain those bridges cheaply and genuinely — a real message now and then, no agenda. Treat relationships like compounding accounts: small regular deposits, and never try to withdraw from an account you never funded. Best of all, become a connector. Introducing two people who should know each other costs you two minutes and both of them remember you for it. And quietly audit your five people — standards are contagious, so spend time with people whose standards give yours a fever."
        },
        {
          id: "life-5",
          title: "Meaning & the Long Game",
          minutes: 8,
          hook: "The final layer of intelligence: knowing what all the intelligence is FOR.",
          ideas: [
            { h: "Purpose beats pleasure", b: "The research on wellbeing is consistent: lasting life satisfaction comes from meaning — contribution, growth, connection — more than from pleasure or comfort, which fade fast (hedonic adaptation). The good life is built from engagement and purpose, then seasoned with pleasure, not the reverse." },
            { h: "Long-term thinking is a superpower", b: "Almost everything valuable — skills, wealth, health, reputation, relationships — is a long-term compounding game, and almost every trap (debt, junk food, outrage, shortcuts) is a short-term one. Simply extending your time horizon to decades puts you ahead of most people, because most people won't." },
            { h: "Design your environment and defaults", b: "Your life is largely the output of your defaults: the city, the job, the people, the apps, the first hour of the day. Deliberate people redesign defaults every few years; everyone else inherits theirs. The highest-leverage life question isn't 'what should I do today' but 'what should my defaults be?'" },
            { h: "Gratitude and savouring are trainable", b: "The brain's negativity bias discounts what's going well. Deliberate practices — writing three good things daily, savouring one moment fully — measurably raise baseline wellbeing. Not as fluff: as calibration. A mind that only sees problems is as miscalibrated as one that sees none." }
          ],
          action: "Write your answer to: 'What would I want to be true about my life in 10 years that no amount of money could buy directly?' Then identify one weekly default to change in service of it.",
          quiz: [
            { q: "Research on life satisfaction points most strongly to…", options: ["Maximising pleasure", "Meaning, engagement and connection", "Comfort and convenience", "Status competition"], answer: 1, why: "Pleasure adapts away fast; meaning compounds. Build on purpose, season with pleasure." },
            { q: "Long-term thinking is powerful mainly because…", options: ["It's morally superior", "Everything valuable compounds over decades, and most people won't wait", "Short-term thinking is illegal", "It requires more intelligence"], answer: 1, why: "Extending your time horizon is a nearly free edge — the rewards of patience are enormous precisely because patience is rare." },
            { q: "The highest-leverage life design question is…", options: ["What's on my to-do list?", "What should my defaults and environment be?", "What do others expect?", "What's trending?"], answer: 1, why: "Your defaults produce most of your days. Redesign the defaults and the days redesign themselves." }
          ],
          voice: "Last lesson. All this intelligence needs a purpose, or it is just cleverness. Here is what the research says a good life is built from: meaning before pleasure, because pleasure fades and meaning compounds. Long time horizons, because everything worth having — skill, wealth, health, trust — compounds over decades, and patience is the last remaining unfair advantage. Deliberate defaults, because your environment quietly produces most of your days, so choose the city, the people, and the first hour of your morning like they matter. They do. And train gratitude like a muscle, not to be soft, but to be calibrated — a mind that only sees problems is as broken as one that sees none. That is the whole course. Now go run the system."
        }
      ]
    }
  ]
};

/* Flattened lookup helpers */
COURSE.allLessons = function () {
  const out = [];
  for (const d of COURSE.domains) for (const l of d.lessons) out.push({ domain: d, lesson: l });
  return out;
};
COURSE.findLesson = function (id) {
  for (const d of COURSE.domains) for (const l of d.lessons) if (l.id === id) return { domain: d, lesson: l };
  return null;
};
COURSE.findDomain = function (id) {
  return COURSE.domains.find(d => d.id === id) || null;
};

if (typeof module !== "undefined") module.exports = COURSE;
