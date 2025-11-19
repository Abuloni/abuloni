import abuLogo from '../assets/logo.png'
import typo from '../assets/logotypo.png'
import '../style/App.css'
import TaxPdfProcessor from '../components/TaxPdfProcessor'

function App() {
  return (
    <>
      <div className="logo-container">
          <img src={abuLogo} className="logo" alt="Vite logo" />
          <img src={typo} className="logo typo" alt="Abuloni logo" />
      </div>
      <TaxPdfProcessor />
    </>
  )
}

export default App
