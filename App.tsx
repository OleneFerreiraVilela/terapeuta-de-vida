"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AppStage, UserData, MapResult, ChatMessage, User } from './types';
import { calculateMap, getCardData } from './utils/numerology';
import { isValidCPF, calculateAge } from './utils/validation';
import { sendMessageToTherapist } from './services/geminiService';
import { authService } from './services/authService';
import { Button } from './components/Button';
import { Sparkles, ArrowRight, User as UserIcon, Heart, Map as MapIcon, ShieldCheck, Lock, MessageCircle, Infinity, AlertCircle, Loader2, LogOut, LayoutDashboard, Users, CheckCircle2 } from 'lucide-react';
import { TAROT_CARDS } from './constants';

// --- COMPONENTES INDEPENDENTES ---

interface CardItemProps {
  title: string;
  period: string;
  cardNumber: number;
  description: string;
}

const CardItem: React.FC<CardItemProps> = ({ title, period, cardNumber, description }) => {
  const card = getCardData(cardNumber);
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-brand-blue p-3 flex justify-between items-center">
        <h3 className="text-brand-gold font-serif font-bold">{title}</h3>
        <span className="text-xs text-white/70">{period}</span>
      </div>
      <div className="p-4 flex flex-col gap-4">
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-24 h-36 bg-gray-200 rounded shrink-0 overflow-hidden relative group flex items-center justify-center border border-gray-100 shadow-inner">
               {!imgError ? (
                 <img 
                   src={card.image} 
                   alt={card.name} 
                   className="w-full h-full object-cover" 
                   onError={() => setImgError(true)}
                   referrerPolicy="no-referrer"
                 />
               ) : (
                 <div className="flex flex-col items-center justify-center h-full p-1 text-center bg-gray-100">
                   <span className="text-[10px] text-gray-500">Imagem indisponível</span>
                 </div>
               )}
             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-serif text-brand-blue mb-1">{card.number}. {card.name}</h4>
            <div className="flex flex-wrap gap-1 justify-center md:justify-start mb-3">
              {card.keywords.map(k => (
                <span key={k} className="text-[10px] uppercase tracking-wider bg-brand-beige px-2 py-1 rounded text-gray-600">{k}</span>
              ))}
            </div>
            <p className="text-sm text-gray-500 italic mb-2">"{description}"</p>
          </div>
        </div>

        {/* Voice of the Archetype */}
        <div className="bg-brand-beige/50 p-4 rounded-lg border-l-4 border-brand-gold">
          <p className="text-brand-blue font-serif italic text-lg leading-relaxed">"{card.quote}"</p>
        </div>
        
        {/* Theoretical Definition */}
        <div className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
          <strong>Arquétipo:</strong> {card.archetypeDefinition}
        </div>

      </div>
    </div>
  );
};

interface PreMapEducationProps {
  onComplete: () => void;
}

