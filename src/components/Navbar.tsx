
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchCategories } from '../services/api';
import { WpCategory } from '../types';
import { Menu, Search, X } from 'lucide-react';

const Navbar = () => {
  const [categories, setCategories] = useState<WpCategory[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      // Only take categories with posts
      setCategories(data.filter(cat => cat.count && cat.count > 0).slice(0, 5));
    };
    
    loadCategories();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm' : 'py-5 bg-transparent'
    }`}>
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-serif font-medium tracking-tight hover:opacity-80 transition-opacity"
        >
          Moda Astro
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm uppercase tracking-wide hover:text-fashion-secondary transition-colors">
            Home
          </Link>
          
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/categoria/${category.slug}`}
              className="text-sm uppercase tracking-wide hover:text-fashion-secondary transition-colors"
            >
              {category.name}
            </Link>
          ))}
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-sm flex items-center hover:text-fashion-secondary transition-colors"
            aria-label="Pesquisar"
          >
            <Search size={18} />
          </button>
        </nav>
        
        <div className="md:hidden flex items-center space-x-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-fashion-secondary transition-colors"
            aria-label="Pesquisar"
          >
            <Search size={20} />
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="hover:text-fashion-secondary transition-colors"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 animate-fade-in">
          <div className="container px-4 py-5 mx-auto flex justify-between items-center">
            <Link 
              to="/" 
              className="text-2xl font-serif font-medium tracking-tight"
              onClick={() => setIsMenuOpen(false)}
            >
              Moda Astro
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-fashion-secondary transition-colors"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="container px-4 py-8 mx-auto">
            <ul className="space-y-6">
              <li>
                <Link 
                  to="/" 
                  className="text-xl font-medium hover:text-fashion-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              
              {categories.map(category => (
                <li key={category.id}>
                  <Link
                    to={`/categoria/${category.slug}`}
                    className="text-xl font-medium hover:text-fashion-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fade-in">
          <div className="container px-4 mx-auto">
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="hover:text-fashion-secondary transition-colors"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-medium mb-6">O que você está procurando?</h2>
                
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Digite para pesquisar..."
                    className="w-full py-3 px-4 border-b border-fashion-lightGray bg-transparent focus:outline-none focus:border-fashion-primary"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-fashion-secondary transition-colors"
                    aria-label="Pesquisar"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
