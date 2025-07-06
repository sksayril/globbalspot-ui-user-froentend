import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Hotel } from '../App';

interface HotelsPageProps {
  hotels: Hotel[];
  onHotelSelect: (hotel: Hotel) => void;
}

const HotelsPage: React.FC<HotelsPageProps> = ({ hotels, onHotelSelect }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-6 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Hotel products</h1>
          <ChevronRight className="w-6 h-6" />
        </div>
      </div>

      {/* Hotel List */}
      <div className="p-4 space-y-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="flex">
              {/* Hotel Image */}
              <div className="w-24 h-24 relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{hotel.tier}</span>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{hotel.name}</h3>
                  <button
                    onClick={() => onHotelSelect(hotel)}
                    className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    Buy
                  </button>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price</span>
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
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-pink-600">{hotel.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${hotel.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* No More Data */}
        <div className="text-center py-8">
          <p className="text-gray-500">No more data</p>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;