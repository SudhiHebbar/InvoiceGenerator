import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvoice } from '@/contexts/InvoiceContext';

export const BeneficiaryInfo: React.FC = () => {
  const { invoice, updateBeneficiaryInfo } = useInvoice();

  return (
    <div className="bg-card rounded-lg p-6 border border-border print:border-0 print:bg-transparent">
      <h3 className="text-lg font-semibold mb-4 text-foreground print:text-black">Bank Info</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Beneficiary AC No */}
        <div className="space-y-2">
          <Label htmlFor="beneficiary-account" className="text-sm font-medium text-foreground print:text-black">
            Beneficiary AC No:
          </Label>
          <Input
            id="beneficiary-account"
            value={invoice.beneficiaryAccountNumber}
            onChange={(e) => updateBeneficiaryInfo('beneficiaryAccountNumber', e.target.value)}
            placeholder="Enter account number"
            className="bg-background border-border text-foreground print:border-0 print:bg-transparent print:p-0 print:text-black"
          />
        </div>

        {/* 2. Beneficiary Name */}
        <div className="space-y-2">
          <Label htmlFor="beneficiary-name" className="text-sm font-medium text-foreground print:text-black">
            Beneficiary Name:
          </Label>
          <Input
            id="beneficiary-name"
            value={invoice.beneficiaryName}
            onChange={(e) => updateBeneficiaryInfo('beneficiaryName', e.target.value)}
            placeholder="Enter beneficiary name"
            className="bg-background border-border text-foreground print:border-0 print:bg-transparent print:p-0 print:text-black"
          />
        </div>

        {/* 3. Beneficiary Bank */}
        <div className="space-y-2">
          <Label htmlFor="bank-name" className="text-sm font-medium text-foreground print:text-black">
            Beneficiary Bank:
          </Label>
          <Input
            id="bank-name"
            value={invoice.beneficiaryBankName}
            onChange={(e) => updateBeneficiaryInfo('beneficiaryBankName', e.target.value)}
            placeholder="Enter bank name"
            className="bg-background border-border text-foreground print:border-0 print:bg-transparent print:p-0 print:text-black"
          />
        </div>

        {/* 4. IFSC Code */}
        <div className="space-y-2">
          <Label htmlFor="ifsc-code" className="text-sm font-medium text-foreground print:text-black">
            IFSC Code:
          </Label>
          <Input
            id="ifsc-code"
            value={invoice.ifscCode}
            onChange={(e) => updateBeneficiaryInfo('ifscCode', e.target.value)}
            placeholder="Enter IFSC code"
            className="bg-background border-border text-foreground print:border-0 print:bg-transparent print:p-0 print:text-black"
          />
        </div>

        {/* 5. Beneficiary Bank Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bank-address" className="text-sm font-medium text-foreground print:text-black">
            Beneficiary Bank Address:
          </Label>
          <Textarea
            id="bank-address"
            value={invoice.beneficiaryBankAddress}
            onChange={(e) => updateBeneficiaryInfo('beneficiaryBankAddress', e.target.value)}
            placeholder="Enter bank address"
            className="bg-background border-border text-foreground min-h-[60px] print:border-0 print:bg-transparent print:p-0 print:text-black print:resize-none"
          />
        </div>
      </div>
    </div>
  );
};
