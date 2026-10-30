// app/opengraph-image.tsx
// Dynamically generated 1200×630 share card for the homepage.

import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.nameFull} — skincare and mother care in Nsawam`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'nodejs';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FFF8F5',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 22,
              background: '#49383D',
              color: '#FFF8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: '#49383D' }}>
              {site.name}
            </span>
            <span
              style={{
                fontSize: 15,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: '#A66B78',
                marginTop: 4,
              }}
            >
              Skincare · Mother Care
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: '#A66B78',
              marginBottom: 20,
            }}
          >
            100% authentic · delivered nationwide
          </span>
          <span
            style={{
              fontSize: 68,
              lineHeight: 1.08,
              fontWeight: 700,
              color: '#49383D',
              letterSpacing: -1.5,
            }}
          >
            Gentle care for every mother
          </span>
          <span style={{ fontSize: 27, color: '#7C646A', marginTop: 22 }}>
            Lotions, serums, hair care and baby essentials in East Doboro, Nsawam.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              background: '#FF9FB2',
              color: '#49383D',
              padding: '16px 34px',
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Shop skincare
          </div>
          <span style={{ fontSize: 23, color: '#7C646A' }}>
            Free delivery over GHS {site.freeDeliveryThreshold}
          </span>
        </div>
      </div>
    ),
    size
  );
}
