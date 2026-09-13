const CHAPTERS = {
  '/music': {
    date: 'c. 1981–present'
  },
  '/media/surreal': {
    date: 'c. 1997–2000',
    references: [
      { brand: 'The Gathering', label: 'The Gathering archives', href: 'https://thegathering.co.nz/', detail: 'New Zealand electronic-music history and archive.' },
      { brand: 'NZ History', label: 'First Gathering · 1996', href: 'https://nzhistory.govt.nz/first-gathering-dance-festival-held', detail: 'Manatū Taonga record of Murray Kingi and the first Gathering.' }
    ]
  },
  '/career/hotel-dynamics': {
    date: 'c. 2005–2006',
    references: [
      { brand: 'Hilton', label: 'Hilton Hotels & Resorts', href: 'https://www.hilton.com/', detail: 'One of the hotel brands connected to the membership programmes.', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/HiltonHotelsLogo.svg' },
      { brand: 'Millennium', label: 'Millennium Hotels & Resorts', href: 'https://www.millenniumhotels.com/en/', detail: 'Official hotel-group site covering Millennium, Copthorne and Kingsgate.' }
    ]
  },
  '/career/compass': {
    date: 'c. 2007',
    references: [
      { brand: 'Compass', label: 'Compass Communications', href: 'https://compass.net.nz/', detail: 'Official New Zealand telecommunications site.' },
      { brand: 'ALT TV', label: 'ALT TV public record', href: 'https://natlib.govt.nz/records/22571219', detail: 'National Library record for the Auckland music television station.' }
    ]
  },
  '/career/hrv': {
    date: 'c. 2007–2009',
    references: [
      { brand: 'HRV', label: 'HRV New Zealand', href: 'https://www.hrv.co.nz/', detail: 'Official HRV New Zealand site.' },
      { brand: 'Deloitte', label: 'Deloitte Fast 50', href: 'https://www.deloitte.com/nz/en/services/deloitte-private/services/fast-50-index-deloitte-fast-50.html', detail: 'Official Fast 50 index and programme archive.' }
    ]
  },
  '/media/alt-tv': {
    date: 'c. 2007–2009',
    references: [
      { brand: 'ALT TV', label: 'ALT TV · National Library', href: 'https://natlib.govt.nz/records/22571219', detail: 'National Library record: ALT TV aired nationally during 2006–2009.' },
      { brand: 'George FM', label: 'George FM', href: 'https://www.georgefm.co.nz/', detail: 'The Auckland dance-music station co-founded by Thane Kirby.' }
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Auckland_Karangahape_Road.jpg',
      href: 'https://commons.wikimedia.org/wiki/File:Auckland_Karangahape_Road.jpg',
      alt: 'Karangahape Road in Auckland photographed in 2006',
      caption: 'Karangahape Road, Auckland, photographed in 2006. Context image, not the specific nightclub. Public-domain image via Wikimedia Commons.'
    }
  },
  '/career/red-vs-blue': {
    date: 'c. 2008–2009',
    references: [
      { brand: 'Counter-Strike', label: 'Counter-Strike', href: 'https://www.counter-strike.net/', detail: 'One of the games I remember dominating the centre.' },
      { brand: 'World of Warcraft', label: 'World of Warcraft', href: 'https://worldofwarcraft.blizzard.com/', detail: 'Another major part of the gaming-centre crowd.' },
      { brand: 'IMVU', label: 'IMVU', href: 'https://www.imvu.com/', detail: 'The online community experience I brought into the chapter.' }
    ]
  },
  '/career/mojo-marketing': {
    date: '2008–2013',
    references: [
      { brand: 'MOJO', label: 'Mojo Marketing Limited · company record', href: 'https://www.companyhub.nz/companyDetails.cfm?nzbn=9429032628654', detail: 'Public company information sourced from the New Zealand Companies Office.' }
    ]
  },
  '/career/christchurch-directory': {
    date: 'c. 2009–2011',
    references: [
      { brand: 'NZ History', label: 'Canterbury earthquakes', href: 'https://nzhistory.govt.nz/keyword/canterbury-earthquake', detail: 'Public historical context for the 2010–11 disruption that ended this Christchurch phase.' }
    ]
  },
  '/media/pulzarfm': {
    date: 'c. 2010–2011',
    references: [
      { brand: 'PulzarFM', label: 'PulzarFM public profile', href: 'https://en.wikipedia.org/wiki/Pulzar_FM', detail: 'Station history, frequencies and the December 2011 shutdown.' },
      { brand: 'RDU', label: 'RDU 98.5FM', href: 'https://rdu.org.nz/', detail: 'Christchurch independent radio and music-scene context.' }
    ]
  },
  '/career/funk-and-fish-and-chips': {
    date: 'c. 2010–2011',
    references: [
      { brand: 'NZ History', label: 'Christchurch earthquake · 2011', href: 'https://nzhistory.govt.nz/page/christchurch-earthquake-kills-185', detail: 'Historical context for the earthquake that ended the business.' }
    ]
  },
  '/career/0199': {
    date: '2011–c. 2016',
    references: [
      { brand: '0199', label: '0199 Limited · company record', href: 'https://www.nzlbusiness.com/company/struck-off/01992012-Limited', detail: 'Public record showing incorporation in Wellington in February 2012.' },
      { brand: 'NZ Gazette', label: 'New Zealand Gazette record', href: 'https://gazette.govt.nz/notice/id/2013-ds2224', detail: 'Official government company notice.' },
      { brand: 'NZ History', label: 'Christchurch earthquake · 2011', href: 'https://nzhistory.govt.nz/page/christchurch-earthquake-kills-185', detail: 'Context for the move out of Christchurch before the Wellington operation.' }
    ],
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Wellington_waterfront_-_Paul_Moss.jpg',
      href: 'https://commons.wikimedia.org/wiki/File:Wellington_waterfront_-_Paul_Moss.jpg',
      alt: 'Wellington waterfront',
      caption: 'Wellington, where the 0199 call-centre operation took shape after the Christchurch move. Context image, not the office itself. Public-domain image via Wikimedia Commons.'
    }
  },
  '/career/real-websites': {
    date: '2013–c. 2016',
    references: [
      { brand: 'REAL WEBSITES', label: 'Real Websites Limited · company record', href: 'https://www.companyhub.nz/companyDetails.cfm?nzbn=9429030072596', detail: 'Public company information sourced from the New Zealand Companies Office; registered September 2013.' }
    ]
  },
  '/america-first': {
    date: '2024–present',
    references: [
      { brand: 'AMERICA FIRST', label: 'America First Limited · company record', href: 'https://www.companyhub.nz/companyDetails.cfm?nzbn=9429052326752', detail: 'Public company information sourced from the New Zealand Companies Office; registered September 2024.' },
      { brand: 'AFNZ', label: 'America First Limited', href: 'https://americafirst.co.nz/about', detail: 'Current company site.' }
    ]
  },
  '/grid-eater': {
    date: '2026–present',
    references: [
      { brand: 'GRID EATER', label: 'GRID EATER', href: 'https://grideater.com/about', detail: 'Current hosting, domains, websites and New Zealand business-directory project.' }
    ]
  }
};

