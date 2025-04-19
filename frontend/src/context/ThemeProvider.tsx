import { ReactNode, createContext, useEffect, useState, useContext } from 'react'
import React from 'react'

interface ThemeContextType {
    theme: string
    fontSize: number
    toggleTheme: (newTheme: string) => void
    changeFontSize: (newFontSize: number) => void
}

interface ThemeProviderProps {
    children: ReactNode
}

const DEFAULT_THEME = 'light'
const DEFAULT_FONT_SIZE = 16

export const ThemeContext = createContext<ThemeContextType>({
    theme: DEFAULT_THEME,
    fontSize: DEFAULT_FONT_SIZE,
    toggleTheme: () => { },
    changeFontSize: () => { },
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
    }

    const changeFontSize = (newFontSize: number) => {
        if (newFontSize < 10 || newFontSize > 44) return
        setFontSize(newFontSize)
        localStorage.setItem('fontSize', `${newFontSize}`)
        document.documentElement.style.setProperty('--font-size', `${newFontSize}px`)
    }

    return (
        <ThemeContext.Provider value={{ theme, fontSize, toggleTheme, changeFontSize }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
