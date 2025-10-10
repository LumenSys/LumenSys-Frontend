import React, { useState } from 'react';
import { Accessibility, Eye, Type, RotateCcw, X, Plus, Minus } from 'lucide-react';
import { useAccessibility, ColorFilter } from '../../context/AccessibilityContext';
import Button from '../Button';
import Card from '../Card';

const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    colorFilter,
    fontSize,
    setColorFilter,
    increaseFontSize,
    decreaseFontSize,
    resetSettings,
  } = useAccessibility();

  const colorFilters: { value: ColorFilter; label: string; description: string }[] = [
    { value: 'none', label: 'Normal', description: 'Cores normais' },
    { value: 'grayscale', label: 'P&B', description: 'Preto e branco' },
    { value: 'protanopia', label: 'Protanopia', description: 'Daltonismo vermelho-verde' },
    { value: 'deuteranopia', label: 'Deuteranopia', description: 'Daltonismo verde-vermelho' },
    { value: 'tritanopia', label: 'Tritanopia', description: 'Daltonismo azul-amarelo' },
    { value: 'high-contrast', label: 'Alto Contraste', description: 'Contraste aumentado' },
  ];

  const fontSizeLabels = {
    small: 'Pequena',
    normal: 'Normal',
    large: 'Grande',
    'extra-large': 'Extra Grande',
  };

  // Função para obter o label baseado no fontSize
  const getFontSizeLabel = () => {
    if (typeof fontSize === 'number') {
      if (fontSize <= 12) return fontSizeLabels.small;
      if (fontSize <= 14) return fontSizeLabels.normal;
      if (fontSize <= 16) return fontSizeLabels.large;
      return fontSizeLabels['extra-large'];
    }
    return fontSizeLabels[fontSize as keyof typeof fontSizeLabels] || fontSizeLabels.normal;
  };

  const isFontSizeMax = () => {
    if (typeof fontSize === 'number') return fontSize >= 18;
    return fontSize === 'extra-large';
  };

  const isFontSizeMin = () => {
    if (typeof fontSize === 'number') return fontSize <= 12;
    return fontSize === 'small';
  };

  return (
    <>
      {/* Filtros SVG para Daltonismo */}
      <svg className="absolute w-0 h-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Filtro para Protanopia */}
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0
                                                 0.558 0.442 0 0 0
                                                 0     0.242 0.758 0 0
                                                 0     0     0     1 0"/>
          </filter>

          {/* Filtro para Deuteranopia */}
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0
                                                 0.7   0.3   0 0 0
                                                 0     0.3   0.7 0 0
                                                 0     0     0   1 0"/>
          </filter>

          {/* Filtro para Tritanopia */}
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95  0.05  0    0 0
                                                 0     0.433 0.567 0 0
                                                 0     0.475 0.525 0 0
                                                 0     0     0     1 0"/>
          </filter>
        </defs>
      </svg>

      {/* Botão flutuante de acessibilidade */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            variant="primary"
            size="lg"
            icon={Accessibility}
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            aria-label="Abrir painel de acessibilidade"
          >
            <span className="sr-only">Acessibilidade</span>
          </Button>
        )}

        {isOpen && (
          <Card className="w-80 sm:w-96 max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
            <div className="space-y-4 sm:space-y-6">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-footer">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Accessibility className="text-primary" size={20} />
                  <h3 className="text-base sm:text-lg font-semibold text-textPrimary">
                    Acessibilidade
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={() => setIsOpen(false)}
                  aria-label="Fechar painel" children={undefined}                />
              </div>

              {/* Controles de Tamanho da Fonte */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="text-primary" size={18} />
                  <h4 className="text-sm sm:text-base font-medium text-textPrimary">Tamanho da Fonte</h4>
                </div>

                <div className="flex items-center justify-between bg-footer/30 rounded-lg p-2 sm:p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Minus}
                    onClick={decreaseFontSize}
                    disabled={isFontSizeMin()}
                    aria-label="Diminuir fonte"
                    className="h-8 w-8 sm:h-10 sm:w-10" children={undefined}                  />

                  <span className="text-xs sm:text-sm font-medium text-textPrimary px-2 sm:px-4 text-center">
                    {getFontSizeLabel()}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={Plus}
                    onClick={increaseFontSize}
                    disabled={isFontSizeMax()}
                    aria-label="Aumentar fonte"
                    className="h-8 w-8 sm:h-10 sm:w-10" children={undefined}                  />
                </div>
              </div>

              {/* Filtros de Cor */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="text-primary" size={18} />
                  <h4 className="text-sm sm:text-base font-medium text-textPrimary">Filtros Visuais</h4>
                </div>

                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  {colorFilters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={colorFilter === filter.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setColorFilter(filter.value)}
                      className="text-xs justify-start h-auto py-2 px-2 sm:px-3 text-left"
                      aria-label={filter.description}
                    >
                      <span className="truncate">
                        {filter.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Botão Reset */}
              <div className="pt-3 sm:pt-4 border-t border-footer">
                <Button
                  variant="outline"
                  size="sm"
                  icon={RotateCcw}
                  onClick={resetSettings}
                  className="w-full"
                >
                  Restaurar Padrão
                </Button>
              </div>

              {/* Informações */}
              <div className="text-xs text-textSecondary bg-footer/30 rounded-lg p-2 sm:p-3">
                <p className="mb-1">
                  <strong>Atalhos:</strong>
                </p>
                <div className="space-y-1 text-xs">
                  <p>• <kbd className="bg-white px-1 rounded text-xs">Ctrl+Shift++</kbd> Aumentar fonte</p>
                  <p>• <kbd className="bg-white px-1 rounded text-xs">Ctrl+Shift+-</kbd> Diminuir fonte</p>
                  <p>• <kbd className="bg-white px-1 rounded text-xs">Alt+1</kbd> Normal • <kbd className="bg-white px-1 rounded text-xs">Alt+2</kbd> P&B</p>
                  <p>• <kbd className="bg-white px-1 rounded text-xs">Alt+0</kbd> Restaurar padrão</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Atalhos de teclado */}
      <div 
        className="sr-only" 
        onKeyDown={(e) => {
          if (e.ctrlKey) {
            if (e.key === '+' || e.key === '=') {
              e.preventDefault();
              increaseFontSize();
            } else if (e.key === '-') {
              e.preventDefault();
              decreaseFontSize();
            }
          }
        }}
        tabIndex={-1}
      />
    </>
  );
};

export default AccessibilityPanel;