'use client';
import React, { useState } from 'react';

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<'Physical' | 'Digital' | 'Subscription'>('Physical');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory & Catalog</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
            + Add New Product
          </button>
        </div>

        {/* OOP Discriminator Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-300 pb-2">
          {['Physical', 'Digital', 'Subscription'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} Products
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-4 text-sm">
            You are managing the <strong>{activeTab}Product</strong> discriminator schema. 
            Depending on the type selected, unique fields will be required.
          </p>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specific Fields</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Mock data representing the polymorphic structure */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Example {activeTab} Item</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹99.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activeTab === 'Physical' && 'Weight: 1kg, Delivery: ₹5'}
                  {activeTab === 'Digital' && 'Instant Download: Yes'}
                  {activeTab === 'Subscription' && 'Renewal: Monthly'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">
                  Edit
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
