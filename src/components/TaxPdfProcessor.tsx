/**
 * React component for processing and displaying tax PDF data
 */

import React, { useState } from 'react';
import type { ProcessingResult } from '../shared/pdfTaxProcessor';
import { processTaxPdfText } from '../shared/pdfTaxProcessor';
import { getText } from '../shared/getText';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export interface DatosGrafico {
  periodo: string;
  compras: number;
  ventas: number;
}

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Gráfico',
    },
  }
};


const TaxPdfProcessor: React.FC = () => {
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [dataGrafico, setDataGrafico] = useState<DatosGrafico[]>([]); // Placeholder for chart data if needed

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      // Extract text from PDF
      const extractedText = await getText(file);
      
      // Process the extracted text directly
      const processedData = processTaxPdfText(extractedText.TextResult);
      setDataGrafico(processedData.data.map(item => ({
        periodo: item.periodo?.slice(-4,-2) + '.' + item.periodo?.slice(-2) || '',
        compras: item.creditoxFactor,
        ventas: item.debitoxFactor
      })));
      setResult(processedData);
    } catch (err) {
      setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearData = (): void => {
    setResult(null);
    setError('');
    // Reset file input
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Extraer Datos Carpeta</h2>

      {/* Important Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
        <h3 className="text-sm font-medium text-yellow-800">
          IMPORTANTE :
        </h3>
        <div className="mt-2 text-sm text-yellow-700">
            <ul className="list-disc list-inside space-y-1" style={{ textAlign: 'left' }}>
              <li>Seleccionar nueva versión de la carpeta</li>
              <li>Agregar datos F29 (carpeta personalizada)</li>
            </ul>
        </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* File Upload Section */}
        <div className="mb-6">
          <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Subir Documento PDF Carpeta Tributaria:
          </label>
          <div className="file-upload">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isProcessing}
              id="pdf-upload"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleClearData}
            disabled={isProcessing}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Limpiar
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold">Error processing file:</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <p>Processing PDF file...</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div>
            <h3 className="text-xl font-bold mb-4">Resultados</h3>
            
            {result.data.length > 0 ? (
              <>
                <div className="mb-6">
                  <p><strong>Registros encontrados:</strong> {result.data.length}</p>
                </div>
                
                {/* Monthly Data Table */}
                <div className="overflow-x-auto mb-6 monthly-table">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 border-b text-left">Periodo</th>
                        <th className="px-4 py-2 border-b text-right">Facturas</th>
                        <th className="px-4 py-2 border-b text-right">Credito</th>
                        <th className="px-4 py-2 border-b text-right">Debito</th>
                        <th className="px-4 py-2 border-b text-right">Compra $M</th>
                        <th className="px-4 py-2 border-b text-right">Venta $M</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.map((row, index) => (
                        <tr key={`${row.periodo}-${row.mes}-${row.anio}`} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-2 border-b">{row.periodo?.slice(-4,-2)+ '.' + row.periodo?.slice(-2)}</td>
                          <td className="px-4 py-2 border-b text-right">{row.facturas.toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right">{row.credito.toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right">{row.debito.toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right">{row.creditoxFactor.toLocaleString()}</td>
                          <td className="px-4 py-2 border-b text-right">{row.debitoxFactor.toLocaleString()}</td>
                        </tr>
                      ))}
                      
                      {/* Total Row */}
                      <tr className="bg-blue-100 font-bold">
                        <td className="px-4 py-2 border-b">TOTAL</td>
                        <td className="px-4 py-2 border-b text-right">{result.totalRows.facturas.toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-right">{result.totalRows.credito.toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-right">{result.totalRows.debito.toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-right">{result.totalRows.creditoxFactor.toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-right">{result.totalRows.debitoxFactor.toLocaleString()}</td>
                      </tr>
                      
                      {/* Average Row */}
                      <tr className="bg-green-100 font-bold">
                        <td className="px-4 py-2 border-b">PROMEDIO</td>
                        <td className="px-4 py-2 border-b text-right">{result.averageRows.facturas.toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-right">{result.averageRows.credito.toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-right">{result.averageRows.debito.toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-right">{result.averageRows.creditoxFactor.toLocaleString()}</td>
                        <td className="px-4 py-2 border-b text-right">{result.averageRows.debitoxFactor.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='div-graph'>
                  <Line
                    data={{
                      datasets: [
                        {
                          label: 'Compra',
                          data: dataGrafico,
                          borderColor: 'rgb(255, 99, 132)',
                          backgroundColor: 'rgba(255, 99, 132, 0.5)',
                          parsing : {
                            xAxisKey: 'periodo',
                            yAxisKey: 'compras'
                          }
                        },
                        {
                          label: 'Venta',
                          data: dataGrafico,
                          borderColor: 'rgb(53, 162, 235)',
                          backgroundColor: 'rgba(53, 162, 235, 0.5)',
                          parsing : {
                            xAxisKey: 'periodo',
                            yAxisKey: 'ventas'
                          }
                        },
                      ],
                    }}
                    options={options}
                  />
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800">Meses Reportados</h4>
                    <p className="text-2xl font-bold text-blue-900">{result.data.length}</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800">Facturas Totales</h4>
                    <p className="text-2xl font-bold text-green-900">{result.totalRows.facturas.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800">Flujo Total de Ingresos $M</h4>
                    <p className="text-2xl font-bold text-purple-900">{result.totalRows.flujoIngreso.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <h4 className="font-bold text-orange-800">Flujo Mensual Promedio $M</h4>
                    <p className="text-2xl font-bold text-orange-900">{result.averageRows.flujoIngreso.toLocaleString()}</p>
                  </div>
                </div>
              </>
            ) : (
              <p>No tax records found in the processed text.</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default TaxPdfProcessor;