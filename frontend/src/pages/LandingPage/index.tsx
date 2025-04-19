import { useTheme } from "../../context/ThemeProvider"
import { useNavigate } from "react-router-dom"
import { routes } from "../../routes/routes"
import React from "react"

export default function LandingPage() {
  const { theme, changeFontSize, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <h1>
    LandingPage
    </h1>
  )
}
