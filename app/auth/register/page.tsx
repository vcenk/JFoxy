'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { AlertCircle, Loader2, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import JobFoxyLogo from '@/components/assets/JobFoxy.svg'

// --- VALIDATION SCHEMA ---
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, signInWithGoogle, user, loading: authLoading, initialize } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSupabaseConfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  useEffect(() => { initialize() }, [initialize])

  useEffect(() => {
    if (user && !authLoading) router.push('/dashboard')
  }, [user, authLoading, router])

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await signUp(data.email, data.password, data.fullName)
      if (error) setError(error)
      else router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error)
        setGoogleLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during Google sign up')
      setGoogleLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a1615]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex">
      
      {/* LEFT SIDE: Visual (Dark Theme) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1615] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Ambient Backgrounds */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
           <div className="w-14 h-14 relative">
              <Image 
                src={JobFoxyLogo} 
                alt="Job Foxy" 
                fill 
                className="object-contain" 
              />
           </div>
           <span className="font-bold text-xl tracking-tight">Job Foxy</span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md">
           <h1 className="text-4xl font-bold mb-6 leading-tight">
             Your AI coach is ready to help you win.
           </h1>
           <p className="text-lg text-gray-400 mb-10 leading-relaxed">
             Join thousands of candidates who are turning interview anxiety into offers.
           </p>

           {/* Floating Feature Cards */}
           <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                 </div>
                 <div>
                    <div className="font-bold text-sm">Free Forever Plan</div>
                    <div className="text-xs text-gray-400">Get started without a credit card</div>
                 </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                 </div>
                 <div>
                    <div className="font-bold text-sm">Private & Secure</div>
                    <div className="text-xs text-gray-400">Your practice sessions are private to you</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-gray-500">
           © {new Date().getFullYear()} Job Foxy. Crafted for success.
        </div>
      </div>


      {/* RIGHT SIDE: Form (Light Theme) */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-[#1a1615] tracking-tight">Create account</h2>
            <p className="mt-2 text-gray-500">
              Get started with your free account today.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <span className="font-medium">Config Missing:</span> Add Supabase credentials to .env.local
              </div>
            </div>
          )}

          {/* Social Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || !isSupabaseConfigured}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700 disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin h-5 w-5 text-gray-600" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign up with Google</span>
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">or sign up with email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input
                {...register('fullName')}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                {...register('password')}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

              {/* Password Strength Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: '8+ chars', valid: password.length >= 8 },
                  { label: 'Uppercase', valid: /[A-Z]/.test(password) },
                  { label: 'Lowercase', valid: /[a-z]/.test(password) },
                  { label: 'Number', valid: /[0-9]/.test(password) },
                ].map((req) => (
                  <span 
                    key={req.label}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                      req.valid 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    {req.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-bold text-white bg-[#1a1615] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By joining, you agree to our{' '}
              <Link href="/terms" className="text-[#1a1615] font-semibold hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#1a1615] font-semibold hover:underline">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
