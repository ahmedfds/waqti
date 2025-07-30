import React, { useState } from 'react';
import { Shield, DollarSign, Clock, CheckCircle, AlertTriangle, RefreshCw, Download, Eye } from 'lucide-react';
import { EscrowAccount, Contract } from '../types';
import Button from '../components/Button';

interface EscrowManagementPageProps {
  setActivePage: (page: string) => void;
}

const EscrowManagementPage: React.FC<EscrowManagementPageProps> = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedEscrow, setSelectedEscrow] = useState<string | null>(null);

  // Mock escrow data
  const mockEscrowAccounts: (EscrowAccount & { contractTitle: string; clientName: string; freelancerName: string })[] = [
    {
      id: 'escrow1',
      contractId: 'contract1',
      contractTitle: 'تطوير موقع التجارة الإلكترونية',
      clientName: 'شركة التقنية المتقدمة',
      freelancerName: 'أحمد حسن',
      totalAmount: 5000,
      currency: 'AED',
      heldAmount: 3000,
      releasedAmount: 2000,
      status: 'active',
      transactions: [
        {
          id: 'etx1',
          type: 'deposit',
          amount: 5000,
          currency: 'AED',
          description: 'إيداع مبلغ العقد',
          createdAt: new Date('2024-01-15')
        },
        {
          id: 'etx2',
          type: 'release',
          amount: 2000,
          currency: 'AED',
          description: 'إطلاق دفعة المرحلة الأولى',
          milestoneId: 'mile1',
          createdAt: new Date('2024-02-16')
        }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-16')
    },
    {
      id: 'escrow2',
      contractId: 'contract2',
      contractTitle: 'تصميم هوية بصرية',
      clientName: 'أحمد محمد',
      freelancerName: 'سارة علي',
      totalAmount: 20,
      currency: 'AED',
      heldAmount: 20,
      releasedAmount: 0,
      status: 'disputed',
      transactions: [
        {
          id: 'etx3',
          type: 'deposit',
          amount: 20,
          currency: 'AED',
          description: 'إيداع ساعات العمل',
          createdAt: new Date('2024-02-01')
        },
        {
          id: 'etx4',
          type: 'dispute_hold',
          amount: 20,
          currency: 'AED',
          description: 'تجميد بسبب نزاع',
          createdAt: new Date('2024-02-10')
        }
      ],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-10')
    }
  ];

  const filteredEscrows = mockEscrowAccounts.filter(escrow => {
    if (activeTab === 'all') return true;
    return escrow.status === activeTab;
  });

  const handleReleaseEscrow = async (escrowId: string, amount?: number) => {
    try {
      console.log(`Releasing escrow ${escrowId}`, amount ? `amount: ${amount}` : 'full amount');
      // Here you would call your API to release the escrow
      // await releaseEscrow(escrowId, amount);
    } catch (error) {
      console.error('Failed to release escrow:', error);
    }
  };

  const handleRefundEscrow = async (escrowId: string, amount?: number) => {
    try {
      console.log(`Refunding escrow ${escrowId}`, amount ? `amount: ${amount}` : 'full amount');
      // Here you would call your API to refund the escrow
      // await refundEscrow(escrowId, amount);
    } catch (error) {
      console.error('Failed to refund escrow:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'disputed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'disputed': return 'متنازع عليه';
      default: return status;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'AED') {
      return `${amount} درهم`;
    }
    return `${amount} ${currency}`;
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الضمان</h1>
              <p className="text-gray-600">إدارة حسابات الضمان والمعاملات المالية</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                تحديث
              </Button>
              <Button
                variant="primary"
                leftIcon={<Download className="h-4 w-4" />}
              >
                تصدير التقرير
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المبلغ المحجوز</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    mockEscrowAccounts.reduce((sum, escrow) => sum + escrow.heldAmount, 0),
                    'AED'
                  )}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">حسابات الضمان النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockEscrowAccounts.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">النزاعات المفتوحة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockEscrowAccounts.filter(e => e.status === 'disputed').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المبلغ المُطلق هذا الشهر</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    mockEscrowAccounts.reduce((sum, escrow) => sum + escrow.releasedAmount, 0),
                    'AED'
                  )}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'active', name: 'نشط', count: mockEscrowAccounts.filter(e => e.status === 'active').length },
                { id: 'disputed', name: 'متنازع عليه', count: mockEscrowAccounts.filter(e => e.status === 'disputed').length },
                { id: 'completed', name: 'مكتمل', count: mockEscrowAccounts.filter(e => e.status === 'completed').length },
                { id: 'all', name: 'الكل', count: mockEscrowAccounts.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#2E86AB] text-[#2E86AB]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredEscrows.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد حسابات ضمان</h3>
                <p className="text-gray-600">لا توجد حسابات ضمان تطابق الفلتر المحدد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEscrows.map(escrow => (
                  <div key={escrow.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {escrow.contractTitle}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">العميل:</span> {escrow.clientName}
                          </div>
                          <div>
                            <span className="font-medium">المستقل:</span> {escrow.freelancerName}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>تم الإنشاء: {formatDate(escrow.createdAt)}</span>
                          <span>آخر تحديث: {formatDate(escrow.updatedAt)}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(escrow.status)}`}>
                        {getStatusText(escrow.status)}
                      </span>
                    </div>

                    {/* Escrow Details */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(escrow.totalAmount, escrow.currency)}
                        </div>
                        <div className="text-sm text-gray-600">المبلغ الإجمالي</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-600">
                          {formatCurrency(escrow.heldAmount, escrow.currency)}
                        </div>
                        <div className="text-sm text-gray-600">محجوز</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(escrow.releasedAmount, escrow.currency)}
                        </div>
                        <div className="text-sm text-gray-600">مُطلق</div>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">آخر المعاملات</h4>
                      <div className="space-y-2">
                        {escrow.transactions.slice(0, 3).map(transaction => (
                          <div key={transaction.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{transaction.description}</span>
                              <span className="text-xs text-gray-500 block">{formatDate(transaction.createdAt)}</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              transaction.type === 'release' ? 'text-green-600' :
                              transaction.type === 'refund' ? 'text-red-600' :
                              'text-blue-600'
                            }`}>
                              {transaction.type === 'release' ? '+' : 
                               transaction.type === 'refund' ? '-' : ''}
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedEscrow(escrow.id)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        عرض التفاصيل
                      </button>
                      
                      {escrow.status === 'active' && escrow.heldAmount > 0 && (
                        <>
                          <button
                            onClick={() => handleReleaseEscrow(escrow.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            إطلاق المبلغ
                          </button>
                          <button
                            onClick={() => handleRefundEscrow(escrow.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <RefreshCw className="h-4 w-4" />
                            استرداد
                          </button>
                        </>
                      )}
                      
                      {escrow.status === 'disputed' && (
                        <button
                          onClick={() => setActivePage('contracts')}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          حل النزاع
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Escrow Details Modal */}
        {selectedEscrow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">تفاصيل حساب الضمان</h3>
                <button
                  onClick={() => setSelectedEscrow(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Detailed escrow information would go here */}
              <div className="space-y-6">
                <p className="text-gray-600">تفاصيل حساب الضمان #{selectedEscrow}</p>
                {/* Add more detailed information here */}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedEscrow(null)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowManagementPage;