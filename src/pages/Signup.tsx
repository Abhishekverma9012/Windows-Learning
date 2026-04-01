import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner' as 'learner' | 'mentor' });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-select role from URL param
  const urlRole = searchParams.get('role');
  if (urlRole === 'mentor' && form.role !== 'mentor') {
    setForm(f => ({ ...f, role: 'mentor' }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast({ title: 'Password too short', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name, form.role);
      toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
      navigate('/verify-email');
    } catch (error: any) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-secondary/30">
        <div className="w-full max-w-md bg-card rounded-2xl border shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Join Windows Learning</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Create your account and start learning today.</p>

          <div className="flex rounded-lg border p-1 mb-6">
            {(['learner', 'mentor'] as const).map((role) => (
              <button key={role} onClick={() => setForm(f => ({ ...f, role }))}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  form.role === role ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}>
                {role === 'learner' ? 'I want to learn' : 'I want to mentor'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Create a strong password (min 6 characters)"
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                required />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            By signing up, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>
          </p>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
