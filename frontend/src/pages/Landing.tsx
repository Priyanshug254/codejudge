import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Terminal, Code, Trophy, Zap, ChevronRight, Github } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Landing: React.FC = () => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/problems" />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Navbar */}
            <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-xl">
                    <Terminal size={24} />
                    <span>CodeJudge</span>
                </div>
                <div className="flex gap-4 items-center">
                    <ThemeToggle />
                    <Link to="/login" className="px-4 py-2 hover:text-blue-400 transition-colors">Login</Link>
                    <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900 -z-10"></div>

                <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
                    v2.0 Now Available with Analytics 🚀
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                    Master Coding Challenges <br /> Like a Pro.
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
                    Join thousands of developers solving algorithmic problems. Write code, run tests, and climb the leaderboard in real-time.
                </p>

                <div className="flex gap-4 flex-col sm:flex-row">
                    <Link to="/register" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
                        Start Coding Now <ChevronRight size={20} />
                    </Link>
                    <a href="https://github.com/Priyanshug254/codejudge" target="_blank" rel="noreferrer" className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium">
                        <Github size={20} /> Star on GitHub
                    </a>
                </div>

                {/* Editor Preview Mockup */}
                <div className="mt-20 w-full max-w-5xl bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-slide-up transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-gray-900 px-4 py-3 flex gap-2 border-b border-gray-700">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="p-6 text-left font-mono text-sm md:text-base grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-gray-300">
                            <span className="text-purple-400">class</span> <span className="text-yellow-400">Solution</span> {'{'} <br />
                            &nbsp;&nbsp;<span className="text-purple-400">public</span> <span className="text-blue-400">void</span> <span className="text-yellow-400">solve</span>() {'{'} <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">// Write your optimized code here</span> <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-orange-400">true</span>; <br />
                            &nbsp;&nbsp;{'}'} <br />
                            {'}'}
                        </div>
                        <div className="hidden md:block text-gray-500 border-l border-gray-700 pl-6">
                            &gt; Compiling... <br />
                            &gt; Running Test Cases... <br />
                            <span className="text-green-500">&gt; Test Case 1: PASSED (2ms)</span> <br />
                            <span className="text-green-500">&gt; Test Case 2: PASSED (1ms)</span> <br />
                            <span className="text-green-500">&gt; Verdict: ACCEPTED</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features */}
            <section className="py-20 bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors group">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Code className="text-blue-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Multi-Language Support</h3>
                        <p className="text-gray-400">Code in Java, Python, or C++. Our robust execution engine handles it all securely.</p>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors group">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="text-purple-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Real-time Execution</h3>
                        <p className="text-gray-400">Get instant feedback on your solutions. Measure time and space complexity automatically.</p>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-colors group">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Trophy className="text-yellow-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Global Leaderboards</h3>
                        <p className="text-gray-400">Compete with friends and the community. Earn badges and improve your rank.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 border-t border-gray-800">
                <p>&copy; 2024 CodeJudge. Built for developers.</p>
            </footer>
        </div>
    );
};

export default Landing;