const CAREER_TIMELINE = [
  ['c. 1991–1998', 'Hospitality', '/career/hospitality/'],
  ['c. 1997–2000', 'Surreal events', '/media/surreal/'],
  ['c. 2005–2006', 'Hotel Dynamics Group', '/career/hotel-dynamics/'],
  ['2006', 'TelstraClear', '/career/telstraclear/'],
  ['c. 2007', 'Compass Communications', '/career/compass/'],
  ['c. 2007–2009', 'HRV', '/career/hrv/'],
  ['c. 2007–2009', 'ALT TV / ALT After Dark', '/media/alt-tv/'],
  ['c. 2008–2009', 'Red Vs Blue Gaming Centre', '/career/red-vs-blue/'],
  ['2008–2013', 'Mojo Marketing Limited', '/career/mojo-marketing/'],
  ['c. 2009–2011', 'Christchurch directory work', '/career/christchurch-directory/'],
  ['c. 2010–2011', 'PulzarFM After Dark', '/media/pulzarfm/'],
  ['c. 2010–2011', 'Funk & Fish & Chips', '/career/funk-and-fish-and-chips/'],
  ['2011–c. 2016', '0199 / directory assistance', '/career/0199/'],
  ['2013–c. 2016', 'Real Websites Limited', '/career/real-websites/'],
  ['2013', 'Pākehā Party', '/my-account/#pakeha-party'],
  ['2024–present', 'America First Limited', '/america-first/'],
  ['2026–present', 'GRID EATER', '/grid-eater/']
];

