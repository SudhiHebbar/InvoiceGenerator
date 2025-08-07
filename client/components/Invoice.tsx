import React from 'react';
import { Plus, FileText, Download, Printer, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Textarea } from '@/components/ui/textarea';
import { InvoiceLineItem } from './InvoiceLineItem';
import { InvoiceTotals } from './InvoiceTotals';
import { BeneficiaryInfo } from './BeneficiaryInfo';
import { KeyboardShortcuts } from './KeyboardShortcuts';

export const Invoice: React.FC = () => {
  const {
    invoice,
    addLineItem,
    newInvoice,
    exportToPDF,
    exportToDocx,
    printInvoice,
    updateToAddress
  } = useInvoice();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Invoice Generator
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create professional invoices with export options
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 print-hide">
              <Button
                onClick={newInvoice}
                variant="outline"
                size="sm"
                className="border-border hover:bg-accent"
                aria-label="Create new invoice"
              >
                <FileX className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
              
              <Button
                onClick={exportToPDF}
                variant="outline"
                size="sm"
                className="border-border hover:bg-accent"
                aria-label="Export to PDF"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              
              <Button
                onClick={exportToDocx}
                variant="outline"
                size="sm"
                className="border-border hover:bg-accent"
                aria-label="Export to DOCX"
              >
                <Download className="h-4 w-4 mr-2" />
                DOCX
              </Button>
              
              <Button
                onClick={printInvoice}
                variant="outline"
                size="sm"
                className="border-border hover:bg-accent"
                aria-label="Print invoice"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 print:py-16 print:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Items */}
          <div className="lg:col-span-2" id="invoice-container">
            <div className="bg-card rounded-lg border border-border overflow-hidden print:border-0 print:bg-transparent">
              <div className="p-6 border-b border-border print:border-0 print:pb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4 print:text-2xl">INVOICE</h2>
                <div className="text-sm text-muted-foreground print:text-black print:text-base">
                  <p className="mb-2">Invoice ID: {invoice.id}</p>
                  <p className="mb-4">Date: {new Date().toLocaleDateString()}</p>
                </div>

                {/* To Address Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2 print:text-black print:text-base">
                    To:
                  </label>
                  <Textarea
                    value={invoice.toAddress}
                    onChange={(e) => updateToAddress(e.target.value)}
                    placeholder="Enter billing address..."
                    className="bg-background border-border text-foreground min-h-[80px] print:border-0 print:bg-transparent print:p-0 print:text-black print:resize-none"
                    aria-label="Billing address"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                        Description
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground w-20">
                        Qty
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground w-24">
                        Unit Cost
                      </th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground w-24">
                        Total
                      </th>
                      <th className="w-12 print-hide"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item, index) => (
                      <InvoiceLineItem
                        key={item.id}
                        item={item}
                        index={index}
                        canDelete={invoice.lineItems.length > 1}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-border print-hide">
                <Button
                  onClick={addLineItem}
                  variant="outline"
                  className="border-border hover:bg-accent"
                  aria-label="Add new line item"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Row
                </Button>
              </div>
            </div>

            {/* Banking Information */}
            <div className="mt-8">
              <BeneficiaryInfo />
            </div>
          </div>

          {/* Totals */}
          <div className="lg:col-span-1">
            <InvoiceTotals />
          </div>
        </div>
      </main>

      <KeyboardShortcuts />
    </div>
  );
};
