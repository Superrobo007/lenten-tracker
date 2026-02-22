// src/data/days.js
export const ADMIN_PASSWORD = "Sion@tnbc2026";
export const LENTEN_START = new Date("2026-02-18");

export const getLentenDay = () => {
  const diff = Math.floor((new Date() - LENTEN_START) / 86400000);
  return Math.min(Math.max(diff, 0), 39);
};

export const DAYS = [
  {
    ta: { do: "காலை 10 நிமிடம் அமைதியாக இறைவனிடம் வேண்டுதல் செய்", give: "ஒரு ஏழைக்கு உணவு வழங்கு / பொருள்கள் வழங்கு", avoid: "செபநேரத்தை தவிர்க்கும் / குறைக்கும் செயல்களை விட்டுவிடு" },
    en: { do: "Spend 10 quiet minutes in prayer before God", give: "Give food or essentials to someone in need", avoid: "Give up activities that cut short or replace your prayer time" },
  },
  {
    ta: { do: "நான்கு நற்செய்திகளில் இயேசுவின் பாடல்கள் ஒரு பகுதியை வாசித்து யோசி", give: "பசியுடன் இருப்பவருக்கு உணவு கொடு; காரிரணமின்மையை விட்டுவிடு", avoid: "காரிரணமின்மையை விட்டுவிடு" },
    en: { do: "Read and reflect on a passage from the four Gospels", give: "Feed someone who is hungry", avoid: "Give up acting without reason or purpose" },
  },
  {
    ta: { do: "வாரநாள் ஒரு முறையேனும் தனிப்பட்ட வேண்டுதல் / மன்றாட்டம் செய்", give: "வாரத்தில் ஒருமுறை உன் கைசெலவுபணத்தில் இருந்து சிறிதளவு பகிர்", avoid: "பதட்டத்தை / பொறுமையின்மையை விட்டுவிடு" },
    en: { do: "Make personal prayer at least once on a weekday", give: "Share a little from your pocket money once this week", avoid: "Give up anxiety and impatience" },
  },
  {
    ta: { do: "காலை செபமாலை செய்", give: "உடல்நலமற்றவர் / முயலவரை சந்தி உறவாடு", avoid: "அகமாக சிந்தி கவலைகொள்வதை விட்டுவிடு" },
    en: { do: "Pray the Rosary in the morning", give: "Visit and spend time with someone who is sick or struggling", avoid: "Give up inward brooding and excessive worry" },
  },
  {
    ta: { do: "உன் போராட்டங்களைப் பற்றி இயேசுவிடம் பகிர்ந்துகொள்", give: "தமிழில் இருப்பவரை கைபேசியில் அழைத்து பேசி உற்சாகப்படுத்து", avoid: "உன்னை குறைத்தவர்களை மன்னிக்க மறுக்கும் மனோபாவத்தை விட்டுவிடு" },
    en: { do: "Share your struggles with Jesus in prayer", give: "Call someone from your hometown and encourage them", avoid: "Give up refusing to forgive those who have hurt you" },
  },
  {
    ta: { do: "வாரத்திற்கு ஒரு இறை வசனத்தை மனப்பாடம் செய்", give: "குழந்தைகளுக்கு இலவசமாக கற்பி / படிப்பில் உதவு", avoid: "உடல்நலத்தை கெடுக்கும் பெப்சி, கோக்கோகோலா முதலியவற்றை விட்டுவிடு" },
    en: { do: "Memorise one scripture verse this week", give: "Teach children for free or help with their studies", avoid: "Give up health-damaging soft drinks and cola" },
  },
  {
    ta: { do: "வழக்கமுள்ள காலை, மாலை, இரவு செபங்களை மேலும் சிறப்பாக செய்", give: "உடைகள் / போர்வைகள் அத்தியாவசியப் பொருள்கள் வழங்கு", avoid: "இறைவனிடமிருந்து உன்னை விலக்கும் / இடைவேளை தரும் சூழல்களை / மதர்களை விட்டுவிடு" },
    en: { do: "Make your morning, evening and night prayers more meaningful", give: "Donate clothes, blankets, or essential goods", avoid: "Give up environments and habits that distance you from God" },
  },
  {
    ta: { do: "சிலுவைப்பாதை பக்தி முயற்சியில் பங்குகொள்", give: "ஆலயப் பங்கு / சமூகப் பங்கு தன்னார்வமாக பங்குகொள்", avoid: "வேலைகளைத் தள்ளிப்போடும் பழக்கத்தை விட்டுவிடு" },
    en: { do: "Participate in the Way of the Cross devotion", give: "Volunteer in your church or community", avoid: "Give up procrastination" },
  },
  {
    ta: { do: "நோன்பு கால வேண்டுதல் குழுவேட்டு எழுது", give: "சிறையிலிருப்போரை சந்தி உறவாடு", avoid: "சுகபோக / ஆடம்பர வாழ்வை தேடும் எண்ணங்களை விட்டுவிடு" },
    en: { do: "Write in your Lenten prayer journal", give: "Visit and spend time with someone in prison", avoid: "Give up thoughts of seeking luxury and indulgence" },
  },
  {
    ta: { do: "காலை நீ பெற்ற 5 நன்மைகளுக்கு இறைவனுக்கு நன்றி சொல்", give: "கேட்கும் முன்னரே காலை பெற்றோருக்கு / பெரியவர்களுக்கு உதவு", avoid: "இலக்கை நோக்கிய பயணத்தைத் தடுக்கும் / தாமதப்படுத்தும் செயல்களை விட்டுவிடு" },
    en: { do: "Thank God for 5 blessings you received today", give: "Help your parents or elders before they even ask", avoid: "Give up things that block or delay your journey toward your goals" },
  },
  {
    ta: { do: "தவக்கால முழுவதும் அசைவ உணவுகளை தவிர்த்திரு", give: "உன்னை காயப்படுத்தியவரை மன்னித்துவிடு", avoid: "எல்லோருடனும் அன்பாக உறவாடுவதை தடுக்கும் 'நான்' என்ற ஈகோ எண்ணங்களை விட்டுவிடு" },
    en: { do: "Abstain from non-vegetarian food throughout Lent", give: "Forgive someone who has hurt you", avoid: "Give up the ego of 'I' that prevents loving relationships" },
  },
  {
    ta: { do: "உனக்கு கடும் காயத்தை இப்போது / சிறுவயதில் இழைத்ததை விட்டுவிடு", give: "பிறரைப் பற்றி புறமுதுகாமல் நல்லதைப் பேசு", avoid: "அடுத்தவர்களை மாற்றிவிட நடத்தத் தடையாக இருக்கும் இம்சைப்பு எண்ணங்களை விட்டுவிடு" },
    en: { do: "Let go of deep wounds from now or from childhood", give: "Speak well of others — never gossip behind their backs", avoid: "Give up coercive thoughts of forcefully changing others" },
  },
  {
    ta: { do: "தொலைக்காட்சி பார்வை நேரத்தை பாதியாக குறை", give: "ஆசிரியர்கள் / உதவியாளர்களை பாராட்டு", avoid: "கடுமையான / மோசமான / இழிவு சொற்களை பயன்படுத்துவதை விட்டுவிடு" },
    en: { do: "Cut your TV/screen time in half", give: "Appreciate and compliment your teachers and helpers", avoid: "Give up using harsh, crude, or degrading words" },
  },
  {
    ta: { do: "உணவு நேரத்தில் கைபேசி பயன்படுத்தாதே", give: "படிப்பில் சிரமப்படும் வகுப்பு தோழருக்கு உதவு", avoid: "பகைமையை விட்டுவிடு" },
    en: { do: "Do not use your phone during meals", give: "Help a classmate who is struggling in their studies", avoid: "Give up hatred and hostility" },
  },
  {
    ta: { do: "உன் குறைகளை திருத்திக்கொள்ள முயற்சி செய்", give: "அனாதை இல்லம் / முதியோர் இல்லம் சென்று அங்குள்ளோருடன் உறவாடு. இயன்ற பொருள் வழங்கு", avoid: "கோபத்தை விட்டுவிடு" },
    en: { do: "Make an effort to correct your personal faults", give: "Visit an orphanage or old-age home; give what you can", avoid: "Give up anger" },
  },
  {
    ta: { do: "வாரத்தில் ஒரு நாள் முழுவதும் முறையிடாமல் இரு", give: "இயற்கை பேரழிவால் பாக்கப்பட்டவர்களுக்கு உணவு / பொருள்கள் சேகரி", avoid: "ஆரோக்கியமற்ற உணவுகளை உண்ணும் பழக்கத்தை விட்டுவிடு" },
    en: { do: "Spend one full day a week without complaints", give: "Collect food or goods for natural disaster victims", avoid: "Give up unhealthy eating habits" },
  },
  {
    ta: { do: "உன்னைப்பற்றி பெருமை பேசாதே", give: "பேருந்து / தொடர்வண்டி பயணத்தில் சிரமப்படுபவருக்கு உட்கார இடம் கொடு / உதவி செய்", avoid: "வாதம் செய்வதை விட்டுவிடு" },
    en: { do: "Stop boasting about yourself", give: "Offer your seat or help someone struggling on public transport", avoid: "Give up arguing needlessly" },
  },
  {
    ta: { do: "தேவையற்ற பொருள்களை வாங்காதே", give: "காலை தோழுவன் தேவை குறைவடைய இறைவனை வேண்டு", avoid: "'எனக்கு எல்லாம் தெரியும்' என்ற எண்ணத்தை விட்டுவிடு" },
    en: { do: "Do not buy unnecessary things", give: "Pray for God to meet your friend's needs first thing in the morning", avoid: "Give up the 'I know everything' attitude" },
  },
  {
    ta: { do: "வாரத்தில் ஒரு நாள் இடை உணவை தவிர்த்துவிடு", give: "ஒதுங்கியிருப்பவரை / ஒதுக்கப்பட்டவரை உன் குழுவில் சேர்த்துக்கொள்", avoid: "தன்னலத்தை / பொருளாசையை விட்டுவிடு" },
    en: { do: "Skip a meal one day this week as a fast", give: "Include someone isolated or excluded in your group", avoid: "Give up selfishness and material greed" },
  },
  {
    ta: { do: "உன் அறையை காலை சுத்தமாகவும் ஒழுங்காகவும் வைத்திரு", give: "மருத்துவமனையில் சிகிச்சை பெறுவோரை சந்தித்துப் பேசி ஆறுதல் வழங்கி செல்", avoid: "அவநம்பிக்கையை விட்டுவிடு" },
    en: { do: "Keep your room clean and tidy every morning", give: "Visit hospital patients and offer comfort and company", avoid: "Give up disbelief and hopelessness" },
  },
  {
    ta: { do: "எல்லோருடனும் புன்னகைத்து வாழ்த்து கூறு", give: "ஒரு மரம் அல்லது செடி நட்டு வளர்த்துவிடு", avoid: "பிறரைக் குற்றம் சாட்டி குற்றம் காட்டி வசை சொல்வதை விட்டுவிடு" },
    en: { do: "Greet everyone you meet with a warm smile", give: "Plant and care for a tree or a plant", avoid: "Give up accusing, finding fault with, and cursing others" },
  },
  {
    ta: { do: "செய்வனவற்றை முகமலர்ச்சியோடு செய்", give: "ஒரு மாற்றுத் திறனாளிக்கு அருள் பவருக்கு அறிவுரை கூறு", avoid: "சண்டை சச்சரவை விட்டுவிடு" },
    en: { do: "Do everything with a cheerful and willing face", give: "Advise someone who is serving a person with a disability", avoid: "Give up quarrelling and fighting" },
  },
  {
    ta: { do: "பிறர் உன்னிடம் மன்னிப்பு கேட்பவர் என நினைவில் வை", give: "பள்ளி / சிறு தோட்டம் அமைத்துவிடு", avoid: "சோம்பலை விட்டுவிடு" },
    en: { do: "Remember there may be others waiting for your forgiveness", give: "Set up a small garden at school or at home", avoid: "Give up laziness" },
  },
  {
    ta: { do: "உன் பகைவனிடமும் அன்பு காட்டு", give: "உன் தெரு / சுற்றுப்புறத்தை சுத்தமாக்கு", avoid: "பிறரைப் பற்றி வதந்தி பேசுவதை விட்டுவிடு" },
    en: { do: "Show love even to your enemy", give: "Clean and tidy your street or neighbourhood", avoid: "Give up spreading rumours about others" },
  },
  {
    ta: { do: "எல்லாவருடனும் இணக்கமாக வாழ முயற்சி செய்", give: "நெகிழ் பைகளை எறியாதே / பத்திரமாக வை", avoid: "புரட்டுதலை விட்டுவிடு" },
    en: { do: "Make an effort to live in harmony with everyone", give: "Don't throw plastic bags — store them for safe disposal", avoid: "Give up deception and manipulation" },
  },
  {
    ta: { do: "பிறர் குறைகளை பொறுத்துக்கொள்", give: "பறவைகளுக்கு உணவு கொடு. பூந்தோட்டம் / நீர் தொட்டி அமை", avoid: "பிறரிடம் உன்னை ஒப்பிடுவதை விட்டுவிடு" },
    en: { do: "Bear with others' faults patiently", give: "Feed birds; set up a small garden or bird-water trough", avoid: "Give up comparing yourself with others" },
  },
  {
    ta: { do: "முன்கோப எண்ணங்களை தவிர்த்துவிடு", give: "தேவையில்லாதபோது விளக்கு / குளிரூட்டியை அணைத்துவிடு", avoid: "பிறரை தவறுப்படுத்துவதை விட்டுவிடு" },
    en: { do: "Avoid thoughts driven by hot temper and rage", give: "Switch off lights and fans/AC when not needed", avoid: "Give up belittling and humiliating others" },
  },
  {
    ta: { do: "எதைப் பற்றியும் கவலைப்பட வேண்டாம்", give: "கஷ்டத்திலிருக்கும்போது / கலங்கும்போது இறைவனை நம்பி வேண்டு", avoid: "பிறரைப்பற்றி எதிர்மறையாக / எற்றுமறையாக பேசுவதை விட்டுவிடு" },
    en: { do: "Don't worry about anything — place it in God's hands", give: "When troubled or confused, trust God and ask Him in prayer", avoid: "Give up speaking negatively about others behind their backs" },
  },
  {
    ta: { do: "உன்னுடன் வருத்தத்தில் உள்ளவரை மன்னித்துவிடு", give: "குறுகிய தூரங்களுக்கு நடந்து செல் / வண்டி பயன்படுத்தாமல் இரு", avoid: "வார்த்தைகளால் பிறரை கொல்வதை விட்டுவிடு" },
    en: { do: "Forgive someone who has grieved or upset you", give: "Walk short distances instead of using a vehicle", avoid: "Give up wounding others with your words" },
  },
  {
    ta: { do: "வாய்பேச்சை தவிர்த்துவிடு / நாவை அடக்கு", give: "காகிதம் மற்றும் புத்தகங்களை மறுசுழற்சி செய்து பயன்படுத்து", avoid: "தேவையற்ற உறவை / இழிவான தீய நட்பை விட்டுவிடு" },
    en: { do: "Avoid idle talk and control your tongue", give: "Recycle and reuse paper and books", avoid: "Give up unnecessary relationships and toxic friendships" },
  },
  {
    ta: { do: "காலை ஆன்மிக / ஊக்கமளிக்கிற புத்தகம் வாசி", give: "கீழே குப்பை பார்த்தால் அதை எடுத்து குப்பைத் தொட்டியில் போடு", avoid: "தாழ்வு மனப்பான்மையை விட்டுவிடு" },
    en: { do: "Read a spiritual or motivational book in the morning", give: "If you see litter on the ground, pick it up and bin it", avoid: "Give up feelings of inferiority and low self-worth" },
  },
  {
    ta: { do: "புதிய ஒன்றை கற்றுக்கொள் (இசை, ஓவியம், மொழி, சமையல் முதலியன)", give: "காற்று மாசடைவதை குறைக்க பட்டாசு வெடிப்பதை கைவிடு", avoid: "வெளிப்படையாக கோபத்தை முற்றிலும் வெளிப்படுத்துவதை விட்டுவிடு" },
    en: { do: "Learn something new (music, art, language, cooking, etc.)", give: "Stop bursting firecrackers to reduce air pollution", avoid: "Give up expressing anger openly and uncontrollably" },
  },
  {
    ta: { do: "காலை 20 நிமிடம் உடற்பயிற்சி / நடைப்பயிற்சி செய்", give: "உணவை வீணாக்காதே", avoid: "சமூக வலைத்தளங்கள் நேரத்தை வீணாக்குவதை விட்டுவிடு" },
    en: { do: "Do 20 minutes of exercise or walking in the morning", give: "Do not waste food", avoid: "Give up wasting time on social media" },
  },
  {
    ta: { do: "நலமான சொற்கள் மட்டும் பேசு; எதிர்மறை சொற்களை தவிர்", give: "இயற்கையை பாதுகாக்கும் வழிமுறைகளை அறிந்து பிறரிடம் பகிர்", avoid: "பிறர் பேசும்போது இடைமறிப்பதை விட்டுவிடு" },
    en: { do: "Speak only kind words; avoid all negative speech", give: "Learn how to protect nature and share the knowledge", avoid: "Give up interrupting others when they speak" },
  },
  {
    ta: { do: "மனத்தளர்ச்சியை தவிர்த்து இறைவனை, பிறரை, உன்னை நம்பு", give: "இயற்கை வேளாண்மையை ஊக்குவிக்க இயன்றதை செய்", avoid: "பெற்றோர் அல்லது மூத்தோரை புறக்கணிப்பதை விட்டுவிடு" },
    en: { do: "Avoid despondency — trust God, others, and yourself", give: "Do what you can to promote natural/organic farming", avoid: "Give up neglecting your parents and elders" },
  },
  {
    ta: { do: "உறங்க செல்லும்முன் 'இன்று என்ன நன்மை செய்தேன்? எதை திருத்திக்கொள்ள வேண்டும்?' என்று சிந்தித்துப் பார்", give: "இயற்கையை பாதுகாக்க நண்பர்களை ஊக்கப்படுத்து", avoid: "வஞ்சகத்தை விட்டுவிடு" },
    en: { do: "Before sleeping reflect: 'What good did I do? What must I correct?'", give: "Encourage your friends to protect nature", avoid: "Give up deceitfulness and treachery" },
  },
  {
    ta: { do: "எல்லையிலும் மனநிறைவோடு வாழக் கற்றுக்கொள்", give: "பழைய பொருள்களை கொண்டு சுற்றுச்சூழல் காக்கும் பொருட்கள் தயார்", avoid: "இச்சையை தீர்க்கும் எண்ணம் / பேச்சு / செயல்களை விட்டுவிடு" },
    en: { do: "Learn to live contentedly within your means", give: "Make eco-friendly items from recycled or old materials", avoid: "Give up thoughts, words, and actions that fulfil lustful desires" },
  },
  {
    ta: { do: "குடும்பத்துடன் தரமான நேரத்தை செலவிடு", give: "20 நிமிடம் இயற்கை சூழலில் வாழ்ந்து அதற்காக இறைவனுக்கு நன்றி சொல்", avoid: "பிறர் குறைகூறுவதை விட்டுவிடு" },
    en: { do: "Spend quality time with your family", give: "Spend 20 minutes in a natural setting and thank God for it", avoid: "Give up complaining about others" },
  },
  {
    ta: { do: "சோதனைகளை எதிர்த்து போராடுவதில் உறுதியாக இரு", give: "இளைஞர் குழுவுடன் 'படி நாள்' அல்லது மரம் நட்டு வளர்க்கும் கிழமை நடத்து", avoid: "பொறாமைப்படுவதை விட்டுவிடு" },
    en: { do: "Stand firm and battle your temptations with resolve", give: "Organise a 'study day' or a tree-planting event with youth", avoid: "Give up jealousy and envy" },
  },
  {
    ta: { do: "ஒரு தவறிட்ட இலக்கு வைத்து அதனை அடைய காலை முயற்சி செய்", give: "குப்பைகளை ஈரக் குப்பை, உலர் குப்பை என்று பிரித்து வைத்து உதவு", avoid: "சிய சிரமங்களைப் பற்றி முறையிடுதலை விட்டுவிடு" },
    en: { do: "Set one missed goal and take a morning step toward it", give: "Help by segregating waste into wet and dry categories", avoid: "Give up complaining about your own difficulties" },
  },
];
