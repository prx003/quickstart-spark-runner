import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { STUDIO_WORK_ITEMS, StudioWorkItem } from '../data/clickArrowData';
import { CrtCanvasScreen } from './CrtCanvasScreen';

interface CreativeStudioGalleryProps {
  onCursorHint: (label: string | null) => void;
  onStartProject: (topic: string) => void;
}

const CATEGORIES: Array<'All' | StudioWorkItem['category']> = [
  'All',
  'Brand Films',
  'Photography',
  'Identity & Motion',
];

export function CreativeStudioGallery({
  onCursorHint,
  onStartProject,
}: CreativeStudioGalleryProps) {
  const [filter, setFilter] = useState<'All' | StudioWorkItem['category']>('All');
  const [selectedWork, setSelectedWork] = useState<StudioWorkItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const railRef = useRef<HTMLDivElement>(null);

  const visibleItems =
    filter === 'All'
      ? STUDIO_WORK_ITEMS
      : STUDIO_WORK_ITEMS.filter((item) => item.category === filter);

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const step = Math.min(rail.clientWidth * 0.8, 480);
    rail.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section
      id="studio"
      className="relative z-10 border-t border-white/15 bg-[#050505] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Header & Controls */}
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#E80012] uppercase">
              04. Creative Studio — Film, Photo &amp; Motion
            </p>
            <h2
              className="mt-3 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              IDEAS SHOULD NEVER{' '}
              <span className="text-[#E80012]">LOOK ORDINARY.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              Illustrative concept campaigns showcasing Click Arrow&apos;s
              in-house direction across commercial film, product photography,
              editorial portraits, and kinetic design systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Functional Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter studio showcase"
              className="flex flex-wrap items-center gap-1.5 border border-white/15 bg-[#0B0B0B] p-1"
            >
              {CATEGORIES.map((cat) => {
                const active = filter === cat;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setFilter(cat)}
                    className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#E80012] text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Horizontal Rail Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRail(-1)}
                aria-label="Scroll studio gallery left"
                className="flex h-11 w-11 items-center justify-center border border-white/20 bg-[#0B0B0B] text-white transition-colors hover:border-[#E80012] hover:bg-[#E80012] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(1)}
                aria-label="Scroll studio gallery right"
                className="flex h-11 w-11 items-center justify-center border border-white/20 bg-[#0B0B0B] text-white transition-colors hover:border-[#E80012] hover:bg-[#E80012] cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Interactive Media Rail */}
        <div
          ref={railRef}
          className="no-scrollbar mt-10 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
        >
          {visibleItems.map((item) => {
            const isLiveFilmLoop =
              item.id === 'motion-kinetic-type' ||
              item.id === 'motion-crt-matrix';
            const imgBroken = failedImages[item.id];

            return (
              <article
                key={item.id}
                className={`snap-start shrink-0 border border-white/15 bg-[#0A0A0A] transition-colors duration-200 hover:border-[#E80012] ${
                  item.aspect === 'landscape'
                    ? 'w-[86vw] sm:w-[460px] lg:w-[540px]'
                    : 'w-[82vw] sm:w-[370px] lg:w-[410px]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedWork(item)}
                  onMouseEnter={() => onCursorHint('VIEW REEL')}
                  onMouseLeave={() => onCursorHint(null)}
                  className="group block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E80012]"
                >
                  {/* Visual Media Frame */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050505]">
                    {isLiveFilmLoop && item.programType ? (
                      <CrtCanvasScreen
                        program={item.programType}
                        backdropImage={item.image}
                        className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : !imgBroken ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [item.id]: true,
                          }))
                        }
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#E80012]/30 via-[#050505] to-[#050505] p-6 text-center">
                        <span className="font-mono-tabular text-xs font-bold text-[#E80012] uppercase">
                          {item.conceptLabel}
                        </span>
                        <span className="mt-2 font-display text-xl font-bold text-white">
                          {item.title}
                        </span>
                      </div>
                    )}

                    {/* Measured Contrast Scrim */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"
                    />

                    {/* Bottom Frame Metadata */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                      <span className="font-mono-tabular text-xs font-semibold text-white/85 uppercase">
                        {item.index} · {item.conceptLabel}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center bg-[#E80012] text-white transition-transform duration-200 group-hover:scale-110">
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </span>
                    </div>
                  </div>

                  {/* Card Copy */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span className="text-[#E80012] font-semibold">
                        {item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.medium}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold text-white group-hover:text-[#E80012] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">
                      {item.description}
                    </p>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Expanded Studio Lightbox Modal */}
      {selectedWork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedWork.title}
          data-no-3d="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="w-full max-w-4xl border border-white/20 bg-[#080808] p-5 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono-tabular text-white/70 uppercase">
                <span className="text-[#E80012] font-bold">
                  {selectedWork.conceptLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedWork.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWork(null)}
                aria-label="Close studio preview"
                className="flex h-10 w-10 items-center justify-center border border-white/20 text-white hover:bg-[#E80012] hover:border-[#E80012] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-stretch">
              <div className="md:col-span-7 border border-white/15 bg-black overflow-hidden">
                {selectedWork.programType ? (
                  <CrtCanvasScreen
                    program={selectedWork.programType}
                    backdropImage={selectedWork.image}
                    className="aspect-[4/3] w-full"
                  />
                ) : (
                  <img
                    src={selectedWork.image}
                    alt={selectedWork.title}
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover"
                  />
                )}
              </div>

              <div className="md:col-span-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    {selectedWork.title}
                  </h3>
                  <p className="mt-2 font-mono-tabular text-xs text-[#E80012] uppercase">
                    {selectedWork.medium}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/80">
                    {selectedWork.description}
                  </p>
                  <p className="mt-4 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/60">
                    Illustrative Click Arrow studio concept produced in strict
                    red, black, and white brand art direction.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const topic = selectedWork.title;
                    setSelectedWork(null);
                    onStartProject(topic);
                  }}
                  className="mt-6 w-full bg-[#E80012] px-5 py-3.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black cursor-pointer"
                >
                  Commission Similar Production
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
