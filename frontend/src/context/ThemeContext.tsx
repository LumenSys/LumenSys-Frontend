import { ReactNode, createContext, useEffect, useState, useContext } from 'react'

interface ThemeContextType {
    theme: string
    fontSize: number
    toggleTheme: (newTheme: string) => void
    changeFontSize: (newFontSize: number) => void
    colors: {
        primary: string
        secondary: string
        background: string
        surface: string
        textPrimary: string
        textSecondary: string
        footer: string
        danger: string
        success: string
        warning: string
        hoverButton: string
        hoverButton2: string
        white: string
    }
}

interface ThemeProviderProps {
    children: ReactNode
}

const DEFAULT_THEME = 'light'
const DEFAULT_FONT_SIZE = 16

// Paleta de cores padronizada do sistema
const THEME_COLORS = {
    primary: '#87CEDB',           // Azul claro principal
    secondary: '#1E91D6',         // Azul secundário
    background: '#FCFCFC',        // Fundo principal
    surface: '#FFFFFF',           // Superfície de cards
    textPrimary: '#61677A',       // Texto principal
    textSecondary: '#7B8298',     // Texto secundário
    footer: '#E3F1F9',            // Azul claro para footer/hover
    danger: '#FF4D4F',            // Vermelho para erros
    success: '#52C41A',           // Verde para sucesso
    warning: '#FAAD14',           // Amarelo para avisos
    hoverButton: '#E3F1F9',       // Hover de botões
    hoverButton2: '#7B8298',      // Hover alternativo
    white: '#FFFFFF'              // Branco puro
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: DEFAULT_THEME,
    fontSize: DEFAULT_FONT_SIZE,
    toggleTheme: () => { },
    changeFontSize: () => { },
    colors: THEME_COLORS,
})

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<string>(DEFAULT_THEME)
    const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') ?? DEFAULT_THEME
        const savedFontSize = parseInt(localStorage.getItem('fontSize') || '', 10) || DEFAULT_FONT_SIZE

        setTheme(savedTheme)
        setFontSize(savedFontSize)

        document.documentElement.setAttribute('data-theme', savedTheme)
        document.documentElement.style.setProperty('--font-size', `${savedFontSize}px`)
    }, [])

    const toggleTheme = (newTheme: string) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        
        // Atualizar variáveis CSS quando o tema mudar
        updateCSSVariables()
    }

    const changeFontSize = (newFontSize: number) => {
        if (newFontSize < 10 || newFontSize > 44) return
        setFontSize(newFontSize)
        localStorage.setItem('fontSize', `${newFontSize}`)
        document.documentElement.style.setProperty('--font-size', `${newFontSize}px`)
    }

    // Função para atualizar variáveis CSS do tema
    const updateCSSVariables = () => {
        const root = document.documentElement
        Object.entries(THEME_COLORS).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value)
        })
    }

    // Inicializar variáveis CSS na primeira renderização
    useEffect(() => {
        updateCSSVariables()
    }, [])

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            fontSize, 
            toggleTheme, 
            changeFontSize,
            colors: THEME_COLORS 
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
