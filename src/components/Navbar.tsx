
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';  // Fixed import name
import { useCategories } from '@/hooks/use-category';
import ThemeToggle from '@/components/ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();  // Fixed hook usage
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const categoriesQuery = useCategories();  // Store the full query result
  const categories = categoriesQuery.data || [];  // Access data property safely
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-serif font-medium">
          Se A Moda Pega
        </Link>
        
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-fashion-secondary transition-colors">
              Início
            </Link>
            {categories.slice(0, 5).map(category => (
              <Link 
                key={category.id}
                to={`/categoria/${category.slug}`}
                className="text-sm font-medium hover:text-fashion-secondary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}
        
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <form onSubmit={handleSearch} className="relative mr-2">
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="w-[200px] h-9 pl-2 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Pesquisar no blog"
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full px-2"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          )}
          
          <ThemeToggle />
          
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b">
                    <h2 className="text-lg font-medium">Menu</h2>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Fechar menu">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                  </div>
                  
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2">
                      <Input
                        type="search"
                        placeholder="Pesquisar..."
                        className="flex-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" size="icon" aria-label="Buscar">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                  
                  <nav className="flex flex-col space-y-4">
                    <Link 
                      to="/" 
                      className="text-lg font-medium"
                    >
                      Início
                    </Link>
                    {categories.map(category => (
                      <Link 
                        key={category.id}
                        to={`/categoria/${category.slug}`}
                        className="text-lg font-medium"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
