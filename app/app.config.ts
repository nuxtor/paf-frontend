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
  freeDeliveryThreshold: 50,
})
