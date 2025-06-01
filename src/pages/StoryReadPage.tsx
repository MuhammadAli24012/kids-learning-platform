import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowLeft as ChevronLeft,
  Star, 
  BookOpen, 
  Volume2,
  VolumeX,
  Globe,
  Heart,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { toast } from 'sonner';
import type { Story } from '../types';

export default function StoryReadPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { language, setLanguage } = useAppStore();
  
  const [story, setStory] = useState<Story | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readingLanguage, setReadingLanguage] = useState(language);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    try {
      const response = await fetch('/data/stories.json');
      const data = await response.json();
      const foundStory = data.stories.find((s: Story) => s.id === storyId);
      
      if (foundStory) {
        setStory(foundStory);
        // Set reading language to first available language if current language not supported
        if (!foundStory.languages.includes(readingLanguage)) {
          setReadingLanguage(foundStory.languages[0]);
        }
      } else {
        toast.error('Story not found');
        navigate('/stories');
      }
    } catch (error) {
      console.error('Failed to load story:', error);
      toast.error('Failed to load story');
      navigate('/stories');
    }
  };

  const nextChapter = () => {
    if (story && currentChapter < story.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    } else {
      completeStory();
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const completeStory = () => {
    setIsCompleted(true);
    
    // Update user progress
    if (user && story) {
      const newProgress = {
        ...user.progress,
        totalXP: (user.progress?.totalXP || 0) + story.xpReward,
        storiesRead: (user.progress?.storiesRead || 0) + 1,
        level: Math.floor(((user.progress?.totalXP || 0) + story.xpReward) / 1000) + 1
      };
      
      updateUser({ progress: newProgress });
      toast.success(`Story completed! +${story.xpReward} XP earned!`);
    }
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
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

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'english':
        return 'English';
      case 'arabic':
        return 'العربية';
      case 'urdu':
        return 'اردو';
      default:
        return lang;
    }
  };

  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const currentChapterData = story.chapters[currentChapter];
  const progress = ((currentChapter + 1) / story.chapters.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/stories')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Stories</span>
        </Button>

        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <Select value={readingLanguage} onValueChange={(value) => setReadingLanguage(value as 'english' | 'arabic' | 'urdu')}>
            <SelectTrigger className="w-40">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {story.languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  <div className="flex items-center space-x-2">
                    <span>{getLanguageFlag(lang)}</span>
                    <span>{getLanguageName(lang)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Audio Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center space-x-2"
          >
            {audioEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Audio</span>
          </Button>
        </div>
      </motion.div>

      {/* Story Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{story.title}</h1>
            <p className="text-purple-100">{story.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{story.xpReward} XP</div>
            <div className="text-purple-200">Reward</div>
          </div>
        </div>

        {/* Story Info */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge className="bg-white/20 text-white border-white/30">
            {story.category}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            {story.estimatedTime}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            {story.ageRange}
          </Badge>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Chapter {currentChapter + 1} of {story.chapters.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </motion.div>

      {!isCompleted ? (
        <>
          {/* Chapter Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                {/* Chapter Image */}
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={currentChapterData.image} 
                    alt={currentChapterData.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Chapter Title */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {currentChapterData.title}
                      </h2>
                      <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
                    </div>

                    {/* Chapter Content */}
                    <div 
                      className={`text-lg leading-relaxed text-gray-700 dark:text-gray-300 ${
                        readingLanguage === 'arabic' || readingLanguage === 'urdu' ? 'text-right' : 'text-left'
                      }`}
                      style={{
                        fontFamily: readingLanguage === 'arabic' || readingLanguage === 'urdu' 
                          ? 'serif' 
                          : 'inherit'
                      }}
                    >
                      {currentChapterData.content[readingLanguage] || currentChapterData.content.english}
                    </div>

                    {/* Audio Placeholder */}
                    {audioEnabled && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center">
                        <Volume2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Audio narration would play here
                        </p>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-6">
                      <Button
                        variant="outline"
                        onClick={prevChapter}
                        disabled={currentChapter === 0}
                        className="flex items-center space-x-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>

                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <BookOpen className="h-4 w-4" />
                        <span>Chapter {currentChapter + 1}</span>
                      </div>

                      <Button
                        onClick={nextChapter}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex items-center space-x-2"
                      >
                        <span>
                          {currentChapter === story.chapters.length - 1 ? 'Finish Story' : 'Next'}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Story Moral */}
          {story.moral && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 border-pink-200 dark:border-pink-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Heart className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Story Lesson
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {story.moral}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      ) : (
        /* Completion Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-0 shadow-xl text-center">
            <CardContent className="p-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
                </motion.div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Story Complete! 📚
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Great job reading "{story.title}"!
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {story.xpReward}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">XP Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {story.chapters.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Chapters</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {story.estimatedTime}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Reading Time</div>
                    </div>
                  </div>
                </div>

                {/* Story Moral */}
                {story.moral && (
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 rounded-lg p-6">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Heart className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        What We Learned
                      </h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "{story.moral}"
                    </p>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => {
                      setIsCompleted(false);
                      setCurrentChapter(0);
                    }}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Read Again</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/stories')}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    More Stories
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Reading Tips */}
      {!isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Reading Tips:
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Take your time to understand each chapter</li>
                <li>• Try reading in different languages to learn new words</li>
                <li>• Think about the story's lesson and how it applies to your life</li>
                <li>• Use audio narration to improve pronunciation</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
