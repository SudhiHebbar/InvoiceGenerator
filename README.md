# Invoice Generator

A professional, full-featured invoice generation application built with React, TypeScript, and modern web technologies. Create, customize, and export invoices with pre-configured banking information and professional formatting.

## 📋 Executive Summary

The Invoice Generator is a production-ready web application designed for businesses and freelancers to create professional invoices quickly and efficiently. Built with a modern tech stack, it offers real-time editing, multiple export formats, and secure banking information management. The application features a clean dark theme with purple accents, responsive design, and accessibility compliance (WCAG-AA).

**Key Benefits:**
- **Zero Learning Curve** - Intuitive interface with immediate productivity
- **Professional Output** - Export to PDF, DOCX, or print with letterhead compatibility
- **Security First** - Banking information stored locally, never committed to repositories
- **Modern Architecture** - Built with React 18, TypeScript, and Vite for optimal performance
- **Accessibility Compliant** - Full keyboard navigation and screen reader support

## ✨ App Features

### 🧾 **Invoice Management**
- **Dynamic Line Items** - Add, edit, and remove invoice items with real-time calculations
- **Auto-calculations** - Automatic subtotal, tax, and grand total computation
- **Custom Invoice IDs** - Generated with format: `{random}-{ddmmyyyyhhmmss}`
- **Currency Support** - Indian Rupees (Rs.) formatting throughout

### 💳 **Banking Integration**
- **Pre-configured Banking Info** - Auto-populate from secure config file
- **Five Essential Fields** - Account Number, Beneficiary Name, Bank Name, IFSC Code, Bank Address
- **Config-based Defaults** - Load banking details from `banking-config.json`
- **Manual Override** - Edit banking information per invoice as needed

### 📄 **Export & Print**
- **PDF Export** - High-quality PDF generation with proper formatting
- **DOCX Export** - Microsoft Word compatible documents with tables
- **Print Support** - Optimized print styles for pre-printed letterheads
- **Letterhead Compatible** - Extra margins and spacing for branded stationery

