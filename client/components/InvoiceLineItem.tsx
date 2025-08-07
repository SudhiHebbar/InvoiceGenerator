import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInvoice } from '@/contexts/InvoiceContext';
import { InvoiceLineItem as LineItemType } from '@shared/invoice';

interface InvoiceLineItemProps {
  item: LineItemType;
  index: number;
  canDelete: boolean;
}

export const InvoiceLineItem: React.FC<InvoiceLineItemProps> = ({ item, index, canDelete }) => {
  const { updateLineItem, deleteLineItem, addLineItem } = useInvoice();

  const handleInputChange = (field: keyof LineItemType, value: string | number) => {
    if (field === 'quantity' || field === 'unitCost') {
      const numValue = Number(value);
      if (numValue < 0) return; // Prevent negative values
      if (field === 'unitCost' && /^\d*\.?\d{0,2}$/.test(value.toString()) === false) return; // Max 2 decimals
      updateLineItem(item.id, { [field]: numValue });
    } else {
      updateLineItem(item.id, { [field]: value });
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      addLineItem();
    }
  };

  return (
    <tr className="border-b border-border">
      <td className="p-2">
        <Input
          value={item.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Item description"
          className="bg-card border-border text-foreground"
          aria-label={`Description for line item ${index + 1}`}
          required
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleInputChange('quantity', e.target.value)}
          min="0"
          step="1"
          className="bg-card border-border text-foreground w-20"
          aria-label={`Quantity for line item ${index + 1}`}
          required
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          value={item.unitCost}
          onChange={(e) => handleInputChange('unitCost', e.target.value)}
          min="0"
          step="0.01"
          className="bg-card border-border text-foreground w-24"
          aria-label={`Unit cost for line item ${index + 1}`}
          required
        />
      </td>
      <td className="p-2 text-right font-medium">
        Rs. {item.lineTotal.toFixed(2)}
      </td>
      <td className="p-2 print-hide">
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteLineItem(item.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`Delete line item ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
};
