import React from 'react';
import { X } from 'lucide-react';
import { Hotel } from '../App';

interface PurchaseModalProps {
  hotel: Hotel;
  onClose: () => void;
  onConfirm: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ hotel, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-xl p-6 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Product name</span>
            <span className="font-medium">{hotel.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Product price</span>
            <span className="font-medium">₹{hotel.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Daily income</span>
            <span className="font-medium">₹{hotel.dailyIncome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Contract Period</span>
            <span className="font-medium">{hotel.contractPeriod} Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Profit</span>
            <span className="font-medium">₹{hotel.totalProfit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium">-0.00 Rs</span>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="text-gray-600">Pay Amount</span>
            <span className="font-bold text-lg">₹{hotel.price}</span>
          </div>
        </div>

        {/* Warning */}
        <div className="text-sm text-red-600 mb-6">
          The upper limit is {hotel.purchaseLimit} times
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PurchaseModal;