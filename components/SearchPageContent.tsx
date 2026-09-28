'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { TravelItem } from '@/types';
import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '@/components/FilterSidebar';
import SearchHeader from '@/components/SearchHeader';

interface SearchPageContentProps {
  category: string;
  initialData: TravelItem[];
  totalItems: number;
}

export default function SearchPageContent({ category, initialData, totalItems }: SearchPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const page = Number(searchParams.get('page')) || 1;

  // State for client-side filtering
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    ratings: [] as number[],
    options: [] as string[]
  });

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      // Price Filter
      if (item.price > filters.priceRange[1]) return false;

      // Rating Filter
      if (filters.ratings.length > 0) {
        const matchesRating = filters.ratings.some(r => item.rating >= r);
        if (!matchesRating) return false;
      }

      // Options Filter (matches against title, subtitle, or details)
      if (filters.options.length > 0) {
        const itemText = `${item.title} ${item.subtitle} ${item.details.join(' ')}`.toLowerCase();
        const matchesOption = filters.options.some(opt => itemText.includes(opt.toLowerCase()));
        if (!matchesOption) return false;
      }

      return true;
    });
  }, [initialData, filters]);

  // Server-side pagination is used, so we display the filtered data directly
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/search/${category}?${params.toString()}`);
  };

  const routeSummary = [
    from ? `From ${from}` : '',
    to ? `to ${to}` : '',
    date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  ].filter(Boolean).join(' • ');

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Search Header */}
      <SearchHeader key={category + searchParams?.toString?.()} activeCategory={category} />
      
      {/* Results Info */}
      <div className="container-custom py-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{totalItems}</span> results {routeSummary && `• ${routeSummary}`}
        </p>
      </div>

      {/* Results */}
      <div className="container-custom mt-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="hidden lg:block space-y-6">
            <div className="sticky top-40">
            <FilterSidebar 
              key={category}
              category={category} 
              onFilterChange={setFilters} 
            />
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div 
            key={page + JSON.stringify(filters)} // Force re-render on page/filter change
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {paginatedData.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={itemAnim}
                  layout
                  whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-xl border border-border overflow-hidden transition-all flex flex-col sm:flex-row"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                          <p className="text-muted-foreground text-sm">{item.subtitle}</p>
                        </div>
                        <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          {item.rating} <Star className="w-3 h-3 fill-current" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.details.map((detail, idx) => (
                          <span key={idx} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-6 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">₹{item.price.toLocaleString()}</span>
                          <span className="text-xs text-green-600 font-medium">
                            +{Math.floor(item.price * 0.03)} pts
                          </span>
                        </div>
                      </div>

                      <Link 
                        href={`/details/${category}/${item.id}`}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {paginatedData.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-border">
                <p className="text-muted-foreground text-lg">No results found matching your filters.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-primary font-bold hover:underline mt-2 inline-block"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <span className="font-medium text-muted-foreground">
                Page <span className="text-foreground font-bold">{page}</span> of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
