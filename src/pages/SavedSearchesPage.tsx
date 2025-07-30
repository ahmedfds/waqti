import React, { useState } from 'react';
import { Search, Bell, BellOff, Edit, Trash2, Plus, Filter, Calendar } from 'lucide-react';
import { SavedSearch } from '../types';
import Button from '../components/Button';

interface SavedSearchesPageProps {
  setActivePage: (page: string) => void;
}

const SavedSearchesPage: React.FC<SavedSearchesPageProps> = ({ setActivePage }) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      userId: 'user1',
      name: 'مشاريع تطوير ويب',
      description: 'مشاريع تطوير المواقع بميزانية متوسطة',
      query: {
        text: 'تطوير موقع',
        filters: { category: 'web-development', budget: '2000-10000' },
        sortBy: 'date',
        sortOrder: 'desc'
      },
      category: 'projects',
      isPublic: false,
      notifications: true,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: '2',
      userId: 'user1',
      name: 'مصممين UI/UX',
      description: 'مصممين واجهات مستخدم محترفين',
      query: {
        text: 'UI UX تصميم',
        filters: { category: 'design', rating: '4+' },
        sortBy: 'rating',
        sortOrder: 'desc'
      },
      category: 'freelancers',
      isPublic: false,
      notifications: false,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 48),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [newSearchDescription, setNewSearchDescription] = useState('');

  const toggleNotifications = (searchId: string) => {
    setSavedSearches(prev => prev.map(search => 
      search.id === searchId 
        ? { ...search, notifications: !search.notifications }
        : search
    ));
  };

  const deleteSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== searchId));
  };

  const runSearch = (search: SavedSearch) => {
    // Execute the saved search
    console.log('Running search:', search);
    // Update last run time
    setSavedSearches(prev => prev.map(s => 
      s.id === search.id 
        ? { ...s, lastRun: new Date() }
        : s
    ));
    // Navigate to appropriate page with search results
    setActivePage(search.category);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'services': return '🛠️';
      case 'projects': return '📋';
      case 'freelancers': return '👥';
      case 'messages': return '💬';
      default: return '🔍';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'services': return 'الخدمات';
      case 'projects': return 'المشاريع';
      case 'freelancers': return 'المستقلون';
      case 'messages': return 'الرسائل';
      default: return 'عام';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">البحوث المحفوظة</h1>
              <p className="text-gray-600">احفظ عمليات البحث المفضلة لديك واحصل على إشعارات عند ظهور نتائج جديدة</p>
            </div>
            <Button
              variant="primary"
              leftIcon={<Plus className="h-5 w-5" />}
              onClick={() => setShowCreateModal(true)}
            >
              إضافة بحث جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي البحوث</p>
                <p className="text-2xl font-bold text-gray-900">{savedSearches.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">البحوث النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedSearches.filter(s => s.notifications).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">آخر تشغيل</p>
                <p className="text-2xl font-bold text-gray-900">اليوم</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Saved Searches List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">البحوث المحفوظة</h2>
          </div>
          
          {savedSearches.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بحوث محفوظة</h3>
              <p className="text-gray-600 mb-6">احفظ عمليات البحث المفضلة لديك للوصول السريع إليها</p>
              <Button
                variant="primary"
                leftIcon={<Plus className="h-5 w-5" />}
                onClick={() => setShowCreateModal(true)}
              >
                إضافة بحث جديد
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {savedSearches.map(search => (
                <div key={search.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getCategoryIcon(search.category)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{search.name}</h3>
                          <p className="text-sm text-gray-600">{getCategoryName(search.category)}</p>
                        </div>
                      </div>
                      
                      {search.description && (
                        <p className="text-gray-700 mb-3">{search.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>البحث: "{search.query.text}"</span>
                        <span>•</span>
                        <span>آخر تشغيل: {search.lastRun ? formatDate(search.lastRun) : 'لم يتم التشغيل'}</span>
                        <span>•</span>
                        <span>تم الإنشاء: {formatDate(search.createdAt)}</span>
                      </div>
                      
                      {Object.keys(search.query.filters).length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(search.query.filters).map(([key, value]) => (
                              <span
                                key={key}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleNotifications(search.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          search.notifications
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={search.notifications ? 'إيقاف الإشعارات' : 'تفعيل الإشعارات'}
                      >
                        {search.notifications ? (
                          <Bell className="h-5 w-5" />
                        ) : (
                          <BellOff className="h-5 w-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => runSearch(search)}
                        className="px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] transition-colors"
                      >
                        تشغيل البحث
                      </button>
                      
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                        title="تعديل"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => deleteSearch(search.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="حذف"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Search Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة بحث جديد</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم البحث
                  </label>
                  <input
                    type="text"
                    value={newSearchName}
                    onChange={(e) => setNewSearchName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="أدخل اسم البحث"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (اختياري)
                  </label>
                  <textarea
                    value={newSearchDescription}
                    onChange={(e) => setNewSearchDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="وصف مختصر للبحث"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  className="flex-1"
                  disabled={!newSearchName.trim()}
                >
                  حفظ البحث
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSearchName('');
                    setNewSearchDescription('');
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearchesPage;