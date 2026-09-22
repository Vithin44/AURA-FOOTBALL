/**
 * AURA Football - Componente Reutilizável: PlayerAvatar2D
 * Renderizador visual 2D leve em SVG vetorial estilizado, atlético e moderno.
 * Não utiliza 3D, WebGL ou bibliotecas pesadas. Roda perfeitamente a 60fps em Chromebooks.
 */

import React from 'react';
import { PlayerAvatar } from '../../types';
import { SKIN_TONES } from '../../data/avatarOptions';

interface PlayerAvatar2DProps {
  avatar: PlayerAvatar;
  kitNumber?: number;
  mode?: 'full' | 'bust';
  className?: string;
  showGlow?: boolean;
}

export function PlayerAvatar2D({
  avatar,
  kitNumber = 10,
  mode = 'full',
  className = '',
  showGlow = true,
}: PlayerAvatar2DProps) {
  // Tom de pele com cor base e sombra anatômica
  const currentSkin =
    SKIN_TONES.find((s) => s.id === avatar.skinTone) || SKIN_TONES[1];
  const skinColor = avatar.skinColor || currentSkin.hex;
  const skinShadow = currentSkin.shadowHex;

  // Cabelo
  const hairColor = avatar.hairColor || '#111313';
  const hairStyle = avatar.hairStyle || 'curto_degrade';

  // Roupas e Chuteira
  const primaryJersey = avatar.jerseyPrimaryColor || '#B7FF3C';
  const secondaryJersey = avatar.jerseySecondaryColor || '#111313';
  const shortsColor = avatar.shortsColor || '#111313';
  const socksColor = avatar.socksColor || '#111313';
  const bootsColor = avatar.bootsColor || '#B7FF3C';
  const jerseyStyle = avatar.jerseyStyle || 'solida';

  // Feições
  const faceShape = avatar.faceShape || 'oval';
  const eyebrows = avatar.eyebrows || 'marcante';
  const eyes = avatar.eyes || 'focado';
  const mouth = avatar.mouth || 'firme';

  const viewBox = mode === 'bust' ? '70 20 260 270' : '50 15 300 485';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Halo de iluminação atlética de estúdio */}
      {showGlow && (
        <div
          className="absolute -inset-4 rounded-full opacity-25 blur-2xl pointer-events-none transition-all duration-500"
          style={{ backgroundColor: primaryJersey }}
        />
      )}

      <svg
        viewBox={viewBox}
        className="w-full h-full max-h-[500px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente de iluminação suave para o uniforme */}
          <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryJersey} stopOpacity="1" />
            <stop offset="100%" stopColor={primaryJersey} stopOpacity="0.88" />
          </linearGradient>

          {/* Sombra suave no queixo/pescoço */}
          <linearGradient id="neckShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skinShadow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={skinColor} stopOpacity="0" />
          </linearGradient>

          {/* Efeito de brilho da chuteira */}
          <linearGradient id="bootGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={bootsColor} stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* ==================================================== */}
        {/* PARTE INFERIOR: PERNAS, SHORTS, MEIÕES E CHUTEIRAS */}
        {/* (Apenas visíveis no modo 'full') */}
        {/* ==================================================== */}
        {mode === 'full' && (
          <g id="lower-body">
            {/* Pernas (Coxas com tom de pele) */}
            <rect x="156" y="325" width="36" height="55" rx="6" fill={skinColor} />
            <rect x="208" y="325" width="36" height="55" rx="6" fill={skinColor} />

            {/* Sombra entre as pernas */}
            <path d="M 192 330 L 208 330 L 200 355 Z" fill="#080909" opacity="0.35" />

            {/* Shorts */}
            <path
              d="M 145 272 L 255 272 L 250 338 L 205 338 L 200 310 L 195 338 L 150 338 Z"
              fill={shortsColor}
              stroke="#080909"
              strokeWidth="2"
            />
            {/* Detalhe lateral do shorts */}
            <path d="M 147 274 L 151 336" stroke={primaryJersey} strokeWidth="3" opacity="0.85" />
            <path d="M 253 274 L 249 336" stroke={primaryJersey} strokeWidth="3" opacity="0.85" />

            {/* Joelhos e Canelas (Pele visível antes do meião) */}
            <rect x="159" y="370" width="30" height="25" rx="4" fill={skinColor} />
            <rect x="211" y="370" width="30" height="25" rx="4" fill={skinColor} />

            {/* Meiões de Futebol */}
            <rect x="157" y="390" width="34" height="60" rx="5" fill={socksColor} />
            <rect x="209" y="390" width="34" height="60" rx="5" fill={socksColor} />
            {/* Faixas superiores do meião */}
            <rect x="157" y="393" width="34" height="6" fill={primaryJersey} opacity="0.9" />
            <rect x="209" y="393" width="34" height="6" fill={primaryJersey} opacity="0.9" />

            {/* Chuteiras Velozes Estilizadas */}
            {/* Pé Esquerdo */}
            <path
              d="M 152 448 C 152 448 165 442 186 444 C 196 445 200 452 198 460 C 197 465 145 466 142 461 C 140 456 146 450 152 448 Z"
              fill={bootsColor}
              stroke="#080909"
              strokeWidth="2"
            />
            {/* Travas do Pé Esquerdo */}
            <rect x="146" y="465" width="8" height="4" rx="1" fill="#111313" />
            <rect x="182" y="465" width="8" height="4" rx="1" fill="#111313" />

            {/* Pé Direito */}
            <path
              d="M 248 448 C 248 448 235 442 214 444 C 204 445 200 452 202 460 C 203 465 255 466 258 461 C 260 456 254 450 248 448 Z"
              fill={bootsColor}
              stroke="#080909"
              strokeWidth="2"
            />
            {/* Travas do Pé Direito */}
            <rect x="210" y="465" width="8" height="4" rx="1" fill="#111313" />
            <rect x="246" y="465" width="8" height="4" rx="1" fill="#111313" />
          </g>
        )}

        {/* ==================================================== */}
        {/* PARTE SUPERIOR: BRAÇOS, TRONCO E CAMISA */}
        {/* ==================================================== */}
        <g id="upper-body">
          {/* Braços com tom de pele */}
          <path
            d="M 125 180 L 105 260 C 103 268 115 272 120 265 L 140 195 Z"
            fill={skinColor}
          />
          <path
            d="M 275 180 L 295 260 C 297 268 285 272 280 265 L 260 195 Z"
            fill={skinColor}
          />

          {/* Camisa / Tronco */}
          <path
            d="M 140 162 L 260 162 L 278 190 L 255 285 L 145 285 L 122 190 Z"
            fill="url(#jerseyGrad)"
            stroke="#080909"
            strokeWidth="1.5"
          />

          {/* Mangas da Camisa */}
          <path d="M 140 162 L 115 195 L 135 205 L 148 175 Z" fill={primaryJersey} />
          <path d="M 260 162 L 285 195 L 265 205 L 252 175 Z" fill={primaryJersey} />

          {/* Estilos Gráficos da Camisa */}
          {jerseyStyle === 'listrada' && (
            <g opacity="0.35">
              <rect x="165" y="162" width="16" height="123" fill={secondaryJersey} />
              <rect x="192" y="162" width="16" height="123" fill={secondaryJersey} />
              <rect x="219" y="162" width="16" height="123" fill={secondaryJersey} />
            </g>
          )}

          {jerseyStyle === 'faixa_diagonal' && (
            <path
              d="M 145 170 L 175 162 L 255 265 L 235 285 Z"
              fill={secondaryJersey}
              opacity="0.45"
            />
          )}

          {jerseyStyle === 'gola_v' && (
            <g>
              <polygon points="175,162 200,195 225,162" fill={secondaryJersey} opacity="0.3" />
              <line x1="140" y1="162" x2="160" y2="190" stroke={secondaryJersey} strokeWidth="3" opacity="0.6" />
              <line x1="260" y1="162" x2="240" y2="190" stroke={secondaryJersey} strokeWidth="3" opacity="0.6" />
            </g>
          )}

          {/* Gola da Camisa */}
          <path
            d="M 180 162 C 180 178 220 178 220 162 Z"
            fill={secondaryJersey}
            stroke="#080909"
            strokeWidth="1"
          />

          {/* Número Oficial Estilizado na Camisa */}
          <text
            x="200"
            y="235"
            textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace"
            fontWeight="900"
            fontSize="32"
            fill={secondaryJersey}
            letterSpacing="-1"
            opacity="0.9"
            style={{ userSelect: 'none' }}
          >
            {kitNumber}
          </text>
        </g>

        {/* ==================================================== */}
        {/* PESCOÇO E ROSTO */}
        {/* ==================================================== */}
        <g id="head-and-neck">
          {/* Pescoço */}
          <rect x="186" y="132" width="28" height="36" rx="4" fill={skinColor} />
          {/* Sombra sob o queixo */}
          <path d="M 186 132 L 214 132 L 208 148 L 192 148 Z" fill="url(#neckShadowGrad)" />

          {/* Orelhas */}
          <circle cx="160" cy="108" r="8" fill={skinColor} stroke={skinShadow} strokeWidth="1" />
          <circle cx="240" cy="108" r="8" fill={skinColor} stroke={skinShadow} strokeWidth="1" />

          {/* Formato do Rosto (Oval, Quadrado, Alongado) */}
          {faceShape === 'quadrado' && (
            <path
              d="M 166 75 C 166 60 234 60 234 75 L 234 112 C 234 128 222 134 200 135 C 178 134 166 128 166 112 Z"
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="0.8"
            />
          )}

          {faceShape === 'alongado' && (
            <path
              d="M 168 70 C 168 55 232 55 232 70 L 230 114 C 230 132 216 142 200 142 C 184 142 170 132 170 114 Z"
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="0.8"
            />
          )}

          {faceShape === 'oval' && (
            <path
              d="M 166 72 C 166 58 234 58 234 72 L 232 110 C 232 126 218 136 200 136 C 182 126 168 126 168 110 Z"
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="0.8"
            />
          )}

          {/* ==================================================== */}
          {/* FEIÇÕES: SOBRANCELHAS, OLHOS, NARIZ, BOCA */}
          {/* ==================================================== */}
          <g id="face-features">
            {/* Sobrancelhas */}
            {eyebrows === 'marcante' && (
              <g stroke={hairColor} strokeWidth="3.2" strokeLinecap="round">
                <line x1="178" y1="94" x2="194" y2="93" />
                <line x1="206" y1="93" x2="222" y2="94" />
              </g>
            )}
            {eyebrows === 'fina' && (
              <g stroke={hairColor} strokeWidth="1.8" strokeLinecap="round">
                <line x1="180" y1="95" x2="194" y2="94" />
                <line x1="206" y1="94" x2="220" y2="95" />
              </g>
            )}
            {eyebrows === 'arqueada' && (
              <g stroke={hairColor} strokeWidth="2.5" strokeLinecap="round">
                <path d="M 178 96 Q 186 92 194 94" fill="none" />
                <path d="M 206 94 Q 214 92 222 96" fill="none" />
              </g>
            )}

            {/* Olhos */}
            {eyes === 'focado' && (
              <g>
                <ellipse cx="186" cy="103" rx="4.5" ry="3.2" fill="#F4F5F2" />
                <circle cx="186" cy="103" r="2.2" fill="#111313" />
                <circle cx="187.2" cy="102" r="0.8" fill="#FFFFFF" />

                <ellipse cx="214" cy="103" rx="4.5" ry="3.2" fill="#F4F5F2" />
                <circle cx="214" cy="103" r="2.2" fill="#111313" />
                <circle cx="215.2" cy="102" r="0.8" fill="#FFFFFF" />
              </g>
            )}

            {eyes === 'amendoado' && (
              <g>
                <ellipse cx="186" cy="103" rx="5" ry="2.6" fill="#F4F5F2" />
                <circle cx="186" cy="103" r="2" fill="#111313" />
                <ellipse cx="214" cy="103" rx="5" ry="2.6" fill="#F4F5F2" />
                <circle cx="214" cy="103" r="2" fill="#111313" />
              </g>
            )}

            {eyes === 'intenso' && (
              <g>
                <polygon points="181,104 186,100 191,104" fill="#F4F5F2" />
                <circle cx="186" cy="103" r="2" fill="#111313" />
                <polygon points="209,104 214,100 219,104" fill="#F4F5F2" />
                <circle cx="214" cy="103" r="2" fill="#111313" />
              </g>
            )}

            {/* Nariz Atlético Estilizado */}
            <path
              d="M 199 104 L 202 113 L 197 114"
              fill="none"
              stroke={skinShadow}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Boca / Expressão */}
            {mouth === 'firme' && (
              <line
                x1="193"
                y1="123"
                x2="207"
                y2="123"
                stroke={skinShadow}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}
            {mouth === 'neutra' && (
              <line
                x1="194"
                y1="123"
                x2="206"
                y2="123"
                stroke={skinShadow}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
            {mouth === 'sorriso_leve' && (
              <path
                d="M 193 122 Q 200 126 207 122"
                fill="none"
                stroke={skinShadow}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* ==================================================== */}
          {/* CABELO (ESTILIZADO POR TIPO) */}
          {/* ==================================================== */}
          <g id="hair">
            {hairStyle === 'raspado' && (
              <path
                d="M 165 74 C 165 52 235 52 235 74 L 235 84 C 235 84 225 70 200 70 C 175 70 165 84 165 84 Z"
                fill={hairColor}
                opacity="0.75"
              />
            )}

            {hairStyle === 'curto_degrade' && (
              <g>
                {/* Topo volumoso */}
                <path
                  d="M 164 74 C 164 48 236 48 236 74 C 236 82 226 73 200 73 C 174 73 164 82 164 74 Z"
                  fill={hairColor}
                />
                {/* Degradê sutil nas laterais */}
                <path
                  d="M 164 75 L 163 96 L 167 96 L 167 78 Z"
                  fill={hairColor}
                  opacity="0.45"
                />
                <path
                  d="M 236 75 L 237 96 L 233 96 L 233 78 Z"
                  fill={hairColor}
                  opacity="0.45"
                />
              </g>
            )}

            {hairStyle === 'ondulado' && (
              <g fill={hairColor}>
                <path d="M 163 76 C 160 48 240 48 237 76 C 240 68 230 54 200 54 C 170 54 160 68 163 76 Z" />
                <circle cx="172" cy="58" r="9" />
                <circle cx="188" cy="52" r="10" />
                <circle cx="206" cy="51" r="10" />
                <circle cx="224" cy="56" r="9" />
              </g>
            )}

            {hairStyle === 'moicano' && (
              <g fill={hairColor}>
                {/* Faixa central estilizada mais alta */}
                <path d="M 186 70 L 192 38 L 208 38 L 214 70 Z" />
                <path d="M 188 42 L 200 32 L 212 42 Z" />
                {/* Laterais raspadas */}
                <path d="M 165 74 L 165 92 L 169 92 L 174 74 Z" opacity="0.3" />
                <path d="M 235 74 L 235 92 L 231 92 L 226 74 Z" opacity="0.3" />
              </g>
            )}

            {hairStyle === 'dreads' && (
              <g stroke={hairColor} strokeWidth="5" strokeLinecap="round" fill="none">
                <path d="M 180 65 Q 170 75 168 95" />
                <path d="M 190 60 Q 185 75 182 100" />
                <path d="M 200 58 Q 200 75 200 102" />
                <path d="M 210 60 Q 215 75 218 100" />
                <path d="M 220 65 Q 230 75 232 95" />
                {/* Base do topo */}
                <ellipse cx="200" cy="65" rx="35" ry="14" fill={hairColor} stroke="none" />
              </g>
            )}

            {hairStyle === 'topete' && (
              <g fill={hairColor}>
                <path d="M 164 74 C 164 50 185 40 215 44 C 235 46 238 60 236 74 C 220 66 185 66 164 74 Z" />
                <path d="M 180 50 Q 210 36 222 46 Z" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
