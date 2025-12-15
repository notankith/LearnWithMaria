import Link from "next/link"
import { ArrowRight, BookOpen, Mic, PenTool, Headphones } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-slate-900">LinguaFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 md:px-12 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 text-pretty max-w-4xl">
          Master IELTS & OET with Expert Guidance
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 text-pretty max-w-2xl">
          Join thousands of learners achieving their language goals. Personalized courses, real practice tests, and
          AI-powered feedback.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="px-8 py-3 border-2 border-slate-300 text-slate-900 rounded-lg font-semibold hover:border-slate-400 hover:bg-slate-50 transition"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-2xl">
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600">10K+</div>
            <div className="text-sm md:text-base text-slate-600">Active Learners</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600">500+</div>
            <div className="text-sm md:text-base text-slate-600">Practice Tests</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600">95%</div>
            <div className="text-sm md:text-base text-slate-600">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-12 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
            Comprehensive Learning Platform
          </h2>
          <p className="text-center text-slate-600 mb-16 text-pretty max-w-2xl mx-auto">
            Everything you need to excel in IELTS and OET examinations
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Speaking Tests */}
            <div className="p-8 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-lg transition">
              <Mic className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Speaking Practice</h3>
              <p className="text-slate-600">
                AI-powered speaking evaluation. Record responses, get instant feedback, and track improvement over time.
              </p>
            </div>

            {/* Writing Tests */}
            <div className="p-8 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-lg transition">
              <PenTool className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Writing Evaluation</h3>
              <p className="text-slate-600">
                Submit essays and reports. Get detailed scoring, band predictions, and expert feedback on grammar and
                structure.
              </p>
            </div>

            {/* Reading Tests */}
            <div className="p-8 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-lg transition">
              <BookOpen className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Reading Comprehension</h3>
              <p className="text-slate-600">
                Authentic exam-style passages. Practice time management, improve accuracy, and master reading
                strategies.
              </p>
            </div>

            {/* Listening Tests */}
            <div className="p-8 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-lg transition">
              <Headphones className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Listening Practice</h3>
              <p className="text-slate-600">
                Native speaker audio samples. Adjust playback speed, take notes, and review transcripts for learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="px-6 md:px-12 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">Learning Paths</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* IELTS General */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-slate-200">
              <div className="text-sm font-semibold text-blue-600 uppercase mb-2">Most Popular</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">IELTS General</h3>
              <p className="text-slate-600 mb-6 text-sm">
                Complete preparation for IELTS General Training with all four modules.
              </p>
              <div className="text-2xl font-bold text-slate-900 mb-6">
                $29<span className="text-sm text-slate-600">/month</span>
              </div>
              <Link
                href="/signup"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Enroll Now
              </Link>
            </div>

            {/* OET */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-slate-200">
              <div className="text-sm font-semibold text-slate-400 uppercase mb-2">For Professionals</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">OET Medical</h3>
              <p className="text-slate-600 mb-6 text-sm">
                Specialized preparation for healthcare professionals seeking OET certification.
              </p>
              <div className="text-2xl font-bold text-slate-900 mb-6">
                $39<span className="text-sm text-slate-600">/month</span>
              </div>
              <Link
                href="/signup"
                className="block w-full text-center px-4 py-2 border-2 border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition"
              >
                Enroll Now
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-slate-200">
              <div className="text-sm font-semibold text-slate-400 uppercase mb-2">All Access</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Plus</h3>
              <p className="text-slate-600 mb-6 text-sm">
                Full access to all courses, 1-on-1 tutoring, and priority feedback.
              </p>
              <div className="text-2xl font-bold text-slate-900 mb-6">
                $79<span className="text-sm text-slate-600">/month</span>
              </div>
              <Link
                href="/signup"
                className="block w-full text-center px-4 py-2 border-2 border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Achieve Your Language Goals?</h2>
          <p className="text-lg text-blue-100 mb-8">Start your free trial today. No credit card required.</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 bg-slate-900 text-slate-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-white">LinguaFlow</span>
              </div>
              <p className="text-sm">Expert-led language learning for IELTS and OET.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Courses</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    IELTS General
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    IELTS Academic
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    OET
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Study Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 LinguaFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
