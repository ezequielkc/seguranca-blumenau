// ===================== ANALYTICS E TRACKING =====================

// Função para inicializar analytics (Google Analytics, Facebook Pixel, etc.)
function initAnalytics() {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('init', 'FB_PIXEL_ID');
    fbq('track', 'PageView');
  }
}

// Tracking de eventos importantes
function trackEvent(eventName, eventData = {}) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, eventData);
  }
  
  // Console log para desenvolvimento
  console.log('Event tracked:', eventName, eventData);
}

// Tracking de cliques em botões importantes
function trackButtonClicks() {
  const importantButtons = document.querySelectorAll('.btn-modern-primary, .contact-method-card a');
  
  importantButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const buttonText = this.textContent.trim();
      const buttonHref = this.href || '';
      
      trackEvent('button_click', {
        button_text: buttonText,
        button_url: buttonHref,
        page_location: window.location.pathname
      });
    });
  });
}

// Tracking de scroll para seções importantes
function trackScrollDepth() {
  const sections = document.querySelectorAll('section[id]');
  const viewedSections = new Set();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !viewedSections.has(entry.target.id)) {
        viewedSections.add(entry.target.id);
        
        trackEvent('section_view', {
          section_id: entry.target.id,
          section_name: entry.target.querySelector('h2')?.textContent || entry.target.id
        });
      }
    });
  }, { threshold: 0.5 });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Tracking de tempo na página
function trackTimeOnPage() {
  const startTime = Date.now();
  
  window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    trackEvent('time_on_page', {
      time_spent_seconds: timeSpent,
      page_location: window.location.pathname
    });
  });
}

// Inicializar tracking quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar analytics
  initAnalytics();
  
  // Configurar tracking de eventos
  trackButtonClicks();
  trackScrollDepth();
  trackTimeOnPage();
  
  // Tracking de cliques em links externos
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  externalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      trackEvent('external_link_click', {
        link_url: this.href,
        link_text: this.textContent.trim()
      });
    });
  });
});

// Função para configurar Google Analytics
function setupGoogleAnalytics(measurementId) {
  // Carregar Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', measurementId);
}

// Função para configurar Facebook Pixel
function setupFacebookPixel(pixelId) {
  // Carregar Facebook Pixel
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  fbq('init', pixelId);
  fbq('track', 'PageView');
} 