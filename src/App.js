import './App.css';
import { useState, useEffect } from 'react';

// Flying Cats Component
// Component for cats that randomly pop up in the welcome box corner
function PopupCats() {
  const [currentCat, setCurrentCat] = useState(null);
  
  const popupCats = [
    {
      src: '/images/cat2.png',
      position: { bottom: '-15px', left: '-3px' },
      size: { height: '110%', width: 'auto' }
    },
    {
      src: '/images/cat3.png', 
      position: { bottom: '-12px', left: '-9px' },
      size: { height: '90%', width: 'auto' }
    }
  ];
  
  useEffect(() => {
    const showRandomCat = () => {
      // Random delay between appearances (3-8 seconds)
      const delay = 1000 + Math.random() * 3500;
      
      setTimeout(() => {
        // Pick a random cat
        const randomCatIndex = Math.floor(Math.random() * popupCats.length);
        const randomCat = popupCats[randomCatIndex];
        setCurrentCat(randomCat);
        
        // Show for random duration (2-5 seconds)
        const showDuration = 1000 + Math.random() * 3500;
        
        setTimeout(() => {
          setCurrentCat(null);
          showRandomCat(); // Schedule next appearance
        }, showDuration);
      }, delay);
    };
    
    showRandomCat(); // Start the cycle
  }, []);
  
  return (
    currentCat && (
      <img
        src={currentCat.src}
        alt="Popup cat"
        className="popup-cat"
        style={{
          position: 'absolute',
          bottom: currentCat.position.bottom,
          left: currentCat.position.left,
          width: currentCat.size.width,
          height: currentCat.size.height,
          zIndex: 1001,
        }}
      />
    )
  );
}

function FlyingCats() {
  const [cats, setCats] = useState([]);
  const [trailParticles, setTrailParticles] = useState([]);
  
  // Only cat1.png and cat4.png fly around
  const catImages = [
    '/images/cat1.png',
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
      rotation: index === 1 ? Math.random() * 90 : 0, // Only cat4.png (index 1 now) gets initial rotation
      rotationSpeed: index === 1 ? (Math.random() - 0.5) * 6 : 0, // Only cat4.png rotates
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
            rotation: cat.id === 1 ? cat.rotation + cat.rotationSpeed : cat.rotation // Only cat4.png (id 1 now) rotates
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

// Form Submission Component
function TalkToCatsForm({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate message field is required
    if (!formData.message) {
      return; // Do nothing if no message
    }
    
    setSubmitting(true);
    
    // Submit to the API endpoint
    fetch('https://jfumnb3gqn2yzfj23fonxed6w40jmoww.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setFormData({ name: '', email: '', message: '' });
      setSubmitting(false);
      setSuccess(true);
      
      // Show "Meow!" for 1.5 seconds then go back
      setTimeout(() => {
        onBack();
      }, 1250);
    })
    .catch(error => {
      console.error('Error:', error);
      setSubmitting(false);
    });
  };

  return (
    <div className="form-container">
      {success ? (
        <h2 className="meow-message">Meow!</h2>
      ) : (
        <>
          <h2 className="form-title glitter-text">Talk to Cats</h2>
          <div className="retro-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name (optional):</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="retro-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email (optional):</label>
                <input 
                  type="text" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="retro-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  className="retro-textarea" 
                  required
                  rows="5"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="button-90s">{submitting ? 'Sending...' : 'Send to Cats'}</button>
                <button type="button" onClick={onBack} className="button-90s back-button">Go Back</button>
              </div>
            </form>
          </div>
          
          <div className="cat-corner">
            <img src="/images/cat3.png" alt="Cat listening" className="center-cat" />
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [visitorCount, setVisitorCount] = useState(1337);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setVisitorCount(prev => prev + 1);
  };
  
  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  return (
    <div className="App">
      <FlyingCats />
      {showForm ? (
        <TalkToCatsForm onBack={toggleForm} />
      ) : (
        <div className="main-content">
          <h1 className="glitter-text">cats</h1>
          <p className="subtitle">Welcome to cats.com, a radical new way to internet, for cats by cats</p>
          
          <div className="nav-link">
            <a href="#" className="talk-cats-link" onClick={(e) => { e.preventDefault(); toggleForm(); }}>talk to cats</a>
          </div>
          
          <div className="marquee">
            <div className="marquee-text">
              ★ ☆ ★ meow ★ ☆ ★ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; meow. meow
            </div>
          </div>

          <div className="welcome-box" style={{ position: 'relative' }}>
            <PopupCats />
            <p>🌟 Hi, I'm <span className="blink">Aphaea</span> and I'm Apol<span className="blink">lo</span> and together we are a<sup>3</sup>! 🌟</p>
            <p> We're so glad that you decided to come hang out with us today </p>
            <p> Take a look around and check out how cute we are! </p>
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
            Please excuse the mess while the cats are blogging and sleeping!
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
      )}
    </div>
  );
}

export default App;
