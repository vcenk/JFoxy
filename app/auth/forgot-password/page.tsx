'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/clients/supabaseBrowserClient'  // lib/clients/supabaseBrowserClient.ts
import { AlertCircle, Loader2, ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import JobFoxyLogo from '@/components/assets/JobFoxyDark.svg'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred sending reset email')
    } finally {
      setLoading(false)
    }
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
            Don't worry, it happens to everyone
          </h1>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            Enter your email and we'll send you instructions to reset your password.
          </p>

          {/* Security Badge */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="font-bold text-sm">Secure Reset</div>
              <div className="text-xs text-gray-400">Your data is encrypted and safe</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-gray-500">
          © {new Date().getFullYear()} Job Foxy. Secure by design.
        </div>
      </div>

      {/* RIGHT SIDE: Form (Light Theme) */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Back Link */}
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#1a1615] tracking-tight">
              Reset your password
            </h2>
            <p className="mt-2 text-gray-500">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {!success ? (
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
                  Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-bold text-white bg-[#1a1615] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send reset link
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-100 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900 mb-2">
                    Check your email
                  </h3>
                  <p className="text-sm text-green-700 mb-4">
                    We've sent a password reset link to your email address. Click the link in the email to reset your password.
                  </p>
                  <p className="text-xs text-green-600">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setSuccess(false)}
                      className="font-bold underline hover:no-underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}