/**
 * Test file demonstrating the usage of the PDF Tax Processor
 */

import { processTaxPdfText, getFormattedResults, formatNumber } from './pdfTaxProcessor';

// Example PDF text (extracted from the SQL comments)
const examplePdfText = `
CARPETA TRIBUTARIA REGULAR
                                                                                 PARA SOLICITAR CRÉDITO
                                                      Importante: Esta información es válida para la fecha y hora en que se generó la carpeta
               Toda declaración y pago que sea presentada en papel retrasa la actualización de las bases de datos del SII, por lo que, eventualmente, podrían no aparecer en esta carpeta
   Nombre del Emisor:                                                                 NELSON FERNANDEZ FERNANDEZ
   RUT del Emisor:                                                                    22158382-5
   Fecha de generación de la Carpeta:                                                 06/11/2025 13:07

                                           Septiembre 2025                                                                                       2/24
                                                                                                                                                                                     Pág. 2 / 32
                                                                                                                                                                  FOLIO         [07]  8510460106
                                                                                                    DECLARACIÓN MENSUAL Y PAGO                                    RUT           [03] 22.158.382-5
                                                                                                       SIMULTÁNEO DE IMPUESTOS                                    PERIODO       [15]       202509
                                                                                                                  FORMULARIO 29
                                                              01     Apellido Paterno o Razón Social   02                  Apellido Materno                  05               Nombres
                                                                          FERNANDEZ                                      FERNANDEZ                                         NELSON
                                                              06                 Calle                610                      Número                        08               Comuna
                                                            Luis  Emilio  recabarren  Nº:2328,  ALTO                                                                   ALTO HOSPICIO
                                                            HOSPICIO, ALTO HOSPICIO
                                                              09                Teléfono               55                  Correo Electrónico               314         Rut del Representante
                                                             Código                   Glosa                         Valor        Código                   Glosa                          Valor
                                                              503  CANTIDAD FACTURAS EMITIDAS                                 4   502  DÉBITOS FACTURAS EMITIDAS                            4.198.036
                                                              511  CRÉD. IVA POR DCTOS. ELECTRÓNICOS                    8.185.460 538  TOTAL DÉBITOS                                        4.198.036
                                                              519  CANT. DE DCTOS. FACT. RECIB. DEL GIRO                     27   520  CRÉDITO REC. Y REINT./FACT. DEL GIRO                 8.185.460
                                                              077  REMANENTE DE CRÉDITO FISC.                           3.987.424 544  RECUP. IMP. ESP. DIESEL (Art. 2)                           0
                                                              151  RETENCION TASA LEY 21.133 SOBRE RENTAS                  5.800  779  Monto de IVA postergado 6 o 12 cuotas                      0
                                                              563  BASE IMPONIBLE                                      22.094.926 537  TOTAL CRÉDITOS                                       8.185.460
                                                              115  TASA PPM 1ra. CATEGORÍA                                   0.4  089  IMP. DETERM. IVA                                           0
                                                                                                                                  062  PPM NETO DETERMINADO                                   88.380
                                                                                                                                  595  SUB TOTAL IMP. DETERMINADO ANVERSO                     94.180
                                                                                                                                  547  TOTAL DETERMINADO                                      94.180
                                                            TOTAL A PAGAR DENTRO DEL PLAZO LEGAL                         91                          94.180  +
                                                            Más IPC                                                      92                                  +
                                                            Más Interes y Multas                                         93                                  +
                                                            CONDONACIÓN                                                  795                                 -
                                                            TOTAL A PAGAR CON RECARGO                                    94                                  =
                                                             60       % Condonación        922       Número de la Resolución       915 Fecha de la Condonación
                                                                 Tipo de Declaración         Corrige a Folio(s)              Banco                  Medio de Pago          Fecha de Presentación
                                                                      Primitiva                                               BCI                        PEL                     10/10/2025

                                                          Agosto 2025                                                                                                                      3/24
                                                                                                    DECLARACIÓN MENSUAL Y PAGO                                    FOLIO         [07]  8456884316
                                                                                                       SIMULTÁNEO DE IMPUESTOS                                    RUT           [03] 22.158.382-5
                                                                                                                  FORMULARIO 29                                   PERIODO       [15]       202508
                                                              01     Apellido Paterno o Razón Social   02                  Apellido Materno                  05               Nombres
                                                                          FERNANDEZ                                      FERNANDEZ                                         NELSON
                                                             Código                   Glosa                         Valor        Código                   Glosa                          Valor
                                                              503  CANTIDAD FACTURAS EMITIDAS                                 4   502  DÉBITOS FACTURAS EMITIDAS                            1.939.076
                                                              511  CRÉD. IVA POR DCTOS. ELECTRÓNICOS                    1.759.087 538  TOTAL DÉBITOS                                        1.939.076
                                                              584  CANT.INT.EX.NO GRAV.SIN DER. CRED.FISCAL                   1   562  MONTO SIN DER. A CRED. FISCAL                             101
                                                              519  CANT. DE DCTOS. FACT. RECIB. DEL GIRO                     29   520  CRÉDITO REC. Y REINT./FACT. DEL GIRO                 1.761.099
                                                              527  CANT. NOTAS DE CRÉDITO RECIBIDAS                           1   528  CRÉDITO RECUP. Y REINT NOTAS DE CRÉD                    2.012
                                                              151  RETENCION TASA LEY 21.133 SOBRE RENTAS                  4.350  504  REMANENTE CRÉDITO MES ANTERIOR                         66.494
                                                              563  BASE IMPONIBLE                                      10.205.663 544  RECUP. IMP. ESP. DIESEL (Art. 2)                           0
                                                              115  TASA PPM 1ra. CATEGORÍA                                   0.5  779  Monto de IVA postergado 6 o 12 cuotas                      0
                                                                                                                                  537  TOTAL CRÉDITOS                                       1.825.581
                                                                                                                                  089  IMP. DETERM. IVA                                       113.495
                                                                                                                                  062  PPM NETO DETERMINADO                                   51.028
                                                                                                                                  595  SUB TOTAL IMP. DETERMINADO ANVERSO                     168.873
                                                                                                                                  547  TOTAL DETERMINADO                                      168.873
`;