### 🎨 **User Experience**
- **Dark Theme** - Modern dark UI with purple accent colors (#7B5BFF)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Ctrl+Enter to add rows, full tab navigation
- **Auto-save** - Persistent storage in localStorage
- **Accessibility** - ARIA labels, high contrast, screen reader compatible

### 🔧 **Developer Features**
- **TypeScript** - Full type safety and IntelliSense support
- **Hot Reload** - Instant updates during development
- **Component Architecture** - Modular, reusable React components
- **State Management** - Context API for clean data flow

## 📁 Project Structure

```
├── client/                     # React SPA Frontend
│   ├── components/            # UI Components
│   │   ├── ui/               # Base UI component library (shadcn/ui)
│   │   ├── Invoice.tsx       # Main invoice interface
│   │   ├── InvoiceLineItem.tsx   # Line item row component
│   │   ├── InvoiceTotals.tsx     # Totals calculation display
│   │   ├── BeneficiaryInfo.tsx   # Banking information form
│   │   └── KeyboardShortcuts.tsx # Help dialog
│   ├── contexts/             # State Management
│   │   └── InvoiceContext.tsx    # Main application state
│   ├── lib/                  # Utilities
│   │   ├── banking-config.ts     # Banking config loader
│   │   └── utils.ts             # Helper functions
│   ├── pages/               # Route Components
│   │   ├── Index.tsx        # Home page (invoice interface)
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Application entry point
│   └── global.css           # Global styles and print CSS
├── server/                  # Express Backend (minimal)
│   ├── routes/             # API route handlers
│   └── index.ts            # Server configuration
├── shared/                 # Shared Types
│   └── invoice.ts          # TypeScript interfaces
├── banking-config.json     # Banking information (excluded from git)
├── banking-config.example.json  # Template for banking config
├── BANKING_CONFIG.md       # Banking setup instructions
└── package.json           # Dependencies and scripts
```

## 🚀 Commands to Build the App

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager

### **Setup & Development**
```bash
# Clone the repository
git clone <repository-url>
cd invoice-generator

# Install dependencies
npm install

# Set up banking configuration
cp banking-config.example.json banking-config.json
# Edit banking-config.json with your banking details

# Start development server
npm run dev
# Application runs at http://localhost:8080
```

### **Available Scripts**
```bash
# Development
npm run dev              # Start dev server with hot reload
npm run typecheck        # TypeScript type checking

# Production
npm run build           # Build for production
npm run start           # Start production server

# Testing & Quality
npm test                # Run Vitest test suite
npm run format.fix      # Format code with Prettier
```

### **Production Build**
```bash
# Build optimized production bundle
npm run build

# Serve production build locally
npm run start

# Deploy dist/ folder to your hosting provider
```

### **Development Workflow**
1. **Start Development** - `npm run dev` for live reloading
2. **Code Changes** - Edit files in `client/` directory
3. **Type Safety** - `npm run typecheck` for TypeScript validation
4. **Testing** - `npm test` for component and unit tests
5. **Production** - `npm run build` to create optimized bundle

## 🔒 Security Notes

### **Banking Information Protection**
- **Git Exclusion** - `banking-config.json` automatically excluded from version control
- **Local Storage** - Banking data stored locally, never transmitted to external servers
- **Environment Isolation** - Each deployment can have separate banking configuration
- **Template Provided** - `banking-config.example.json` for setup guidance

### **Data Privacy**
- **Client-side Processing** - All invoice data processed in browser
- **localStorage Persistence** - Invoice data saved locally for session continuity
- **No External APIs** - No third-party services for sensitive operations
- **Export Security** - PDF/DOCX generation handled client-side

### **Deployment Security**
```bash
# Verify banking config is excluded
git status
# banking-config.json should not appear in git status

# For production deployments
# 1. Create banking-config.json on server
# 2. Ensure proper file permissions
# 3. Keep separate configs per environment
```

### **Best Practices**
- Never commit `banking-config.json` to version control
- Use environment-specific configurations for different deployments
- Regularly backup your banking configuration file
- Consider server-side config management for sensitive production environments

## 🐛 Troubleshooting

### **Common Setup Issues**

**Port Already in Use**
```bash
# Kill process on port 8080
npx kill-port 8080
# Or use different port
PORT=3000 npm run dev
```

**Missing Dependencies**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**
```bash
# Run type checking
npm run typecheck
# Check for missing type declarations
```

### **Banking Configuration Issues**

**Banking Info Not Loading**
```bash
# Verify config file exists
ls -la banking-config.json

# Check JSON syntax
cat banking-config.json | jq .

# Restart dev server after config changes
```

**Config File Format**
```json
{
  "defaultBankingInfo": {
    "beneficiaryAccountNumber": "123456789012",
    "beneficiaryName": "Your Company Name",
    "beneficiaryBankName": "Your Bank Name",
    "ifscCode": "BANK0123456",
    "beneficiaryBankAddress": "Bank Address"
  }
}
```

### **Export Issues**

**PDF Generation Fails**
- Ensure all invoice fields are filled
- Check browser console for errors
- Verify network connectivity for fonts

**DOCX Export Problems**
- Check if modern browser supports required APIs
- Ensure sufficient memory for large invoices
- Try with fewer line items

**Print Layout Issues**
```css
/* Check print styles in global.css */
@media print {
  @page { margin: 0.5in; margin-top: 2.5in; }
}
```

### **Performance Issues**

**Slow Loading**
```bash
# Build production version for testing
npm run build
npm run start
```

**Memory Issues**
- Clear browser localStorage: `localStorage.clear()`
- Restart development server
- Check for memory leaks in browser DevTools

### **Browser Compatibility**

**Minimum Requirements**
- Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- JavaScript enabled
- LocalStorage support

**Feature Detection**
```javascript
// Check for required APIs
if (!window.localStorage) {
  console.error('LocalStorage not supported');
}
```

### **Getting Help**

1. **Check Browser Console** - Look for JavaScript errors
2. **Verify Configuration** - Ensure `banking-config.json` is properly formatted
3. **Test with Clean Data** - Clear localStorage and restart
4. **Update Dependencies** - `npm update` for latest package versions
5. **Check Network** - Ensure local development server is accessible

---

## 📞 Support

For technical issues, feature requests, or contributions:
- Check existing issues and documentation
- Review troubleshooting guide above
- Create detailed issue reports with reproduction steps

Built with ❤️ using React, TypeScript, and modern web technologies.
