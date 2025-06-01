import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Gamepad2, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  Settings,
  Users,
  CreditCard,
  Star,
  Target
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  const navigationItems = user.role === 'child' ? [
    {
      name: 'Dashboard',
      href: '/kids-dashboard',
      icon: Home,
      description: 'Your learning home'
    },
    {
      name: 'Games',
      href: '/games',
      icon: Gamepad2,
      description: 'Play & learn'
    },
    {
      name: 'Stories',
      href: '/stories',
      icon: BookOpen,
      description: 'Read adventures'
    },
    {
      name: 'Achievements',
      href: '/achievements',
      icon: Trophy,
      description: 'Your rewards'
    }
  ] : [
    {
      name: 'Dashboard',
      href: '/parent-dashboard',
      icon: Home,
      description: 'Overview'
    },
    {
      name: 'Children',
      href: '/children',
      icon: Users,
      description: 'Manage kids'
    },
    {
      name: 'Progress',
      href: '/progress',
      icon: BarChart3,
      description: 'Learning analytics'
    },
    {
      name: 'Subscription',
      href: '/subscription',
      icon: CreditCard,
      description: 'Billing & plans'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Account settings'
    }
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-purple-200 dark:border-purple-700 z-40 hidden lg:block"
    >
      <div className="flex flex-col h-full">
        {/* User Info */}
        <div className="p-6 border-b border-purple-100 dark:border-purple-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
              {user.role === 'child' && user.progress && (
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>Level {user.progress.level}</span>
                </div>
              )}
            </div>
          </div>
          
          {user.role === 'child' && user.progress && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress to next level</span>
                <span>{user.progress.totalXP} XP</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((user.progress.totalXP % 1000) / 10, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-600 dark:hover:text-purple-400'
                      }
                    `}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-purple-500'}`} />
                    <div>
                      <div>{item.name}</div>
                      <div className={`text-xs ${isActive ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Stats for Kids */}
        {user.role === 'child' && user.progress && (
          <div className="p-4 border-t border-purple-100 dark:border-purple-800">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Today's Progress</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {user.progress.gamesCompleted}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Games</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {user.progress.storiesRead}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Stories</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Target className="h-3 w-3" />
                <span>{user.progress.streakDays} day streak!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
