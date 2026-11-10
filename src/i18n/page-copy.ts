import type { Locale } from "./config";

type PageCopy = { title: string; description: string };
type PageKey = "home" | "salt" | "machinery" | "projects" | "engineering" | "about" | "contact";

const pageCopy: Record<Locale, Record<PageKey, PageCopy>> = {
  en: {
    home: { title: "S.K. Engineering Works | Industrial Machinery & Salt Refinery Plants", description: "Industrial process equipment, material handling systems and complete salt refinery plants engineered and fabricated by S.K. Engineering Works in Rajasthan." },
    salt: { title: "Complete Salt Refinery Plants & Engineering", description: "Complete salt refinery plants by S.K. Engineering Works: process planning, machinery fabrication, equipment integration and installation, from Sambhar Lake, Rajasthan." },
    machinery: { title: "Industrial Machinery & Process Equipment", description: "Industrial machinery for material handling, milling, air and dust handling, screening, separation and process applications." },
    projects: { title: "Industrial & Salt Refinery Projects", description: "Real S.K. Engineering Works projects across salt refinery plants, machinery, material handling and industrial equipment." },
    engineering: { title: "Plant Engineering & Industrial Layout Planning", description: "Industrial plant engineering, 2D layouts, equipment arrangement and site-specific planning by S.K. Engineering Works." },
    about: { title: "About S.K. Engineering Works", description: "Learn about S.K. Engineering Works, its manufacturing journey, engineering capability and salt refinery experience." },
    contact: { title: "Contact S.K. Engineering Works", description: "Discuss industrial machinery, salt refinery plants, engineering, fabrication and installation requirements with S.K. Engineering Works." }
  },
  hi: {
    home: { title: "S.K. Engineering Works | औद्योगिक मशीनरी और नमक रिफाइनरी संयंत्र", description: "राजस्थान में S.K. Engineering Works द्वारा अभिकल्पित और निर्मित औद्योगिक प्रक्रिया उपकरण, सामग्री प्रबंधन प्रणालियाँ और संपूर्ण नमक रिफाइनरी संयंत्र।" },
    salt: { title: "संपूर्ण नमक रिफाइनरी संयंत्र और इंजीनियरिंग", description: "S.K. Engineering Works के संपूर्ण नमक रिफाइनरी संयंत्र: प्रक्रिया योजना, मशीनरी निर्माण, उपकरण एकीकरण और स्थापना, Sambhar Lake, राजस्थान से।" },
    machinery: { title: "औद्योगिक मशीनरी और प्रक्रिया उपकरण", description: "सामग्री प्रबंधन, मिलिंग, वायु और धूल नियंत्रण, स्क्रीनिंग, पृथक्करण और प्रक्रिया अनुप्रयोगों के लिए औद्योगिक मशीनरी।" },
    projects: { title: "औद्योगिक और नमक रिफाइनरी परियोजनाएँ", description: "नमक रिफाइनरी संयंत्रों, मशीनरी, सामग्री प्रबंधन और औद्योगिक उपकरणों में S.K. Engineering Works की वास्तविक परियोजनाएँ।" },
    engineering: { title: "संयंत्र इंजीनियरिंग और औद्योगिक लेआउट योजना", description: "S.K. Engineering Works द्वारा औद्योगिक संयंत्र इंजीनियरिंग, 2D लेआउट, उपकरण व्यवस्था और साइट-विशिष्ट योजना।" },
    about: { title: "S.K. Engineering Works के बारे में", description: "S.K. Engineering Works की निर्माण यात्रा, इंजीनियरिंग क्षमता और नमक रिफाइनरी अनुभव के बारे में जानें।" },
    contact: { title: "S.K. Engineering Works से संपर्क करें", description: "औद्योगिक मशीनरी, नमक रिफाइनरी संयंत्र, इंजीनियरिंग, निर्माण और स्थापना आवश्यकताओं पर चर्चा करें।" }
  },
  ar: {
    home: { title: "S.K. Engineering Works | الآلات الصناعية ومصانع تكرير الملح", description: "معدات العمليات الصناعية وأنظمة مناولة المواد ومصانع تكرير الملح المتكاملة، من تصميم وتصنيع S.K. Engineering Works في راجستان." },
    salt: { title: "مصانع تكرير الملح المتكاملة والهندسة", description: "مصانع تكرير ملح متكاملة من S.K. Engineering Works: تخطيط العمليات وتصنيع الآلات وتكامل المعدات والتركيب، من Sambhar Lake في راجستان." },
    machinery: { title: "الآلات الصناعية ومعدات العمليات", description: "آلات صناعية لمناولة المواد والطحن ومعالجة الهواء والغبار والغربلة والفصل وتطبيقات العمليات." },
    projects: { title: "المشاريع الصناعية ومشاريع تكرير الملح", description: "مشاريع حقيقية من S.K. Engineering Works في مصانع تكرير الملح والآلات ومناولة المواد والمعدات الصناعية." },
    engineering: { title: "هندسة المصانع وتخطيط المواقع الصناعية", description: "هندسة المصانع والمخططات ثنائية الأبعاد وترتيب المعدات والتخطيط المخصص للموقع من S.K. Engineering Works." },
    about: { title: "عن S.K. Engineering Works", description: "تعرف على مسيرة التصنيع والقدرات الهندسية وخبرة تكرير الملح لدى S.K. Engineering Works." },
    contact: { title: "اتصل بـ S.K. Engineering Works", description: "ناقش متطلبات الآلات الصناعية ومصانع تكرير الملح والهندسة والتصنيع والتركيب مع S.K. Engineering Works." }
  }
};

export function getPageCopy(locale: Locale, key: PageKey) {
  return pageCopy[locale][key];
}

