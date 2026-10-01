/**
 * LOKUPDATE RAJASTHAN - NEWS CREATIVE STUDIO
 * Professional News Templates Library
 * 7 Curated Templates + Custom Template Storage
 */

const PREBUILT_TEMPLATES = [
  // 1. BREAKING NEWS (Dark Navy, Yellow Highlights, Big Hindi Headline, Photo Frame)
  {
    id: 'tmpl_breaking_news',
    name: 'Breaking News (बड़ी खबर)',
    category: 'BREAKING NEWS',
    aspectRatio: '1:1',
    description: 'Dark navy background, yellow highlights, live pulse badge, and prominent photo frame',
    data: {
      width: 1080,
      height: 1080,
      backgroundColor: '#0B1340',
      elements: [
        // Top Brand Header Bar
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 0,
          width: 1080,
          height: 110,
          fillColor: '#0E1642',
          strokeColor: '#FFC400',
          strokeWidth: 3
        },
        // Official LokUpdate Logo
        {
          type: 'image',
          name: 'LokUpdate Logo',
          src: 'assets/lokupdate-logo-transparent.png',
          x: 40,
          y: 12,
          width: 200,
          height: 86,
          fitMode: 'contain',
          isLogo: true
        },
        // Breaking News Pulsing Badge
        {
          type: 'badge',
          name: 'Breaking Live Badge',
          label: 'BREAKING NEWS',
          hindiLabel: 'बड़ी खबर',
          x: 740,
          y: 28,
          width: 300,
          height: 52,
          fillColor: '#FFC400',
          textColor: '#0B1340',
          fontSize: 18,
          showPulseDot: true
        },
        // Main News Image with Golden Border
        {
          type: 'image',
          name: 'Main News Photo',
          src: 'assets/samples/news-press.jpg',
          x: 40,
          y: 130,
          width: 1000,
          height: 480,
          fitMode: 'cover',
          borderRadius: 16,
          borderColor: '#FFC400',
          borderWidth: 4,
          shadowBlur: 16,
          shadowColor: 'rgba(0,0,0,0.5)'
        },
        // Location & Time Ribbon
        {
          type: 'shape',
          shapeType: 'pill',
          x: 60,
          y: 570,
          width: 310,
          height: 42,
          fillColor: '#17237F',
          strokeColor: '#FFC400',
          strokeWidth: 2
        },
        {
          type: 'text',
          name: 'Location & Time',
          text: '📍 जयपुर | 10 मिनट पहले',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 17,
          fontWeight: '700',
          color: '#FFC400',
          x: 80,
          y: 579,
          width: 270,
          textAlign: 'left'
        },
        // Big Impact Headline (Hindi)
        {
          type: 'text',
          name: 'Breaking Headline',
          text: 'राजस्थान में बड़ा प्रशासनिक फेरबदल: 35 IAS और 42 IPS अधिकारियों के तबादले जारी!',
          fontFamily: 'Rozha One',
          fontSize: 44,
          fontWeight: '800',
          lineHeight: 1.25,
          color: '#FFFFFF',
          x: 40,
          y: 630,
          width: 1000,
          textAlign: 'left',
          shadowColor: 'rgba(0,0,0,0.8)',
          shadowBlur: 8,
          isHeadline: true
        },
        // Sub-text / Bullet summary
        {
          type: 'text',
          name: 'News Description',
          text: '• कार्मिक विभाग ने देर रात जारी किए आदेश, कई जिलों के बदले कलेक्टर व एसपी।\n• राजधानी जयपुर और जोधपुर में भी नए अधिकारियों की हुई तैनाती।',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 24,
          fontWeight: '500',
          lineHeight: 1.4,
          color: '#E2E8F0',
          x: 40,
          y: 810,
          width: 1000,
          textAlign: 'left'
        },
        // Footer Brand Bar
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 990,
          width: 1080,
          height: 90,
          fillColor: '#FFC400'
        },
        {
          type: 'text',
          name: 'Footer Handle',
          text: '@LokUpdateRajasthan  •  www.lokupdaterajasthan.com',
          fontFamily: 'Poppins',
          fontSize: 22,
          fontWeight: '800',
          color: '#0B1340',
          x: 40,
          y: 1022,
          width: 600,
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Footer Tagline',
          text: 'सच की आवाज़, सबसे तेज़',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 20,
          fontWeight: '800',
          color: '#0B1340',
          x: 740,
          y: 1022,
          width: 300,
          textAlign: 'right'
        }
      ]
    }
  },

  // 2. RAJASTHAN NEWS (Official Editorial State Layout, Royal Navy & Gold)
  {
    id: 'tmpl_rajasthan_news',
    name: 'Rajasthan News (राजस्थान न्यूज़)',
    category: 'RAJASTHAN NEWS',
    aspectRatio: '1:1',
    description: 'Clean professional state news layout with photo, headline, location, and date',
    data: {
      width: 1080,
      height: 1080,
      backgroundColor: '#F8FAFC',
      elements: [
        // Top Header
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 0,
          width: 1080,
          height: 120,
          fillColor: '#17237F'
        },
        {
          type: 'image',
          name: 'Brand Logo',
          src: 'assets/lokupdate-logo-transparent.png',
          x: 40,
          y: 15,
          width: 220,
          height: 90,
          fitMode: 'contain',
          isLogo: true
        },
        // Category Pill
        {
          type: 'shape',
          shapeType: 'pill',
          x: 720,
          y: 35,
          width: 320,
          height: 50,
          fillColor: '#FFC400'
        },
        {
          type: 'text',
          name: 'Category Name',
          text: 'RAJASTHAN SPECIAL',
          fontFamily: 'Poppins',
          fontSize: 18,
          fontWeight: '900',
          color: '#0B1340',
          x: 730,
          y: 48,
          width: 300,
          textAlign: 'center'
        },
        // Photo Card
        {
          type: 'image',
          name: 'News Photo',
          src: 'assets/samples/jaipur-news.jpg',
          x: 50,
          y: 145,
          width: 980,
          height: 460,
          fitMode: 'cover',
          borderRadius: 14,
          borderColor: '#E2E8F0',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.1)'
        },
        // Location Badge Tag
        {
          type: 'shape',
          shapeType: 'rect',
          x: 50,
          y: 625,
          width: 160,
          height: 38,
          borderRadius: 6,
          fillColor: '#17237F'
        },
        {
          type: 'text',
          name: 'Location Tag',
          text: '📍 राजस्थान',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 18,
          fontWeight: '700',
          color: '#FFFFFF',
          x: 60,
          y: 631,
          width: 140,
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Date Tag',
          text: '02 अक्टूबर 2026 | LokUpdate विशेष',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 16,
          fontWeight: '600',
          color: '#64748B',
          x: 230,
          y: 632,
          width: 400,
          textAlign: 'left'
        },
        // Headline
        {
          type: 'text',
          name: 'Headline',
          text: 'विधानसभा में बजट सत्र को लेकर रणनीति तैयार, कई ऐतिहासिक योजनाओं की हो सकती है घोषणा!',
          fontFamily: 'Poppins',
          fontSize: 38,
          fontWeight: '800',
          lineHeight: 1.3,
          color: '#0F172A',
          x: 50,
          y: 685,
          width: 980,
          textAlign: 'left',
          isHeadline: true
        },
        // Description
        {
          type: 'text',
          name: 'News Summary',
          text: 'मुख्यमंत्री ने उच्चस्तरीय बैठक में दिए निर्देश, किसानों और युवाओं के लिए विशेष प्रावधान। विकास कार्यों को मिलेगी तीव्र गति।',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 23,
          fontWeight: '500',
          lineHeight: 1.45,
          color: '#334155',
          x: 50,
          y: 835,
          width: 980,
          textAlign: 'left'
        },
        // Footer Bar
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 990,
          width: 1080,
          height: 90,
          fillColor: '#17237F'
        },
        {
          type: 'text',
          name: 'Footer Text',
          text: 'लोकअपडेट राजस्थान  •  Follow us @LokUpdateRajasthan',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 20,
          fontWeight: '700',
          color: '#FFC400',
          x: 50,
          y: 1022,
          width: 980,
          textAlign: 'center'
        }
      ]
    }
  },

  // 3. JAIPUR LOCAL NEWS (Clean Local News with Large Photo & Pink/Royal Touch)
  {
    id: 'tmpl_jaipur_news',
    name: 'Jaipur Local News (जयपुर लोकल न्यूज़)',
    category: 'JAIPUR NEWS',
    aspectRatio: '1:1',
    description: 'Clean local news design with large photo and readable headline',
    data: {
      width: 1080,
      height: 1080,
      backgroundColor: '#FFFFFF',
      elements: [
        // Top Ribbon
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 0,
          width: 1080,
          height: 100,
          fillColor: '#0B1340'
        },
        {
          type: 'image',
          name: 'Brand Logo',
          src: 'assets/lokupdate-logo-transparent.png',
          x: 40,
          y: 10,
          width: 190,
          height: 80,
          fitMode: 'contain',
          isLogo: true
        },
        {
          type: 'shape',
          shapeType: 'pill',
          x: 760,
          y: 25,
          width: 280,
          height: 50,
          fillColor: '#FFC400'
        },
        {
          type: 'text',
          name: 'City Badge',
          text: 'जयपुर शहर समाचार',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 20,
          fontWeight: '800',
          color: '#0B1340',
          x: 770,
          y: 37,
          width: 260,
          textAlign: 'center'
        },
        // Prominent Photo
        {
          type: 'image',
          name: 'Jaipur Photo',
          src: 'assets/samples/jaipur-news.jpg',
          x: 40,
          y: 125,
          width: 1000,
          height: 510,
          fitMode: 'cover',
          borderRadius: 12,
          borderColor: '#17237F',
          borderWidth: 2
        },
        // Headline
        {
          type: 'text',
          name: 'Local Headline',
          text: 'जयपुर में मेट्रो फेज-2 का विस्तार जल्द, नए रूट से लाखों यात्रियों को मिलेगी ट्रैफिक जाम से राहत!',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 38,
          fontWeight: '800',
          lineHeight: 1.3,
          color: '#0B1340',
          x: 40,
          y: 665,
          width: 1000,
          textAlign: 'left',
          isHeadline: true
        },
        // Details
        {
          type: 'text',
          name: 'Description',
          text: 'अंबाबाड़ी से सीतापुरा तक बनेगा नया कॉरिडोर। जेएमआरसी ने डीपीआर तैयार कर सरकार को भेजी। 6 प्रमुख चौराहों पर बनेंगे अंडरग्राउंड स्टेशन।',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 23,
          fontWeight: '500',
          lineHeight: 1.45,
          color: '#475569',
          x: 40,
          y: 815,
          width: 1000,
          textAlign: 'left'
        },
        // Footer Bar
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 980,
          width: 1080,
          height: 100,
          fillColor: '#F1F5F9',
          strokeColor: '#E2E8F0',
          strokeWidth: 1
        },
        {
          type: 'text',
          name: 'Footer',
          text: 'LOKUPDATE RAJASTHAN  •  जयपुर की हर खबर सबसे पहले',
          fontFamily: 'Poppins',
          fontSize: 20,
          fontWeight: '700',
          color: '#17237F',
          x: 40,
          y: 1018,
          width: 1000,
          textAlign: 'center'
        }
      ]
    }
  },

  // 4. POLITICS NEWS (Editorial Political News Layout, Quote styling)
  {
    id: 'tmpl_politics_news',
    name: 'Politics News (राजनीति हलचल)',
    category: 'POLITICS',
    aspectRatio: '1:1',
    description: 'Neutral editorial news layout with space for photograph, quotes, and headline',
    data: {
      width: 1080,
      height: 1080,
      backgroundColor: '#0F172A',
      elements: [
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 0,
          width: 1080,
          height: 110,
          fillColor: '#17237F'
        },
        {
          type: 'image',
          name: 'Brand Logo',
          src: 'assets/lokupdate-logo-transparent.png',
          x: 40,
          y: 12,
          width: 210,
          height: 85,
          fitMode: 'contain',
          isLogo: true
        },
        {
          type: 'shape',
          shapeType: 'pill',
          x: 770,
          y: 30,
          width: 270,
          height: 48,
          fillColor: '#FFC400'
        },
        {
          type: 'text',
          name: 'Category Tag',
          text: 'सियासत / POLITICS',
          fontFamily: 'Poppins',
          fontSize: 17,
          fontWeight: '800',
          color: '#0B1340',
          x: 780,
          y: 43,
          width: 250,
          textAlign: 'center'
        },
        // Portrait / Leader Photo
        {
          type: 'image',
          name: 'Leader Photo',
          src: 'assets/samples/news-press.jpg',
          x: 40,
          y: 135,
          width: 1000,
          height: 460,
          fitMode: 'cover',
          borderRadius: 14,
          borderColor: '#FFC400',
          borderWidth: 3
        },
        // Headline
        {
          type: 'text',
          name: 'Politics Headline',
          text: 'चुनावी रणनीति पर हाईकमान की अहम बैठक संपन्न, उम्मीदवारों के चयन पर मंथन तेज!',
          fontFamily: 'Rozha One',
          fontSize: 42,
          fontWeight: '800',
          lineHeight: 1.25,
          color: '#FFC400',
          x: 40,
          y: 625,
          width: 1000,
          textAlign: 'left',
          isHeadline: true
        },
        // Description / Quote
        {
          type: 'text',
          name: 'Quote / Summary',
          text: '"पार्टी जनता के मुद्दों पर मजबूती से चुनाव लड़ेगी, जिताऊ और स्वच्छ छवि वाले चेहरों को ही टिकट मिलेगा।" - शीर्ष नेतृत्व',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 24,
          fontWeight: '500',
          lineHeight: 1.45,
          color: '#E2E8F0',
          x: 40,
          y: 795,
          width: 1000,
          textAlign: 'left'
        },
        // Footer Bar
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 980,
          width: 1080,
          height: 100,
          fillColor: '#1E293B',
          strokeColor: '#FFC400',
          strokeWidth: 2
        },
        {
          type: 'text',
          name: 'Footer Handle',
          text: 'LokUpdate Rajasthan  |  राजनीति की निष्पक्ष एवं सटीक कवरेज',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 21,
          fontWeight: '700',
          color: '#FFFFFF',
          x: 40,
          y: 1018,
          width: 1000,
          textAlign: 'center'
        }
      ]
    }
  },

  // 5. EDUCATION NEWS (Exam & Result Alert Layout)
  {
    id: 'tmpl_education_news',
    name: 'Education News (शिक्षा एवं भर्ती अलर्ट)',
    category: 'EDUCATION',
    aspectRatio: '1:1',
    description: 'Modern educational news and recruitment alert layout',
    data: {
      width: 1080,
      height: 1080,
      backgroundColor: '#F8FAFC',
      elements: [
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 0,
          width: 1080,
          height: 110,
          fillColor: '#17237F'
        },
        {
          type: 'image',
          name: 'Brand Logo',
          src: 'assets/lokupdate-logo-transparent.png',
          x: 40,
          y: 12,
          width: 200,
          height: 85,
          fitMode: 'contain',
          isLogo: true
        },
        {
          type: 'shape',
          shapeType: 'pill',
          x: 740,
          y: 30,
          width: 300,
          height: 50,
          fillColor: '#FFC400'
        },
        {
          type: 'text',
          name: 'Alert Badge',
          text: '📢 शिक्षा एवं भर्ती अपडेट',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 18,
          fontWeight: '800',
          color: '#0B1340',
          x: 750,
          y: 43,
          width: 280,
          textAlign: 'center'
        },
        // Exam Photo
        {
          type: 'image',
          name: 'Exam Photo',
          src: 'assets/samples/jaipur-news.jpg',
          x: 40,
          y: 135,
          width: 1000,
          height: 440,
          fitMode: 'cover',
          borderRadius: 12,
          borderColor: '#CBD5E1',
          borderWidth: 2
        },
        // Headline
        {
          type: 'text',
          name: 'Exam Headline',
          text: 'राजस्थान शिक्षक भर्ती (REET): मुख्य परीक्षा की तिथियां घोषित, प्रवेश पत्र अगले सप्ताह होंगे जारी!',
          fontFamily: 'Poppins',
          fontSize: 38,
          fontWeight: '800',
          lineHeight: 1.3,
          color: '#0F172A',
          x: 40,
          y: 605,
          width: 1000,
          textAlign: 'left',
          isHeadline: true
        },
        // Information Checklist
        {
          type: 'text',
          name: 'Exam Highlights',
          text: '✔ कुल पदों की संख्या: 28,500 पद\n✔ परीक्षा केंद्र: राज्य के 33 जिलों में बनाए जाएंगे केंद्र\n✔ आधिकारिक वेबसाइट rsmssb.rajasthan.gov.in पर देखें अधिसूचना',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 23,
          fontWeight: '600',
          lineHeight: 1.6,
          color: '#334155',
          x: 40,
          y: 770,
          width: 1000,
          textAlign: 'left'
        },
        // Footer Bar
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 980,
          width: 1080,
          height: 100,
          fillColor: '#17237F'
        },
        {
          type: 'text',
          name: 'Footer',
          text: 'युवाओं और विद्यार्थियों का विश्वसनीय मंच  •  @LokUpdateRajasthan',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 20,
          fontWeight: '700',
          color: '#FFC400',
          x: 40,
          y: 1018,
          width: 1000,
          textAlign: 'center'
        }
      ]
    }
  },

  // 6. SPORTS NEWS (High-energy, Bold typography)
  {
    id: 'tmpl_sports_news',
    name: 'Sports News (खेल समाचार)',
    category: 'SPORTS',
    aspectRatio: '1:1',
    description: 'Dynamic sports news layout with energetic highlights and yellow accents',
    data: {
      width: 1080,
      height: 1080,
      backgroundColor: '#0B1340',
      elements: [
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 0,
          width: 1080,
          height: 110,
          fillColor: '#17237F'
        },
        {
          type: 'image',
          name: 'Brand Logo',
          src: 'assets/lokupdate-logo-transparent.png',
          x: 40,
          y: 12,
          width: 200,
          height: 85,
          fitMode: 'contain',
          isLogo: true
        },
        {
          type: 'shape',
          shapeType: 'pill',
          x: 780,
          y: 30,
          width: 260,
          height: 50,
          fillColor: '#FFC400'
        },
        {
          type: 'text',
          name: 'Sports Badge',
          text: '🏆 खेल जगत',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 20,
          fontWeight: '900',
          color: '#0B1340',
          x: 790,
          y: 42,
          width: 240,
          textAlign: 'center'
        },
        // Photo
        {
          type: 'image',
          name: 'Match Photo',
          src: 'assets/samples/sports-arena.jpg',
          x: 40,
          y: 135,
          width: 1000,
          height: 480,
          fitMode: 'cover',
          borderRadius: 14,
          borderColor: '#FFC400',
          borderWidth: 3
        },
        // Headline
        {
          type: 'text',
          name: 'Sports Headline',
          text: 'राजस्थान के होनहार खिलाड़ी ने राष्ट्रीय एथलेटिक्स चैंपियनशिप में जीता गोल्ड मेडल!',
          fontFamily: 'Rozha One',
          fontSize: 42,
          fontWeight: '800',
          lineHeight: 1.25,
          color: '#FFFFFF',
          x: 40,
          y: 645,
          width: 1000,
          textAlign: 'left',
          isHeadline: true
        },
        // Summary
        {
          type: 'text',
          name: 'Sports Details',
          text: 'शानदार प्रदर्शन के साथ तोड़ा 5 साल पुराना रिकॉर्ड। प्रदेशभर में खुशी की लहर, खेल मंत्री ने दी बधाई।',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 23,
          fontWeight: '500',
          lineHeight: 1.45,
          color: '#CBD5E1',
          x: 40,
          y: 810,
          width: 1000,
          textAlign: 'left'
        },
        // Footer Bar
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 980,
          width: 1080,
          height: 100,
          fillColor: '#FFC400'
        },
        {
          type: 'text',
          name: 'Footer',
          text: 'LOKUPDATE RAJASTHAN SPORTS  •  खेल की हर रोमांचक खबर',
          fontFamily: 'Poppins',
          fontSize: 20,
          fontWeight: '800',
          color: '#0B1340',
          x: 40,
          y: 1018,
          width: 1000,
          textAlign: 'center'
        }
      ]
    }
  },

  // 7. WEATHER NEWS (Rajasthan Weather Alert)
  {
    id: 'tmpl_weather_news',
    name: 'Weather News (मौसम अलर्ट)',
    category: 'WEATHER',
    aspectRatio: '1:1',
    description: 'Rajasthan weather bulletin with alert badge and temperature highlights',
    data: {
      width: 1080,
      height: 1080,
      backgroundColor: '#0F172A',
      elements: [
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 0,
          width: 1080,
          height: 110,
          fillColor: '#17237F'
        },
        {
          type: 'image',
          name: 'Brand Logo',
          src: 'assets/lokupdate-logo-transparent.png',
          x: 40,
          y: 12,
          width: 200,
          height: 85,
          fitMode: 'contain',
          isLogo: true
        },
        {
          type: 'shape',
          shapeType: 'pill',
          x: 770,
          y: 30,
          width: 270,
          height: 50,
          fillColor: '#FFC400'
        },
        {
          type: 'text',
          name: 'Weather Badge',
          text: '⛅ मौसम चेतावनी',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 19,
          fontWeight: '800',
          color: '#0B1340',
          x: 780,
          y: 43,
          width: 250,
          textAlign: 'center'
        },
        // Photo
        {
          type: 'image',
          name: 'Weather Photo',
          src: 'assets/samples/weather-radar.jpg',
          x: 40,
          y: 135,
          width: 1000,
          height: 480,
          fitMode: 'cover',
          borderRadius: 14,
          borderColor: '#38BDF8',
          borderWidth: 2
        },
        // Headline
        {
          type: 'text',
          name: 'Weather Headline',
          text: 'राजस्थान में बदला मौसम का मिजाज: जयपुर, अजमेर और बीकानेर समेत 12 जिलों में बारिश का येलो अलर्ट!',
          fontFamily: 'Rozha One',
          fontSize: 40,
          fontWeight: '800',
          lineHeight: 1.25,
          color: '#38BDF8',
          x: 40,
          y: 645,
          width: 1000,
          textAlign: 'left',
          isHeadline: true
        },
        // Details
        {
          type: 'text',
          name: 'Forecast Summary',
          text: 'मौसम विभाग के अनुसार आगामी 48 घंटों में तेज हवाओं के साथ बारिश और ओलावृष्टि की संभावना। तापमान में 4 से 6 डिग्री की गिरावट।',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 23,
          fontWeight: '500',
          lineHeight: 1.45,
          color: '#E2E8F0',
          x: 40,
          y: 810,
          width: 1000,
          textAlign: 'left'
        },
        // Footer Bar
        {
          type: 'shape',
          shapeType: 'rect',
          x: 0,
          y: 980,
          width: 1080,
          height: 100,
          fillColor: '#1E293B',
          strokeColor: '#38BDF8',
          strokeWidth: 2
        },
        {
          type: 'text',
          name: 'Footer',
          text: 'LOKUPDATE RAJASTHAN  •  मौसम की हर पल की सटीक रिपोर्ट',
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 20,
          fontWeight: '700',
          color: '#38BDF8',
          x: 40,
          y: 1018,
          width: 1000,
          textAlign: 'center'
        }
      ]
    }
  }
];

window.PREBUILT_TEMPLATES = PREBUILT_TEMPLATES;
