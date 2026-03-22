import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navCategories = [
  'Technology',
  'Data Science',
  'UI/UX Design',
  'Digital Marketing',
  'Business',
  'Creative Arts',
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={`w-full z-50 ${isHome ? 'absolute top-0 left-0 right-0' : 'sticky top-0 bg-card border-b shadow-sm'}`}>
      <nav className="container-main flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <div className={`text-xl font-bold tracking-tight ${isHome ? 'text-white' : 'text-foreground'}`}>
            Windows<span className="text-accent">Learning</span>
          </div>
        </Link>

        {/* Search - hidden on home hero, visible elsewhere */}
        {!isHome && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search mentors or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        )}

        {/* Desktop Nav */}
        <div className={`hidden md:flex items-center gap-6 ${isHome ? 'text-white/90' : 'text-foreground'}`}>
          <Link to="/mentors" className="text-sm font-medium hover:opacity-80 transition-opacity">
            Find Mentors
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:opacity-80 transition-opacity">
            How It Works
          </Link>
          <Link to="/login" className="text-sm font-medium hover:opacity-80 transition-opacity">
            Sign In
          </Link>
          <Link to="/signup">
            <Button
              size="sm"
              className={isHome
                ? 'bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-foreground active:scale-[0.97] transition-all'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all'
              }
            >
              Join as Mentor
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className={`md:hidden p-2 ${isHome ? 'text-white' : 'text-foreground'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Category bar - non-home pages */}
      {!isHome && (
        <div className="border-b bg-card hidden lg:block">
          <div className="container-main flex items-center gap-8 h-11 overflow-x-auto">
            {navCategories.map((cat) => (
              <Link
                key={cat}
                to={`/mentors?category=${cat.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap border-b-2 border-transparent hover:border-primary pb-2 pt-2 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b shadow-lg animate-fade-in">
          <div className="container-main py-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search mentors..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <Link to="/mentors" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Find Mentors</Link>
            <Link to="/how-it-works" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
            <Link to="/login" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button size="sm" className="w-full">Join as Mentor</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