const MEDIA_TIMELINE = [
  ['c. 1997–2000', 'Surreal', '/media/surreal/'],
  ['c. 2007–2009', 'ALT TV / ALT After Dark', '/media/alt-tv/'],
  ['c. 2010–2011', 'PulzarFM After Dark', '/media/pulzarfm/'],
  ['1980s–present', 'Life in music', '/music/']
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderReferenceCard(reference) {
  const visual = reference.logo
    ? `<img src="${escapeHtml(reference.logo)}" alt="${escapeHtml(reference.brand)} logo" loading="lazy" decoding="async">`
    : `<span class="history-wordmark">${escapeHtml(reference.brand)}</span>`;

  return `<article class="history-reference-card"><a href="${escapeHtml(reference.href)}" target="_blank" rel="noopener"><div class="history-reference-visual">${visual}</div><div class="history-reference-copy"><strong>${escapeHtml(reference.label)}</strong><span>${escapeHtml(reference.detail)}</span></div></a></article>`;
}

function renderEvidence(chapter) {
  if (!chapter.references?.length && !chapter.image) return '';
  const cards = (chapter.references || []).map(renderReferenceCard).join('');
  const image = chapter.image
    ? `<figure class="history-context-photo"><a href="${escapeHtml(chapter.image.href)}" target="_blank" rel="noopener"><img src="${escapeHtml(chapter.image.src)}" alt="${escapeHtml(chapter.image.alt)}" loading="lazy" decoding="async"></a><figcaption>${escapeHtml(chapter.image.caption)}</figcaption></figure>`
    : '';

  return `<section class="section history-evidence" aria-label="References and historical context"><div class="eyebrow">References &amp; historical context</div><div class="history-evidence-layout"><div class="history-reference-grid">${cards}</div>${image}</div><p class="history-evidence-note">External references are provided for chronology and context. They do not imply endorsement, employment verification or a commercial relationship beyond what the chapter itself describes.</p></section>`;
}

function renderTimeline(items, title) {
  const rows = items.map(([date, label, href]) => `<a class="history-timeline-item" href="${href}"><span class="history-timeline-date">${escapeHtml(date)}</span><span class="history-timeline-label">${escapeHtml(label)}</span></a>`).join('');
  return `<section class="section history-timeline" aria-label="Reconstructed chronology"><div class="eyebrow">Reconstructed chronology</div><h2>${escapeHtml(title)}</h2><p class="history-timeline-intro">Dates marked <strong>c.</strong> are deliberately approximate. They are reconstructed from surviving public records and the sequence in my own account, and I will tighten them as earlier records surface.</p><div class="history-timeline-grid">${rows}</div></section>`;
}

class AppendDateHandler {
  constructor(date) { this.date = date; }
  element(element) { element.append(` · ${escapeHtml(this.date)}`, { html: true }); }
}

class AfterHtmlHandler {
  constructor(html) { this.html = html; }
  element(element) { element.after(this.html, { html: true }); }
}

export function applyChapterEnhancements(rewriter, pathname) {
  const chapter = CHAPTERS[pathname];
  if (chapter) {
    if (chapter.date) {
      rewriter = rewriter.on('.page-head .eyebrow', new AppendDateHandler(chapter.date));
    }
    const evidence = renderEvidence(chapter);
    if (evidence) {
      rewriter = rewriter.on('.page-head', new AfterHtmlHandler(evidence));
    }
  }

  if (pathname === '/career') {
    rewriter = rewriter.on('.page-head', new AfterHtmlHandler(renderTimeline(CAREER_TIMELINE, 'The working career timeline.')));
  }

  if (pathname === '/media') {
    rewriter = rewriter.on('.page-head', new AfterHtmlHandler(renderTimeline(MEDIA_TIMELINE, 'Media, events and music in sequence.')));
  }

  return rewriter;
}
