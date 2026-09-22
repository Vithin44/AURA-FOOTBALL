/**
 * AURA Football - Páginas do Sistema (Módulos Ricos e Preparados)
 * Telas temáticas com a identidade visual dark oficial, interações com a Engine e navegação fluida.
 */

import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatDisplay } from '../components/StatDisplay';
import { useNavigation } from '../state/navigationState';
import { useCareer } from '../state/careerState';
import { formatFichas, getPositionName } from '../utils/formatters';
import { ATTRIBUTE_IDS } from '../data/attributes';
import { modifyAttribute, isAttributeId } from '../engine/attributes';
import {
  Swords,
  Dumbbell,
  Shield,
  Calendar as CalendarIcon,
  ArrowLeftRight,
  Newspaper,
  Trophy,
  ShoppingBag,
  Sparkles,
  Settings as SettingsIcon,
  Play,
  RotateCcw,
  Save,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

// ====================================================
// 1. TELA DE PARTIDAS (MATCH PAGE - PROMPT 08)
// ====================================================
export { MatchPage } from './MatchPage';

// ====================================================
// 2. TELA DE TREINAMENTO (TRAINING PAGE)
// ====================================================
export function TrainingPage() {
  const { career, updatePlayer, spendFichas } = useCareer();
  const [trainedAttr, setTrainedAttr] = useState<string | null>(null);

  const handleTrain = (attr: string) => {
    if (!isAttributeId(attr)) return;
    // Treino consome 10 Fichas e melhora +1 ponto no atributo (garantido entre 1 e 100)
    if (spendFichas(10, `Sessão de treino de ${attr}`)) {
      updatePlayer((prev) => modifyAttribute(prev, attr, 1));
      setTrainedAttr(attr);
      setTimeout(() => setTrainedAttr(null), 2500);
    } else {
      alert('Fichas insuficientes para realizar a sessão de treino!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">Centro de Treinamento</h1>
          <p className="text-xs text-[#8B918E]">
            Desenvolva os 6 atributos centrais do atleta usando sessões dedicadas.
          </p>
        </div>
        <Badge variant="gold">Custo: 10 Fichas / Sessão</Badge>
      </div>

      {trainedAttr && (
        <div className="p-3 bg-[#B7FF3C]/10 border border-[#B7FF3C]/30 rounded-xl text-xs text-[#B7FF3C] font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          Treino concluído com sucesso! Atributo {trainedAttr} evoluído em +1 ponto.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ATTRIBUTE_IDS.map((attr) => {
          const val = career.player.attributes[attr];
          return (
            <Card key={attr} variant="dark" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-[#F4F5F2]">{attr}</span>
                <span className="font-mono text-lg font-black text-[#B7FF3C]">{val}</span>
              </div>
              <div className="w-full h-1.5 bg-[#080909] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B7FF3C] rounded-full transition-all duration-300"
                  style={{ width: `${val}%` }}
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => handleTrain(attr)}
              >
                <Dumbbell size={14} />
                Treinar {attr} (-10 Fichas)
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ====================================================
// 3. TELA DO CLUBE (CLUB PAGE)
// ====================================================
export function ClubPage() {
  const { career } = useCareer();
  const club = career.club;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">{club.name}</h1>
          <p className="text-xs text-[#8B918E]">{club.league} • {club.country}</p>
        </div>
        <Badge variant="dark">Prestígio: {club.prestige}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="dark" className="md:col-span-1 text-center space-y-3">
          <div
            className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center font-display font-black text-3xl border border-white/20 shadow-xl"
            style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
          >
            {club.shortName}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F4F5F2]">{club.name}</h2>
            <span className="text-xs font-mono text-[#8B918E]">OVR Elenco: {club.ovr}</span>
          </div>
        </Card>

        <Card variant="dark" className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-[#F4F5F2]">Instalações do Clube</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatDisplay label="Estádio" value={club.stadium} />
            <StatDisplay label="Divisão" value={club.league} />
            <StatDisplay label="Prestígio" value={club.prestige} />
            <StatDisplay label="OVR Médio" value={club.ovr} highlight />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ====================================================
// 4. TELA DE CALENDÁRIO (CALENDAR PAGE)
// ====================================================
export function CalendarPage() {
  const { career } = useCareer();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">Calendário da Temporada</h1>
          <p className="text-xs text-[#8B918E]">
            Ano {career.season.year} • Semana Atual: {career.season.currentWeek} de {career.season.totalWeeks}
          </p>
        </div>
        <Badge variant="green">{career.season.currentPhase}</Badge>
      </div>

      <div className="space-y-3">
        {[
          { week: 1, opponent: 'Metropolitano', status: 'Próxima', venue: 'Casa' },
          { week: 2, opponent: 'Esperança Atlético', status: 'Agendada', venue: 'Fora' },
          { week: 3, opponent: 'União Alvirrubro', status: 'Agendada', venue: 'Casa' },
          { week: 4, opponent: 'Paulista FC B', status: 'Agendada', venue: 'Fora' },
        ].map((item) => (
          <Card
            key={item.week}
            variant="dark"
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-bold text-[#8B918E]">
                SEM {item.week}
              </span>
              <div>
                <span className="text-sm font-bold text-[#F4F5F2] block">
                  vs {item.opponent}
                </span>
                <span className="text-[10px] text-[#8B918E]">
                  Mando: {item.venue} • {career.club.league}
                </span>
              </div>
            </div>

            <Badge variant={item.week === 1 ? 'green' : 'dark'}>{item.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ====================================================
// 5. TELA DE MERCADO & TRANSFERÊNCIAS (TRANSFERS PAGE)
// ====================================================
export function TransfersPage() {
  const { career } = useCareer();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">Mercado da Bola</h1>
          <p className="text-xs text-[#8B918E]">Contratos, valor de passe e interesse de clubes</p>
        </div>
        <Badge variant="dark">Janela Fechada</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatDisplay label="Valor de Mercado" value="R$ 1.8M" highlight />
        <StatDisplay label="Salário Mensal" value={`${career.player.contract.salary} Fichas`} />
        <StatDisplay label="Contrato Restante" value={`${career.player.contract.yearsRemaining} Anos`} />
      </div>

      <Card variant="dark">
        <h3 className="text-sm font-bold text-[#F4F5F2] mb-3">Sondagens de Clubes</h3>
        <p className="text-xs text-[#8B918E] leading-relaxed">
          Nenhuma proposta formal recebida nesta semana. Boas atuações nas próximas partidas aumentarão seu prestígio no mercado nacional.
        </p>
      </Card>
    </div>
  );
}

// ====================================================
// 6. CENTRAL DE NOTÍCIAS (NEWS PAGE)
// ====================================================
export function NewsPage() {
  const { career } = useCareer();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">Central de Imprensa Esportiva</h1>
          <p className="text-xs text-[#8B918E]">Cobertura da mídia sobre sua carreira</p>
        </div>
        <Newspaper size={16} className="text-[#B7FF3C]" />
      </div>

      <div className="space-y-4">
        {career.news && career.news.length > 0 ? (
          career.news.map((item) => (
            <Card key={item.id} variant="dark" className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="dark">{item.category}</Badge>
                <span className="text-[11px] font-mono text-[#8B918E]">{item.date}</span>
              </div>
              <h2 className="text-base font-bold text-[#F4F5F2]">{item.title}</h2>
              <p className="text-xs text-[#8B918E] leading-relaxed">{item.description}</p>
            </Card>
          ))
        ) : (
          <Card variant="dark">
            <p className="text-xs text-[#8B918E]">Nenhuma notícia registrada até o momento.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

// ====================================================
// 7. SALA DE TROFÉUS (TROPHIES PAGE)
// ====================================================
export function TrophiesPage() {
  const { career } = useCareer();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">Sala de Troféus</h1>
          <p className="text-xs text-[#8B918E]">Conquistas coletivas e prêmios individuais</p>
        </div>
        <Trophy size={16} className="text-[#D9B65D]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="dark" className="text-center p-6 space-y-2 opacity-60">
          <div className="w-12 h-12 rounded-xl mx-auto bg-[#191C1C] flex items-center justify-center text-[#8B918E]">
            <Trophy size={20} />
          </div>
          <h3 className="text-xs font-bold text-[#F4F5F2]">Campeonato Estadual</h3>
          <span className="text-[10px] text-[#8B918E] block">Ainda não conquistado</span>
        </Card>

        <Card variant="dark" className="text-center p-6 space-y-2 opacity-60">
          <div className="w-12 h-12 rounded-xl mx-auto bg-[#191C1C] flex items-center justify-center text-[#8B918E]">
            <Trophy size={20} />
          </div>
          <h3 className="text-xs font-bold text-[#F4F5F2]">Copa Nacional</h3>
          <span className="text-[10px] text-[#8B918E] block">Ainda não conquistado</span>
        </Card>

        <Card variant="dark" className="text-center p-6 space-y-2 opacity-60">
          <div className="w-12 h-12 rounded-xl mx-auto bg-[#191C1C] flex items-center justify-center text-[#8B918E]">
            <Trophy size={20} />
          </div>
          <h3 className="text-xs font-bold text-[#F4F5F2]">Bola de Ouro Nacional</h3>
          <span className="text-[10px] text-[#8B918E] block">Ainda não conquistado</span>
        </Card>
      </div>
    </div>
  );
}

// ====================================================
// 8. LOJA OFICIAL (STORE PAGE)
// ====================================================
export function StorePage() {
  const { career, spendFichas } = useCareer();
  const [purchaseStatus, setPurchaseStatus] = useState<string>('');

  const handleBuy = (item: string, cost: number) => {
    if (spendFichas(cost, `Compra na Loja: ${item}`)) {
      setPurchaseStatus(`Você adquiriu '${item}' com sucesso!`);
      setTimeout(() => setPurchaseStatus(''), 3000);
    } else {
      alert('Saldo de Fichas insuficiente!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">Loja Oficial</h1>
          <p className="text-xs text-[#8B918E]">Itens cosméticos e chuteiras exclusivas usando suas Fichas</p>
        </div>
        <Badge variant="gold">{formatFichas(career.currency.fichas)} Fichas</Badge>
      </div>

      {purchaseStatus && (
        <div className="p-3 bg-[#B7FF3C]/10 border border-[#B7FF3C]/30 rounded-xl text-xs text-[#B7FF3C] font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          {purchaseStatus}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { name: 'Chuteira Neon AURA V1', cost: 40, desc: 'Chuteira com visual de fibra e travas verdes' },
          { name: 'Munhequeira Clássica', cost: 20, desc: 'Acessório de proteção para os punhos' },
          { name: 'Faixa de Cabelo Pro', cost: 25, desc: 'Faixa atlética com ajuste esportivo' },
        ].map((item) => (
          <Card key={item.name} variant="dark" className="space-y-3">
            <h3 className="text-sm font-bold text-[#F4F5F2]">{item.name}</h3>
            <p className="text-xs text-[#8B918E]">{item.desc}</p>
            <div className="flex items-center justify-between pt-2 border-t border-[#191C1C]">
              <span className="font-mono text-xs font-bold text-[#D9B65D]">{item.cost} Fichas</span>
              <Button variant="secondary" size="sm" onClick={() => handleBuy(item.name, item.cost)}>
                Comprar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ====================================================
// 9. CASSINO VIP (CASINO PAGE - FICTÍCIO COM FICHAS UNIFICADAS)
// ====================================================
export function CasinoPage() {
  const { career, creditFichas, spendFichas } = useCareer();
  const [betAmount, setBetAmount] = useState(10);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const handleSpin = () => {
    if (!spendFichas(betAmount, 'Aposta no Minigame do Cassino')) {
      alert('Fichas insuficientes para apostar!');
      return;
    }

    // Minigame simples com 45% de chance de dobrar
    const won = Math.random() < 0.45;
    if (won) {
      const prize = betAmount * 2;
      creditFichas(prize, 'Vitória no Minigame do Cassino');
      setSpinResult(`🎉 Parabéns! Você ganhou +${prize} Fichas!`);
    } else {
      setSpinResult(`Não foi dessa vez. Tente novamente!`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">Cassino VIP (Fictício)</h1>
          <p className="text-xs text-[#8B918E]">
            Minigame de entretenimento usando o mesmo saldo único de Fichas (sem dinheiro real).
          </p>
        </div>
        <Badge variant="gold">Saldo: {formatFichas(career.currency.fichas)} Fichas</Badge>
      </div>

      <Card variant="dark" className="text-center p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl mx-auto bg-[#D9B65D]/10 flex items-center justify-center text-[#D9B65D]">
          <Sparkles size={28} />
        </div>

        <h2 className="text-lg font-bold text-[#F4F5F2]">Roleta da Sorte Esportiva</h2>
        <p className="text-xs text-[#8B918E] max-w-md mx-auto">
          Aposte suas Fichas virtuais conquistadas na carreira. Multiplicador de 2x em caso de vitória.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant={betAmount === 10 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setBetAmount(10)}
          >
            10 Fichas
          </Button>
          <Button
            variant={betAmount === 25 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setBetAmount(25)}
          >
            25 Fichas
          </Button>
          <Button
            variant={betAmount === 50 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setBetAmount(50)}
          >
            50 Fichas
          </Button>
        </div>

        <div>
          <Button variant="primary" size="lg" onClick={handleSpin}>
            Girar Roleta ({betAmount} Fichas)
          </Button>
        </div>

        {spinResult && (
          <div className="text-xs font-mono font-bold text-[#F4F5F2] pt-2">
            {spinResult}
          </div>
        )}
      </Card>
    </div>
  );
}

// ====================================================
// 10. AJUSTES & SAVE (SETTINGS PAGE)
// ====================================================
export function SettingsPage() {
  const { saveCareer, resetCareer } = useCareer();
  const { navigateTo } = useNavigation();
  const [status, setStatus] = useState<string>('');

  const handleSave = () => {
    const ok = saveCareer();
    setStatus(ok ? 'Carreira gravada com sucesso no LocalStorage!' : 'Falha ao salvar carreira.');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
        <div>
          <h1 className="text-xl font-bold text-[#F4F5F2]">Configurações & Gerenciamento de Save</h1>
          <p className="text-xs text-[#8B918E]">Preferências do simulador e persistência local</p>
        </div>
        <SettingsIcon size={16} className="text-[#8B918E]" />
      </div>

      <Card variant="dark" className="space-y-4">
        <h3 className="text-sm font-bold text-[#F4F5F2]">Armazenamento Local</h3>
        <p className="text-xs text-[#8B918E]">
          Sua carreira é salva com versionamento seguro e validação de integridade.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={14} />
            Salvar Carreira no Armazenamento Local
          </Button>
          <Button variant="outline" size="sm" onClick={resetCareer}>
            <RotateCcw size={14} />
            Resetar Carreira
          </Button>
        </div>

        {status && <div className="text-xs font-mono text-[#B7FF3C]">{status}</div>}
      </Card>

      <Card variant="dark" className="space-y-3">
        <h3 className="text-sm font-bold text-[#F4F5F2]">Diagnóstico Técnico</h3>
        <p className="text-xs text-[#8B918E]">
          Acesse a página separada com todos os testes da Engine, RNG Mulberry32 e validações de regras.
        </p>
        <Button variant="secondary" size="sm" onClick={() => navigateTo('diagnostics')}>
          <Terminal size={14} />
          Abrir Página de Diagnóstico da Engine
        </Button>
      </Card>
    </div>
  );
}
