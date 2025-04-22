import { useTheme } from '../../context/ThemeContext'

export default function Header() {
  useTheme()

  return (
    <h1>header</h1>
  )
}
