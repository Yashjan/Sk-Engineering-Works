export const companyContact = {
  phoneDisplay: "+91 98284 60532",
  phoneHref: "tel:+919828460532",
  whatsappNumber: "919828460532",
  addressLines: ["Nawa Road, Sambhar Lake – 303604", "Dist. Jaipur, Rajasthan"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=S.K.%20Engineering%20Works%2C%20Nawa%20Road%2C%20Sambhar%20Lake%2C%20Rajasthan",
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${companyContact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
