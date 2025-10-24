// Google Analytics 4 Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class AnalyticsService {
  private isInitialized = false;
  private trackingId: string;

  constructor(trackingId: string = 'G-XXXXXXXXXX') {
    this.trackingId = trackingId;
  }

  // Initialize Google Analytics
  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.trackingId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.isInitialized = true;
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId, {
      page_path: path,
      page_title: title || document.title,
    });
  }

  // Track events
  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Track conversions
  trackConversion(conversionId: string, value?: number, currency: string = 'BRL') {
    if (!this.isInitialized) return;

    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
    });
  }

  // Track custom events for our platform
  trackPlanView(planId: string) {
    this.trackEvent('view_plan', 'engagement', planId);
  }

  trackPlanClick(planId: string) {
    this.trackEvent('click_plan', 'engagement', planId);
  }

  trackCheckoutStart(planId: string, value: number) {
    this.trackEvent('begin_checkout', 'ecommerce', planId, value);
  }

  trackPaymentMethod(method: 'credit_card' | 'pix') {
    this.trackEvent('select_payment_method', 'ecommerce', method);
  }

  trackPurchase(orderId: string, planId: string, value: number) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: value,
      currency: 'BRL',
      items: [{
        item_id: planId,
        item_name: `Plano ${planId}`,
        category: 'subscription',
        quantity: 1,
        price: value,
      }]
    });
  }

  trackBotInteraction(action: string, intent?: string) {
    this.trackEvent('bot_interaction', 'engagement', `${action}_${intent || 'unknown'}`);
  }

  trackFormSubmit(formType: string) {
    this.trackEvent('form_submit', 'engagement', formType);
  }

  trackVideoPlay(videoId: string) {
    this.trackEvent('video_play', 'engagement', videoId);
  }

  trackDownload(fileName: string) {
    this.trackEvent('file_download', 'engagement', fileName);
  }

  trackSearch(searchTerm: string) {
    this.trackEvent('search', 'engagement', searchTerm);
  }

  trackSocialShare(platform: string, url: string) {
    this.trackEvent('share', 'social', `${platform}_${url}`);
  }

  // Track user properties
  setUserProperty(property: string, value: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId, {
      custom_map: { [property]: value }
    });
  }

  // Track user ID for cross-device tracking
  setUserId(userId: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId, {
      user_id: userId
    });
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// Facebook Pixel Integration
class FacebookPixelService {
  private isInitialized = false;
  private pixelId: string;

  constructor(pixelId: string = 'XXXXXXXXXXXXXXXXX') {
    this.pixelId = pixelId;
  }

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Load Facebook Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    this.isInitialized = true;
  }

  track(event: string, parameters?: any) {
    if (!this.isInitialized || typeof window === 'undefined') return;
    
    (window as any).fbq('track', event, parameters);
  }

  trackPurchase(value: number, currency: string = 'BRL') {
    this.track('Purchase', { value, currency });
  }

  trackLead() {
    this.track('Lead');
  }

  trackAddToCart(value: number) {
    this.track('AddToCart', { value, currency: 'BRL' });
  }

  trackInitiateCheckout(value: number) {
    this.track('InitiateCheckout', { value, currency: 'BRL' });
  }
}

export const facebookPixel = new FacebookPixelService();

// Heat mapping and session recording (Hotjar-like)
class HeatmapService {
  private isInitialized = false;
  private siteId: string;

  constructor(siteId: string = 'XXXXXXX') {
    this.siteId = siteId;
  }

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Load Hotjar or similar service
    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${this.siteId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);

    this.isInitialized = true;
  }

  // Trigger events
  trigger(eventName: string) {
    if (!this.isInitialized || typeof window === 'undefined') return;
    
    (window as any).hj('trigger', eventName);
  }

  // Identify user
  identify(userId: string, attributes?: any) {
    if (!this.isInitialized || typeof window === 'undefined') return;
    
    (window as any).hj('identify', userId, attributes);
  }
}

export const heatmap = new HeatmapService();

// Initialize all analytics services
export function initializeAnalytics() {
  // Only initialize in production
  if (import.meta.env.PROD) {
    analytics.init();
    facebookPixel.init();
    heatmap.init();
  }
}

// Custom analytics for our platform
export const platformAnalytics = {
  // Track user journey
  trackUserJourney(step: string, metadata?: any) {
    analytics.trackEvent('user_journey', 'navigation', step);
    
    // Store in localStorage for funnel analysis
    const journey = JSON.parse(localStorage.getItem('userJourney') || '[]');
    journey.push({
      step,
      timestamp: new Date().toISOString(),
      metadata
    });
    localStorage.setItem('userJourney', JSON.stringify(journey));
  },

  // Track A/B tests
  trackABTest(testName: string, variant: string) {
    analytics.trackEvent('ab_test', 'experiment', `${testName}_${variant}`);
    analytics.setUserProperty('ab_test_' + testName, variant);
  },

  // Track performance metrics
  trackPerformance() {
    if (typeof window === 'undefined') return;

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      analytics.trackEvent('page_load_time', 'performance', 'load', Math.round(loadTime));
    });

    // Track Core Web Vitals (commented out for now)
    // if ('web-vitals' in window) {
    //   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //     getCLS((metric) => analytics.trackEvent('web_vital', 'performance', 'CLS', metric.value));
    //     getFID((metric) => analytics.trackEvent('web_vital', 'performance', 'FID', metric.value));
    //     getFCP((metric) => analytics.trackEvent('web_vital', 'performance', 'FCP', metric.value));
    //     getLCP((metric) => analytics.trackEvent('web_vital', 'performance', 'LCP', metric.value));
    //     getTTFB((metric) => analytics.trackEvent('web_vital', 'performance', 'TTFB', metric.value));
    //   });
    // }
  },

  // Track errors
  trackError(error: Error, context?: string) {
    analytics.trackEvent('javascript_error', 'error', `${context || 'unknown'}: ${error.message}`);
  },

  // Track feature usage
  trackFeatureUsage(feature: string, action: string) {
    analytics.trackEvent('feature_usage', feature, action);
  }
};

// Error boundary integration
export function setupErrorTracking() {
  window.addEventListener('error', (event) => {
    platformAnalytics.trackError(event.error, 'global_error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    platformAnalytics.trackError(new Error(event.reason), 'unhandled_promise');
  });
}