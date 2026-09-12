import React, { useState, useEffect } from 'react';
import { Download, Share2, Smartphone, X, CheckCircle2, Apple } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPromptModal: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    // 1. Detect if running standalone (already installed on iOS or Android)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone === true);

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIosDevice(isIos);

    // 3. Android / Chrome PWA install event
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      alert('Pe Android: Apasă pe cele 3 puncte din colțul dreapta-sus al ecranului în Chrome și alege "Instalează aplicația" sau "Adaugă pe ecranul de pornire".');
      return;
    }

    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'Frugalito - Optimizator Coș Cumpărături',
      text: 'Uite aplicația asta tare care găsește cele mai ieftine produse din supermarketuri și îți calculează drumul optim!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  if (isInstalled || isDismissed) return null;

  return (
    <div className="fixed top-20 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-slate-700/80 flex flex-col gap-3">
        
        {/* Header with platform badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-md">
              {isIosDevice ? <Apple className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  {isIosDevice ? 'Aplicație iPhone (iOS)' : 'Aplicație Android'}
                </span>
                <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  1-Click
                </span>
              </div>
              <p className="text-sm font-extrabold text-white">
                {isIosDevice ? 'Instalează pe ecranul iPhone-ului' : 'Instalează Frugalito pe telefon'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic description based on platform */}
        {isIosDevice ? (
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-2 text-xs text-slate-200">
            <p className="font-semibold text-white">Cum se instalează pe iPhone în 2 secunde:</p>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <span>Apasă pe butonul <strong className="text-emerald-400">Partajează</strong> (pătratul cu săgeată în sus ⎋ din bara de jos a Safari).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <span>Alege <strong className="text-emerald-400">„Adaugă pe ecranul principal”</strong> (+).</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-700">
              Pictograma va apărea pe ecranul tău și se va deschide pe tot ecranul exact ca o aplicație din App Store!
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-300 leading-relaxed">
            Instaleaz-o direct pe ecranul principal. Se deschide ca o aplicație nativă, fără bară de browser, fără reclame și cu încărcare instantanee!
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {!isIosDevice && (
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Instalează pe Telefon</span>
            </button>
          )}

          <button
            onClick={handleShareApp}
            className={`${isIosDevice ? 'w-full' : 'py-2 px-3'} py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5`}
            title="Trimite linkul pe WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link copiat!' : 'Trimite unui prieten'}</span>
          </button>
        </div>

        {copiedLink && (
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Linkul a fost copiat! Îl poți trimite direct pe WhatsApp.
          </p>
        )}

      </div>
    </div>
  );
};
