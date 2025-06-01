import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Star, 
  Trophy, 
  Calendar,
  BookOpen,
  Gamepad2,
  Target,
  Award,
  BarChart3,
  Plus,
  Settings,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuthStore } from '../store/authStore';
import type { User, Achievement } from '../types';

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const [children, setChildren] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [usersResponse, achievementsResponse] = await Promise.all([
        fetch('/data/users.json'),
        fetch('/data/achievements.json')
      ]);
      
      const usersData = await usersResponse.json();
      const achievementsData = await achievementsResponse.json();
      
      // Find children for this parent
      const childrenList = usersData.users.filter((u: User) => 
        user?.children?.includes(u.id) || u.parentId === user?.id
      );
      
      setChildren(childrenList);
      setAchievements(achievementsData.achievements);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    return children.reduce((acc, child) => {
      if (child.progress) {
        acc.totalXP += child.progress.totalXP;
        acc.gamesCompleted += child.progress.gamesCompleted;
        acc.storiesRead += child.progress.storiesRead;
        acc.achievements += child.progress.achievements.length;
      }
      return acc;
    }, { totalXP: 0, gamesCompleted: 0, storiesRead: 0, achievements: 0 });
  };

  const getWeeklyProgress = (child: User) => {
    // Mock weekly progress data
    return [
      { day: 'Mon', xp: Math.floor(Math.random() * 100) },
      { day: 'Tue', xp: Math.floor(Math.random() * 100) },
      { day: 'Wed', xp: Math.floor(Math.random() * 100) },
      { day: 'Thu', xp: Math.floor(Math.random() * 100) },
      { day: 'Fri', xp: Math.floor(Math.random() * 100) },
      { day: 'Sat', xp: Math.floor(Math.random() * 100) },
      { day: 'Sun', xp: Math.floor(Math.random() * 100) },
    ];
  };

  if (!user || user.role !== 'parent') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const totalStats = getTotalStats();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-purple-100 text-lg">
                Track your children's learning journey and celebrate their achievements
              </p>
            </div>
            
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="hidden md:block"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{children.length}</div>
              <div className="text-sm text-purple-100">Children</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{totalStats.totalXP}</div>
              <div className="text-sm text-purple-100">Total XP</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{totalStats.gamesCompleted}</div>
              <div className="text-sm text-purple-100">Games</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{totalStats.achievements}</div>
              <div className="text-sm text-purple-100">Achievements</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="children">Children</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Children Quick View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span>Children's Progress</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Child
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {children.map((child) => (
                    <motion.div
                      key={child.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg p-6 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {child.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {child.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Age {child.age} • Level {child.progress?.level || 1}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {child.progress?.totalXP || 0} XP
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {child.progress?.streakDays || 0} day streak
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Progress to next level</span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {((child.progress?.totalXP || 0) % 1000) / 10}%
                          </span>
                        </div>
                        <Progress value={((child.progress?.totalXP || 0) % 1000) / 10} className="h-2" />

                        <div className="grid grid-cols-3 gap-3 text-center text-xs">
                          <div>
                            <div className="font-semibold text-blue-600 dark:text-blue-400">
                              {child.progress?.gamesCompleted || 0}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">Games</div>
                          </div>
                          <div>
                            <div className="font-semibold text-green-600 dark:text-green-400">
                              {child.progress?.storiesRead || 0}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">Stories</div>
                          </div>
                          <div>
                            <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                              {child.progress?.achievements.length || 0}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">Badges</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {children.length === 0 && (
                    <div className="col-span-2 text-center py-8">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No children added yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Add your first child to start tracking their learning progress.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Child
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {child.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {child.name} completed a math game
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            2 hours ago • Earned 50 XP
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gamepad2 className="h-4 w-4 text-blue-500" />
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  ))}

                  {children.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No recent activity to show
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Children Tab */}
        <TabsContent value="children" className="space-y-6">
          <div className="grid gap-6">
            {children.map((child) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {child.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {child.name}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Age {child.age} • Level {child.progress?.level || 1} • {child.progress?.streakDays || 0} day streak
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Progress Stats */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Learning Progress</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Level Progress</span>
                              <span>{((child.progress?.totalXP || 0) % 1000) / 10}%</span>
                            </div>
                            <Progress value={((child.progress?.totalXP || 0) % 1000) / 10} />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {child.progress?.gamesCompleted || 0}
                              </div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">Games</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {child.progress?.storiesRead || 0}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400">Stories</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Achievements */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Recent Achievements</h4>
                        <div className="space-y-2">
                          {child.progress?.achievements.slice(-3).map((achievementId) => {
                            const achievement = achievements.find(a => a.id === achievementId);
                            return achievement ? (
                              <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                                <span className="text-xl">{achievement.icon}</span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {achievement.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    +{achievement.xpReward} XP
                                  </p>
                                </div>
                              </div>
                            ) : null;
                          })}
                          {(!child.progress?.achievements || child.progress.achievements.length === 0) && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No achievements yet
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Weekly Activity */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">This Week</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Time Spent</span>
                            <span className="font-medium">2h 30m</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">XP Earned</span>
                            <span className="font-medium">350 XP</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Activities</span>
                            <span className="font-medium">12</span>
                          </div>
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                Weekly goal: 80% complete
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span>Learning Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Subject Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Mathematics</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Language</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Science</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-300">
                        • Encourage more science activities to improve scores
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        • Great progress in language learning!
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        • Consider advanced math challenges
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span>Learning Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Weekly Schedule</h4>
                    <div className="space-y-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                        <div key={day} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                          <span className="text-sm">{day}</span>
                          <span className="text-sm text-green-600 dark:text-green-400">30 min</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Goals</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>Complete 5 games this week</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        <span>Read 3 stories this week</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span>Earn 2 new achievements</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-500" />
                <span>Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Subscription</h4>
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.subscription === 'premium' ? 'Premium Plan' : user.subscription === 'standard' ? 'Standard Plan' : 'Free Plan'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.subscription === 'free' ? 'Upgrade to unlock more features' : 'Active subscription'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      {user.subscription === 'free' ? 'Upgrade' : 'Manage'}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Parental Controls</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Screen time limits</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content filtering</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progress notifications</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Privacy & Safety</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data sharing preferences</span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Export learning data</span>
                      <Button variant="outline" size="sm">Export</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
