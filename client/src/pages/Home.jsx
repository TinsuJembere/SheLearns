import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const featureCards = [
  {
    icon: () => (
      <span className="bg-yellow-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
      </span>
    ),
    title: 'Personalized Learning Pathways',
    desc: "Tailored tech education journeys, designed with each student's goals in mind, encouraging engagement with structured knowledge."
  },
  {
    icon: () => (
      <span className="bg-yellow-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
      </span>
    ),
    title: 'Dedicated Mentor Matching',
    desc: 'Connect with experienced mentors for support, guidance, and inspiration, fostering professional relationships.'
  },
  {
    icon: () => (
      <span className="bg-yellow-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z" /><path d="M12 12V4" /></svg>
      </span>
    ),
    title: 'AI Q&A Bot Support',
    desc: 'Get personalized answers to tech questions, available 24/7 for clarity, confidence, and problem-solving.'
  },
];

const empowerSteps = [
  {
    icon: '👩‍💻',
    title: 'Join SheLearns Community',
    desc: 'Register and become part of a supportive network of learners and mentors.'
  },
  {
    icon: '🛤️',
    title: 'Explore Learning Pathways',
    desc: 'Access curated tech content and structured learning journeys.'
  },
  {
    icon: '🤝',
    title: 'Connect With Mentors',
    desc: 'Find mentors and ask questions to get real-world guidance.'
  },
  {
    icon: '🚀',
    title: 'Grow & Innovate',
    desc: 'Develop skills, build projects, and prepare for tech careers.'
  },
];

const testimonials = [
  {
    quote: 'SheLearns has transformed my understanding of technology and given me incredible mentors who truly believe in my potential. I feel more confident than ever!',
    name: 'Tinsae Jembere',
    role: 'Mentee, Aspiring Developer'
  },
  {
    quote: 'Mentorship through SheLearns has let me give back and help girls grow into the next generation of tech leaders. The platform is making a real difference.',
    name: 'Fatima Ali',
    role: 'Mentor, Software Engineer'
  },
  {
    quote: 'The personalized pathways keep me engaged, and the AI bot is always there for quick questions. I never imagined learning coding could be this accessible.',
    name: 'Chaltu Bedada',
    role: 'Student, Girls Outreach'
  },
];

const orgLogos = [
  'https://dummyimage.com/60x30/eee/aaa',
  'https://dummyimage.com/60x30/eee/aaa',
  'https://dummyimage.com/60x30/eee/aaa',
  'https://dummyimage.com/60x30/eee/aaa',
  'https://dummyimage.com/60x30/eee/aaa',
  'https://dummyimage.com/60x30/eee/aaa',
];

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('/api/subscribe', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[480px] flex items-center justify-center">
        <img src="/image.png" alt="Hero" className="absolute w-full h-full " />
        <div className="relative z-10 flex flex-col items-center text-center px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow-lg">Empowering Girls in Tech, One Skill at a Time</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl">SheLearns connects young girls from rural areas with mentors in technology, providing personalized learning pathways and an AI Q&A bot to facilitate their journey.</p>
          <div className="flex gap-4 justify-center">
            {!user ? (
              <>
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded shadow"
                  onClick={() => navigate('/signup?role=student')}
                >
                  Become a Student
                </button>
                <button
                  className="border border-yellow-400 text-yellow-500 font-semibold px-6 py-2 rounded shadow bg-white hover:bg-yellow-50"
                  onClick={() => navigate('/signup?role=mentor')}
                >
                  Become a Mentor
                </button>
              </>
            ) : (
              <div className="bg-yellow-100 text-yellow-800 font-semibold px-6 py-2 rounded shadow">
                Welcome, {user.name}!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Our Mission: Bridging the Digital Divide</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">At SheLearns, we believe every girl deserves access to technology education. Our mission is to empower young girls, particularly from rural areas, with essential tech and soft skills, fostering a community where they can learn, grow, and thrive under unique experiences in the tech field.</p>
      </section>

      {/* Feature Cards */}
      <section className="py-6 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
            {card.icon()}
            <h3 className="font-bold text-lg mt-4 mb-2 text-gray-800">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.desc}</p>
          </div>
        ))}
      </section>

      {/* Empowerment Steps */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How SheLearns Empowers You</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {empowerSteps.map((step, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-gray-100">
              <span className="text-3xl mb-3">{step.icon}</span>
              <h4 className="font-semibold text-md mb-1 text-gray-800">{step.title}</h4>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Voices of Our Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col">
              <span className="text-yellow-400 text-3xl mb-2">"</span>
              <p className="text-gray-700 italic mb-4 flex-grow">{t.quote}</p>
              <div className="mt-2">
                <span className="font-bold text-gray-800">{t.name}</span>
                <span className="block text-xs text-gray-500">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center bg-gradient-to-r from-yellow-100 via-purple-100 to-white">
          <div className="flex-1 p-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Ready to Transform Your Future with Tech?</h3>
            <p className="text-gray-700 mb-4">Join SheLearns today and start your journey towards a brighter future in technology. Connect, learn, and grow with a supportive community.</p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded shadow">Get Started Now</button>
          </div>
          <div className="flex-1 min-w-[200px] h-48 md:h-full relative">
            <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80" alt="CTA" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-white border-t mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg text-gray-800">SheLearns</span>
          </div>
          <form className="flex items-center gap-2" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Stay updated with SheLearns!" 
              className="border rounded px-3 py-2" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded">Subscribe</button>
          </form>
          <div className="flex gap-4 text-gray-400 text-xl">
            <a href="#" aria-label="Twitter"><svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616 2c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.762.127 1.124C7.728 7.89 4.1 6.13 1.671 3.149c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099A4.904 4.904 0 0 1 .964 8.1v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z" /></svg></a>
            <a href="#" aria-label="Facebook"><svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.675 0h-21.35C.597 0 0 .592 0 1.326v21.348C0 23.408.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.408 24 22.674V1.326C24 .592 23.403 0 22.675 0" /></svg></a>
            <a href="#" aria-label="LinkedIn"><svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76c.97 0 1.75.79 1.75 1.76s-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62z" /></svg></a>
          </div>
        </div>
        {message && <p className="text-center text-sm mt-4">{message}</p>}
        <div className="text-center text-gray-400 text-xs mt-6">© 2023 SheLearns</div>
      </footer>
    </div>
  );
}

export default Home; 