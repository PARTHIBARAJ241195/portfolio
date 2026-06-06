import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Typewriter Hook ──────────────────────────────────────── */
function useTypewriter(words, speed = 95, deleteSpeed = 55, pause = 2400) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx % words.length];
    let t;
    if (!deleting) {
      if (text.length < word.length) t = setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
      else t = setTimeout(() => setDeleting(true), pause);
    } else {
      if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
      else { setDeleting(false); setWordIdx((i) => i + 1); }
    }
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx, words, speed, deleteSpeed, pause]);
  return text;
}

/* ─── Animated Counter Hook ────────────────────────────────── */
function useCounter(target, duration = 1800, trigger = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return val;
}

/* ─── Reveal Hook ──────────────────────────────────────────── */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Code Video Background ──────────────────────────────── */
function CodeRain() {
  const matrixRef = useRef(null);

  useEffect(() => {
    const cvs = matrixRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const CHARS = "01{}[]()<>=+-*/;:.,|&!?$#@~%^PHPLARAVELMYSQLDOCKERREDISK8SAWSAPI".split("");
    const SIZE = 13;
    let cols, drops, speeds, raf;

    const init = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
      cols = Math.floor(cvs.width / SIZE);
      drops = Array.from({ length: cols }, () => Math.random() * -100);
      speeds = Array.from({ length: cols }, () => 0.28 + Math.random() * 0.65);
      ctx.fillStyle = "rgba(4,0,14,0)";
      ctx.fillRect(0, 0, cvs.width, cvs.height);
    };

    const paint = () => {
      ctx.fillStyle = "rgba(4,0,14,0.08)";
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      ctx.font = `${SIZE}px monospace`;
      
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * SIZE;
        const a = Math.random() * 0.18 + 0.03;
        const x = i * SIZE;
        
        ctx.strokeStyle = i % 2 === 0 ? `rgba(6,182,212,${a * 0.18})` : `rgba(139,92,246,${a * 0.18})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x + 5, y - 36);
        ctx.lineTo(x + 5, y + 10);
        ctx.stroke();

        // Draw a faint trailing chain and a bright head for each rain column.
        for (let k = 1; k <= 3; k++) {
          const trailCh = CHARS[Math.floor(Math.random() * CHARS.length)];
          const trailAlpha = Math.max(a * (0.22 - k * 0.05), 0.03);
          ctx.fillStyle = i % 2 === 0 ? `rgba(6,182,212,${trailAlpha})` : `rgba(167,139,250,${trailAlpha})`;
          ctx.fillText(trailCh, x, y - k * SIZE);
        }

        const headCh = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.95, a * 4)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = i % 2 === 0 ? "rgba(6,182,212,0.9)" : "rgba(167,139,250,0.9)";
        ctx.fillText(headCh, x, y);
        ctx.shadowBlur = 0;
        
        if (drops[i] * SIZE > cvs.height && Math.random() > 0.972) {
          drops[i] = -Math.random() * 40;
          speeds[i] = 0.28 + Math.random() * 0.65;
        }
        drops[i] += speeds[i];
      }
      raf = requestAnimationFrame(paint);
    };

    init();
    window.addEventListener("resize", init);
    raf = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  return <canvas ref={matrixRef} className="code-rain matrix-overlay" aria-hidden="true" />;
}

/* ─── Data ─────────────────────────────────────────────────── */
const ROLES = [
  "Senior Software Engineer",
  "Backend API Specialist",
  "Laravel & PHP Expert",
  "Cloud & DevOps Enthusiast",
];

const HERO_WORDS = ["Builder", "Backend", "APIs", "Cloud"];

const STATS = [
  { value: 6, suffix: ".5+", label: "Years Exp." },
  { value: 4, suffix: "", label: "Companies" },
  { value: 15, suffix: "+", label: "Projects" },
  { value: 50, suffix: "+", label: "APIs Built" },
];

const SKILLS = [
  { icon: "⚡", category: "Languages & Frameworks", items: ["PHP (OOP)", "Laravel", "CodeIgniter", "JavaScript", "HTML & CSS"] },
  { icon: "🗄️", category: "Databases", items: ["MySQL / SQL", "MongoDB", "Redis", "Memcached", "SQLyog"] },
  { icon: "☁️", category: "DevOps & Cloud", items: ["Docker", "Kubernetes", "AWS (S3, EC2)", "Nginx", "Apache"] },
  { icon: "🛠️", category: "Tools", items: ["GitHub / Bitbucket", "Jira & Confluence", "SonarQube", "Jenkins", "PHPUnit"] },
  { icon: "🏗️", category: "Architecture", items: ["REST API Design", "Microservices", "SOLID Principles", "Design Patterns", "OAuth 2.0"] },
  { icon: "🔗", category: "Integrations", items: ["Payment Gateways", "Third-party APIs", "Swiftmailer", "PDO", "PHP-code-coverage"] },
];

const EXPERIENCES = [
  {
    role: "Senior Software Engineer",
    company: "Nalashaa Software Solutions Pvt Ltd",
    location: "Bangalore, Karnataka",
    duration: "Oct 2021 – Present",
    type: "Full-time",
    color: "#8B5CF6",
    companyUrl: "https://www.nalashaa.com",
    highlights: [
      "Designed and incorporated API integrations, enhancing workflow efficiency by 35%.",
      "Resolved critical Jira tickets through comprehensive bug fixes and root cause analysis.",
      "Led sprint planning and backlog prioritization to consistently meet project deadlines.",
      "Built and maintained reusable code libraries improving consistency across projects.",
      "Optimized SQL queries, improving performance for high-traffic healthcare modules.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Rakuten India",
    location: "Bangalore, Karnataka",
    duration: "Oct 2020 – Oct 2021",
    type: "Full-time",
    color: "#06B6D4",
    companyUrl: "https://www.rakuten.com",
    highlights: [
      "Gathered and translated customer requirements into clear technical specifications.",
      "Coordinated with cross-functional engineers to improve software and hardware interfaces.",
      "Analyzed proposed solutions based on customer requirements and product goals.",
      "Prepared detailed progress reports for stakeholder visibility.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Dtors Technologies / Tech Mahindra C2H",
    location: "Bangalore, Karnataka",
    duration: "Oct 2019 – Apr 2020",
    type: "Contract",
    color: "#10B981",
    companyUrl: "https://www.techmahindra.com",
    highlights: [
      "Built RESTful APIs and developed expertise in microservices architecture.",
      "Collaborated with senior developers on enterprise-grade design projects.",
      "Created efficient technical design documents aligned with delivery goals.",
      "Contributed to educational platform initiatives for B2C audiences.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Provab Technosoft Pvt Ltd",
    location: "Bangalore, Karnataka",
    duration: "Jun 2018 – Oct 2019",
    type: "Full-time",
    color: "#F59E0B",
    companyUrl: "https://www.provab.com",
    highlights: [
      "Maintained and enhanced travel-domain projects with Travelport GDS integration.",
      "Wrote well-tested, standards-compliant code across multiple software products.",
      "Devised test cases to validate new features and functional expansions.",
      "Supported code reviews, system integration, and regulatory validation.",
    ],
  },
];

const PROJECTS = [
  { name: "Bestnotes", subtitle: "Healthcare B2B / B2C", url: "https://www.bestnotes.com", logo: "https://logo.clearbit.com/bestnotes.com", tags: ["PHP", "Laravel", "MySQL", "REST API"], desc: "Comprehensive healthcare SaaS with scheduling, clinical notes, patient management, and billing modules used by healthcare providers nationwide.", gradient: "135deg,#7C3AED33,#06B6D433" },
  { name: "Rakuten Energy", subtitle: "Energy Management", url: "https://energy.rakuten.co.jp", logo: "https://logo.clearbit.com/rakuten.com", tags: ["PHP", "API Integration", "MongoDB", "Redis"], desc: "High-traffic energy management platform in Rakuten Japan's ecosystem with real-time data processing and customer self-service features.", gradient: "135deg,#06B6D433,#10B98133" },
  { name: "Educational Initiatives", subtitle: "EdTech B2C Platform", url: "https://ei.study", logo: "https://logo.clearbit.com/ei.study", tags: ["Microservices", "Docker", "PHP", "MySQL"], desc: "Large-scale educational assessment platform focused on student performance analytics, curriculum mapping, and learning outcomes.", gradient: "135deg,#10B98133,#F59E0B33" },
  { name: "Globalduniya", subtitle: "E-commerce Marketplace", url: "https://globalduniya.in", logo: "https://logo.clearbit.com/globalduniya.in", tags: ["PHP", "Payment Gateway", "MySQL", "Laravel"], desc: "Full-featured e-commerce marketplace with vendor management, payment gateway integration, and real-time order tracking.", gradient: "135deg,#F59E0B33,#EF444433" },
  { name: "Travefy", subtitle: "Travel Itinerary Platform", url: "https://travefy.com", logo: "https://logo.clearbit.com/travefy.com", tags: ["Travelport", "PHP", "Redis", "API"], desc: "Travel planning platform with Travelport GDS integration, real-time pricing, booking management, and itinerary collaboration.", gradient: "135deg,#7C3AED33,#10B98133" },
];

const MAIN_STACKS = [
  { name: "PHP", sub: "Backend Core", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "Laravel", sub: "App Framework", logo: "https://cdn.simpleicons.org/laravel/FF2D20" },
  { name: "MySQL", sub: "Data Layer", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Docker", sub: "Containers", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "AWS", sub: "Cloud Deploy", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
];

const STACK_LOGOS = [
  { name: "PHP", color: "#777BB3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "Laravel", color: "#FF2D20", logo: "https://cdn.simpleicons.org/laravel/FF2D20" },
  { name: "MySQL", color: "#00758F", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MongoDB", color: "#13AA52", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Redis", color: "#DC382D", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { name: "Docker", color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Kubernetes", color: "#326CE5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  { name: "AWS", color: "#FF9900", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "Nginx", color: "#009639", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
  { name: "GitHub", color: "#181717", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Jira", color: "#0052CC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
  { name: "Jenkins", color: "#D33C27", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
];

const STORY_BEATS = {
  home: { title: "Act 01", text: "Crafting reliable products with backend excellence." },
  skills: { title: "Act 02", text: "Tools, frameworks, and architecture that power delivery." },
  experience: { title: "Act 03", text: "From engineer to senior role with measurable impact." },
  projects: { title: "Act 04", text: "Real-world products across healthcare, energy, edtech, and travel." },
  contact: { title: "Act 05", text: "Open to building the next meaningful software chapter." },
};

/* ─── Magic Cursor ──────────────────────────────────────────── */
function MagicCursor() {
  const sparkCvs = useRef(null);
  const wand     = useRef(null);
  const light    = useRef(null);

  useEffect(() => {
    const cvs = sparkCvs.current;
    const ctx = cvs.getContext("2d");
    const COLS = ["#A78BFA","#67E8F9","#F0ABFC","#FDE68A","#ffffff","#C4B5FD"];
    const pts  = [];
    let mx = 0, my = 0, lx = 0, ly = 0, px = 0, py = 0, raf;

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };

    const spawn = (x, y) => {
      for (let k = 0; k < 4; k++) pts.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 3.2,
        vy: Math.random() * -3.2 - 0.5,
        r: Math.random() * 5 + 2,
        life: 1,
        color: COLS[~~(Math.random() * COLS.length)],
        decay: Math.random() * 0.022 + 0.016,
        rot: Math.random() * Math.PI * 2,
      });
    };

    const star4 = (x, y, r, c, a, rot) => {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = c;
      ctx.shadowBlur = r * 8; ctx.shadowColor = c;
      ctx.translate(x, y); ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const rad = i % 2 === 0 ? r : r * 0.38;
        i === 0 ? ctx.moveTo(Math.cos(ang)*rad, Math.sin(ang)*rad)
                : ctx.lineTo(Math.cos(ang)*rad, Math.sin(ang)*rad);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.1;
        p.life -= p.decay; p.rot += 0.1;
        if (p.life <= 0) { pts.splice(i, 1); continue; }
        star4(p.x, p.y, p.r * p.life, p.color, Math.min(p.life * 1.5, 1), p.rot);
      }
      lx += (mx - lx) * 0.055; ly += (my - ly) * 0.055;
      if (light.current) light.current.style.transform = `translate(${lx - 250}px,${ly - 250}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (wand.current) wand.current.style.transform = `translate(${mx - 10}px,${my - 10}px)`;
      const d = Math.hypot(mx - px, my - py);
      if (d > 6) { spawn(mx, my); px = mx; py = my; }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <>
      <canvas ref={sparkCvs} className="sparkle-canvas" aria-hidden="true" />
      <div className="cursor-wand" ref={wand} aria-hidden="true">✦</div>
      <div className="cursor-light" ref={light} aria-hidden="true" />
    </>
  );
}

function ThemeToggleBulb({ theme, toggleTheme }) {
  const [pulling, setPulling] = useState(false);
  
  useEffect(() => {
    if (pulling) {
      const timer = setTimeout(() => setPulling(false), 600);
      return () => clearTimeout(timer);
    }
  }, [pulling]);

  const handleClick = () => {
    setPulling(true);
    toggleTheme();
  };

  return (
    <div className="theme-rope-bulb">
      <svg className={`rope-bulb-svg ${pulling ? "pulling" : ""}`} viewBox="0 0 100 200" width="50" height="100">
        {/* Rope */}
        <path 
          d={pulling ? "M50 10 L50 60" : "M50 10 Q45 30 50 50 Q55 70 50 90"} 
          stroke="#D4AF37" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
        {/* Bulb socket */}
        <ellipse cx="50" cy="100" rx="8" ry="6" fill="#C0C0C0" />
        {/* Bulb glass */}
        <circle 
          cx="50" 
          cy="130" 
          r="18" 
          fill={theme === "dark" ? "#FFD700" : "#E8E8E8"} 
          opacity={theme === "dark" ? 0.9 : 0.6}
        />
        {/* Bulb glow (only when dark) */}
        {theme === "dark" && (
          <circle 
            cx="50" 
            cy="130" 
            r="20" 
            fill="none" 
            stroke="#FFD700" 
            strokeWidth="1"
            opacity="0.4"
          />
        )}
        {/* Filament */}
        {theme === "dark" && (
          <path 
            d="M 45 120 Q 50 125 45 130" 
            stroke="#FF6B00" 
            strokeWidth="1.5" 
            fill="none"
          />
        )}
      </svg>
      <button 
        onClick={handleClick}
        className="rope-bulb-btn"
        aria-label="Toggle theme (rope-bulb)"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      />
    </div>
  );
}
function Navbar({ active, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["home", "skills", "experience", "projects", "contact"];
  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#home" className="nav-logo">
          <span className="logo-letter">Expert-Card</span>
        </a>
        <nav className={`nav-links${open ? " open" : ""}`}>
          {links.map((id) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""} onClick={() => setOpen(false)}>
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
          <a href="./Parthibaraj_S_CV 22_1735378632017_Parthibaraj.pdf" className="nav-cta zoom-cursor" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Search me ?
          </a>
        </nav>
        <div className="nav-right">
          <ThemeToggleBulb theme={theme} toggleTheme={toggleTheme} />
          <button className={`burger${open ? " open" : ""}`} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */
function StatItem({ value, suffix, label, trigger }) {
  const count = useCounter(value, 1800, trigger);
  return (
    <div className="stat">
      <span className="stat-num">{count}{suffix}</span>
      <span className="stat-lbl">{label}</span>
    </div>
  );
}

function HeroSection({ onVisible }) {
  const role = useTypewriter(ROLES, 95, 55, 5000);
  const shortWord = useTypewriter(HERO_WORDS, 110, 65, 5000);
  const [counting, setCounting] = useState(false);
  const [nameAnim, setNameAnim] = useState(0);
  useEffect(() => {
    onVisible("home");
    const t = setTimeout(() => setCounting(true), 800);
    return () => clearTimeout(t);
  }, [onVisible]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNameAnim((v) => {
        let next = Math.floor(Math.random() * 10);
        if (next === v) next = (next + 1) % 10;
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="section hero-section">
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />
      <div className="orb orb-mid" />
      <div className="grid-bg" aria-hidden />

      <div className="hero-body">
        <div className={`hero-brand hero-brand-anim-${nameAnim}`}>Parthibaraj</div>
        <p className="role-text">{shortWord}<span className="typing-cursor">|</span></p>
        <h1 className="hero-name">{role}<span className="name-dot">.</span></h1>
        <p className="hero-bio">
          Senior Software Engineer with <strong>6.5+ years</strong> of expertise in building
          scalable backend systems, robust REST APIs, and cloud-deployed applications.
          Dedicated to clean architecture and performance-driven solutions.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">View My Work <span>→</span></a>
          <a href="./Parthibaraj_S_CV 22_1735378632017_Parthibaraj.pdf" className="btn-outline" target="_blank" rel="noreferrer">Download Resume</a>
        </div>
        <div className="stats-bar">
          {STATS.map((s) => <StatItem key={s.label} {...s} trigger={counting} />)}
        </div>
      </div>

      <a href="#skills" className="scroll-hint">
        <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        <span>Scroll</span>
      </a>
    </section>
  );
}

/* ─── Skills ────────────────────────────────────────────────── */
function SkillsSection({ onVisible }) {
  const [ref, visible] = useReveal(0.15);
  useEffect(() => { if (visible) onVisible("skills"); }, [visible, onVisible]);
  return (
    <section id="skills" className="section alt-section" ref={ref}>
      <div className="s-inner">
        <div className={`section-highlight ru${visible ? " go" : ""}`}>
          <div className="highlight-logo">🛠️</div>
          <div className="highlight-content">
            <div className="highlight-label">Technical Arsenal</div>
            <h3 className="highlight-title">6 Core Tech Stacks</h3>
            <p className="highlight-desc">PHP, Laravel, MySQL, Docker, AWS, and modern architecture patterns</p>
          </div>
        </div>

        <SectionHead tag="What I Know" title="Technical Expertise" visible={visible} />

        <div className={`main-stack-grid rc${visible ? " go" : ""}`}>
          {MAIN_STACKS.map((stack, i) => (
            <article key={stack.name} className="main-stack-card" style={{ "--d": `${i * 70}ms` }}>
              {stack.logo ? <img className="stack-logo" src={stack.logo} alt={`${stack.name} logo`} loading="lazy" /> : null}
              <h3>{stack.name}</h3>
              <p>{stack.sub}</p>
            </article>
          ))}
        </div>

        <div className="stack-marquee" aria-label="Technology logos carousel">
          <div className="stack-track">
            {[...STACK_LOGOS, ...STACK_LOGOS].map((logo, i) => (
              <span className="stack-pill" key={`${logo.name}-${i}`} style={{ borderColor: logo.color, color: logo.color }}>
                {logo.logo ? <img className="pill-logo" src={logo.logo} alt={`${logo.name} logo`} loading="lazy" /> : null}
                {logo.name}
              </span>
            ))}
          </div>
        </div>

        <div className={`skills-grid rc${visible ? " go" : ""}`}>
          {SKILLS.map((g, i) => (
            <div key={g.category} className={`skill-card${visible ? " go" : ""}`} style={{ "--d": `${i * 80}ms` }}>
              <div className="skill-top">
                <span className="skill-ico">{g.icon}</span>
                <h3>{g.category}</h3>
              </div>
              <ul>{g.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Experience ────────────────────────────────────────────── */
function ExperienceSection({ onVisible }) {
  const [ref, visible] = useReveal(0.1);
  useEffect(() => { if (visible) onVisible("experience"); }, [visible, onVisible]);
  return (
    <section id="experience" className="section" ref={ref}>
      <div className="s-inner">
        <SectionHead tag="My Journey" title="Work Experience" visible={visible} />
        <div className={`timeline${visible ? " go" : ""}`}>
          {EXPERIENCES.map((exp, i) => (
            <div key={exp.company} className="tl-item" style={{ "--d": `${i * 120}ms`, "--accent": exp.color }}>
              <div className="tl-dot" />
              <div className="tl-card">
                <div className="tl-head">
                  <div className="tl-company-wrap">
                    <div>
                    <h3 className="tl-role">{exp.role}</h3>
                    <p className="tl-co"><a href={exp.companyUrl} target="_blank" rel="noreferrer">{exp.company}</a></p>
                    <p className="tl-loc">{exp.location}</p>
                    </div>
                  </div>
                  <div className="tl-meta">
                    <span className="tl-dur">{exp.duration}</span>
                    <span className={`tl-type${exp.type === "Contract" ? " contract" : ""}`}>{exp.type}</span>
                  </div>
                </div>
                <ul className="tl-ul">
                  {exp.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Projects ──────────────────────────────────────────────── */
function ProjectsSection({ onVisible }) {
  const [ref, visible] = useReveal(0.1);
  useEffect(() => { if (visible) onVisible("projects"); }, [visible, onVisible]);
  return (
    <section id="projects" className="section alt-section" ref={ref}>
      <div className="s-inner">
        <SectionHead tag="Portfolio" title="Featured Projects" visible={visible} />
        <div className={`proj-grid rc${visible ? " go" : ""}`}>
          {PROJECTS.map((p, i) => (
            <a key={p.name} className={`proj-card${visible ? " go" : ""}`} href={p.url} target="_blank" rel="noreferrer" style={{ "--d": `${i * 80}ms`, "--g": p.gradient }}>
              <div className="pc-top">
                {p.logo ? <img className="pc-logo" src={p.logo} alt={`${p.name} logo`} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <span className="pc-ico">{"</>"}</span>}
                <span className="pc-arr">↗</span>
              </div>
              <h3 className="pc-name">{p.name}</h3>
              <p className="pc-sub">{p.subtitle}</p>
              <p className="pc-desc">{p.desc}</p>
              <div className="pc-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <div className="pc-url">{p.url.replace("https://", "")}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ───────────────────────────────────────────────── */
function ContactSection({ onVisible }) {
  const [ref, visible] = useReveal(0.2);
  useEffect(() => { if (visible) onVisible("contact"); }, [visible, onVisible]);

  const chips = [
    { ico: "📍", text: "Bangalore, India" },
    { ico: "🗣️", text: "Tamil (Native) · English (Fluent)" },
    { ico: "🎓", text: "B.E ECE · Gnanamani College · 2017" },
    { ico: "💼", text: "6.5+ Years · 4 Companies" },
    { ico: "⚡", text: "PHP · Laravel · MySQL · Docker" },
    { ico: "☁️", text: "AWS · Redis · Kubernetes · Nginx" },
  ];

  return (
    <section id="contact" className="section contact-section" ref={ref}>
      <div className="orb orb-purple" style={{ opacity: 0.32, bottom: "-8%", top: "auto", left: "-5%" }} />
      <div className="orb orb-cyan"   style={{ opacity: 0.25, top: "-5%", right: "-3%", left: "auto" }} />

      <div className="s-inner contact-new">

        {/* ── Section Highlight ── */}
        <div className={`section-highlight ru${visible ? " go" : ""}`}>
          <div className="highlight-logo">🤝</div>
          <div className="highlight-content">
            <div className="highlight-label">Let's Connect</div>
            <h3 className="highlight-title">Ready to Collaborate</h3>
            <p className="highlight-desc">Open to exciting opportunities and meaningful projects</p>
          </div>
        </div>

        {/* ── Availability badge ── */}
        <div className={`contact-avail ru${visible ? " go" : ""}`}>
          <span className="avail-dot" />
          Currently open to senior software engineering opportunities
        </div>

        {/* ── Big headline ── */}
        <h2 className={`contact-big-h ru${visible ? " go" : ""}`} style={{ "--d": "100ms" }}>
          Let's build something<br />
          <span className="grad-txt">extraordinary together.</span>
        </h2>

        <p className={`contact-bio ru${visible ? " go" : ""}`} style={{ "--d": "180ms" }}>
          I bring 6.5+ years of backend expertise, API design mastery, and a passion for
          quality-first engineering. Ready to contribute and lead from day one.
        </p>

        {/* ── Primary CTAs ── */}
        <div className={`contact-ctas ru${visible ? " go" : ""}`} style={{ "--d": "260ms" }}>
          <a href="mailto:parthibaraj16@gmail.com" className="cta-email">
            <div className="cta-email-left">
              <span className="cta-ico">✉</span>
              <div>
                <span className="cta-lbl">Drop me a line</span>
                <span className="cta-val">parthibaraj16@gmail.com</span>
              </div>
            </div>
            <span className="cta-arr">→</span>
          </a>

          <a href="tel:+918526670257" className="cta-phone">
            <span>📱</span>
            <div>
              <span className="cta-lbl">Call me directly</span>
              <span className="cta-val">+91 85266 70257</span>
            </div>
          </a>
        </div>

        {/* ── Chip grid ── */}
        <div className={`contact-chips rc${visible ? " go" : ""}`}>
          {chips.map(({ ico, text }, i) => (
            <span key={text} className="c-chip" style={{ "--d": `${i * 55}ms` }}>
              <span>{ico}</span>{text}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─── Shared ─────────────────────────────────────────────────── */
function SectionHead({ tag, title, visible }) {
  return (
    <div className={`sec-head ru${visible ? " go" : ""}`}>
      <p className="sec-tag">{tag}</p>
      <h2 className="sec-title">{title}</h2>
      <div className="sec-line" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="footer-left">Built with ❤️ by <strong>Parthibaraj</strong></span>
      <span className="footer-right">React + Vite · © 2025 · All rights reserved</span>
    </footer>
  );
}

/* ─── Story Rail Component ──────────────────────────────────── */
function StoryRail({ active }) {
  const beat = STORY_BEATS[active] ?? STORY_BEATS.home;
  return (
    <aside className="story-rail" aria-live="polite">
      <span className="story-kicker">{beat.title}</span>
      <p key={active} className="story-line">{beat.text}</p>
    </aside>
  );
}

/* ─── Hold-To-Select Anime Component ───────────────────────── */
function HoldToSelectAnime() {
  const [pops, setPops] = useState([]);

  useEffect(() => {
    const faces = ["(o^_^o)", "(=^･ω･^=)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "(ᗒᗨᗕ)", "(•̀ᴗ•́)و", "(｡◕‿◕｡)"];
    let holdTimer = null;

    const spawn = (x, y) => {
      const id = Date.now() + Math.random();
      const face = faces[Math.floor(Math.random() * faces.length)];
      setPops((prev) => [...prev, { id, x, y, face }]);
      setTimeout(() => {
        setPops((prev) => prev.filter((p) => p.id !== id));
      }, 1200);
    };

    const onDown = (e) => {
      holdTimer = setTimeout(() => {
        spawn(e.clientX, e.clientY);
      }, 260);
    };

    const cancel = () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", cancel);
    window.addEventListener("mouseleave", cancel);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", cancel);
      window.removeEventListener("mouseleave", cancel);
      cancel();
    };
  }, []);

  return (
    <div className="hold-anime-layer" aria-hidden="true">
      {pops.map((p) => (
        <span
          key={p.id}
          className="hold-anime-pop"
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
        >
          {p.face}
        </span>
      ))}
    </div>
  );
}

/* ─── Backdrop FX Component ─────────────────────────────────── */
function BackdropFX() {
  return (
    <div className="backdrop-fx" aria-hidden="true">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <div className="story-grid" />
      <div className="story-vignette" />
      <div className="story-noise" />
    </div>
  );
}

/* ─── Root ──────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive]   = useState("home");
  const [theme, setTheme]     = useState("dark");
  const [wipe, setWipe]       = useState(false);
  const prevActive            = useRef("home");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (active !== prevActive.current) {
      prevActive.current = active;
      setWipe(true);
      const t = setTimeout(() => setWipe(false), 720);
      return () => clearTimeout(t);
    }
  }, [active]);

  const set = useCallback((id) => setActive(id), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return (
    <>
      <CodeRain />
      <BackdropFX />
      <MagicCursor />
      <HoldToSelectAnime />
      <StoryRail active={active} />
      <div className={`section-wipe${wipe ? " active" : ""}`} aria-hidden="true" />
      <Navbar active={active} theme={theme} toggleTheme={toggleTheme} />
      <main>
        <HeroSection onVisible={set} />
        <SkillsSection onVisible={set} />
        <ExperienceSection onVisible={set} />
        <ProjectsSection onVisible={set} />
        <ContactSection onVisible={set} />
      </main>
      <Footer />
    </>
  );
}
