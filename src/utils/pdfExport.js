import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportToPDF(elementRef, filename = 'tripbrief.pdf') {
  if (!elementRef.current) return

  try {
    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        const briefingEl = clonedDoc.querySelector('.briefing')
        if (briefingEl) {
          briefingEl.style.animation = 'none'
          briefingEl.style.boxShadow = 'none'
          briefingEl.style.transform = 'none'
        }
        const noPrint = clonedDoc.querySelectorAll('.no-print')
        noPrint.forEach(el => el.style.display = 'none')
      }
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add extra pages if content is long
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
  } catch (err) {
    console.error('PDF export failed:', err)
    // Fallback to print dialog
    window.print()
  }
}