/**
 * Example usage of the PDF Tax Processor
 */
export function testPdfProcessor(): void {
  console.log('Testing PDF Tax Processor...\n');

  try {
    // Process the PDF text
    const result = processTaxPdfText(examplePdfText, 12345);
    
    console.log('Processing Results:');
    console.log('==================\n');
    
    // Display individual records
    console.log('Monthly Data:');
    for (let index = 0; index < result.data.length; index++) {
      const row = result.data[index];
      console.log(`${index + 1}. Period: ${row.periodo}`);
      console.log(`   Invoices: ${formatNumber(row.facturas)}`);
      console.log(`   Credits: $${formatNumber(row.credito)}`);
      console.log(`   Debits: $${formatNumber(row.debito)}`);
      console.log(`   Cash Flow: $${formatNumber(row.flujoIngreso)}`);
      console.log('');
    }

    // Display totals
    console.log('TOTALS:');
    console.log(`Total Invoices: ${formatNumber(result.totalRows.facturas)}`);
    console.log(`Total Credits: $${formatNumber(result.totalRows.credito)}`);
    console.log(`Total Debits: $${formatNumber(result.totalRows.debito)}`);
    console.log(`Total Cash Flow: $${formatNumber(result.totalRows.flujoIngreso)}`);
    console.log('');

    // Display averages
    console.log('AVERAGES:');
    console.log(`Avg Invoices: ${formatNumber(result.averageRows.facturas)}`);
    console.log(`Avg Credits: $${formatNumber(result.averageRows.credito)}`);
    console.log(`Avg Debits: $${formatNumber(result.averageRows.debito)}`);
    console.log(`Avg Cash Flow: $${formatNumber(result.averageRows.flujoIngreso)}`);
    console.log('');

    // Get formatted results (similar to SQL output)
    const formattedResults = getFormattedResults(result);
    console.log('Formatted Results (similar to SQL output):');
    console.log(JSON.stringify(formattedResults, null, 2));

  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// Helper function to integrate with existing React app
export function processPdfTextForApp(pdfText: string): any {
  try {
    const result = processTaxPdfText(pdfText);
    return {
      success: true,
      data: getFormattedResults(result),
      summary: {
        totalMonths: result.data.length,
        totalInvoices: result.totalRows.facturas,
        totalCredits: result.totalRows.credito,
        totalDebits: result.totalRows.debito,
        totalCashFlow: result.totalRows.flujoIngreso,
        averageInvoices: result.averageRows.facturas,
        averageCredits: result.averageRows.credito,
        averageDebits: result.averageRows.debito,
        averageCashFlow: result.averageRows.flujoIngreso
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: []
    };
  }
}

// Run test if this file is executed directly
if (globalThis.window === undefined) {
  testPdfProcessor();
}