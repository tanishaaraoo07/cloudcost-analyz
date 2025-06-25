from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Table, TableStyle
from io import BytesIO


def generate_pdf_report(cost_data, mapping_data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 50

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "CloudCost Analyzer Report")
    y -= 30

    # Cost Comparison Section
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Cost Comparison Table:")
    y -= 20

    cost_table_data = [["Service", "AWS Cost ($)", "Azure Cost ($)", "GCP Cost ($)"]]
    for item in cost_data:
        cost_table_data.append([
            item.get("service", "-"),
            item.get("aws_cost", "-"),
            item.get("azure_cost", "-"),
            item.get("gcp_cost", "-")
        ])

    cost_table = Table(cost_table_data, colWidths=[120, 100, 100, 100])
    cost_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightblue),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))
    cost_table.wrapOn(c, width, height)
    cost_table.drawOn(c, 50, y - (len(cost_table_data) * 20))
    y -= (len(cost_table_data) * 20) + 30

    # Service Mapping Section
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Service Mapping:")
    y -= 20

    map_table_data = [["Original Service", "GCP Equivalent"]]
    for item in mapping_data:
        map_table_data.append([
            item.get("original_service", "-"),
            item.get("gcp_equivalent", "-")
        ])

    map_table = Table(map_table_data, colWidths=[200, 200])
    map_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgreen),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))
    map_table.wrapOn(c, width, height)
    map_table.drawOn(c, 50, y - (len(map_table_data) * 20))
    y -= (len(map_table_data) * 20) + 30

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer
