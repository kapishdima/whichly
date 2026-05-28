import { siteConfig } from "@/lib/config";
import { highlight } from "@/lib/highlight";
import { Block, Variant, WhichlyPicker } from "@whichly/react";
import { ChevronLeft, ChevronRight, FileCode, Minus } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-sky-400">{children}</p>;
}

function ClickHint() {
  return (
    <div className="pointer-events-none absolute top-10 z-99999 left-54 hidden -rotate-3 select-none items-end gap-1 text-sm text-sky-400 sm:flex">
      <svg
        width="65"
        height="102"
        viewBox="0 0 65 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Click</title>
        <path
          d="M55.7789 0.0953657C55.2792 -0.139741 54.6835 0.0747877 54.4483 0.574529L50.6171 8.71832C50.382 9.21806 50.5965 9.81377 51.0962 10.0489C51.596 10.284 52.1917 10.0695 52.4268 9.56971L55.8324 2.33079L63.0713 5.73638C63.571 5.97149 64.1668 5.75696 64.4019 5.25722C64.637 4.75748 64.4224 4.16176 63.9227 3.92666L55.7789 0.0953657ZM0.172913 100.958L0.34584 101.942C1.0094 101.826 1.67024 101.705 2.32824 101.579L2.14063 100.597L1.95303 99.6148C1.30492 99.7385 0.653864 99.8578 -1.46938e-05 99.9726L0.172913 100.958ZM6.04491 99.7888L6.26296 100.765C7.57893 100.471 8.88205 100.157 10.1712 99.8241L9.92102 98.8559L9.67078 97.8877C8.40349 98.2153 7.12183 98.5236 5.82685 98.8129L6.04491 99.7888ZM13.7629 97.791L14.0471 98.7498C15.3421 98.3658 16.6213 97.9606 17.8835 97.5338L17.5632 96.5865L17.2429 95.6392C16.0052 96.0577 14.7501 96.4553 13.4786 96.8323L13.7629 97.791ZM21.3135 95.234L21.672 96.1675C22.9353 95.6824 24.1792 95.174 25.4026 94.642L25.0038 93.7249L24.6049 92.8079C23.409 93.3281 22.192 93.8255 20.9551 94.3005L21.3135 95.234ZM28.6221 92.0505L29.0635 92.9478C30.2796 92.3495 31.4725 91.7256 32.6407 91.0757L32.1546 90.2019L31.6684 89.328C30.5305 89.9611 29.3674 90.5693 28.1807 91.1532L28.6221 92.0505ZM35.5853 88.1709L36.1181 89.0171C37.266 88.2942 38.3862 87.5434 39.4773 86.764L38.896 85.9503L38.3148 85.1366C37.2562 85.8927 36.1683 86.6219 35.0524 87.3247L35.5853 88.1709ZM42.0668 83.5347L42.6975 84.3107C43.7498 83.4553 44.77 82.5698 45.7563 81.6536L45.0757 80.9209L44.3951 80.1883C43.4419 81.0738 42.455 81.9304 41.4361 82.7587L42.0668 83.5347ZM47.9003 78.1093L48.6302 78.7929C49.5556 77.8047 50.4446 76.7849 51.2954 75.7328L50.5179 75.104L49.7403 74.4752C48.9204 75.4889 48.0633 76.4723 47.1704 77.4258L47.9003 78.1093ZM52.9072 71.9136L53.7296 72.4827C54.4975 71.3728 55.2259 70.2309 55.913 69.0566L55.0499 68.5516L54.1868 68.0466C53.5254 69.1769 52.8243 70.2761 52.0849 71.3446L52.9072 71.9136ZM56.9315 65.0354L57.8305 65.4734C58.4185 64.2666 58.9656 63.0289 59.4704 61.7598L58.5412 61.3902L57.612 61.0206C57.1256 62.2434 56.5987 63.4355 56.0325 64.5974L56.9315 65.0354ZM59.8776 57.6361L60.8312 57.9372C61.2334 56.6636 61.5953 55.3612 61.9158 54.0296L60.9435 53.7957L59.9713 53.5617C59.6616 54.8486 59.3121 56.1062 58.9241 57.335L59.8776 57.6361ZM61.7464 49.8905L62.732 50.0597C62.9571 48.7484 63.1441 47.4111 63.2919 46.0474L62.2977 45.9397L61.3035 45.8319C61.1601 47.1552 60.9789 48.4515 60.7608 49.7213L61.7464 49.8905ZM62.611 41.9629L63.6098 42.0129C63.6759 40.6923 63.707 39.3485 63.7022 37.9815L62.7022 37.985L61.7022 37.9885C61.7069 39.3207 61.6766 40.6287 61.6123 41.9129L62.611 41.9629ZM62.5884 34.0084L63.587 33.9554C63.5171 32.6378 63.4153 31.2997 63.2808 29.941L62.2857 30.0395L61.2906 30.138C61.4221 31.4672 61.5216 32.7749 61.5899 34.0613L62.5884 34.0084ZM61.8085 26.0816L62.7986 25.9413C62.613 24.6313 62.3981 23.303 62.1536 21.9563L61.1697 22.135L60.1857 22.3137C60.4258 23.6355 60.6365 24.9382 60.8184 26.2219L61.8085 26.0816ZM60.3852 18.2208L61.3621 18.007C61.0816 16.7253 60.7751 15.4276 60.4421 14.1137L59.4727 14.3594L58.5034 14.6051C58.8312 15.8983 59.1326 17.1747 59.4083 18.4345L60.3852 18.2208ZM58.4335 10.51L59.3949 10.2348C59.0299 8.95933 58.6406 7.66918 58.2267 6.36426L57.2735 6.66658L56.3203 6.96891C56.7286 8.25617 57.1124 9.5282 57.4721 10.7851L58.4335 10.51ZM56.0274 2.90968L56.9724 2.58271C56.752 1.94568 56.5259 1.30525 56.2941 0.661406L55.3532 1.00023L54.4124 1.33905C54.6414 1.97509 54.8647 2.60763 55.0824 3.23666L56.0274 2.90968ZM55.7789 0.0953657C55.2792 -0.139741 54.6835 0.0747877 54.4483 0.574529L50.6171 8.71832C50.382 9.21806 50.5965 9.81377 51.0962 10.0489C51.596 10.284 52.1917 10.0695 52.4268 9.56971L55.8324 2.33079L63.0713 5.73638C63.571 5.97149 64.1668 5.75696 64.4019 5.25722C64.637 4.75748 64.4224 4.16176 63.9227 3.92666L55.7789 0.0953657ZM0.172913 100.958L0.34584 101.942C1.0094 101.826 1.67024 101.705 2.32824 101.579L2.14063 100.597L1.95303 99.6148C1.30492 99.7385 0.653864 99.8578 -1.46938e-05 99.9726L0.172913 100.958ZM6.04491 99.7888L6.26296 100.765C7.57893 100.471 8.88205 100.157 10.1712 99.8241L9.92102 98.8559L9.67078 97.8877C8.40349 98.2153 7.12183 98.5236 5.82685 98.8129L6.04491 99.7888ZM13.7629 97.791L14.0471 98.7498C15.3421 98.3658 16.6213 97.9606 17.8835 97.5338L17.5632 96.5865L17.2429 95.6392C16.0052 96.0577 14.7501 96.4553 13.4786 96.8323L13.7629 97.791ZM21.3135 95.234L21.672 96.1675C22.9353 95.6824 24.1792 95.174 25.4026 94.642L25.0038 93.7249L24.6049 92.8079C23.409 93.3281 22.192 93.8255 20.9551 94.3005L21.3135 95.234ZM28.6221 92.0505L29.0635 92.9478C30.2796 92.3495 31.4725 91.7256 32.6407 91.0757L32.1546 90.2019L31.6684 89.328C30.5305 89.9611 29.3674 90.5693 28.1807 91.1532L28.6221 92.0505ZM35.5853 88.1709L36.1181 89.0171C37.266 88.2942 38.3862 87.5434 39.4773 86.764L38.896 85.9503L38.3148 85.1366C37.2562 85.8927 36.1683 86.6219 35.0524 87.3247L35.5853 88.1709ZM42.0668 83.5347L42.6975 84.3107C43.7498 83.4553 44.77 82.5698 45.7563 81.6536L45.0757 80.9209L44.3951 80.1883C43.4419 81.0738 42.455 81.9304 41.4361 82.7587L42.0668 83.5347ZM47.9003 78.1093L48.6302 78.7929C49.5556 77.8047 50.4446 76.7849 51.2954 75.7328L50.5179 75.104L49.7403 74.4752C48.9204 75.4889 48.0633 76.4723 47.1704 77.4258L47.9003 78.1093ZM52.9072 71.9136L53.7296 72.4827C54.4975 71.3728 55.2259 70.2309 55.913 69.0566L55.0499 68.5516L54.1868 68.0466C53.5254 69.1769 52.8243 70.2761 52.0849 71.3446L52.9072 71.9136ZM56.9315 65.0354L57.8305 65.4734C58.4185 64.2666 58.9656 63.0289 59.4704 61.7598L58.5412 61.3902L57.612 61.0206C57.1256 62.2434 56.5987 63.4355 56.0325 64.5974L56.9315 65.0354ZM59.8776 57.6361L60.8312 57.9372C61.2334 56.6636 61.5953 55.3612 61.9158 54.0296L60.9435 53.7957L59.9713 53.5617C59.6616 54.8486 59.3121 56.1062 58.9241 57.335L59.8776 57.6361ZM61.7464 49.8905L62.732 50.0597C62.9571 48.7484 63.1441 47.4111 63.2919 46.0474L62.2977 45.9397L61.3035 45.8319C61.1601 47.1552 60.9789 48.4515 60.7608 49.7213L61.7464 49.8905ZM62.611 41.9629L63.6098 42.0129C63.6759 40.6923 63.707 39.3485 63.7022 37.9815L62.7022 37.985L61.7022 37.9885C61.7069 39.3207 61.6766 40.6287 61.6123 41.9129L62.611 41.9629ZM62.5884 34.0084L63.587 33.9554C63.5171 32.6378 63.4153 31.2997 63.2808 29.941L62.2857 30.0395L61.2906 30.138C61.4221 31.4672 61.5216 32.7749 61.5899 34.0613L62.5884 34.0084ZM61.8085 26.0816L62.7986 25.9413C62.613 24.6313 62.3981 23.303 62.1536 21.9563L61.1697 22.135L60.1857 22.3137C60.4258 23.6355 60.6365 24.9382 60.8184 26.2219L61.8085 26.0816ZM60.3852 18.2208L61.3621 18.007C61.0816 16.7253 60.7751 15.4276 60.4421 14.1137L59.4727 14.3594L58.5034 14.6051C58.8312 15.8983 59.1326 17.1747 59.4083 18.4345L60.3852 18.2208ZM58.4335 10.51L59.3949 10.2348C59.0299 8.95933 58.6406 7.66918 58.2267 6.36426L57.2735 6.66658L56.3203 6.96891C56.7286 8.25617 57.1124 9.5282 57.4721 10.7851L58.4335 10.51ZM56.0274 2.90968L56.9724 2.58271C56.752 1.94568 56.5259 1.30525 56.2941 0.661406L55.3532 1.00023L54.4124 1.33905C54.6414 1.97509 54.8647 2.60763 55.0824 3.23666L56.0274 2.90968Z"
          fill="currentColor"
        />
      </svg>

      <p className="pb-1 font-medium italic text-xs">click</p>
    </div>
  );
}

