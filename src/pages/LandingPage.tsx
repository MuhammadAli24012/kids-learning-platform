import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Star, 
  BookOpen, 
  Gamepad2, 
  Trophy, 
  Users, 
  Globe, 
  Shield,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Header from '../components/layout/Header';

const features = [
  {
    icon: Gamepad2,
    title: 'Interactive Games',
    description: 'Educational games that make learning math, science, and languages fun and engaging.',
    color: 'from-purple-500 to-blue-500'
  },
  {
    icon: BookOpen,
    title: 'Story Adventures',
    description: 'Immersive stories in multiple languages with moral lessons and beautiful illustrations.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Trophy,
    title: 'Achievement System',
    description: 'Motivating rewards, badges, and level progression to keep kids engaged.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Globe,
    title: 'Multilingual Learning',
    description: 'Support for English, Arabic, and Urdu to help kids learn multiple languages.',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: Users,
    title: 'Parent Dashboard',
    description: 'Comprehensive analytics and progress tracking for informed parental guidance.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Shield,
    title: 'Safe Environment',
    description: 'Kid-friendly, ad-free environment with parental controls and content moderation.',
    color: 'from-indigo-500 to-purple-500'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Parent of 2 kids',
    content: 'My children absolutely love KidsSpace! They\'ve learned so much while having fun. The progress tracking helps me stay involved in their learning journey.',
    rating: 5
  },
  {
    name: 'Ahmed Al-Rashid',
    role: 'Father of 3',
    content: 'Finally, a platform that teaches Arabic and English together! My kids are becoming bilingual while playing games they actually enjoy.',
    rating: 5
  },
  {
    name: 'Fatima Khan',
    role: 'Teacher & Mom',
    content: 'As an educator, I appreciate the pedagogical approach. The content is age-appropriate and follows learning standards while being incredibly engaging.',
    rating: 5
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-400/20 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Learning
                </span>{' '}
                <span className="text-gray-900 dark:text-white">
                  Adventures
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">in</span>{' '}
                <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Space!
                </span>
              </motion.h1>
              
              <motion.p 
                className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Blast off into a universe of fun educational games, interactive stories, and multilingual learning adventures designed for kids aged 5-12.
              </motion.p>

              <motion.div 
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Rocket className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Start Learning Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button variant="outline" size="lg" className="border-purple-300 hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-900/50 group">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div 
                className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  No ads
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Safe for kids
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/hero-space-banner.jpg" 
                  alt="Kids learning in space" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-full p-3 shadow-lg"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="h-6 w-6 text-yellow-500" />
                </motion.div>
                
                <motion.div
                  className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 shadow-lg"
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium">Level Up!</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Kids Love <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">KidsSpace</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform combines education with entertainment, creating an engaging learning experience that kids actually enjoy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </CardContent>
                    
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Parents Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of families who trust KidsSpace for their children's education
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start the Adventure?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of kids who are already learning and having fun on KidsSpace. Start your free journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Rocket className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Rocket className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold">KidsSpace</span>
            </div>
            <p className="text-gray-400 mb-6">
              Making learning an adventure for kids around the world
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-500">
              © 2024 KidsSpace. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
