import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof import('jspdf-autotable').default;
  }

  interface jsPDFAPI {
    autoTable: typeof import('jspdf-autotable').default;
  }
}