export async function HeroSection() {
  return (
    <section id="top" className="pt-36 pb-20 md:pt-36 md:pb-44">
      <div className="mx-auto max-w-5xl px-6">
        <Block name="Hero">
          {/* Variant A — client's pain */}
          <Variant name="main">
            <div className="flex flex-col items-center justify-center gap-12 lg:grid-cols-2">
              <div className="max-w-lg text-center">
                <Eyebrow>Stop the Figma ping-pong</Eyebrow>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-5xl">
                  Which version does the client actually want?
                </h1>
                <p className="mt-6 text-base text-muted-foreground">
                  Stop guessing. Drop two or three versions of a block into your code and let the
                  client flip between them on the live site until they land on the one.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="relative">
                    <ClickHint />
                    <WhichlyPicker />
                  </div>
                  <Button
                    size="xl"
                    className="rounded-full"
                    render={
                      <Link
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    nativeButton={false}
                  >
                    <span>Get started</span>
                  </Button>
                </div>
              </div>
            </div>
          </Variant>

          <Variant name="second">
            <div className="flex flex-col items-center justify-center gap-12 lg:grid-cols-2">
              <div className="max-w-lg text-center">
                <Badge className="bg-sky-400">Open-source variant picker</Badge>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-5xl">
                  Build a few versions Let the client pick
                </h1>
                <p className="mt-6 text-base text-muted-foreground">
                  Stop guessing. Drop two or three versions of a block into your code and let the
                  client flip between them on the live site until they land on the one.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="relative">
                    <ClickHint />
                    <WhichlyPicker />
                  </div>
                  <Button
                    size="xl"
                    className="rounded-full"
                    render={
                      <Link
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    nativeButton={false}
                  >
                    <span>Get started</span>
                  </Button>
                </div>
              </div>
            </div>
          </Variant>

          <Variant name="third">
            <div className="flex flex-col items-center justify-center gap-12 lg:grid-cols-2">
              <div className="max-w-lg text-center">
                <Button size="sm">Not a mockup. The real site</Button>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-5xl">
                  See every version on the real site, not a mockup
                </h1>
                <p className="mt-6 text-base text-muted-foreground">
                  Build a few takes on a block, ship them to staging, and switch between them live.
                  Your client picks the winner in the actual layout, on the actual site.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="relative">
                    <ClickHint />
                    <WhichlyPicker />
                  </div>
                  <Button
                    size="xl"
                    className="rounded-full"
                    render={
                      <Link
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    nativeButton={false}
                  >
                    <span>Get started</span>
                  </Button>
                </div>
              </div>
            </div>
          </Variant>
        </Block>
      </div>
    </section>
  );
}
