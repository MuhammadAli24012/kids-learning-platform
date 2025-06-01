import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('parent@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);
      
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        // Navigate based on user role
        if (user.role === 'child') {
          navigate('/kids-dashboard');
        } else {
          navigate('/parent-dashboard');
        }
      } else {
        toast.error('Invalid email or password. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-purple-400/10 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-20 w-24 h-24 bg-blue-400/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-pink-400/10 rounded-full animate-pulse delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Home */}
        <Link 
          to="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Rocket className="h-8 w-8 text-white" />
            </motion.div>
            
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sign in to continue your learning adventure
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                Try demo accounts:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                  <p className="font-medium text-purple-700 dark:text-purple-300">Parent Account</p>
                  <p className="text-purple-600 dark:text-purple-400">parent@example.com</p>
                  <p className="text-purple-600 dark:text-purple-400">password123</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                  <p className="font-medium text-blue-700 dark:text-blue-300">Child Account</p>
                  <p className="text-blue-600 dark:text-blue-400">Use child switch</p>
                  <p className="text-blue-600 dark:text-blue-400">in parent dashboard</p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                Create one here
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
