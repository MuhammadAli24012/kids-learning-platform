import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Star, 
  Rocket, 
  Crown, 
  Shield,
  Zap,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import Header from '../components/layout/Header';
import type { SubscriptionPlan } from '../types';

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetch('/data/plans.json');
      const data = await response.json();
      setPlans(data.plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Rocket className="h-8 w-8" />;
      case 'standard':
        return <Star className="h-8 w-8" />;
      case 'premium':
        return <Crown className="h-8 w-8" />;
      default:
        return <Rocket className="h-8 w-8" />;
    }
  };

  const getPlanPrice = (plan: SubscriptionPlan) => {
    if (plan.price === 0) return 'Free';
    if (isYearly && plan.yearlyPrice) {
      const monthlyEquivalent = plan.yearlyPrice / 12;
      return `$${monthlyEquivalent.toFixed(2)}/mo`;
    }
    return `$${plan.price}/mo`;
  };

  const getYearlySavings = (plan: SubscriptionPlan) => {
    if (!plan.yearlyPrice) return 0;
    const monthlyTotal = plan.price * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Link */}
        <Link 
          to="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Choose Your
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Learning Adventure
              </span>
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Start with our free plan and upgrade anytime to unlock more games, stories, and features for your child's learning journey.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full p-2 inline-flex">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-purple-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-500"
            />
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-purple-600' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">
                Save up to 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = getPlanIcon(plan.id);
            const savings = getYearlySavings(plan);
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <Card className={`relative overflow-hidden border-0 shadow-2xl h-full ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/50' 
                    : 'bg-white/80 dark:bg-gray-900/80'
                } backdrop-blur-md`}>
                  <CardHeader className="text-center pb-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white"
                      style={{ backgroundColor: plan.color }}
                    >
                      {Icon}
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </CardTitle>
                    
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {getPlanPrice(plan)}
                      </div>
                      
                      {plan.price > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {isYearly && plan.yearlyPrice ? (
                            <div className="space-y-1">
                              <div>${plan.yearlyPrice}/year</div>
                              {savings > 0 && (
                                <div className="text-green-600 dark:text-green-400 font-medium">
                                  Save {savings}% yearly
                                </div>
                              )}
                            </div>
                          ) : (
                            `Billed ${plan.billingCycle}`
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mt-4">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Plan Limits:
                        </h4>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="text-xs text-gray-500 dark:text-gray-400">
                            • {limitation}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="pt-6">
                      {plan.id === 'free' ? (
                        <Link to="/register">
                          <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                            Get Started Free
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/register">
                          <Button 
                            className={`w-full ${
                              plan.popular 
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl' 
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            } transition-all duration-300`}
                          >
                            {plan.popular ? (
                              <div className="flex items-center space-x-2">
                                <Zap className="h-4 w-4" />
                                <span>Start Free Trial</span>
                              </div>
                            ) : (
                              'Choose Plan'
                            )}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>

                  {/* Popular plan highlight */}
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none" />
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Why Choose KidsSpace?
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Our platform is designed specifically for children's learning and development
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Safe & Secure
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Kid-friendly environment with no ads, secure data protection, and parental controls.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Expert-Designed
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Content created by education specialists following proven learning methodologies.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Engaging & Fun
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Gamified learning with rewards, achievements, and interactive storytelling.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our free plan gives you access to basic features. Premium plans include a 7-day free trial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                How many children can use one account?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Parent accounts can manage multiple children. Each child gets their own personalized experience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What languages are supported?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We support English, Arabic, and Urdu with more languages coming soon.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
