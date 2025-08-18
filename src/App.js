import './App.css';
import { useState, useEffect } from 'react';

// Flying Cats Component
function FlyingCats() {
  const [cats, setCats] = useState([]);
  const [trailParticles, setTrailParticles] = useState([]);
  
  // Define cat images outside of useEffect to avoid dependency issues
  const catImages = [
    '/images/cat1.png',
    '/images/cat2.png',
    '/images/cat3.png',
    '/images/cat4.png'
  ];

  useEffect(() => {
    // Create initial cats
    const initialCats = catImages.map((src, index) => ({
      id: index,
      src,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 4, // Random velocity x (-2 to 2)
      vy: (Math.random() - 0.5) * 4, // Random velocity y (-2 to 2)
      rotation: index === 3 ? Math.random() * 90 : 0, // Only cat4.png (index 3) gets initial rotation
      rotationSpeed: index === 3 ? (Math.random() - 0.5) * 6 : 0, // Only cat4.png rotates
      scale: 0.8 + Math.random() * 0.9 // Random size between 0.3 and 0.7
    }));
    
    setCats(initialCats);

    // Cat movement animation loop (smooth 20 FPS)
    const catAnimationInterval = setInterval(() => {
      setCats(prevCats => 
        prevCats.map(cat => {
          let newX = cat.x + cat.vx;
          let newY = cat.y + cat.vy;
          let newVx = cat.vx;
          let newVy = cat.vy;

          // Bounce off edges (clean bounce, no chaos)
          if (newX <= 0 || newX >= window.innerWidth - 100) {
            newVx = -cat.vx;
            newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - 100) {
            newVy = -cat.vy;
            newY = Math.max(0, Math.min(window.innerHeight - 100, newY));
          }

          // No speed limiting needed since we maintain consistent speeds

          return {
            ...cat,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: cat.id === 3 ? cat.rotation + cat.rotationSpeed : cat.rotation // Only cat4.png (id 3) rotates
          };
        })
      );
    }, 16); // ~60 FPS for very smooth cat movement

    // Sparkle animation loop (much more optimized)
    const sparkleAnimationInterval = setInterval(() => {
      setCats(currentCats => {
        // Create very few trail particles for performance
        const newTrailParticles = [];
        currentCats.forEach(cat => {
          // Add 2 particles per cat every frame (doubled again)
          for (let i = 0; i < 3; i++) {
            newTrailParticles.push({
              id: Math.random(),
              x: cat.x + 50 + (Math.random() - 0.5) * 20, // Center of 100px wide cat + spread
              y: cat.y + 50 + (Math.random() - 0.5) * 20, // Center of cat height + spread
              life: 1.0,
              maxLife: 10 + Math.random() * 30,
              size: 2 + Math.random() * 3,
              color: `hsl(0, 0%, ${70 + Math.random() * 30}%)`
            });
          }
        });

        setTrailParticles(prevParticles => {
          // Update existing particles and add new ones
          const updatedParticles = prevParticles
            .map(particle => ({
              ...particle,
              life: particle.life - (1 / particle.maxLife)
            }))
            .filter(particle => particle.life > 0); // Remove dead particles
          
          return [...updatedParticles, ...newTrailParticles];
        });

        return currentCats; // Don't modify cats in sparkle loop
      });
    }, 200); // 5 FPS for sparkles for sparkle creation (performance optimized)

    return () => {
      clearInterval(catAnimationInterval);
      clearInterval(sparkleAnimationInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flying-cats-container">
      {/* Render trail particles behind cats */}
      {trailParticles.map(particle => (
        <div
          key={particle.id}
          className="trail-particle"
          style={{
            position: 'fixed',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.life,
            pointerEvents: 'none',
            zIndex: 999, // Behind cats but above everything else
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animation: 'sparkle 0.5s ease-in-out infinite alternate'
          }}
        />
      ))}
      
      {/* Render flying cats */}
      {cats.map(cat => (
        <img
          key={cat.id}
          src={cat.src}
          alt="Flying cat"
          className="flying-cat"
          style={{
            position: 'fixed',
            left: `${cat.x}px`,
            top: `${cat.y}px`,
            transform: `rotate(${cat.rotation}deg) scale(${cat.scale})`,
            pointerEvents: 'none',
            zIndex: 1000,
            width: '100px',
            height: 'auto',
            filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.5))'
          }}
        />
      ))}
    </div>
  );
}

function App() {
  const [visitorCount, setVisitorCount] = useState(1337);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setVisitorCount(prev => prev + 1);
  };

  return (
    <div className="App">
      <FlyingCats />
      <div className="main-content">
        <h1 className="glitter-text">cats</h1>
        <p className="subtitle">Welcome to cats.com, a radical new internet by cats for cats</p>
        
        <div className="marquee">
          <div className="marquee-text">
            ★ ☆ ★ meow ★ ☆ ★ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; meow. meow
          </div>
        </div>

        <div className="welcome-box">
          <p>🌟 Hi, I'm <span className="blink">Aphaea</span> and I'm Apo<span className="blink">llo</span> and together we are a<sup>3</sup>! 🌟</p>
          <p> We're so glad that you decided to come hang out with us today </p>
          <p> Take a look around and check out all of our cool stuff! </p>
        </div>

        <div className="retro-grid">
          <div className="retro-card">
            <img src="/images/aphaea_pfp.jpg" alt="Aphaea.jpg" className="card-pfp" />
            <h3>Aphaea</h3>
            <p>✨ pwincess ✨</p>
            <button className="button-90s" onClick={handleClick}>Click Here!</button>
          </div>
          
          <div className="retro-card">
            <img src="/images/apollo_pfp.jpg" alt="aPollo.jpg" className="apollo-card-pfp" />
            <h3>aPollo</h3>
            <p>🌟 demon. chicken. spawn. cat. bingus 🌟</p>
            <button className="button-90s">Explore</button>
          </div>
        </div>

        <div className="pixel-border">
          <h3>🎵 Now Playing: Darude - Sandstorm 🎵</h3>
          <p>Turn up your speakers for the full experience!</p>
        </div>

        <div className="under-construction">
          🚧 This site is under construction! 🚧
          <br />
          Please excuse the mess while I add more cool stuff!
        </div>

        <div className="visitor-counter">
          You are visitor #{visitorCount.toLocaleString()}
          <br />
          Current time: {currentTime.toLocaleTimeString()}
        </div>

        <p style={{fontSize: '12px', color: '#666'}}>
          Best viewed with Internet Explorer 4.0+ | 
          <span className="blink">NEW!</span> JavaScript enabled | 
          Made with ❤️ and HTML
        </p>
      </div>
    </div>
  );
}

export default App;
