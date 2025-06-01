import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  Lock,
  Crown,
  Sparkles,
  Heart,
  Globe
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useAuthStore } from '../store/authStore';
import type { Story } from '../types';

export default function StoriesPage() {
  const { user } = useAuthStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [stories, searchTerm, selectedCategory, selectedLanguage]);

  const loadStories = async () => {
    try {
      const response = await fetch('/data/stories.json');
      const data = await response.json();
      setStories(data.stories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStories = () => {
    let filtered = stories.filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
      const matchesLanguage = selectedLanguage === 'all' || story.languages.includes(selectedLanguage);
      
      return matchesSearch && matchesCategory && matchesLanguage;
    });

    setFilteredStories(filtered);
  };

  const canReadStory = (story: Story) => {
    if (!user) return false;
    
    const userSubscription = user.subscription || 'free';
    
    switch (story.subscription) {
      case 'free':
        return true;
      case 'standard':
        return userSubscription === 'standard' || userSubscription === 'premium';
      case 'premium':
        return userSubscription === 'premium';
      default:
        return false;
    }
  };

  const getSubscriptionIcon = (subscription: string) => {
    switch (subscription) {
      case 'standard':
        return <Star className="h-4 w-4 text-blue-500" />;
      case 'premium':
        return <Crown className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'adventure':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'educational':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      case 'moral':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
      case 'fantasy':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'english':
        return '🇺🇸';
      case 'arabic':
        return '🇸🇦';
      case 'urdu':
        return '🇵🇰';
      default:
        return '🌍';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Story Adventures
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore magical tales and educational stories that spark imagination and teach valuable lessons!
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="moral">Moral</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                </SelectContent>
              </Select>

              {/* Language Filter */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="arabic">🇸🇦 Arabic</SelectItem>
                  <SelectItem value="urdu">🇵🇰 Urdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>
                Showing {filteredStories.length} of {stories.length} stories
              </span>
              {(searchTerm || selectedCategory !== 'all' || selectedLanguage !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedLanguage('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredStories.map((story, index) => {
          const canRead = canReadStory(story);
          
          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <div className="relative">
                  {/* Story Image */}
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Subscription Badge */}
                  {story.subscription !== 'free' && (
                    <div className="absolute top-3 right-3">
                      <Badge className={`${story.subscription === 'premium' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                        {getSubscriptionIcon(story.subscription)}
                        <span className="ml-1 capitalize">{story.subscription}</span>
                      </Badge>
                    </div>
                  )}

                  {/* Languages */}
                  <div className="absolute top-3 left-3">
                    <div className="flex space-x-1">
                      {story.languages.slice(0, 3).map((language) => (
                        <span key={language} className="text-lg">
                          {getLanguageFlag(language)}
                        </span>
                      ))}
                      {story.languages.length > 3 && (
                        <span className="text-xs bg-black/50 text-white px-1 rounded">
                          +{story.languages.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lock Overlay for Premium Content */}
                  {!canRead && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">
                          {story.subscription === 'premium' ? 'Premium' : 'Standard'} Plan Required
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title and Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {story.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(story.category)}>
                        {story.category}
                      </Badge>
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                        {story.difficulty}
                      </Badge>
                    </div>

                    {/* Story Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {story.estimatedTime}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {story.ageRange}
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-600">
                        <Star className="h-4 w-4 mr-1" />
                        {story.xpReward} XP
                      </div>
                    </div>

                    {/* Moral Lesson */}
                    {story.moral && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Lesson:</span> {story.moral}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Chapters Count */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{story.chapters.length} chapters</span>
                      <div className="flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        <span>{story.languages.length} languages</span>
                      </div>
                    </div>

                    {/* Read Button */}
                    <div className="pt-2">
                      {canRead ? (
                        <Link to={`/stories/${story.id}`} className="block">
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white group/btn">
                            <BookOpen className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            Read Story
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/pricing" className="block">
                          <Button variant="outline" className="w-full">
                            <Lock className="h-4 w-4 mr-2" />
                            Upgrade to Read
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* No Results */}
      {filteredStories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No stories found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Try adjusting your search or filters to find more stories.
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedLanguage('all');
            }}
            variant="outline"
          >
            Clear All Filters
          </Button>
        </motion.div>
      )}

      {/* Featured Stories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              New Stories Added Weekly!
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Discover fresh adventures and educational tales every week. Our library is constantly growing with stories that entertain and educate.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>3 Languages</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                <span>Moral Lessons</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Age-Appropriate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade Prompt */}
      {user?.subscription === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                Unlock Premium Stories!
              </h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Access our complete library of stories with moral lessons, multilingual support, and interactive features designed to enhance reading comprehension.
              </p>
              <Link to="/pricing">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Crown className="h-5 w-5 mr-2" />
                  View Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
