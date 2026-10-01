/**
 * LOKUPDATE RAJASTHAN - NEWS CREATIVE STUDIO
 * News Content Editor & Rapid Generator
 */

const NEWS_CATEGORIES = [
  'BREAKING NEWS',
  'RAJASTHAN NEWS',
  'JAIPUR NEWS',
  'INDIA NEWS',
  'POLITICS',
  'EDUCATION',
  'SPORTS',
  'BUSINESS',
  'WEATHER',
  'ENTERTAINMENT',
  'CRIME NEWS',
  'LOCAL NEWS'
];

class NewsContentEditor {
  constructor() {
    this.categories = [...NEWS_CATEGORIES];
    this.initCategories();
    this.bindEvents();
  }

  initCategories() {
    const select = document.getElementById('newsCategorySelect');
    if (!select) return;

    select.innerHTML = '';
    this.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    });

    const customOpt = document.createElement('option');
    customOpt.value = '__custom__';
    customOpt.textContent = '+ Custom Category...';
    select.appendChild(customOpt);
  }

  bindEvents() {
    const categorySelect = document.getElementById('newsCategorySelect');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          const customName = prompt('नई कैटेगरी का नाम दर्ज करें (Enter custom category name):');
          if (customName && customName.trim()) {
            const clean = customName.trim().toUpperCase();
            if (!this.categories.includes(clean)) {
              this.categories.push(clean);
              this.initCategories();
              categorySelect.value = clean;
            }
          } else {
            categorySelect.value = this.categories[0];
          }
        }
      });
    }

    // Auto-fill Current Date & Time button
    const btnNow = document.getElementById('btnSetCurrentDateTime');
    if (btnNow) {
      btnNow.addEventListener('click', () => {
        const now = new Date();
        const dateInput = document.getElementById('newsDateInput');
        const timeInput = document.getElementById('newsTimeInput');

        const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();

        if (dateInput) dateInput.value = `${day} ${month} ${year}`;
        if (timeInput) {
          let hours = now.getHours();
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          timeInput.value = `${hours}:${minutes} ${ampm}`;
        }
        if (window.showToast) window.showToast('वर्तमान दिनांक व समय सेट किया गया', 'info');
      });
    }

    // Apply News to Canvas Button
    const btnApply = document.getElementById('btnApplyNewsToCanvas');
    if (btnApply) {
      btnApply.addEventListener('click', () => {
        this.applyNewsToCanvas();
      });
    }

    // Load Sample News Data
    const btnSampleBreaking = document.getElementById('btnLoadSampleBreaking');
    if (btnSampleBreaking) {
      btnSampleBreaking.addEventListener('click', () => {
        this.populateForm({
          category: 'BREAKING NEWS',
          headline: 'राजस्थान में बड़ा प्रशासनिक फेरबदल: 35 IAS और 42 IPS अधिकारियों के तबादले जारी!',
          description: '• कार्मिक विभाग ने देर रात जारी किए आदेश, कई जिलों के बदले कलेक्टर व एसपी।\n• राजधानी जयपुर और जोधपुर में भी नए अधिकारियों की हुई तैनाती।',
          location: 'जयपुर',
          date: '02 अक्टूबर 2026',
          time: '01:30 PM',
          source: 'विशेष संवाददाता / LokUpdate Bureau',
          isBreaking: true
        });
      });
    }

    const btnSampleRajasthan = document.getElementById('btnLoadSampleRajasthan');
    if (btnSampleRajasthan) {
      btnSampleRajasthan.addEventListener('click', () => {
        this.populateForm({
          category: 'RAJASTHAN NEWS',
          headline: 'प्रदेश में सोलर ऊर्जा परियोजनाओं को मिली बड़ी मंजूरी, 50,000 युवाओं को मिलेगा रोजगार!',
          description: 'राज्य सरकार ने नई ऊर्जा नीति के तहत 5 बड़े सौर पार्कों की स्थापना को दी हरी झंडी। थार मरुस्थल बनेगा देश का ऊर्जा हब।',
          location: 'जोधपुर / बाड़मेर',
          date: '02 अक्टूबर 2026',
          time: '11:45 AM',
          source: 'LokUpdate State Desk',
          isBreaking: false
        });
      });
    }
  }

  populateForm(data) {
    if (document.getElementById('newsCategorySelect')) document.getElementById('newsCategorySelect').value = data.category;
    if (document.getElementById('newsHeadlineInput')) document.getElementById('newsHeadlineInput').value = data.headline;
    if (document.getElementById('newsDescriptionInput')) document.getElementById('newsDescriptionInput').value = data.description;
    if (document.getElementById('newsLocationInput')) document.getElementById('newsLocationInput').value = data.location;
    if (document.getElementById('newsDateInput')) document.getElementById('newsDateInput').value = data.date;
    if (document.getElementById('newsTimeInput')) document.getElementById('newsTimeInput').value = data.time;
    if (document.getElementById('newsSourceInput')) document.getElementById('newsSourceInput').value = data.source;
    if (document.getElementById('newsBreakingCheck')) document.getElementById('newsBreakingCheck').checked = data.isBreaking;
    if (window.showToast) window.showToast('सैंपल न्यूज़ डेटा लोड हुआ!', 'info');
  }

  applyNewsToCanvas() {
    if (!window.activeCanvasEngine) return;
    const engine = window.activeCanvasEngine;

    const category = document.getElementById('newsCategorySelect')?.value || 'BREAKING NEWS';
    const headline = document.getElementById('newsHeadlineInput')?.value || '';
    const description = document.getElementById('newsDescriptionInput')?.value || '';
    const location = document.getElementById('newsLocationInput')?.value || 'राजस्थान';
    const date = document.getElementById('newsDateInput')?.value || '';
    const time = document.getElementById('newsTimeInput')?.value || '';
    const isBreaking = document.getElementById('newsBreakingCheck')?.checked;

    if (!headline.trim()) {
      if (window.showToast) window.showToast('कृपया मुख्य शीर्षक (Headline) दर्ज करें!', 'warning');
      return;
    }

    // 1. Find existing headline element or create one
    let headlineEl = engine.elements.find(el => el.type === 'text' && (el.isHeadline || el.name.toLowerCase().includes('headline')));
    if (headlineEl) {
      headlineEl.text = headline;
    } else {
      headlineEl = new TextElement({
        name: 'Headline',
        text: headline,
        fontFamily: 'Rozha One',
        fontSize: 42,
        fontWeight: '800',
        color: engine.backgroundColor === '#FFFFFF' ? '#0B1340' : '#FFFFFF',
        x: 40,
        y: 640,
        width: engine.width - 80,
        isHeadline: true
      });
      engine.addElement(headlineEl);
    }

    // 2. Find description element or create one
    if (description.trim()) {
      let descEl = engine.elements.find(el => el.type === 'text' && (el.name.toLowerCase().includes('description') || el.name.toLowerCase().includes('summary')));
      if (descEl) {
        descEl.text = description;
      } else {
        descEl = new TextElement({
          name: 'News Description',
          text: description,
          fontFamily: 'Noto Sans Devanagari',
          fontSize: 24,
          fontWeight: '500',
          color: engine.backgroundColor === '#FFFFFF' ? '#334155' : '#E2E8F0',
          x: 40,
          y: headlineEl.y + headlineEl.height + 25,
          width: engine.width - 80
        });
        engine.addElement(descEl);
      }
    }

    // 3. Update Location Tag if exists
    let locEl = engine.elements.find(el => el.type === 'text' && el.name.toLowerCase().includes('location'));
    if (locEl) {
      locEl.text = `📍 ${location} ${date ? '| ' + date : ''}`;
    }

    // 4. Update Category Badge if exists
    let badgeEl = engine.elements.find(el => el.type === 'badge' || (el.type === 'text' && el.name.toLowerCase().includes('category')));
    if (badgeEl) {
      if (badgeEl.type === 'badge') {
        badgeEl.label = category;
        badgeEl.hindiLabel = isBreaking ? 'बड़ी खबर' : '';
      } else {
        badgeEl.text = category;
      }
    }

    engine.recordState();
    engine.render();
    if (window.showToast) window.showToast('कैनवास पर न्यूज़ अपडेट कर दी गई है!', 'success');
  }
}

window.NewsContentEditor = NewsContentEditor;
