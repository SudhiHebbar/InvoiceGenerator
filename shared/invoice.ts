export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface InvoiceData {
  id: string;
  toAddress: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number; // percentage (0-100)
  taxAmount: number;
  grandTotal: number;
  beneficiaryAccountNumber: string;
  beneficiaryName: string;
  beneficiaryBankName: string;
  ifscCode: string;
  beneficiaryBankAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceContextType {
  invoice: InvoiceData;
  showTaxField: boolean;
  setShowTaxField: (show: boolean) => void;
  addLineItem: () => void;
  updateLineItem: (id: string, updates: Partial<InvoiceLineItem>) => void;
  deleteLineItem: (id: string) => void;
  setTaxRate: (rate: number) => void;
  updateToAddress: (address: string) => void;
  updateBeneficiaryInfo: (field: string, value: string) => void;
  newInvoice: () => void;
  exportToPDF: () => Promise<void>;
  exportToDocx: () => Promise<void>;
  printInvoice: () => void;
}
