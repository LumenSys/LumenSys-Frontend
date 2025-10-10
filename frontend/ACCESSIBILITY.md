# 🔧 Recursos de Acessibilidade - LumenSys Frontend

## 📋 Visão Geral

Este documento descreve os recursos de acessibilidade implementados no sistema LumenSys Frontend para garantir que a aplicação seja utilizável por pessoas com diferentes necessidades e limitações.

## 🎯 Recursos Implementados

### 1. 🔍 Filtros de Cor para Daltonismo

#### Tipos de Filtros Disponíveis:
- **Normal**: Cores padrão do sistema
- **Preto e Branco**: Remove todas as cores, convertendo para escala de cinza
- **Protanopia**: Filtro para daltonismo vermelho-verde (dificuldade em ver vermelho)
- **Deuteranopia**: Filtro para daltonismo verde-vermelho (dificuldade em ver verde)
- **Tritanopia**: Filtro para daltonismo azul-amarelo (dificuldade em ver azul)
- **Alto Contraste**: Aumenta o contraste e brilho para melhor visibilidade

#### Como Usar:
1. Clique no botão flutuante de acessibilidade (ícone de pessoa) no canto inferior direito
2. Na seção "Filtros Visuais", escolha o filtro desejado
3. O filtro será aplicado imediatamente em toda a página

### 2. 📝 Controle de Tamanho de Fonte

#### Tamanhos Disponíveis:
- **Pequena**: 85% do tamanho padrão
- **Normal**: Tamanho padrão do sistema
- **Grande**: 115% do tamanho padrão
- **Extra Grande**: 130% do tamanho padrão

#### Como Usar:
1. No painel de acessibilidade, use os botões "+" e "-" para ajustar o tamanho
2. Ou use os atalhos de teclado (veja seção de atalhos abaixo)

### 3. ⌨️ Atalhos de Teclado

#### Controle de Fonte:
- `Ctrl + Shift + +`: Aumentar tamanho da fonte
- `Ctrl + Shift + -`: Diminuir tamanho da fonte  
- `Ctrl + Shift + 0`: Restaurar tamanho normal

#### Filtros de Cor:
- `Alt + 1`: Aplicar filtro normal
- `Alt + 2`: Aplicar filtro preto e branco
- `Alt + 3`: Aplicar alto contraste
- `Alt + 0`: Restaurar configurações padrão

### 4. 💾 Persistência de Configurações

- Todas as configurações são salvas automaticamente no localStorage
- As preferências são mantidas entre sessões do navegador
- Não é necessário reconfigurar a cada visita

## 🎨 Design Responsivo

### Características:
- **Layout Fluido**: O painel de acessibilidade se adapta a diferentes tamanhos de tela
- **Breakpoints**: Otimizado para mobile, tablet e desktop
- **Elementos Escaláveis**: Botões e texto se ajustam proporcionalmente
- **Touch-Friendly**: Botões com tamanho adequado para dispositivos touch

### Responsividade por Dispositivo:
- **Mobile (< 640px)**: Painel compacto, ícones menores, layout em coluna
- **Tablet (640px - 1024px)**: Layout otimizado para toque, espaçamentos maiores
- **Desktop (> 1024px)**: Layout completo com todas as funcionalidades

## 🧭 Navegação e UX

### Indicadores Visuais:
- **Estados Ativos**: Filtros ativos são destacados visualmente
- **Feedback Instantâneo**: Mudanças aplicadas em tempo real
- **Tooltips**: Descrições detalhadas dos filtros ao passar o mouse
- **Loading States**: Indicadores de carregamento quando necessário

### Acessibilidade Adicional:
- **Screen Reader Support**: Textos alternativos e labels apropriados
- **Focus Management**: Navegação por teclado funcional
- **Semantic HTML**: Estrutura HTML semântica adequada
- **ARIA Labels**: Atributos ARIA para melhor compatibilidade

## 🔧 Implementação Técnica

### Componentes Principais:
- `AccessibilityContext`: Gerencia estado global das configurações
- `AccessibilityPanel`: Interface de controle flutuante
- `CSS Classes`: Filtros e estilos aplicados dinamicamente

### Tecnologias Utilizadas:
- **React Context**: Gerenciamento de estado global
- **CSS Filters**: Implementação dos filtros de daltonismo
- **localStorage**: Persistência das configurações
- **Tailwind CSS**: Estilização responsiva
- **Lucide React**: Ícones consistentes

## 📊 Estatísticas de Uso

### Benefícios Esperados:
- **8% da população**: Tem algum tipo de daltonismo
- **15% da população**: Tem dificuldades visuais que se beneficiam de alto contraste
- **Usuários idosos**: Beneficiam-se do controle de tamanho de fonte
- **Conformidade WCAG**: Atende diretrizes de acessibilidade web

## 🚀 Melhorias Futuras

### Próximas Funcionalidades:
- [ ] Modo escuro automático
- [ ] Mais opções de filtros de cor
- [ ] Controle de espaçamento entre elementos
- [ ] Leitor de tela integrado
- [ ] Tradução para libras
- [ ] Navegação por voz

### Otimizações Planejadas:
- [ ] Melhorar performance dos filtros CSS
- [ ] Adicionar mais atalhos de teclado
- [ ] Implementar temas personalizáveis
- [ ] Integração com tecnologias assistivas

## 📞 Suporte e Feedback

Para reportar problemas ou sugerir melhorias nos recursos de acessibilidade:
- Abra uma issue no repositório do projeto
- Entre em contato com a equipe de desenvolvimento
- Participe dos testes de usabilidade com usuários reais

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0  
**Compatibilidade**: Todos os navegadores modernos