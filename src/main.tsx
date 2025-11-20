import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import Router from './Router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)


const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function updateThemeColor() {
  if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
    themeColorMeta!.setAttribute('content', '#000000'); // Dark mode theme color
  } else {
    themeColorMeta!.setAttribute('content', '#ffffff'); // Light mode theme color
  }
}

// Call on page load
updateThemeColor();

// Listen for changes in preferred color scheme
globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeColor);