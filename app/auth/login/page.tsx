'use client'

import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { AlertCircle, Loader2, AlertTriangle, ArrowRight, CheckCircle2, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import JobFoxyLogo from '@/components/assets/JobFoxyDark.svg'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

// Wrapper component with Suspense for useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signInWithGoogle, user, loading: authLoading, initialize } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSupabaseConfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')

  // Check for OAuth error in URL params
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Initialize auth on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn(data.email, data.password)

      if (error) {
        setError(error)
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error)
        setGoogleLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during Google sign in')
      setGoogleLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex">
      
      {/* LEFT SIDE: Visual & Testimonial (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1615] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
           <div className="w-36 h-36 relative">
              <Image 
                src={JobFoxyLogo} 
                alt="Job Foxy" 
                fill 
                className="object-contain"
              />
           </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md">
           <h1 className="text-4xl font-bold mb-6 leading-tight">
             Master your interview skills with AI
           </h1>
           <ul className="space-y-4 mb-12">
             {['Real-time voice feedback', 'STAR method coaching', 'Resume analysis'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                   <CheckCircle2 className="w-5 h-5 text-blue-400" />
                   {item}
                </li>
             ))}
           </ul>

           {/* Testimonial Card */}
           <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex gap-1 mb-3">
                 {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-gray-200 leading-relaxed mb-4">
                 "I was terrified of behavioral interviews. Job Foxy helped me structure my thoughts and I landed the Senior PM role at TechCorp!"
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-400" />
                 <div>
                    <div className="font-bold text-sm">Sarah Jenkins</div>
                    <div className="text-xs text-gray-400">Product Manager</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer text */}
        <div className="relative z-10 text-xs text-gray-500">
           © {new Date().getFullYear()} Job Foxy. All rights reserved.
        </div>
      </div>


      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#1a1615] tracking-tight">Welcome back</h2>
            <p className="mt-2 text-gray-500">
              Please enter your details to sign in.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Supabase Config Missing</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Add credentials to <code className="bg-amber-100 px-1 rounded">.env.local</code>
                </p>
              </div>
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">or sign in with email</span>
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
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-bold text-white bg-[#1a1615] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}