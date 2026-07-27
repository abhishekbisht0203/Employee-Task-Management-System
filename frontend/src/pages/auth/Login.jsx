import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

function SoftBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '50%', height: '50%', top: '-10%', right: '-5%',
          background: 'radial-gradient(ellipse at center, rgba(79,70,229,0.05) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
        animate={{ x: ['0%', '2%', '-1%', '0%'], y: ['0%', '1.5%', '-2%', '0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '40%', height: '40%', bottom: '-8%', left: '-5%',
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
        animate={{ x: ['0%', '-1.5%', '2%', '0%'], y: ['0%', '-2%', '1.5%', '0%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '30%', height: '30%', top: '30%', left: '15%',
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.03) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: ['0%', '3%', '-1%', '0%'], y: ['0%', '-1%', '3%', '0%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function FloatingParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.15 + 0.03,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 70, 229, ${p.o})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    }

    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true" />
  );
}

function MouseGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const handle = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[2] transition-[opacity] duration-700"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(79,70,229,0.03) 0%, transparent 65%)',
        borderRadius: '50%',
        opacity: pos.x === -400 ? 0 : 1,
      }}
      aria-hidden="true"
    />
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 18 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 15 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 20, delay: 0.15 },
  },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [remember, setRemember] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');

      if (!email.trim()) { setError('Email is required'); setShakeKey((k) => k + 1); return; }
      if (!password.trim()) { setError('Password is required'); setShakeKey((k) => k + 1); return; }

      setLoading(true);
      try {
        const role = await login(email.trim(), password);
        setSuccess(true);
        setTimeout(() => navigate(role === 'ADMIN' ? '/dashboard' : '/employee/tasks'), 700);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid email or password');
        setShakeKey((k) => k + 1);
        setLoading(false);
      }
    },
    [email, password, login, navigate]
  );

  const copyCredentials = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #EEF4FF 0%, #E8F1FF 25%, #DCEBFF 55%, #F5F8FF 100%)',
      }}
    >
      <SoftBlobs />
      <FloatingParticles />
      <MouseGlow />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full h-full flex items-center justify-center px-4 py-8"
      >
        <motion.div
          variants={cardVariants}
          animate={shakeKey > 0 ? { x: [0, -5, 5, -3, 3, -1, 1, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <motion.div
            className="relative rounded-[20px] p-6 sm:p-10 w-full max-w-[420px]"
            style={{
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 25px 60px rgba(15,23,42,0.10)',
            }}
            whileHover={{
              boxShadow: '0 30px 70px rgba(15,23,42,0.12)',
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
              <motion.div
                className="relative mb-5"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(99,102,241,0.04))',
                    border: '1px solid rgba(255,255,255,0.6)',
                  }}
                >
                  <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
              </motion.div>

              <h1 className="text-[28px] font-bold tracking-tight mb-1" style={{ color: '#0F172A' }}>
                Task <span style={{ color: '#4F46E5' }}>Manager</span>
              </h1>
              <p className="text-sm" style={{ color: '#475569' }}>
                Manage your work efficiently
              </p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 p-3 rounded-[10px] flex items-start gap-2.5"
                  style={{
                    background: 'rgba(239,68,68,0.04)',
                    border: '1px solid rgba(239,68,68,0.1)',
                  }}
                  role="alert"
                >
                  <svg className="w-[16px] h-[16px] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span className="text-sm" style={{ color: '#DC2626' }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-[16px]"
              noValidate
            >
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-[17px] h-[17px] transition-colors duration-300"
                    style={{ color: focusedField === 'email' ? '#6366F1' : '#94A3B8' }}
                    strokeWidth={1.5}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    autoComplete="email"
                    aria-label="Email address"
                    className="block w-full h-[48px] pl-10 pr-3.5 pt-3 pb-1 text-sm outline-none rounded-[10px] transition-all duration-200"
                    style={{
                      color: '#0F172A',
                      background: 'rgba(255,255,255,0.75)',
                      border: focusedField === 'email'
                        ? '1px solid #6366F1'
                        : '1px solid #CBD5E1',
                      boxShadow: focusedField === 'email'
                        ? '0 0 0 4px rgba(99,102,241,0.12)'
                        : 'none',
                    }}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-10 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none"
                    style={{
                      color: email || focusedField === 'email' ? '#6366F1' : '#94A3B8',
                      fontSize: email || focusedField === 'email' ? '11px' : '14px',
                      top: email || focusedField === 'email' ? '7px' : '50%',
                      transform: email || focusedField === 'email' ? 'translateY(0)' : 'translateY(-50%)',
                    }}
                  >
                    Email address
                  </label>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-[17px] h-[17px] transition-colors duration-300"
                    style={{ color: focusedField === 'password' ? '#6366F1' : '#94A3B8' }}
                    strokeWidth={1.5}
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    autoComplete="current-password"
                    aria-label="Password"
                    className="block w-full h-[48px] pl-10 pr-10 pt-3 pb-1 text-sm outline-none rounded-[10px] transition-all duration-200"
                    style={{
                      color: '#0F172A',
                      background: 'rgba(255,255,255,0.75)',
                      border: focusedField === 'password'
                        ? '1px solid #6366F1'
                        : '1px solid #CBD5E1',
                      boxShadow: focusedField === 'password'
                        ? '0 0 0 4px rgba(99,102,241,0.12)'
                        : 'none',
                    }}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-10 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none"
                    style={{
                      color: password || focusedField === 'password' ? '#6366F1' : '#94A3B8',
                      fontSize: password || focusedField === 'password' ? '11px' : '14px',
                      top: password || focusedField === 'password' ? '7px' : '50%',
                      transform: password || focusedField === 'password' ? 'translateY(0)' : 'translateY(-50%)',
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-md transition-colors"
                    style={{ color: focusedField === 'password' ? '#6366F1' : '#94A3B8' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOff className="w-[17px] h-[17px]" strokeWidth={1.5} />
                      : <Eye className="w-[17px] h-[17px]" strokeWidth={1.5} />
                    }
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="sr-only"
                      aria-label="Remember me"
                    />
                    <motion.div
                      className="w-[17px] h-[17px] rounded-[4px] flex items-center justify-center transition-all duration-200"
                      style={{
                        background: remember
                          ? 'linear-gradient(135deg, #4F46E5, #6366F1)'
                          : 'rgba(255,255,255,0.75)',
                        border: remember
                          ? '1px solid transparent'
                          : '1px solid #CBD5E1',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <AnimatePresence>
                        {remember && (
                          <motion.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  <span className="text-sm" style={{ color: '#64748B' }}>
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  className="text-sm font-medium bg-transparent border-none cursor-pointer transition-colors duration-200"
                  style={{ color: '#4F46E5' }}
                >
                  Forgot password?
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading || success}
                  className="relative w-full h-[46px] rounded-[10px] text-sm font-semibold text-white overflow-hidden cursor-pointer border-none outline-none flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                    boxShadow: '0 2px 12px rgba(79,70,229,0.15)',
                  }}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: '0 4px 16px rgba(79,70,229,0.2)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 rounded-[10px]"
                    style={{
                      background: 'linear-gradient(135deg, #4338CA, #4F46E5)',
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    {success ? (
                      <>
                        <CheckCircle2 className="w-[17px] h-[17px]" strokeWidth={2.5} />
                        <span>Signed in</span>
                      </>
                    ) : loading ? (
                      <>
                        <Loader2 className="w-[16px] h-[16px] animate-spin" strokeWidth={2} />
                        <span>Signing in</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-[15px] h-[15px]" strokeWidth={2} />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.div variants={itemVariants} className="mt-7">
              <div
                className="rounded-[12px] p-4"
                style={{
                  background: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.6)',
                }}
              >
                <p className="text-[11px] font-semibold mb-3 tracking-wide uppercase" style={{ color: '#94A3B8' }}>
                  Demo Credentials
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Admin', email: 'admin@eventxplora.com', pass: 'admin123' },
                    { label: 'Employee', email: 'employee@eventxplora.com', pass: 'employee123' },
                  ].map((cred) => (
                    <div
                      key={cred.label}
                      className="flex items-center justify-between gap-2 rounded-[8px] px-3 py-2 cursor-pointer group transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.35)' }}
                      onClick={() => { setEmail(cred.email); setPassword(cred.pass); }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setEmail(cred.email);
                          setPassword(cred.pass);
                        }
                      }}
                      aria-label={`Fill ${cred.label} credentials`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[11px] font-semibold w-14 shrink-0" style={{ color: '#64748B' }}>
                          {cred.label}
                        </span>
                        <span className="text-xs truncate" style={{ color: '#475569' }}>
                          {cred.email}
                        </span>
                      </div>
                      <motion.button
                        type="button"
                        className="p-1 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        style={{ background: 'rgba(79,70,229,0.08)' }}
                        onClick={(e) => { e.stopPropagation(); copyCredentials(cred.email); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`Copy ${cred.label} email`}
                      >
                        {copied ? (
                          <Check className="w-3 h-3" style={{ color: '#4F46E5' }} strokeWidth={3} />
                        ) : (
                          <Copy className="w-3 h-3" style={{ color: '#4F46E5' }} strokeWidth={2} />
                        )}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center mt-6">
              <span className="text-xs" style={{ color: '#94A3B8' }}>
                By signing in, you agree to our{' '}
                <button
                  type="button"
                  className="bg-transparent border-none cursor-pointer text-xs transition-colors duration-200"
                  style={{ color: '#4F46E5' }}
                >
                  Terms
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  className="bg-transparent border-none cursor-pointer text-xs transition-colors duration-200"
                  style={{ color: '#4F46E5' }}
                >
                  Privacy Policy
                </button>
              </span>
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}