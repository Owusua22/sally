// app/location/page.tsx
// Local-SEO landing page: where the shop is, when it is open and what
// delivery to each town costs.

import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, MapPin, MessageCircle, Package, Phone, Store, Truck } from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema, localBusinessSchema } from '@/lib/seo/jsonld';
import { HOME_FAQS } from '@/lib/seo/content';
import { getPublicShippingZones } from '@/lib/data/shipping';
import { formatCedis } from '@/lib/utils';
import { site } from '@/lib/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Visit our shop in East Doboro, Nsawam | Delivery areas & hours',
  description: `${site.nameFull} is at ${site.address}. See opening hours, delivery fees and estimated arrival times for every region we serve in Ghana.`,
  keywords: [
    'skincare shop East Doboro',
    'cosmetics shop Nsawam',
    'mothercare Nsawam',
    'baby products Doboro',
    'skincare near St. George’s Height',
    'delivery areas Ghana',
  ],
  alternates: { canonical: '/location' },
  openGraph: {
    title: 'Visit our shop in East Doboro, Nsawam',
    description: `Opening hours, directions and delivery fees for ${site.nameFull}.`,
    url: '/location',
    type: 'website',
  },
};

export default async function LocationPage() {
  const zones = await getPublicShippingZones();

  const byRegion = zones.reduce<Record<string, typeof zones>>((acc, zone) => {
    (acc[zone.region] ||= []).push(zone);
    return acc;
  }, {});

  const deliveryFaqs = HOME_FAQS.filter((faq) =>
    /delivery|collect|return/i.test(faq.question)
  );

  return (
    <>
      <JsonLd
        id="location"
        data={[
          localBusinessSchema(),
          faqSchema(deliveryFaqs.length > 0 ? deliveryFaqs : HOME_FAQS),
          breadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Shop location & delivery', href: '/location' },
          ]),
        ]}
      />

      <div className="container-page py-8 sm:py-12">
        <header className="max-w-3xl">
          <p className="eyebrow">Find us</p>
          <h1 className="mt-2 font-display text-[30px] font-bold leading-tight text-ink sm:text-[40px]">
            Our shop in East Doboro, Nsawam
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            We are beside {site.landmark} in {site.town}. Walk in to test textures and
            shades before you buy, or order online and we will bring it to you.
          </p>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Contact card */}
          <div className="space-y-4">
            <div className="rounded-[26px] border border-line bg-surface p-6">
              <h2 className="font-display text-[19px] font-bold text-ink">Shop details</h2>

              <dl className="mt-4 space-y-3.5 text-[13px]">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="font-bold text-ink">Address</dt>
                    <dd className="text-muted">{site.address}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="font-bold text-ink">Phone &amp; WhatsApp</dt>
                    <dd>
                      <a
                        href={`tel:${site.phone}`}
                        className="text-accent-deep underline underline-offset-4"
                      >
                        {site.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="font-bold text-ink">Opening hours</dt>
                    <dd className="text-muted">
                      <ul className="mt-1 space-y-0.5">
                        {site.hours.map((day) => (
                          <li key={day.day} className="flex justify-between gap-6">
                            <span>{day.day}</span>
                            <span className="font-semibold text-ink">
                              {day.open} – {day.close}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-5 grid gap-2.5">
                <a
                  href={site.directionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-block"
                >
                  <MapPin className="h-4 w-4" />
                  Get directions
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-block"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp the shop
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Store, title: 'Walk in', copy: 'Test before you buy' },
                { icon: Package, title: 'Pick up', copy: 'Order online, collect free' },
                { icon: Truck, title: 'Delivery', copy: 'Nationwide, 2–4 days' },
              ].map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-line bg-surface p-4 text-center"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-accent-deep">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="mt-2.5 text-[12px] font-bold text-ink">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map + delivery table */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[26px] border border-line bg-card">
              <iframe
                title={`Map showing ${site.nameFull} in ${site.town}, Nsawam`}
                src={site.mapEmbedUrl}
                loading="lazy"
                className="h-[320px] w-full border-0 sm:h-[400px]"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div id="delivery" className="rounded-[26px] border border-line bg-surface p-6">
              <h2 className="font-display text-[19px] font-bold text-ink">
                Delivery areas &amp; fees
              </h2>
              <p className="mt-1.5 text-[12.5px] text-muted">
                Fees are per order and shown again at checkout before you pay. Free
                delivery applies automatically on baskets over{' '}
                {formatCedis(site.freeDeliveryThreshold)} where a free-over amount is set.
              </p>

              <div className="mt-5 space-y-6">
                {Object.entries(byRegion).map(([region, regionZones]) => (
                  <div key={region}>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-accent-deep">
                      {region}
                    </h3>
                    <table className="mt-2 w-full text-left text-[12.5px]">
                      <thead>
                        <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
                          <th className="pb-2 font-semibold">Town</th>
                          <th className="pb-2 font-semibold">Fee</th>
                          <th className="pb-2 font-semibold">Arrives in</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regionZones.map((zone) => (
                          <tr key={zone.id} className="border-b border-line/70">
                            <td className="py-2 font-semibold text-ink">{zone.town}</td>
                            <td className="py-2 text-muted">
                              {Number(zone.shipping_fee) === 0
                                ? 'Free'
                                : formatCedis(Number(zone.shipping_fee))}
                            </td>
                            <td className="py-2 text-muted">
                              {zone.estimated_days_min === 0 &&
                              zone.estimated_days_max <= 1
                                ? 'Same day'
                                : `${zone.estimated_days_min}–${zone.estimated_days_max} days`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-10 rounded-[26px] border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-[22px] font-bold text-ink">
            Delivery &amp; pickup questions
          </h2>
          <dl className="mt-5 grid gap-5 md:grid-cols-2">
            {HOME_FAQS.slice(2, 6).map((faq) => (
              <div key={faq.question}>
                <dt className="text-[13.5px] font-bold text-ink">{faq.question}</dt>
                <dd className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[12.5px] text-muted">
            Still unsure? Read the full{' '}
            <Link href="/policies" className="font-bold text-accent-deep hover:underline">
              shop policies
            </Link>{' '}
            or{' '}
            <Link href="/contact" className="font-bold text-accent-deep hover:underline">
              message us on WhatsApp
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
