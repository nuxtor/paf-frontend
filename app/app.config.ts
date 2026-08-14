export default defineAppConfig({
  siteName: 'Premium Abrahamic Foods',
  siteTagline: 'The Premium Halal Food',
  contact: {
    email: 'info@premiumabrahamicfoods.co.uk',
    phone: '+44 123 456 7890',
    // Defined once here so the footer and the contact page cannot disagree.
    address: {
      line1: '251 Ilford Lane',
      city: 'Ilford',
      county: 'Essex',
      postcode: 'IG1 2SB',
    },
  },
  social: {
    facebook: 'https://facebook.com/premiumabrahimicfoods',
    instagram: 'https://instagram.com/premiumabrahimicfoods',
    twitter: 'https://twitter.com/paborahimicfoods',
  },
  home: {
    // Drop a 9:16 clip in public/videos/ and name it here, and it appears
    // beside the welcome copy. Left empty the section renders as a single
    // centred column, so a missing file is never a broken player on the page.
    welcomeVideo: '/videos/welcome-farm-to-fork.mp4',
    // Shown before the clip loads and while it is paused. Worth setting: a
    // portrait card is a large hole to leave black on a slow connection.
    welcomeVideoPoster: '/images/welcome-video-poster.jpg',
  },
  freeDeliveryThreshold: 50,
})
