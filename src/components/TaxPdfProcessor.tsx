/**
 * React component for processing and displaying tax PDF data
 */

import React, { useState } from 'react';
import { processPdfTextForApp } from '../shared/pdfTaxProcessorTest';

interface TaxData {
  tipo: number;
  orden: number;
  mes: number;
  anio: number;
  periodo: string;
  credito: string;
  debito: string;
  facturas: string;
  flujoIngreso: string;
  nombre_Mes: string;
}

interface ProcessingResult {
  success: boolean;
  data: TaxData[];
  summary?: {
    totalMonths: number;
    totalInvoices: number;
    totalCredits: number;
    totalDebits: number;
    totalCashFlow: number;
    averageInvoices: number;
    averageCredits: number;
    averageDebits: number;
    averageCashFlow: number;
  };
  error?: string;
}

const TaxPdfProcessor: React.FC = () => {
  const [pdfText, setPdfText] = useState<string>('');
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleProcessPdf = async (): Promise<void> => {
    if (!pdfText.trim()) {
      alert('Por favor ingrese el texto del PDF');
      return;
    }

    setIsProcessing(true);
    try {
      const processResult = processPdfTextForApp(pdfText);
      setResult(processResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: []
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearData = (): void => {
    setPdfText('');
    setResult(null);
  };

  const renderDataTable = (data: TaxData[]) => {
    const monthlyData = data.filter(row => row.tipo === 1);
    const totalRow = data.find(row => row.tipo === 2);
    const averageRow = data.find(row => row.tipo === 3);

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Datos Procesados de la Carpeta Tributaria</h3>
        
        {/* Monthly Data Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">Período</th>
                <th className="px-4 py-2 border-b text-right">Facturas</th>
                <th className="px-4 py-2 border-b text-right">Créditos</th>
                <th className="px-4 py-2 border-b text-right">Débitos</th>
                <th className="px-4 py-2 border-b text-right">Flujo de Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2 border-b">{row.periodo}</td>
                  <td className="px-4 py-2 border-b text-right">{row.facturas}</td>
                  <td className="px-4 py-2 border-b text-right">${row.credito}</td>
                  <td className="px-4 py-2 border-b text-right">${row.debito}</td>
                  <td className="px-4 py-2 border-b text-right">${row.flujoIngreso}</td>
                </tr>
              ))}
              
              {/* Total Row */}
              {totalRow && (
                <tr className="bg-blue-100 font-bold">
                  <td className="px-4 py-2 border-b">TOTAL</td>
                  <td className="px-4 py-2 border-b text-right">{totalRow.facturas}</td>
                  <td className="px-4 py-2 border-b text-right">${totalRow.credito}</td>
                  <td className="px-4 py-2 border-b text-right">${totalRow.debito}</td>
                  <td className="px-4 py-2 border-b text-right">${totalRow.flujoIngreso}</td>
                </tr>
              )}
              
              {/* Average Row */}
              {averageRow && (
                <tr className="bg-green-100 font-bold">
                  <td className="px-4 py-2 border-b">PROMEDIO</td>
                  <td className="px-4 py-2 border-b text-right">{averageRow.facturas}</td>
                  <td className="px-4 py-2 border-b text-right">${averageRow.credito}</td>
                  <td className="px-4 py-2 border-b text-right">${averageRow.debito}</td>
                  <td className="px-4 py-2 border-b text-right">${averageRow.flujoIngreso}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        {result?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800">Meses Informados</h4>
              <p className="text-2xl font-bold text-blue-900">{result.summary.totalMonths}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h4 className="font-bold text-green-800">Total Facturas</h4>
              <p className="text-2xl font-bold text-green-900">{result.summary.totalInvoices.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h4 className="font-bold text-purple-800">Flujo Total</h4>
              <p className="text-2xl font-bold text-purple-900">${result.summary.totalCashFlow.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg">
              <h4 className="font-bold text-orange-800">Promedio Mensual</h4>
              <p className="text-2xl font-bold text-orange-900">${result.summary.averageCashFlow.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Procesador de Carpeta Tributaria</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Input Section */}
        <div className="mb-6">
          <label htmlFor="pdfText" className="block text-sm font-medium text-gray-700 mb-2">
            Texto del PDF de Carpeta Tributaria:
          </label>
          <textarea
            id="pdfText"
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Pegue aquí el texto completo de la carpeta tributaria obtenida del PDF..."
            disabled={isProcessing}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleProcessPdf}
            disabled={isProcessing || !pdfText.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Procesando...' : 'Procesar PDF'}
          </button>
          <button
            onClick={handleClearData}
            disabled={isProcessing}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Limpiar
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div>
            {result.success ? (
              renderDataTable(result.data)
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <h3 className="font-bold">Error al procesar el PDF:</h3>
                <p>{result.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <h3 className="font-bold mb-2">Instrucciones de uso:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Copie todo el texto de su carpeta tributaria del PDF del SII</li>
          <li>Pegue el texto en el área de texto superior</li>
          <li>Haga clic en "Procesar PDF" para extraer los datos tributarios</li>
          <li>El sistema identificará automáticamente los períodos declarados y extraerá:</li>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Número de facturas emitidas por período</li>
            <li>Montos de créditos y débitos fiscales</li>
            <li>Flujo de ingresos calculado</li>
            <li>Totales y promedios mensuales</li>
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default TaxPdfProcessor;