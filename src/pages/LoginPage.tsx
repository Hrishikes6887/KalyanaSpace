import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEMO_CREDENTIALS, DemoAccountCreds } from '../data/seedUsers';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Store,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('customer@kalyanaspace.demo');
  const [password, setPassword] = useState('Customer@123');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'owner' | 'admin'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState('');

  const handleRoleSelect = (creds: DemoAccountCreds) => {
    setSelectedRole(creds.role);
    setEmail(creds.email);
    setPassword(creds.password);
    setErrorMessage('');
  };

  const copyCreds = (creds: DemoAccountCreds, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${creds.email}\n${creds.password}`);
    setCopiedEmail(creds.email);
    showToast('info', 'Credentials Copied', `Copied login for ${creds.name}`);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      showToast('success', `Welcome back, ${result.user.name.split(' ')[0]}!`, `Logged in as ${result.user.role.toUpperCase()}`);

      // Redirect appropriately
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else if (result.user.role === 'owner') {
        navigate('/owner');
      } else {
        const from = (location.state as any)?.from?.pathname || '/account';
        navigate(from);
      }
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please select one of the seeded accounts.');
    }
  };

  return (
    <div className="bg-ivory-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center shadow-subtle">
              <Sparkles className="w-5 h-5 text-gold-300" />
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
              Kalyana<span className="text-gold-600 font-sans">Space</span>
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2">
            Demo Portal Access
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Choose a demo persona below to explore KalyanaSpace as a Customer, Hall Owner, or Platform Administrator.
          </p>
        </div>

        {/* Demo Persona Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_CREDENTIALS.map((creds) => {
            const isSelected = selectedRole === creds.role;
            let icon = <User className="w-5 h-5 text-emerald-600" />;
            let borderHover = 'hover:border-emerald-300';
            if (creds.role === 'owner') {
              icon = <Store className="w-5 h-5 text-amber-600" />;
              borderHover = 'hover:border-amber-300';
            } else if (creds.role === 'admin') {
              icon = <ShieldCheck className="w-5 h-5 text-rose-600" />;
              borderHover = 'hover:border-rose-300';
            }

            return (
              <div
                key={creds.email}
                onClick={() => handleRoleSelect(creds)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-brand-800 shadow-card ring-2 ring-brand-700/20'
                    : `bg-white/80 border-stone-200 shadow-subtle ${borderHover}`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-stone-50">{icon}</div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                      {creds.role}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-stone-900 mb-0.5">{creds.name}</h3>
                  <p className="text-[11px] text-stone-500 leading-tight mb-3">
                    {creds.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-stone-400 truncate max-w-[120px]">{creds.email}</span>
                  <button
                    type="button"
                    onClick={(e) => copyCreds(creds, e)}
                    className="p-1 rounded text-stone-400 hover:text-stone-700 transition-colors"
                    title="Copy demo credentials"
                    aria-label={`Copy credentials for ${creds.name}`}
                  >
                    {copiedEmail === creds.email ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-card space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Demo Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. customer@kalyanaspace.demo"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-700 font-mono"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In to Demo Session...</span>
                  </>
                ) : (
                  <>
                    <span>Enter {selectedRole.toUpperCase()} Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-500 border border-stone-200/60 leading-relaxed">
            <strong>Demonstration Notice:</strong> This is a client-side frontend MVP. Mock authentication preserves session state in your local browser storage. No external servers or API keys are required.
          </div>
        </div>

      </div>
    </div>
  );
};