const PreMapEducation: React.FC<PreMapEducationProps> = ({ onComplete }) => {
  const [eduSlide, setEduSlide] = useState(0);
  
  const slides = [
    {
      icon: <Infinity className="w-12 h-12 text-brand-gold mb-4" />,
      image: null,
      title: "União da Física e do Sagrado",
      content: "A Terapeuta de Vida é a união da física quântica com esse recurso milenar de autoconhecimento que é o Tarot. O Mapa-guia é uma técnica de investigação das causas de suas dificuldades e dos seus sofrimentos."
    },
    {
      icon: null,
      image: TAROT_CARDS[0].image,
      title: "A Jornada do Herói",
      content: "Um chamado para você vivenciar a clássica Jornada do Herói. Durante nossa jornada terrena, representamos diversos personagens arquetípicos (padrões). Um após o outro, a cada momento estamos representando um modelo inconscientemente."
    },
    {
      icon: null,
      image: TAROT_CARDS[18].image,
      title: "O Entendimento",
      content: "O entendimento é o primeiro passo para a mudança. Este mapa vai indicar qual padrão está criando sua realidade e lhe ajudar a alcançar os melhores resultados. É um orientador para a vida."
    },
    {
      icon: null,
      image: TAROT_CARDS[19].image,
      title: "O Convite",
      content: "O Louco te convida a fazer uma viagem de autoconhecimento. Siga-o e descubra para onde ele o levará: Qual arquétipo você está vivenciando hoje?"
    },
    {
      icon: null,
      image: TAROT_CARDS[21].image,
      title: "O Mundo",
      content: "Sua alma anseia integrar-se ao cosmo e triunfar. O Mundo simboliza a chegada do herói ao objetivo, ao paraíso perdido. Vamos descobrir o seu mapa?"
    }
  ];

  const currentSlide = slides[eduSlide];

  return (
    <div className="min-h-screen bg-brand-blue text-white p-6 flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-blue to-black opacity-80 z-0"></div>
      
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 min-h-[500px] flex flex-col items-center text-center z-10 shadow-2xl">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
           {currentSlide.image ? (
             <div className="w-32 h-48 mb-6 rounded-lg overflow-hidden shadow-2xl border border-brand-gold/30 transform hover:scale-105 transition-transform duration-500 bg-black/50">
               <img 
                  src={currentSlide.image} 
                  alt={currentSlide.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
               />
             </div>
           ) : (
             <div className="mb-4">
                {currentSlide.icon || <Sparkles className="w-16 h-16 text-brand-gold animate-pulse" />}
             </div>
           )}

           <h3 className="text-3xl font-serif text-brand-gold mb-4 drop-shadow-md">{currentSlide.title}</h3>
           <p className="text-lg font-light leading-relaxed text-gray-100">
             {currentSlide.content}
           </p>
        </div>

        <div className="mt-8 w-full">
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === eduSlide ? 'w-8 bg-brand-gold' : 'w-2 bg-white/30'}`} />
            ))}
          </div>

          {eduSlide < slides.length - 1 ? (
            <Button variant="secondary" fullWidth onClick={() => setEduSlide(prev => prev + 1)}>
              Próximo
            </Button>
          ) : (
            <Button variant="secondary" fullWidth onClick={onComplete}>
              Aceito o Chamado
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};


// --- APP PRINCIPAL ---

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.SPLASH);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Forms State
  const [authForm, setAuthForm] = useState({ email: '', password: '', fullName: '', cpf: '', birthDate: '' });
  const [userData, setUserData] = useState<UserData>({ fullName: '', birthDate: '', cpf: '' }); // Legacy for MapGen
  
  const [mapResult, setMapResult] = useState<MapResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialization
  useEffect(() => {
    // Check session
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    
    // Splash Timeout
    if (stage === AppStage.SPLASH) {
      const timer = setTimeout(() => {
        // Redirecionamento inteligente pós-splash
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
          if (savedUser.role === 'admin') {
            setStage(AppStage.ADMIN_DASHBOARD);
          } else {
            setStage(AppStage.WELCOME);
          }
        } else {
          setStage(AppStage.AUTH_LOGIN);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Load User Map if exists when entering WELCOME or MY_MAP
  useEffect(() => {
    if (currentUser && currentUser.role === 'client') {
       const savedMap = authService.getUserMap(currentUser.id);
       if (savedMap) {
         setMapResult(savedMap);
         setUserData({
           fullName: currentUser.fullName,
           birthDate: currentUser.birthDate || '',
           cpf: currentUser.cpf || ''
         });
       }
    }
  }, [currentUser]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // --- ACTIONS ---

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setMapResult(null);
    setStage(AppStage.AUTH_LOGIN);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await authService.login(authForm.email, authForm.password);
      setCurrentUser(user);
      if (user.role === 'admin') {
        setStage(AppStage.ADMIN_DASHBOARD);
      } else {
        setStage(AppStage.WELCOME);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Basic Validations
    if (!isValidCPF(authForm.cpf)) {
      setErrorMsg("CPF Inválido.");
      setIsLoading(false);
      return;
    }
    const age = calculateAge(authForm.birthDate);
    if (age < 18) {
      setErrorMsg("Cadastro permitido apenas para maiores de 18 anos.");
      setIsLoading(false);
      return;
    }

    const cleanCpf = authForm.cpf.replace(/\D/g, '');
    try {
      const user = await authService.register({
        fullName: authForm.fullName,
        email: authForm.email,
        cpf: cleanCpf,
        birthDate: authForm.birthDate,
        password: authForm.password
      });
      setCurrentUser(user);
      // Pre-fill user data for map context
      setUserData({
        fullName: user.fullName,
        birthDate: user.birthDate || '',
        cpf: user.cpf || '',
        email: user.email
      });
      setStage(AppStage.WELCOME);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await authService.loginGoogleAdmin();
      setCurrentUser(user);
      setStage(AppStage.ADMIN_DASHBOARD);
    } catch (e) {
      setErrorMsg("Erro ao conectar com Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConsultation = () => {
    setStage(AppStage.CHAT_CONSULTATION);
    setChatHistory([{
      id: 'init',
      role: 'model',
      text: 'Olá. Eu sou sua Terapeuta de Vida. Este é um espaço seguro. Antes de qualquer coisa, respire fundo. Me diga: o que está pesando no seu coração hoje? Qual situação você gostaria de entender melhor?'
    }]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, newMsg]);
    setChatInput('');
    setIsTyping(true);

    const response = await sendMessageToTherapist(chatHistory, newMsg.text);
    
    setIsTyping(false);
    setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response }]);
  };

  const handleGenerateMap = async () => {
    // If user already has a map (loaded from effect), skip calculation
    if (mapResult) {
      setStage(AppStage.MY_MAP);
      return;
    }

    // Since we are logged in, we use currentUser data
    if (!currentUser || !currentUser.cpf || !currentUser.birthDate) {
      setErrorMsg("Dados de usuário incompletos.");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate Processing
      
      const result = calculateMap(currentUser.fullName, currentUser.birthDate);
      authService.saveUserMap(currentUser.id, result); // SAVE TO DB
      setMapResult(result);
      setStage(AppStage.MY_MAP);
    } catch (err) {
      setErrorMsg("Erro ao gerar mapa.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkMapAndNavigate = () => {
     if (mapResult) {
       setStage(AppStage.MY_MAP);
     } else {
       setStage(AppStage.PRE_MAP_EDUCATION);
     }
  };

  // --- RENDERERS ---

  const renderSplash = () => (
    <div className="min-h-screen bg-brand-beige flex flex-col items-center justify-center p-4 animate-fade-in text-center">
      <div className="mb-6 relative">
        <Sparkles className="w-16 h-16 text-brand-gold animate-pulse" />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif text-brand-blue mb-4 tracking-wide">Terapeuta de Vida</h1>
      <p className="text-brand-rose text-lg font-light italic mb-8">Clareza para seu momento. Sabedoria para sua jornada.</p>
      <span className="text-xs text-brand-sage uppercase tracking-widest border border-brand-sage px-2 py-1 rounded">Exclusivo para maiores de 18 anos</span>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-white flex flex-col md:flex-row animate-fade-in overflow-hidden">
      {/* Esquerda: Identidade Visual e Informação */}
      <div className="w-full md:w-1/2 bg-brand-blue text-white flex flex-col justify-center p-8 md:p-12 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-gold blur-3xl"></div>
            <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full bg-brand-rose blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto md:mx-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-brand-gold" />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-wider text-brand-beige">Terapeuta de Vida</h1>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-white">
            Clareza e direcionamento para sua <span className="text-brand-gold italic">jornada</span>.
          </h2>

          <p className="text-lg text-blue-100 mb-8 leading-relaxed font-light">
            Acesse sua consulta terapêutica gratuita baseada na sabedoria dos Arquétipos e na Física Quântica. 
            Descubra seu Mapa-Guia e entenda os padrões que regem sua vida.
          </p>

          <div className="flex flex-wrap gap-3">
             <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm">
                <CheckCircle2 size={16} className="text-brand-gold"/> Consulta Gratuita
             </div>
             <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm">
                <MapIcon size={16} className="text-brand-gold"/> Mapa-Guia
             </div>
             <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-sm">
                <Lock size={16} className="text-brand-gold"/> +18 Anos
             </div>
          </div>
        </div>
      </div>

      {/* Direita: Formulário */}
      <div className="w-full md:w-1/2 bg-brand-beige/30 flex items-center justify-center p-6 md:p-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">Bem-vindo(a)</h2>
          <p className="text-gray-500 text-sm mb-6">Entre para acessar sua área segura.</p>
          
          {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100 flex items-center gap-2"><AlertCircle size={16}/> {errorMsg}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 mb-1 block">E-mail</label>
              <input 
                type="email" 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all"
                value={authForm.email}
                onChange={e => setAuthForm({...authForm, email: e.target.value})}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1 ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Senha</label>
              </div>
              <input 
                type="password" 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all"
                value={authForm.password}
                onChange={e => setAuthForm({...authForm, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Acessar Plataforma"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
            <p className="text-sm text-gray-600">
              Ainda não descobriu seu mapa? <button onClick={() => setStage(AppStage.AUTH_REGISTER)} className="text-brand-blue font-bold hover:text-brand-gold transition-colors underline decoration-dotted underline-offset-4">Criar conta gratuita</button>
            </p>
            <div>
               <button onClick={() => setStage(AppStage.AUTH_ADMIN)} className="text-xs text-gray-400 hover:text-brand-blue transition-colors flex items-center justify-center gap-1 mx-auto mt-4">
                 <Lock size={12} /> Área Administrativa
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6 animate-slide-up">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md my-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-brand-gold to-brand-blue"></div>
        
        <button onClick={() => setStage(AppStage.AUTH_LOGIN)} className="text-sm text-gray-400 mb-6 hover:text-brand-blue flex items-center gap-1 transition-colors">
          <ArrowRight className="rotate-180 w-4 h-4" /> Voltar ao Login
        </button>

        <div className="text-center mb-6">
           <h2 className="text-2xl font-serif text-brand-blue font-bold">Criar Conta</h2>
           <p className="text-xs text-brand-rose mt-1 font-medium">Seu CPF será sua chave única para o Mapa-Guia.</p>
        </div>
        
        {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100 flex gap-2"><AlertCircle className="shrink-0 w-5 h-5"/> <span>{errorMsg}</span></div>}

        <form onSubmit={handleRegister} className="space-y-3">
          <input 
            type="text" placeholder="Nome Completo" required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            value={authForm.fullName} onChange={e => setAuthForm({...authForm, fullName: e.target.value})}
          />
          <input 
            type="text" placeholder="CPF (ex: 123.456.789-09)" required maxLength={14}
            inputMode="numeric"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            value={authForm.cpf} onChange={e => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
              const formatted = raw
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
              setAuthForm({...authForm, cpf: formatted});
            }}
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 ml-1 mb-1 font-bold uppercase">Data de Nascimento</span>
            <input 
              type="date" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
              value={authForm.birthDate} onChange={e => setAuthForm({...authForm, birthDate: e.target.value})}
            />
          </div>
          <input 
            type="email" placeholder="E-mail" required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Senha" required minLength={3}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})}
          />
          
          <Button type="submit" fullWidth disabled={isLoading} className="mt-2">
            {isLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Criar Conta e Iniciar"}
          </Button>
        </form>
      </div>
    </div>
  );

  const renderAdminLogin = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 animate-fade-in">
       <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
         <h2 className="text-2xl font-serif text-gray-900 mb-6">Acesso Administrativo</h2>
         
         <button 
           onClick={handleAdminGoogleLogin}
           disabled={isLoading}
           className="w-full flex items-center justify-center gap-3 border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors"
         >
           {isLoading ? <Loader2 className="animate-spin" /> : (
             <>
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" />
                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               </svg>
               Entrar com Google
             </>
           )}
         </button>

         <button onClick={() => setStage(AppStage.AUTH_LOGIN)} className="mt-6 text-sm text-gray-400 underline">Voltar para Login de Cliente</button>
       </div>
    </div>
  );

  const renderAdminDashboard = () => {
    const stats = authService.getStats();
    const users = authService.getAllUsers();

    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow p-4 flex justify-between items-center">
           <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
             <LayoutDashboard className="text-brand-blue" /> Painel Administrativo
           </h1>
           <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
             <LogOut size={16} /> Sair
           </button>
        </header>
        
        <main className="p-6 max-w-6xl mx-auto space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-500 text-sm">Total de Usuários</p>
                   <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
                 </div>
                 <Users className="w-10 h-10 text-blue-100" />
               </div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-500 text-sm">Mapas Gerados</p>
                   <h3 className="text-3xl font-bold text-gray-800">{stats.totalMaps}</h3>
                 </div>
                 <MapIcon className="w-10 h-10 text-green-100" />
               </div>
             </div>
           </div>

           <div className="bg-white rounded-xl shadow overflow-hidden">
             <div className="p-4 border-b border-gray-100">
               <h3 className="font-bold text-gray-700">Usuários Cadastrados</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500">
                   <tr>
                     <th className="p-3">Nome</th>
                     <th className="p-3">CPF</th>
                     <th className="p-3">Data Cadastro</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {users.map(u => (
                     <tr key={u.id} className="hover:bg-gray-50">
                       <td className="p-3 font-medium">{u.fullName}</td>
                       <td className="p-3 font-mono text-gray-500">{u.cpf}</td>
                       <td className="p-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                     </tr>
                   ))}
                   {users.length === 0 && (
                     <tr><td colSpan={3} className="p-6 text-center text-gray-400">Nenhum usuário encontrado.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </main>
      </div>
    );
  };

  const renderWelcome = () => (
    <div className="min-h-screen bg-gradient-to-b from-brand-beige to-white flex flex-col items-center justify-center p-6 animate-slide-up text-center max-w-2xl mx-auto relative">
      <button onClick={handleLogout} className="absolute top-4 right-4 text-gray-400 hover:text-brand-rose"><LogOut size={20}/></button>
      
      <div className="bg-white p-4 rounded-full shadow-xl mb-8">
        <Sparkles className="w-12 h-12 text-brand-gold" />
      </div>
      <h2 className="text-3xl md:text-4xl font-serif text-brand-blue mb-2">Olá, {currentUser?.fullName.split(' ')[0]}</h2>
      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
        Este é seu espaço seguro. O que deseja fazer hoje?
      </p>
      
      <div className="space-y-4 w-full max-w-md">
        <Button fullWidth onClick={handleStartConsultation}>
          <MessageCircle className="inline mr-2 w-4 h-4"/>
          Iniciar Chat Terapêutico
        </Button>
        <Button variant="outline" fullWidth onClick={checkMapAndNavigate}>
          <MapIcon className="inline mr-2 w-4 h-4"/>
          {mapResult ? "Ver Meu Mapa-Guia" : "Descobrir Meu Mapa-Guia"}
        </Button>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="min-h-screen bg-brand-beige flex flex-col">
      <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-brand-gold" />
          <span className="font-serif text-brand-blue font-bold">Consulta Terapêutica</span>
        </div>
        <button onClick={() => setStage(AppStage.WELCOME)} className="text-xs text-gray-500 hover:text-brand-blue">Voltar</button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand-blue text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none border border-brand-beige'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none text-xs text-gray-400 italic animate-pulse">
               A Terapeuta está escrevendo...
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite aqui..." 
            className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:border-brand-gold text-sm"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-brand-gold text-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        </div>
        
        {chatHistory.length > 6 && !mapResult && (
          <div className="mt-4 pt-3 border-t border-gray-100 animate-fade-in text-center">
             <p className="text-xs text-gray-500 mb-2 italic">
               A Terapeuta convidou você a ver seus padrões?
             </p>
             <button 
               onClick={() => setStage(AppStage.PRE_MAP_EDUCATION)} 
               className="bg-brand-beige text-brand-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-gold hover:text-white transition-colors flex items-center gap-2 mx-auto"
             >
               <MapIcon size={16} />
               Desvendar meu Mapa-Guia da Vida
             </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderMapGeneration = () => (
    <div className="min-h-screen bg-brand-beige flex flex-col items-center justify-center p-6 animate-slide-up">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="text-brand-sage w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif text-brand-blue text-center mb-2">Ativar seu Mapa-Guia</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Confirme seus dados para gerarmos sua assinatura vibracional. 
          O Mapa será vinculado permanentemente ao seu CPF.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Nome</p>
            <p className="text-brand-blue">{currentUser?.fullName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
             <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Data Nasc.</p>
                  <p className="text-brand-blue">{currentUser?.birthDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">CPF</p>
                  <p className="text-brand-blue font-mono">{currentUser?.cpf}</p>
                </div>
             </div>
          </div>
          
          <div className="bg-brand-blue/5 p-3 rounded text-xs text-brand-blue flex items-start gap-2">
            <Lock size={14} className="mt-0.5 flex-shrink-0" />
            <p>Ao confirmar, estes dados serão imutáveis para este mapa.</p>
          </div>

          <Button onClick={handleGenerateMap} fullWidth disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" /> Calculando...
              </span>
            ) : (
              "Revelar meu Mapa-Guia Agora"
            )}
          </Button>
          <button onClick={() => setStage(AppStage.WELCOME)} className="w-full text-center text-xs text-gray-400 mt-2 hover:text-gray-600">Cancelar</button>
        </div>
      </div>
    </div>
  );

  const renderMyMap = () => {
    if (!mapResult) return null;

    return (
      <div className="min-h-screen bg-brand-beige p-4 md:p-8 animate-fade-in relative">
        <button onClick={() => setStage(AppStage.WELCOME)} className="fixed top-4 left-4 z-20 bg-white/80 p-2 rounded-full shadow hover:bg-white text-brand-blue">
           &larr; Voltar
        </button>
        <div className="max-w-4xl mx-auto mt-8">
          <header className="mb-8 text-center">
            <h2 className="text-3xl font-serif text-brand-blue mb-2">Seu Mapa-Guia de Vida</h2>
            <p className="text-brand-rose">Olá, {currentUser?.fullName.split(' ')[0]}. Estes são os padrões que regem sua jornada.</p>
          </header>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 text-sm text-gray-600 border-l-4 border-brand-gold">
            <p><strong>Lembre-se:</strong> O mapa indica os personagens que você está vivendo. Se deseja criar algo positivo para o futuro, precisa ter consciência desses sentimentos e intenções para corrigir o leme, como ensina Garnier Mallet.</p>
          </div>

          <div className="space-y-6">
            <CardItem title="1. A Bagagem" period="0-13 anos" cardNumber={mapResult.arcano1} description="O que você trouxe de vidas passadas e padrões herdados." />
            <CardItem title="2. O Ambiente" period="13-25 anos" cardNumber={mapResult.arcano2} description="O cenário onde você cresceu e as primeiras sementes que brotaram." />
            <CardItem title="3. Personalidade" period="25-35 anos" cardNumber={mapResult.arcano3} description="A fase de escolha do próprio caminho e individuação." />
            <CardItem title="4. Maturidade" period="35-45 anos" cardNumber={mapResult.arcano4} description="Momento de colheita e reflexão sobre o que foi plantado." />
            <CardItem title="5. Propósito" period="45+ anos" cardNumber={mapResult.arcano5} description="A missão maior e o legado da sua existência." />
            
            <div className="mt-8 p-6 bg-brand-blue rounded-2xl text-white text-center shadow-xl border border-brand-gold/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
              <div className="flex justify-center mb-4"><Heart className="text-brand-gold animate-pulse" /></div>
              <h3 className="text-2xl font-serif text-brand-gold mb-2">Anseio da Alma</h3>
              <p className="mb-6 opacity-90">A energia eterna que acompanha seu espírito através das existências.</p>
              
              <div className="bg-white/10 p-6 rounded-xl inline-block max-w-lg text-left backdrop-blur-sm">
                 <div className="flex flex-col md:flex-row gap-4 items-center">
                   {/* Soul Card Image */}
                   <div className="w-24 h-36 rounded overflow-hidden shadow-lg border border-white/30 shrink-0">
                      <img 
                        src={getCardData(mapResult.soulArcane).image}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x250?text=Falta+Imagem'; 
                        }}
                        alt="Anseio da Alma"
                      />
                   </div>
                   <div>
                     <h4 className="text-xl font-bold mb-2 text-center md:text-left text-brand-gold">{getCardData(mapResult.soulArcane).number}. {getCardData(mapResult.soulArcane).name}</h4>
                     <p className="text-lg italic font-serif mb-4 text-center md:text-left">"{getCardData(mapResult.soulArcane).quote}"</p>
                     <p className="text-xs opacity-70 border-t border-white/20 pt-2 text-justify">{getCardData(mapResult.soulArcane).archetypeDefinition}</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 items-center">
            <h3 className="text-brand-blue font-bold">Aprofundar na Jornada</h3>
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
              <Button variant="outline" fullWidth onClick={() => setStage(AppStage.EXERCISES)}>
                Práticas de Liberação
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setStage(AppStage.FAMILY_MAP)}>
                <UserIcon className="inline mr-2 w-4 h-4"/>
                Ver Influência Familiar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFamilyMap = () => (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center animate-fade-in">
       <div className="max-w-2xl w-full">
         <button onClick={() => setStage(AppStage.MY_MAP)} className="text-sm text-gray-500 hover:text-brand-blue mb-6 flex items-center gap-1">
            &larr; Voltar ao meu mapa
         </button>
         
         <h2 className="text-3xl font-serif text-brand-blue mb-4">Emaranhamento Familiar</h2>
         <p className="text-gray-600 mb-8 leading-relaxed">
           Esse emaranhamento familiar e ancestral tem relação científica com a <strong>Sequência de Fibonacci, a Proporção Áurea e os Ciclos da Vida</strong> (Problema dos Coelhos de Liber Abaci).
           <br/><br/>
           Revela padrões iguais que vocês têm em comum. A dor viaja pelas famílias até que alguém esteja pronto para senti-la e curá-la.
         </p>

         <div className="bg-brand-beige p-6 rounded-xl mb-8">
            <h3 className="font-bold text-brand-blue mb-4">Adicionar Familiares (Pais, Parceiros, Filhos)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nome da Mãe" className="p-3 rounded border border-gray-300" />
              <input type="text" placeholder="Nome do Pai" className="p-3 rounded border border-gray-300" />
            </div>
            <div className="mt-4 p-4 bg-white/50 rounded border border-brand-blue/10 flex items-center justify-between">
               <span className="text-gray-500 text-sm">Padrões identificados na matriz vibracional...</span>
               <Lock className="text-brand-rose w-5 h-5" />
            </div>
         </div>

         <div className="text-center p-8 bg-gradient-to-br from-brand-blue to-gray-900 rounded-2xl text-white">
            <h3 className="text-xl font-serif text-brand-gold mb-4">Aprofunde com Segurança</h3>
            <p className="mb-6 text-sm opacity-80">
              Para acessar a interpretação completa desses emaranhamentos e realizar o desbloqueio mental necessário, 
              é fundamental uma sessão guiada com a Terapeuta. Isso garante que a "correção do leme" seja feita com amor e responsabilidade.
            </p>
            <Button variant="secondary" onClick={() => setStage(AppStage.BOOKING)}>
              Agendar Leitura Familiar
            </Button>
         </div>
       </div>
    </div>
  );

  const renderExercises = () => (
    <div className="min-h-screen bg-brand-beige p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setStage(AppStage.MY_MAP)} className="text-sm text-gray-500 hover:text-brand-blue mb-6 flex items-center gap-1">
            &larr; Voltar ao meu mapa
         </button>
        <h2 className="text-3xl font-serif text-brand-blue mb-6">Práticas para sua Alma</h2>
        
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand-sage">
            <h3 className="text-xl font-bold text-brand-blue mb-2">Liberação com EFT</h3>
            <p className="text-gray-600 mb-4">
              Baseado no seu mapa, você pode estar vivenciando a sombra de um arquétipo. A EFT ajuda a liberar a carga emocional.
            </p>
            <p className="text-sm italic text-gray-500">Toque no ponto do karatê e repita: "Apesar de sentir esse padrão se repetindo, eu me aceito profunda e completamente."</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand-rose">
            <h3 className="text-xl font-bold text-brand-blue mb-2">O Duplo (Garnier Mallet)</h3>
            <p className="text-gray-600 mb-4">
              À noite, ao deitar, peça (em sentimento, não em palavras) ao seu Duplo (Eu Superior) que vá ao futuro e traga a sua melhor versão para o aqui e agora.
            </p>
            <p className="text-sm italic text-gray-500">Isso ajuda a corrigir o futuro antes de vivê-lo.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-slide-up text-center">
      <button onClick={() => setStage(AppStage.WELCOME)} className="absolute top-4 left-4 text-gray-400 hover:text-brand-blue">&larr; Voltar</button>
      <div className="bg-brand-blue p-4 rounded-full mb-6">
        <Sparkles className="text-brand-gold w-8 h-8" />
      </div>
      <h2 className="text-3xl font-serif text-brand-blue mb-4">Sessão Terapêutica Individual</h2>
      <p className="max-w-md text-gray-600 mb-8">
        Desbloqueio mental, Reprogramação e Leitura Profunda dos Laços Familiares.
        Entenda a Sequência de Fibonacci na sua árvore genealógica.
      </p>
      <div className="space-y-4 w-full max-w-xs">
        <Button 
          fullWidth 
          onClick={() => window.open('https://api.whatsapp.com/send/?phone=5511966131780&text&app_absent=0', '_blank')}
        >
          Agendar via WhatsApp
        </Button>
      </div>
    </div>
  );

  return (
    <div className="font-sans antialiased text-gray-800 selection:bg-brand-gold selection:text-white">
      {stage === AppStage.SPLASH && renderSplash()}
      {stage === AppStage.AUTH_LOGIN && renderLogin()}
      {stage === AppStage.AUTH_REGISTER && renderRegister()}
      {stage === AppStage.AUTH_ADMIN && renderAdminLogin()}
      {stage === AppStage.ADMIN_DASHBOARD && renderAdminDashboard()}
      {stage === AppStage.WELCOME && renderWelcome()}
      {stage === AppStage.CHAT_CONSULTATION && renderChat()}
      {stage === AppStage.PRE_MAP_EDUCATION && <PreMapEducation onComplete={() => setStage(AppStage.MAP_GENERATION)} />}
      {stage === AppStage.MAP_GENERATION && renderMapGeneration()}
      {stage === AppStage.MY_MAP && renderMyMap()}
      {stage === AppStage.FAMILY_MAP && renderFamilyMap()}
      {stage === AppStage.EXERCISES && renderExercises()}
      {stage === AppStage.BOOKING && renderBooking()}
    </div>
  );
};

export default App;
