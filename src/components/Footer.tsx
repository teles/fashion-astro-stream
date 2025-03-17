
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCategories } from '../services/api';
import { WpCategory } from '../types';

const Footer = () => {
  const [categories, setCategories] = useState<WpCategory[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data.filter(cat => cat.count && cat.count > 0));
    };
    
    loadCategories();
  }, []);

  return (
    <footer className="bg-fashion-beige mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <Link to="/" className="text-2xl font-serif font-medium tracking-tight">
              Se A Moda Pega
            </Link>
            <p className="mt-4 text-fashion-secondary">
              Blog de moda com as últimas tendências, dicas de estilo e novidades do mundo fashion.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Categorias</h4>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <Link 
                    to={`/categoria/${category.slug}`}
                    className="text-fashion-secondary hover:text-fashion-primary transition-colors"
                  >
                    {category.name} ({category.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Siga-nos</h4>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-fashion-secondary hover:text-fashion-primary transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-fashion-secondary hover:text-fashion-primary transition-colors"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-fashion-sand mt-8 pt-8 text-center text-sm text-fashion-secondary">
          <p>&copy; {new Date().getFullYear()} Se A Moda Pega. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
