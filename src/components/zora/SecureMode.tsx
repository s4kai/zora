import { useZora } from "@/contexts/ZoraContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Image,
  MapPin,
  Mic,
  Phone,
  Shield,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";

const vaultItems = [
  { icon: Mic, label: "Notas de Voz", count: 3 },
  { icon: Image, label: "Fotos & Evidências", count: 12 },
  { icon: FileText, label: "Relatórios", count: 2 },
];

const trustedContacts = [
  { name: "Ana Silva", phone: "(11) 98765-4321" },
  { name: "Centro de Apoio", phone: "180" },
  { name: "Delegacia da Mulher", phone: "(11) 4521-2024" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SecureMode = () => {
  const { exitSecureMode, triggerAlert } = useZora();
  const [panicEnabled, setPanicEnabled] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-secure-bg font-secure"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-5 pt-12 pb-10 max-w-md mx-auto space-y-5"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center gap-3">
          <button
            onClick={exitSecureMode}
            className="w-9 h-9 rounded-lg bg-secure-card flex items-center justify-center hover:bg-secure-border transition-colors"
          >
            <ArrowLeft size={18} className="text-secure-text" />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-secure-crimson" />
            <h1 className="text-lg font-semibold text-secure-text">
              Área Pessoal Segura
            </h1>
          </div>
        </motion.div>

        {/* Encrypted Vault */}
        <motion.div variants={item} className="space-y-2">
          <h2 className="text-xs font-semibold text-secure-muted uppercase tracking-wider">
            Cofre Criptografado
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {vaultItems.map((v) => (
              <button
                key={v.label}
                className="bg-secure-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-secure-border transition-colors border border-secure-border"
              >
                <div className="w-10 h-10 rounded-lg bg-secure-surface flex items-center justify-center">
                  <v.icon size={18} className="text-secure-text" />
                </div>
                <span className="text-[10px] font-medium text-secure-text text-center leading-tight">
                  {v.label}
                </span>
                <span className="text-[10px] text-secure-muted">
                  {v.count} itens
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trusted Contacts */}
        <motion.div variants={item} className="space-y-2">
          <h2 className="text-xs font-semibold text-secure-muted uppercase tracking-wider">
            Contatos de Confiança
          </h2>
          <div className="bg-secure-card rounded-xl border border-secure-border overflow-hidden">
            {trustedContacts.map((c, i) => (
              <div
                key={c.name}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i < trustedContacts.length - 1
                    ? "border-b border-secure-border"
                    : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-secure-surface flex items-center justify-center">
                  <Phone size={14} className="text-secure-text" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secure-text">
                    {c.name}
                  </p>
                  <p className="text-xs text-secure-muted">{c.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Panic Button Config */}
        <motion.div variants={item}>
          <div className="bg-secure-card rounded-xl p-4 border border-secure-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-secure-text">
                  Botão de Pânico Silencioso
                </h3>
                <p className="text-xs text-secure-muted">
                  Ativar via Smartwatch / Gesto
                </p>
              </div>
              <button onClick={() => setPanicEnabled(!panicEnabled)}>
                {panicEnabled ? (
                  <ToggleRight size={32} className="text-secure-safe" />
                ) : (
                  <ToggleLeft size={32} className="text-secure-muted" />
                )}
              </button>
            </div>
            {panicEnabled && (
              <button
                onClick={triggerAlert}
                className="w-full py-2.5 rounded-lg bg-secure-crimson-soft text-secure-text text-sm font-semibold hover:bg-secure-crimson transition-colors"
              >
                Testar Alerta Silencioso
              </button>
            )}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div variants={item}>
          <div className="bg-secure-card rounded-xl p-4 border border-secure-border space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-secure-safe" />
              <h3 className="text-sm font-semibold text-secure-text">
                Localização em Tempo Real
              </h3>
            </div>
            <div className="h-32 bg-secure-surface rounded-lg flex items-center justify-center border border-secure-border">
              <div className="text-center">
                <MapPin size={24} className="text-secure-safe mx-auto mb-1" />
                <p className="text-xs text-secure-safe font-semibold">
                  Localização segura
                </p>
                <p className="text-[10px] text-secure-muted mt-0.5">
                  Pronto para compartilhar
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SecureMode;
