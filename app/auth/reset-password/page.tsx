'use client'

'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/clients/supabaseBrowserClient'  // lib/clients/supabaseBrowserClient.ts
import { AlertCircle, Loader2, CheckCircle2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import JobFoxyLogo from '@/components/assets/JobFoxy.svg'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch('password', '')

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        setError(error.message)
      } else {
        // Password updated successfully
        router.push('/dashboard?password_reset=success')
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred resetting password')
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
            Create a strong password
          </h1>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            Choose a password that's hard to guess and unique to Job Foxy.
          </p>

          {/* Security Tips */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              At least 8 characters long
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Mix of uppercase and lowercase
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Include numbers
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
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#1a1615] tracking-tight">
              Set new password
            </h2>
            <p className="mt-2 text-gray-500">
              Enter a new password for your account.
            </p>
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
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                New Password
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
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
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
                  Resetting password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Reset password
                </>
              )}
            </button>
          </form>

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
