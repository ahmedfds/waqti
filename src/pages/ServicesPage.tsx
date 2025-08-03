import { useEffect, useState } from 'react';
import { Service, ServiceCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/Button';
import { Plus, Filter, Search, MapPin, Clock, DollarSign, Users, TrendingUp } from 'lucide-react';

const ServicesPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<ServiceCategory | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('services')
        .select('*, categories(*)')
        .eq('is_published', true)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data || []);
      setLoading(false);
    };

    fetchServices();
  }, []);

  const filteredServices = services
    .filter(service => service.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(service => !category || service.category === category);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold">{t('services.title')}</h1>
          <p className="mt-2 text-gray-600">{t('services.subtitle')}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              type="search"
              className="pl-10 py-2 border border-gray-300 rounded-md w-64"
              placeholder={t('services.search_placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Button
              className="ml-4"
              onClick={() => setSearchQuery('')}
            >
              {t('common.clear')}
            </Button>
          </div>

          <Button
            className="ml-4"
            onClick={() => setCategory(null)}
          >
            {t('common.all')}
          </Button>

          {[...new Set(services.map(service => service.category))].map(category => (
            <Button
              key={category}
              className="ml-4"
              onClick={() => setCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>

        {user && (
          <div className="text-center mt-12">
            <Button
              className="px-8 py-2"
              onClick={() => console.log('Create service')}
            >
              <Plus size={24} className="mr-2" />
              {t('services.create_service')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
/*******  fb8d2e14-a62d-45c0-a674-b6ee06fc0fb4  *******/