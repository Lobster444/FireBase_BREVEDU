import React from 'react';
import {
  // Navigation
  ArrowRight,
  ArrowLeft,
  CaretRight,
  CaretDown,
  
  // UI Controls
  X,
  List,
  DotsThree,
  MagnifyingGlass,
  
  // Actions
  PencilSimple,
  Trash,
  Plus,
  Check,
  
  // Status
  CheckCircle,
  Eye,
  EyeSlash,
  WarningCircle,
  Warning,
  Info,
  
  // Media
  Play,
  Pause,
  SpeakerHigh,
  VideoCamera,
  Image,
  
  // Communication
  Envelope,
  ChatCircle,
  
  // Users
  User,
  Users,
  SignOut,
  
  // Misc
  Lightning,
  Sparkle,
  Crown,
  Quotes,
  
  // Files
  File,
  FileText,
  FloppyDisk
} from '@phosphor-icons/react';

/**
 * Comprehensive guide to Phosphor icons usage
 */
const PhosphorIconsGuide: React.FC = () => {
  // Available weights
  const weights = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'] as const;
  
  // Icon categories for display
  const iconCategories = [
    {
      name: 'Navigation',
      icons: [
        { icon: ArrowRight, name: 'ArrowRight' },
        { icon: ArrowLeft, name: 'ArrowLeft' },
        { icon: CaretRight, name: 'CaretRight' },
        { icon: CaretDown, name: 'CaretDown' }
      ]
    },
    {
      name: 'UI Controls',
      icons: [
        { icon: X, name: 'X' },
        { icon: List, name: 'List' },
        { icon: DotsThree, name: 'DotsThree' },
        { icon: MagnifyingGlass, name: 'MagnifyingGlass' }
      ]
    },
    {
      name: 'Actions',
      icons: [
        { icon: PencilSimple, name: 'PencilSimple' },
        { icon: Trash, name: 'Trash' },
        { icon: Plus, name: 'Plus' },
        { icon: Check, name: 'Check' }
      ]
    },
    {
      name: 'Status',
      icons: [
        { icon: CheckCircle, name: 'CheckCircle' },
        { icon: Eye, name: 'Eye' },
        { icon: EyeSlash, name: 'EyeSlash' },
        { icon: Warning, name: 'Warning' }
      ]
    },
    {
      name: 'Communication',
      icons: [
        { icon: Envelope, name: 'Envelope' },
        { icon: ChatCircle, name: 'ChatCircle' },
        { icon: User, name: 'User' },
        { icon: SignOut, name: 'SignOut' }
      ]
    }
  ];

  return (
    <div className="p-6 bg-white rounded-[1.2rem] shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <Sparkle className="h-6 w-6 text-cobalt mr-2" weight="fill" />
          Phosphor Icons Guide
        </h1>
        <p className="text-gray-700">
          This guide shows how to use Phosphor icons in your React components.
        </p>
      </div>

      {/* Icon Weights */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Icon Weights</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {weights.map(weight => (
            <div key={weight} className="flex flex-col items-center p-4 bg-gray-50 rounded-[1.2rem]">
              <Lightning className="h-8 w-8 text-cobalt mb-2" weight={weight} />
              <span className="text-sm capitalize">{weight}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Icon Categories */}
      <section className="space-y-8">
        {iconCategories.map(category => (
          <div key={category.name}>
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.icons.map(({ icon: Icon, name }) => (
                <div key={name} className="flex flex-col items-center p-4 bg-gray-50 rounded-[1.2rem]">
                  <Icon className="h-8 w-8 text-cobalt mb-2" />
                  <span className="text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Usage Examples */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
        
        <div className="space-y-4 bg-gray-50 p-4 rounded-[1.2rem]">
          <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
          <pre className="bg-gray-800 text-white p-3 rounded-[0.8rem] overflow-x-auto">
            <code>{`import { ChatCircle } from '@phosphor-icons/react';\n\n<ChatCircle className="h-6 w-6 text-cobalt" />`}</code>
          </pre>
        </div>
        
        <div className="space-y-4 bg-gray-50 p-4 rounded-[1.2rem] mt-4">
          <h3 className="text-lg font-medium mb-2">With Weight</h3>
          <pre className="bg-gray-800 text-white p-3 rounded-[0.8rem] overflow-x-auto">
            <code>{`import { ChatCircle } from '@phosphor-icons/react';\n\n<ChatCircle className="h-6 w-6 text-cobalt" weight="fill" />`}</code>
          </pre>
        </div>
        
        <div className="space-y-4 bg-gray-50 p-4 rounded-[1.2rem] mt-4">
          <h3 className="text-lg font-medium mb-2">With Button</h3>
          <pre className="bg-gray-800 text-white p-3 rounded-[0.8rem] overflow-x-auto">
            <code>{`import { Button } from './Button';\nimport { MagnifyingGlass } from '@phosphor-icons/react';\n\n<Button icon={MagnifyingGlass}>Search</Button>`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
};

export default PhosphorIconsGuide;