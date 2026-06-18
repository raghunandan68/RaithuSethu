import { useState, useEffect } from "react";
import { buyerApi } from "../../api/buyer";
import { flashSalesApi } from "../../api/resources";
import { PageLoader, EmptyState, Badge } from "../../components/common/Feedback";
import CropCard from "../../components/crop/CropCard";
import { Field, Input, Select } from "../../components/common/Field";
import { CROP_CATEGORIES } from "../../utils/format";
import { formatCurrency, formatDateTime } from "../../utils/format";
import { Filter, Search, Clock, Zap } from "lucide-react";

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    min_price: "",
    max_price: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;

      const [cropsRes, fsRes] = await Promise.all([
        buyerApi.getMarketplaceCrops(params),
        flashSalesApi.getAll(true),
      ]);
      setCrops(cropsRes.data || []);
      setFlashSales(fsRes.data || []);
    } catch {
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    fetch();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Marketplace</h1>
        <p className="mt-1 text-sm text-ink-soft">Browse fresh crops from local farmers</p>
      </div>

      {flashSales.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {flashSales.map((fs) => (
              <div
                key={fs.id}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3"
              >
                <Zap size={20} className="text-gold-500" />
                <div>
                  <p className="text-sm font-semibold text-ink">{fs.crops?.name || fs.crop_name}</p>
                  <p className="text-xs text-gold-600 font-bold">{fs.discount_percentage}% OFF</p>
                  <p className="text-[10px] text-ink-soft/60">Ends {formatDateTime(fs.end_time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/50" />
            <Input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search crops..."
              className="pl-9"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              showFilters ? "bg-paddy-800 text-cream border-paddy-800" : "border-paddy-200 text-ink-soft hover:bg-paddy-50"
            }`}
          >
            <Filter size={15} /> Filters
          </button>
          <button
            type="submit"
            className="rounded-lg bg-paddy-800 px-4 py-2.5 text-sm font-semibold text-cream hover:bg-paddy-700"
          >
            Search
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-xl border border-paddy-100 bg-white p-4">
            <Select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              {CROP_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Input name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" />
            <Input type="number" name="min_price" value={filters.min_price} onChange={handleFilterChange} placeholder="Min price" />
            <Input type="number" name="max_price" value={filters.max_price} onChange={handleFilterChange} placeholder="Max price" />
          </div>
        )}
      </div>

      {loading ? (
        <PageLoader />
      ) : crops.length === 0 ? (
        <EmptyState
          icon={<Search size={40} />}
          title="No crops found"
          description="Try adjusting your filters or check back later."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      )}
    </div>
  );
}
