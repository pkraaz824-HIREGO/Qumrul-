import React, { useState } from 'react';
import { Briefcase, Users, TrendingUp, Heart, Send } from 'lucide-react';

export function CareersPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote / New York',
      type: 'Full-time',
      description: 'We are looking for a talented Frontend Developer to join our engineering team. You will work on building beautiful, responsive user interfaces using React and modern web technologies.',
      requirements: [
        '3+ years of experience with React and modern JavaScript',
        'Strong understanding of HTML, CSS, and responsive design',
        'Experience with state management (Redux, Zustand, etc.)',
        'Excellent problem-solving and communication skills'
      ]
    },
    {
      id: 2,
      title: 'Customer Support Specialist',
      department: 'Customer Service',
      location: 'New York',
      type: 'Full-time',
      description: 'Join our customer support team to help provide exceptional service to our customers. You will respond to inquiries, resolve issues, and ensure customer satisfaction.',
      requirements: [
        'Excellent communication skills',
        '2+ years of customer service experience',
        'Ability to work in a fast-paced environment',
        'Problem-solving mindset and empathy'
      ]
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product',
      location: 'New York',
      type: 'Full-time',
      description: 'We are seeking an experienced Product Manager to lead product strategy and development. You will work closely with engineering, design, and business teams to deliver innovative solutions.',
      requirements: [
        '5+ years of product management experience',
        'Strong analytical and strategic thinking skills',
        'Experience with e-commerce platforms',
        'Excellent leadership and communication abilities'
      ]
    },
    {
      id: 4,
      title: 'Marketing Coordinator',
      department: 'Marketing',
      location: 'Remote / New York',
      type: 'Full-time',
      description: 'Help us grow our brand and reach new customers. You will create and execute marketing campaigns, manage social media, and analyze performance metrics.',
      requirements: [
        '2+ years of marketing experience',
        'Strong writing and creative skills',
        'Experience with digital marketing tools',
        'Data-driven mindset'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-gold py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-white" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 md:mb-4">Join Our Team</h1>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Build your career at Elite Store. We're looking for talented individuals who are passionate about innovation and excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-12">
          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Great Team</h3>
            <p className="text-gray-600 text-sm md:text-base">Work with talented professionals from around the world</p>
          </div>

          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Career Growth</h3>
            <p className="text-gray-600 text-sm md:text-base">Opportunities for learning and advancement</p>
          </div>

          <div className="premium-card rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="text-white" size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Great Benefits</h3>
            <p className="text-gray-600 text-sm md:text-base">Competitive salary, health insurance, and more</p>
          </div>
        </div>

        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Open Positions</h2>
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="premium-card rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full font-semibold">{job.department}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">{job.location}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">{job.type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="mt-4 md:mt-0 px-6 py-3 btn-premium text-white rounded-lg hover:shadow-xl transition font-semibold text-sm md:text-base"
                  >
                    View Details
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">{job.description}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full font-semibold">{selectedJob.department}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">{selectedJob.location}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">{selectedJob.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Job Description</h4>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">{selectedJob.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 text-sm md:text-base">
                      <span className="text-gold-600 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="/contact"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 btn-premium text-white rounded-lg hover:shadow-xl transition font-semibold text-sm md:text-base"
              >
                <Send size={20} />
                Apply Now
              </a>
            </div>
          </div>
        )}

        <div className="premium-card rounded-xl p-6 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Don't See the Right Role?</h2>
          <p className="text-gray-700 leading-relaxed mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
            We're always looking for talented individuals. Send us your resume and let us know how you can contribute to Elite Store.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 md:px-10 py-3 md:py-4 btn-premium text-white rounded-lg hover:shadow-xl transition font-semibold text-sm md:text-base"
          >
            Contact HR Team
          </a>
        </div>
      </div>
    </div>
  );
}
