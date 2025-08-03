/**
 * ServicesPage component
 * 
 * This component renders a page with a list of services, filters and search bar.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onServiceClick - Function to call when a service is clicked
 * @returns {ReactElement} - ServicesPage component
 */
const ServicesPage: React.FC<ServicesPageProps> = ({ onServiceClick }) => {
  const { t, isRTL } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxHours, setMaxHours] = useState<number>(10);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = [
    'Design',
    'Teaching', 
    'Programming',
    'Translation',
    'Writing',
    'Music',
    'Cooking',
    'Photography'
  ];

  const locations = useMemo(() => {
    const locationsSet = new Set<string>();
    services.forEach(service => locationsSet.add(service.location));
    return Array.from(locationsSet);
  }, [services]);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            users!services_provider_id_fkey(*)
          `);

        if (error) {
          console.error('Error fetching services:', error);
          return;
        }

        const formattedServices: Service[] = data?.map(service => ({
          id: service.id,
          title: service.title,
          description: service.description,
          category: service.category,
          provider: {
            id: service.users.id,
            name: service.users.name,
            email: service.users.email || '',
            phone: service.users.phone || '',
            balance: service.users.balance || 0,
            joinedAt: new Date(service.users.created_at),
            avatar: service.users.avatar_url
          },
          hourlyRate: service.hourly_rate,
          location: service.location,
          rating: service.rating || 0,
          reviews: service.reviews_count || 0,
          image: service.image_url || 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        })) || [];

        setServices(formattedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...services];
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter((service) => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter((service) => service.category === selectedCategory);
    }
    
    // Apply location filter
    if (selectedLocation) {
      result = result.filter((service) => service.location === selectedLocation);
    }
    
    // Apply rating filter
    if (minRating > 0) {
      result = result.filter((service) => service.rating >= minRating);
    }
    
    // Apply max hours filter
    if (maxHours < 10) {
      result = result.filter((service) => service.hourlyRate <= maxHours);
    }
    
    setFilteredServices(result);
  }, [searchTerm, selectedCategory, selectedLocation, minRating, maxHours, services]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setMinRating(0);
    setMaxHours(10);
    setIsMobileFilterOpen(false);
  };

  const hasActiveFilters = selectedCategory || selectedLocation || minRating > 0 || maxHours < 10;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-[#2E86AB] ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('services.all')}
      </h1>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 md:mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('services.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm md:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            leftIcon={<Filter size={18} />}
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex-1 md:flex-none"
          >
            {t('services.filters')}
          </Button>
          
          {hasActiveFilters && (
            <Button 
              variant="outline"
              onClick={clearFilters}
              className="whitespace-nowrap"
              leftIcon={<X size={16} />}
            >
              {t('services.clearFilters')}
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content area with filters and services */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Filters Panel */}
        <div className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} lg:w-1/4 bg-white p-4 md:p-6 rounded-xl shadow-md h-fit`}>
          <div className="flex justify-between items-center mb-4 lg:block">
            <h3 className="text-lg font-semibold text-[#2E86AB]">{t('services.filters')}</h3>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2 text-sm md:text-base">{t('services.category')}</h4>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Location Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2 text-sm md:text-base">{t('services.location')}</h4>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          
          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2 text-sm md:text-base">{t('services.rating')}</h4>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full"
              />
              <span className="ml-2 w-8 text-center text-sm md:text-base">{minRating}</span>
            </div>
          </div>