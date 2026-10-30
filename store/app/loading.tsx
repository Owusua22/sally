// app/loading.tsx — route-level fallback for the whole storefront.
//
// One loading state everywhere: a centred spinner inside the page container.
// A skeleton that does not match the page it replaces is more jarring than a
// spinner, and a single app/loading.tsx cannot know which route it is on.
import { PageLoader } from '@/components/layout/PageLoader';

export default function Loading() {
  return <PageLoader />;
}
