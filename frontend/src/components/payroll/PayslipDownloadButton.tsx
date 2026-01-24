'use client'

import { Download } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function PayslipDownloadButton({ payroll }: { payroll: any }) {

    const generatePDF = () => {
        const doc = new jsPDF()

        // Company Header
        doc.setFontSize(22)
        doc.setTextColor(40)
        doc.text("EMS Corp", 14, 20)

        doc.setFontSize(10)
        doc.text("123 Tech Park, Suite 400", 14, 26)
        doc.text("San Francisco, CA 94107", 14, 30)
        doc.text("support@ems.com", 14, 34)

        // Title
        doc.setFontSize(16)
        doc.text("PAYSLIP", 140, 20)
        doc.setFontSize(10)
        const date = new Date(payroll.month)
        const monthName = date.toLocaleDateString('default', { month: 'long', year: 'numeric' })
        doc.text(`For the month of: ${monthName}`, 140, 26)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 140, 30)

        // Employee Details
        doc.setFillColor(240, 240, 240)
        doc.rect(14, 45, 182, 35, 'F')

        doc.setFontSize(11)
        doc.setTextColor(0)

        // Col 1
        doc.text(`Employee Name: ${payroll.employee.firstName} ${payroll.employee.lastName}`, 20, 55)
        doc.text(`Employee ID: ${payroll.employee.userId.substring(0, 8).toUpperCase()}`, 20, 62)
        doc.text(`Designation: ${payroll.employee.designation}`, 20, 69)

        // Col 2
        doc.text(`Department: ${payroll.employee.department}`, 110, 55)

        // Earnings Table
        const tableColumn = ["Earnings", "Amount", "Deductions", "Amount"]
        const tableRows = [
            ["Basic Salary", `$${payroll.basicSalary.toLocaleString()}`, "Tax (10%)", `$${payroll.deductions.toLocaleString()}`],
            ["Allowances", `$${payroll.allowances.toLocaleString()}`, "", ""],
            ["", "", "", ""],
            ["Gross Earnings", `$${(payroll.basicSalary + payroll.allowances).toLocaleString()}`, "Total Deductions", `$${payroll.deductions.toLocaleString()}`]
        ]

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 90,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // Blue header
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 40, halign: 'right' },
                2: { cellWidth: 50 },
                3: { cellWidth: 40, halign: 'right' },
            }
        })

        // Net Pay
        const finalY = (doc as any).lastAutoTable.finalY + 10
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text(`NET PAY: $${payroll.netSalary.toLocaleString()}`, 140, finalY)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text("(This is a computer-generated document and does not require a signature)", 14, 280)

        // Footer line
        doc.setDrawColor(200)
        doc.line(14, 275, 196, 275)

        // Save
        doc.save(`Payslip_${payroll.employee.firstName}_${monthName}.pdf`)
    }

    return (
        <button
            onClick={generatePDF}
            className="text-gray-400 hover:text-white transition-colors"
            title="Download PDF"
        >
            <Download size={18} />
        </button>
    )
}
