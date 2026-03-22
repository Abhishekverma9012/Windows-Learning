import { Link } from 'react-router-dom';
import { categories } from '@/data/mockData';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CategoryGrid = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="container-main">
        <h2
          className={`text-balance mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          Explore skill categories
        </h2>
        <p
          className={`text-muted-foreground text-lg mb-12 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          Find the right mentor for the skill you want to master
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/mentors?category=${cat.id}`}
              className={`group flex flex-col items-center p-6 rounded-xl bg-card border hover:border-primary/30 shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-[0.97] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: isVisible ? `${150 + i * 80}ms` : '0ms' }}
            >
              <span className="text-3xl mb-3">{cat.icon}</span>
              <span className="text-sm font-medium text-center leading-tight group-hover:text-primary transition-colors">
                {cat.name}
              </span>
              <span className="mt-2 text-xs text-muted-foreground">{cat.mentorCount} mentors</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
