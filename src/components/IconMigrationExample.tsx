import React from 'react';
import { 
  User, 
  ArrowRight, 
  MagnifyingGlass, 
  ChatCircle, 
  Check, 
  Warning 
} from '@phosphor-icons/react';

/**
 * Example component showing Phosphor icons usage
 */
const IconMigrationExample: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-[1.2rem] shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <ChatCircle className="h-6 w-6 text-cobalt mr-2" weight="fill" />
        Phosphor Icons Example
      </h2>
      
      <p className="text-gray-700 mb-6">
        This component demonstrates how to use Phosphor icons with various weights and sizes.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-[1.2rem]">
          <User className="h-8 w-8 text-cobalt mb-2" />
          <span className="text-sm">User (Regular)</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-[1.2rem]">
          <ArrowRight className="h-8 w-8 text-cobalt mb-2" weight="bold" />
          <span className="text-sm">ArrowRight (Bold)</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-[1.2rem]">
          <MagnifyingGlass className="h-8 w-8 text-cobalt mb-2" weight="light" />
          <span className="text-sm">MagnifyingGlass (Light)</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-[1.2rem]">
          <ChatCircle className="h-8 w-8 text-cobalt mb-2" weight="fill" />
          <span className="text-sm">ChatCircle (Fill)</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center text-green-600">
          <Check className="h-5 w-5 mr-2" weight="bold" />
          <span>Phosphor icons support multiple weights</span>
        </div>
        
        <div className="flex items-center text-green-600">
          <Check className="h-5 w-5 mr-2" weight="bold" />
          <span>Icons can be colored using text-{color} classes</span>
        </div>
        
        <div className="flex items-center text-green-600">
          <Check className="h-5 w-5 mr-2" weight="bold" />
          <span>Size can be controlled with h-{size} and w-{size}</span>
        </div>
        
        <div className="flex items-center text-yellow-600">
          <Warning className="h-5 w-5 mr-2" weight="fill" />
          <span>Remember to update all icon imports in your components</span>
        </div>
      </div>
    </div>
  );
};

export default IconMigrationExample;