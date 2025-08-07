import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { InvoiceData, InvoiceLineItem, InvoiceContextType } from '@shared/invoice';
import { loadBankingConfig } from '@/lib/banking-config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

const createEmptyLineItem = (): InvoiceLineItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitCost: 0,
  lineTotal: 0,
});

const generateInvoiceId = (): string => {
  const randomNumber = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${randomNumber}-${day}${month}${year}${hours}${minutes}${seconds}`;
};

const createEmptyInvoice = async (): Promise<InvoiceData> => {
  const bankingDefaults = await loadBankingConfig();

  return {
    id: generateInvoiceId(),
    toAddress: '',
    lineItems: [createEmptyLineItem()],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 0,
    beneficiaryAccountNumber: bankingDefaults.beneficiaryAccountNumber,
    beneficiaryName: bankingDefaults.beneficiaryName,
    beneficiaryBankName: bankingDefaults.beneficiaryBankName,
    ifscCode: bankingDefaults.ifscCode,
    beneficiaryBankAddress: bankingDefaults.beneficiaryBankAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const calculateLineTotal = (quantity: number, unitCost: number): number => {
  return Number((quantity * unitCost).toFixed(2));
};

const calculateTotals = (lineItems: InvoiceLineItem[], taxRate: number) => {
  const subtotal = Number(lineItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
  const grandTotal = Number((subtotal + taxAmount).toFixed(2));
  
  return { subtotal, taxAmount, grandTotal };
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [showTaxField, setShowTaxField] = useState(false);

  // Initialize invoice with defaults from config
  useEffect(() => {
    const initializeInvoice = async () => {
      const saved = localStorage.getItem('invoice-data');
      if (saved) {
        const savedInvoice = JSON.parse(saved);
        // If saved invoice doesn't have banking info, merge with defaults
        if (!savedInvoice.beneficiaryAccountNumber && !savedInvoice.beneficiaryName) {
          const bankingDefaults = await loadBankingConfig();
          setInvoice({
            ...savedInvoice,
            beneficiaryAccountNumber: bankingDefaults.beneficiaryAccountNumber,
            beneficiaryName: bankingDefaults.beneficiaryName,
            beneficiaryBankName: bankingDefaults.beneficiaryBankName,
            ifscCode: bankingDefaults.ifscCode,
            beneficiaryBankAddress: bankingDefaults.beneficiaryBankAddress,
          });
        } else {
          setInvoice(savedInvoice);
        }
      } else {
        const newInvoice = await createEmptyInvoice();
        setInvoice(newInvoice);
      }
    };

    initializeInvoice();
  }, []);

  // Save to localStorage whenever invoice changes
  useEffect(() => {
    if (invoice) {
      localStorage.setItem('invoice-data', JSON.stringify(invoice));
    }
  }, [invoice]);

  const updateInvoice = useCallback((updates: Partial<InvoiceData>) => {
    setInvoice(prev => prev ? ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }) : null);
  }, []);

  const addLineItem = useCallback(() => {
    setInvoice(prev => prev ? ({
      ...prev,
      lineItems: [...prev.lineItems, createEmptyLineItem()],
      updatedAt: new Date().toISOString(),
    }) : null);
  }, []);

  const updateLineItem = useCallback((id: string, updates: Partial<InvoiceLineItem>) => {
    setInvoice(prev => {
      if (!prev) return null;

      const updatedLineItems = prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          updated.lineTotal = calculateLineTotal(updated.quantity, updated.unitCost);
          return updated;
        }
        return item;
      });

      const totals = calculateTotals(updatedLineItems, prev.taxRate);

      return {
        ...prev,
        lineItems: updatedLineItems,
        ...totals,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const deleteLineItem = useCallback((id: string) => {
    setInvoice(prev => {
      if (!prev || prev.lineItems.length <= 1) return prev; // Keep at least one item

      const updatedLineItems = prev.lineItems.filter(item => item.id !== id);
      const totals = calculateTotals(updatedLineItems, prev.taxRate);

      return {
        ...prev,
        lineItems: updatedLineItems,
        ...totals,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setTaxRate = useCallback((rate: number) => {
    setInvoice(prev => {
      if (!prev) return null;

      const totals = calculateTotals(prev.lineItems, rate);
      return {
        ...prev,
        taxRate: rate,
        ...totals,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateToAddress = useCallback((address: string) => {
    setInvoice(prev => prev ? ({
      ...prev,
      toAddress: address,
      updatedAt: new Date().toISOString(),
    }) : null);
  }, []);

  const updateBeneficiaryInfo = useCallback((field: string, value: string) => {
    setInvoice(prev => prev ? ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }) : null);
  }, []);

  const newInvoice = useCallback(async () => {
    const newInvoiceData = await createEmptyInvoice();
    setInvoice(newInvoiceData);
    setShowTaxField(false);
  }, []);

  const exportToPDF = useCallback(async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Set margins for letterhead (extra top margin)
      const margin = {
        top: 60, // 60mm for letterhead
        left: 20,
        right: 20,
        bottom: 20,
      };

      let yPos = margin.top;

      // Invoice Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', margin.left, yPos);
      yPos += 15;

      // Invoice Details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Invoice ID: ${invoice.id}`, margin.left, yPos);
      yPos += 8;
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, margin.left, yPos);
      yPos += 15;

      // To Address
      pdf.setFont('helvetica', 'bold');
      pdf.text('To:', margin.left, yPos);
      yPos += 8;
      pdf.setFont('helvetica', 'normal');

      if (invoice.toAddress) {
        const addressLines = invoice.toAddress.split('\n');
        addressLines.forEach(line => {
          pdf.text(line, margin.left, yPos);
          yPos += 6;
        });
      }
      yPos += 10;

      // Table Header
      const tableStartY = yPos;
      const tableWidth = 170; // Total width
      const colWidths = [80, 20, 30, 40]; // Description, Qty, Unit Cost, Total
      let xPos = margin.left;

      // Draw table header
      pdf.setFillColor(248, 249, 250);
      pdf.rect(margin.left, yPos - 2, tableWidth, 10, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);

      // Header borders
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.1);

      // Draw header cells and text
      pdf.rect(xPos, yPos - 2, colWidths[0], 10);
      pdf.text('Description', xPos + 2, yPos + 4);
      xPos += colWidths[0];

      pdf.rect(xPos, yPos - 2, colWidths[1], 10);
      pdf.text('Qty', xPos + colWidths[1]/2 - 5, yPos + 4);
      xPos += colWidths[1];

      pdf.rect(xPos, yPos - 2, colWidths[2], 10);
      pdf.text('Unit Cost', xPos + colWidths[2]/2 - 10, yPos + 4);
      xPos += colWidths[2];

      pdf.rect(xPos, yPos - 2, colWidths[3], 10);
      pdf.text('Total', xPos + colWidths[3]/2 - 5, yPos + 4);

      yPos += 8;

      // Table Rows
      pdf.setFont('helvetica', 'normal');
      invoice.lineItems.forEach((item, index) => {
        xPos = margin.left;
        const rowHeight = 8;

        // Draw row borders
        pdf.rect(xPos, yPos, colWidths[0], rowHeight);
        pdf.text(item.description, xPos + 2, yPos + 5);
        xPos += colWidths[0];

        pdf.rect(xPos, yPos, colWidths[1], rowHeight);
        pdf.text(item.quantity.toString(), xPos + colWidths[1]/2 - 2, yPos + 5);
        xPos += colWidths[1];

        pdf.rect(xPos, yPos, colWidths[2], rowHeight);
        pdf.text(item.unitCost.toFixed(2), xPos + colWidths[2]/2 - 5, yPos + 5);
        xPos += colWidths[2];

        pdf.rect(xPos, yPos, colWidths[3], rowHeight);
        pdf.text(`Rs. ${item.lineTotal.toFixed(2)}`, xPos + colWidths[3] - 25, yPos + 5);

        yPos += rowHeight;
      });

      yPos += 15;

      // Invoice Totals
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Invoice Totals', margin.left, yPos);
      yPos += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Subtotal:', margin.left, yPos);
      pdf.text(`Rs. ${invoice.subtotal.toFixed(2)}`, 190 - 30, yPos, { align: 'right' });
      yPos += 8;

      if (showTaxField && invoice.taxRate > 0) {
        pdf.text('Include Tax', margin.left, yPos);
        yPos += 6;
        pdf.text(`Tax (${invoice.taxRate}%):`, margin.left, yPos);
        pdf.text(`Rs. ${invoice.taxAmount.toFixed(2)}`, 190 - 30, yPos, { align: 'right' });
        yPos += 8;
      }

      // Draw line above grand total
      pdf.setLineWidth(0.5);
      pdf.line(margin.left, yPos, 190 - 30, yPos);
      yPos += 5;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Grand Total:', margin.left, yPos);
      pdf.text(`Rs. ${invoice.grandTotal.toFixed(2)}`, 190 - 30, yPos, { align: 'right' });
      yPos += 20;

      // Bank Info
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Bank Info', margin.left, yPos);
      yPos += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);

      if (invoice.beneficiaryAccountNumber) {
        pdf.text(`Beneficiary AC No: ${invoice.beneficiaryAccountNumber}`, margin.left, yPos);
        yPos += 6;
      }

      if (invoice.beneficiaryName) {
        pdf.text(`Beneficiary Name: ${invoice.beneficiaryName}`, margin.left, yPos);
        yPos += 6;
      }

      if (invoice.beneficiaryBankName) {
        pdf.text(`Beneficiary Bank: ${invoice.beneficiaryBankName}`, margin.left, yPos);
        yPos += 6;
      }

      if (invoice.ifscCode) {
        pdf.text(`IFSC Code: ${invoice.ifscCode}`, margin.left, yPos);
        yPos += 6;
      }

      if (invoice.beneficiaryBankAddress) {
        // Replace line breaks with spaces for inline display
        const inlineAddress = invoice.beneficiaryBankAddress.replace(/\n/g, ', ');
        pdf.text(`Beneficiary Bank Address: ${inlineAddress}`, margin.left, yPos);
        yPos += 6;
      }

      pdf.save(`invoice-${invoice.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, [invoice, showTaxField]);

  const exportToDocx = useCallback(async () => {
    try {
      const rows = invoice.lineItems.map(item =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(item.description)],
              borders: {
                top: { style: 'single', size: 1 },
                bottom: { style: 'single', size: 1 },
                left: { style: 'single', size: 1 },
                right: { style: 'single', size: 1 },
              }
            }),
            new TableCell({
              children: [new Paragraph({ text: item.quantity.toString(), alignment: AlignmentType.CENTER })],
              borders: {
                top: { style: 'single', size: 1 },
                bottom: { style: 'single', size: 1 },
                left: { style: 'single', size: 1 },
                right: { style: 'single', size: 1 },
              }
            }),
            new TableCell({
              children: [new Paragraph({ text: `${item.unitCost.toFixed(2)}`, alignment: AlignmentType.CENTER })],
              borders: {
                top: { style: 'single', size: 1 },
                bottom: { style: 'single', size: 1 },
                left: { style: 'single', size: 1 },
                right: { style: 'single', size: 1 },
              }
            }),
            new TableCell({
              children: [new Paragraph({ text: `Rs. ${item.lineTotal.toFixed(2)}`, alignment: AlignmentType.RIGHT })],
              borders: {
                top: { style: 'single', size: 1 },
                bottom: { style: 'single', size: 1 },
                left: { style: 'single', size: 1 },
                right: { style: 'single', size: 1 },
              }
            }),
          ],
        })
      );

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1800, // 2.5 inches for letterhead
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: [
            // Invoice Header
            new Paragraph({
              children: [new TextRun({ text: 'INVOICE', bold: true, size: 32 })],
              spacing: { after: 400 },
            }),

            // Invoice details
            new Paragraph({
              children: [new TextRun({ text: `Invoice ID: ${invoice.id}`, size: 20 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString()}`, size: 20 })],
              spacing: { after: 400 },
            }),

            // To Address
            new Paragraph({
              children: [new TextRun({ text: 'To:', bold: true, size: 20 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: invoice.toAddress || '', size: 20 })],
              spacing: { after: 600 },
            }),

            // Line Items Table
            new Table({
              width: {
                size: 100,
                type: 'pct',
              },
              borders: {
                top: { style: 'single', size: 1 },
                bottom: { style: 'single', size: 1 },
                left: { style: 'single', size: 1 },
                right: { style: 'single', size: 1 },
                insideHorizontal: { style: 'single', size: 1 },
                insideVertical: { style: 'single', size: 1 },
              },
              rows: [
                // Table Header
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({
                        children: [new TextRun({ text: 'Description', bold: true })],
                        alignment: AlignmentType.CENTER
                      })],
                      borders: {
                        top: { style: 'single', size: 1 },
                        bottom: { style: 'single', size: 1 },
                        left: { style: 'single', size: 1 },
                        right: { style: 'single', size: 1 },
                      },
                      shading: { fill: 'F8F9FA' },
                      width: { size: 50, type: 'pct' },
                    }),
                    new TableCell({
                      children: [new Paragraph({
                        children: [new TextRun({ text: 'Qty', bold: true })],
                        alignment: AlignmentType.CENTER
                      })],
                      borders: {
                        top: { style: 'single', size: 1 },
                        bottom: { style: 'single', size: 1 },
                        left: { style: 'single', size: 1 },
                        right: { style: 'single', size: 1 },
                      },
                      shading: { fill: 'F8F9FA' },
                      width: { size: 15, type: 'pct' },
                    }),
                    new TableCell({
                      children: [new Paragraph({
                        children: [new TextRun({ text: 'Unit Cost', bold: true })],
                        alignment: AlignmentType.CENTER
                      })],
                      borders: {
                        top: { style: 'single', size: 1 },
                        bottom: { style: 'single', size: 1 },
                        left: { style: 'single', size: 1 },
                        right: { style: 'single', size: 1 },
                      },
                      shading: { fill: 'F8F9FA' },
                      width: { size: 20, type: 'pct' },
                    }),
                    new TableCell({
                      children: [new Paragraph({
                        children: [new TextRun({ text: 'Total', bold: true })],
                        alignment: AlignmentType.CENTER
                      })],
                      borders: {
                        top: { style: 'single', size: 1 },
                        bottom: { style: 'single', size: 1 },
                        left: { style: 'single', size: 1 },
                        right: { style: 'single', size: 1 },
                      },
                      shading: { fill: 'F8F9FA' },
                      width: { size: 15, type: 'pct' },
                    }),
                  ],
                }),
                ...rows,
              ],
            }),

            new Paragraph(''),
            new Paragraph(''),

            // Invoice Totals Section
            new Paragraph({
              children: [new TextRun({ text: 'Invoice Totals', bold: true, size: 24 })],
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [new TextRun({ text: `Subtotal:`, size: 20 })],
              tabStops: [{ type: 'right', position: 8000 }],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '\t' }),
                new TextRun({ text: `Rs. ${invoice.subtotal.toFixed(2)}`, size: 20 })
              ],
            }),

            ...(showTaxField && invoice.taxRate > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: 'Include Tax', size: 20 })],
                spacing: { after: 200, before: 200 },
              }),
            ] : []),

            new Paragraph(''),
            new Paragraph({
              children: [new TextRun({ text: `Grand Total:`, bold: true, size: 24 })],
              tabStops: [{ type: 'right', position: 8000 }],
              spacing: { before: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '\t' }),
                new TextRun({ text: `Rs. ${invoice.grandTotal.toFixed(2)}`, bold: true, size: 24 })
              ],
            }),

            new Paragraph(''),
            new Paragraph(''),

            // Bank Info Section
            new Paragraph({
              children: [new TextRun({ text: 'Bank Info', bold: true, size: 20 })],
              spacing: { after: 400 },
            }),

            ...(invoice.beneficiaryAccountNumber ? [
              new Paragraph({
                children: [new TextRun({ text: `Beneficiary AC No: ${invoice.beneficiaryAccountNumber}`, size: 20 })],
                spacing: { after: 200 },
              }),
            ] : []),

            ...(invoice.beneficiaryName ? [
              new Paragraph({
                children: [new TextRun({ text: `Beneficiary Name: ${invoice.beneficiaryName}`, size: 20 })],
                spacing: { after: 200 },
              }),
            ] : []),

            ...(invoice.beneficiaryBankName ? [
              new Paragraph({
                children: [new TextRun({ text: `Beneficiary Bank: ${invoice.beneficiaryBankName}`, size: 20 })],
                spacing: { after: 200 },
              }),
            ] : []),

            ...(invoice.ifscCode ? [
              new Paragraph({
                children: [new TextRun({ text: `IFSC Code: ${invoice.ifscCode}`, size: 20 })],
                spacing: { after: 200 },
              }),
            ] : []),

            ...(invoice.beneficiaryBankAddress ? [
              new Paragraph({
                children: [new TextRun({ text: `Beneficiary Bank Address: ${invoice.beneficiaryBankAddress.replace(/\n/g, ', ')}`, size: 20 })],
                spacing: { after: 200 },
              }),
            ] : []),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `invoice-${invoice.id}.docx`);
    } catch (error) {
      console.error('Error generating DOCX:', error);
    }
  }, [invoice, showTaxField]);

  const printInvoice = useCallback(() => {
    window.print();
  }, []);

  // Don't render until invoice is loaded
  if (!invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 text-primary mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" className="opacity-30" />
              <path d="M4,12a8,8 0 0,1 8,-8 V12z" className="opacity-75" />
            </svg>
          </div>
          <p className="text-muted-foreground">Loading invoice generator...</p>
        </div>
      </div>
    );
  }

  const value: InvoiceContextType = {
    invoice,
    showTaxField,
    setShowTaxField,
    addLineItem,
    updateLineItem,
    deleteLineItem,
    setTaxRate,
    updateToAddress,
    updateBeneficiaryInfo,
    newInvoice,
    exportToPDF,
    exportToDocx,
    printInvoice,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};
