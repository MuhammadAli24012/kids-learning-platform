import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Trophy, 
  Rocket, 
  BookOpen, 
  Gamepad2, 
  Target, 
  Flame,
  Gift,
  PlayCircle,
  ChevronRight,
  Calendar,
  Award
} from 'lucide-react';
import Confetti from 'react-confetti';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useAuthStore } from '../store/authStore';
import type { Game, Story, Achievement } from '../types';

export default function KidsDashboard() {
  const { user } = useAuthStore();
  const [games, setGames] = useState<Game[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Load data
    loadGames();
    loadStories();
    loadAchievements();

    // Show confetti for new achievements or level ups
    if (user?.progress && user.progress.level > 1) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [user]);

  const loadGames = async () => {
    try {
      const response = await fetch('/data/games.json');
      const data = await response.json();
      setGames(data.games.slice(0, 3)); // Show only first 3 games
    } catch (error) {
      console.error('Failed to load games:', error);
    }
  };

  const loadStories = async () => {
    try {
      const response = await fetch('/data/stories.json');
      const data = await response.json();
      setStories(data.stories.slice(0, 3)); // Show only first 3 stories
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      const response = await fetch('/data/achievements.json');
      const data = await response.json();
      setAchievements(data.achievements);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  if (!user || user.role !== 'child') {
    return null;
  }

  const progress = user.progress || {
    totalXP: 0,
    level: 1,
    gamesCompleted: 0,
    storiesRead: 0,
    streakDays: 0,
    achievements: []
  };

  const nextLevelXP = progress.level * 1000;
  const currentLevelProgress = (progress.totalXP % 1000) / 10;

  const earnedAchievements = achievements.filter(achievement => 
    progress.achievements.includes(achievement.id)
  );

  const recentAchievements = earnedAchievements.slice(-3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/10 rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {greeting()}, {user.name}! 🚀
              </h1>
              <p className="text-purple-100 text-lg">
                Ready for another learning adventure?
              </p>
            </div>
            
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="hidden md:block"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Rocket className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {progress.level} Space Explorer</span>
              <span className="text-sm">{progress.totalXP} / {nextLevelXP} XP</span>
            </div>
            <Progress value={currentLevelProgress} className="h-3" />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 border-purple-200 dark:border-purple-700">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {progress.totalXP}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Total XP</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {progress.gamesCompleted}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Games Won</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {progress.storiesRead}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">Stories Read</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50 border-orange-200 dark:border-orange-700">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {progress.streakDays}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">Day Streak</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Featured Games */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Gamepad2 className="h-5 w-5 text-purple-500" />
                <span>Featured Games</span>
              </CardTitle>
              <Link to="/games">
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
                >
                  <Link to={`/games/${game.id}`}>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img 
                        src={game.image} 
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {game.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                        {game.category}
                      </span>
                      <div className="flex items-center text-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        {game.xpReward} XP
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span>Story Adventures</span>
              </CardTitle>
              <Link to="/stories">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {stories.map((story) => (
                <motion.div
                  key={story.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
                >
                  <Link to={`/stories/${story.id}`}>
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {story.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        {story.estimatedTime}
                      </span>
                      <div className="flex items-center text-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        {story.xpReward} XP
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Recent Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {recentAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-4 text-center"
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl"
                      style={{ backgroundColor: achievement.color + '20' }}
                    >
                      {achievement.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center text-xs text-yellow-600">
                      <Award className="h-3 w-3 mr-1" />
                      +{achievement.xpReward} XP
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Today's Mission</h3>
                <p className="text-green-100 mb-4">
                  Complete 2 activities to maintain your streak!
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span className="text-sm">Progress: 1/2</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">Streak: {progress.streakDays} days</span>
                  </div>
                </div>
              </div>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
              >
                <Gift className="h-8 w-8" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
