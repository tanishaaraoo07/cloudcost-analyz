from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

def generate_pdf_report(cost_data, mapping_data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 50

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "CloudCost Analyzer Report")
    y -= 30

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Cost Comparison:")
    y -= 20

    c.setFont("Helvetica", 10)
    for item in cost_data:
        line = f"{item['service']}: AWS ${item['aws_cost']}, Azure ${item['azure_cost']}, GCP ${item['gcp_cost']}"
        c.drawString(60, y, line)
        y -= 15

    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Service Mappings:")
    y -= 20

    c.setFont("Helvetica", 10)
    for item in mapping_data:
        line = f"{item['original_service']} → {item['gcp_equivalent']}"
        c.drawString(60, y, line)
        y -= 15

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.getvalue()
