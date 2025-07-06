import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Hotel } from '../App';

interface HotelDetailProps {
  hotel: Hotel;
  onBack: () => void;
  onPurchase: (hotel: Hotel) => void;
}

const HotelDetail: React.FC<HotelDetailProps> = ({ hotel, onBack, onPurchase }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Detail</h1>
        </div>
      </div>

      {/* Hotel Image */}
      <div className="relative">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <span className="text-white font-bold text-6xl">{hotel.tier}</span>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{hotel.name}</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Product price</div>
            <div className="text-lg font-bold text-gray-800">₹{hotel.price}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Daily rate</div>
            <div className="text-lg font-bold text-gray-800">{hotel.dailyRate}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Daily income</div>
            <div className="text-lg font-bold text-gray-800">₹{hotel.dailyIncome}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Contract Period</div>
            <div className="text-lg font-bold text-gray-800">{hotel.contractPeriod} Days</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Profit</div>
            <div className="text-lg font-bold text-gray-800">₹{hotel.totalProfit}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Principal+income</div>
            <div className="text-lg font-bold text-gray-800">₹{hotel.principalIncome}</div>
          </div>
        </div>

        {/* Purchase Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Purchase quantity limit</span>
            <span className="text-red-600 font-medium">{hotel.purchaseLimit} times</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Purchase Level Requirements</span>
            <span className="text-red-600 font-medium">{hotel.levelRequirement}</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Details:</h3>
          <p className="text-gray-600 leading-relaxed">
            <strong>Features:</strong> {hotel.description}
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">₹{hotel.price}</div>
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={() => onPurchase(hotel)}
          className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default HotelDetail;