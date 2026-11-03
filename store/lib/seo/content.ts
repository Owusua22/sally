// lib/seo/content.ts
// Reusable editorial copy that feeds structured data and on-page FAQ blocks.
// Keeping it here means the copy, the JSON-LD and the visible text never drift.

import { site } from '@/lib/site';

export interface Faq {
  question: string;
  answer: string;
}

export const HOME_FAQS: Faq[] = [
  {
    question: 'Are your skincare products authentic?',
    answer: `Yes. Every product at ${site.nameFull} is bought from the brand or its authorised Ghanaian distributor, and each item keeps its original seal and batch number. We do not repackage or decant products.`,
  },
  {
    question: 'Where is the shop located?',
    answer: `We are in ${site.address} — beside ${site.landmark}. You can order online for delivery or choose store pickup at checkout.`,
  },
  {
    question: 'How long does delivery take?',
    answer: 'Orders placed before 2:00 PM are dispatched the same day. Greater Accra and Nsawam usually arrive within 24 hours; Kumasi, Takoradi, Tamale and other regional capitals take 2–4 business days.',
  },
  {
    question: 'How much is delivery?',
    answer: `Delivery starts from GH₵15 depending on your town, and it is free on orders over ${site.currencySymbol}${site.freeDeliveryThreshold}. The exact fee for your area is shown at checkout before you pay.`,
  },
  {
    question: 'Can I pay when my order arrives?',
    answer: 'Yes. Choose Cash on Delivery or Mobile Money at checkout and pay the rider when your parcel arrives. Card payment instructions can also be sent on request.',
  },
  {
    question: 'Do I need an account to order?',
    answer: 'Yes — create a free account or sign in before adding items to your basket. It lets us save your address, track your order and send delivery updates.',
  },
  {
    question: 'What is your return policy?',
    answer: `Report any damaged, wrong or unsealed item within ${site.policy.exchangeWindowHours} hours of delivery and we will exchange it or refund you. For safety and hygiene, opened skincare and baby products can only be returned if faulty.`,
  },
];

export const PRODUCT_FAQS: Faq[] = [
  {
    question: 'How do I know the product suits my skin?',
    answer:
      'Check the skin-type and concern tags on each product page, or WhatsApp us a photo of your current routine and we will point you to the right shelf before you buy.',
  },
  {
    question: 'Can I collect my order from the shop?',
    answer: `Yes. Choose "Pick up" at checkout and collect from ${site.address} during opening hours.`,
  },
];

/** Short, crawlable summaries used by meta descriptions and section intros. */
export const DELIVERY_COPY = `We deliver nationwide from ${site.town}, Nsawam. Same-day dispatch on orders placed before ${site.policy.sameDayCutoff}, and free delivery on baskets over ${site.currencySymbol}${site.freeDeliveryThreshold}.`;
