import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvoice } from '@/contexts/InvoiceContext';

export const InvoiceTotals: React.FC = () => {
  const { invoice, showTaxField, setShowTaxField, setTaxRate } = useInvoice();

  const handleTaxRateChange = (value: string) => {
    const rate = Number(value);
    if (rate >= 0 && rate <= 100) {
      setTaxRate(rate);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border lg:sticky lg:top-24">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Invoice Totals</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium text-foreground">Rs. {invoice.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-tax"
            checked={showTaxField}
            onCheckedChange={setShowTaxField}
            aria-label="Toggle tax field"
          />
          <Label htmlFor="show-tax" className="text-sm text-muted-foreground">
            Include Tax
          </Label>
        </div>

        {showTaxField && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="tax-rate" className="text-sm text-muted-foreground whitespace-nowrap">
                Tax Rate (%):
              </Label>
              <Input
                id="tax-rate"
                type="number"
                value={invoice.taxRate}
                onChange={(e) => handleTaxRateChange(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="bg-background border-border text-foreground w-20"
                aria-label="Tax rate percentage"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
              <span className="font-medium text-foreground">Rs. {invoice.taxAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">Grand Total:</span>
            <span className="text-xl font-bold text-primary">Rs. {invoice.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
