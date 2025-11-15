import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

export function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 border border-gold-100 flex gap-4 sm:gap-6">
      {/* Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">{item.name}</h3>
        <p className="text-gold-600 font-semibold text-sm sm:text-base mb-3">₹{item.price.toFixed(2)}</p>

        {/* Quantity Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-1 hover:bg-gold-50 rounded transition"
          >
            <Minus size={18} className="text-gold-600" />
          </button>
          <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 hover:bg-gold-50 rounded transition"
          >
            <Plus size={18} className="text-gold-600" />
          </button>
        </div>
      </div>

      {/* Total & Remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="font-bold text-gray-800 text-sm sm:text-base">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:bg-red-50 p-2 rounded transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
