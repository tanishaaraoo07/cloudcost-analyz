from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from io import BytesIO

# Draws a bar chart comparing AWS, Azure, and GCP costs
def draw_bar_chart(c, x, y, data):
    bar_width = 25
    gap = 90
    max_height = 150
    base_y = y

    # Calculate maximum cost for scaling bars
    max_cost = max(
        max(item.get("aws_cost", 0), item.get("azure_cost", 0), item.get("gcp_cost", 0))
        for item in data
        if isinstance(item.get("aws_cost", 0), (int, float))
    )

    for i, item in enumerate(data):
        left = x + i * gap
        aws_height = (item.get("aws_cost", 0) / max_cost) * max_height if max_cost else 0
        azure_height = (item.get("azure_cost", 0) / max_cost) * max_height if max_cost else 0
        gcp_height = (item.get("gcp_cost", 0) / max_cost) * max_height if max_cost else 0

        # Draw AWS bar
        c.setFillColor(colors.blue)
        c.rect(left, base_y, bar_width, aws_height, fill=True)

        # Draw Azure bar
        c.setFillColor(colors.gray)
        c.rect(left + bar_width + 3, base_y, bar_width, azure_height, fill=True)

        # Draw GCP bar
        c.setFillColor(colors.green)
        c.rect(left + 2 * (bar_width + 3), base_y, bar_width, gcp_height, fill=True)

        # Label the service
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 7)
        c.drawString(left, base_y - 12, item.get("service", "Unknown")[:10])

    # Legend
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.blue)
    c.rect(x, base_y + max_height + 20, 10, 10, fill=True)
    c.setFillColor(colors.black)
    c.drawString(x + 15, base_y + max_height + 20, "AWS")

    c.setFillColor(colors.gray)
    c.rect(x + 70, base_y + max_height + 20, 10, 10, fill=True)
    c.drawString(x + 85, base_y + max_height + 20, "Azure")

    c.setFillColor(colors.green)
    c.rect(x + 150, base_y + max_height + 20, 10, 10, fill=True)
    c.drawString(x + 165, base_y + max_height + 20, "GCP")

# Generates the complete PDF report
def generate_pdf_report(cost_data, mapping_data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 50

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "CloudCost Analyzer Report")
    y -= 30

    # Cost Table Title
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Cost Comparison Table:")
    y -= 20

    # Populate table with data from frontend
    table_data = [["Service", "AWS ($)", "Azure ($)", "GCP ($)"]]
    for item in cost_data:
        table_data.append([
            item.get("service", "N/A"),
            item.get("aws_cost", 0),
            item.get("azure_cost", 0),
            item.get("gcp_cost", 0)
        ])

    table = Table(table_data, colWidths=[120]*4)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightblue),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (1, 1), (-1, -1), "CENTER"),
    ]))
    table.wrapOn(c, width, height)
    table.drawOn(c, 50, y - len(table_data) * 18)
    y -= (len(table_data) * 18) + 60

    # Chart Title
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Cost Comparison Chart:")
    y -= 180

    # Bar chart
    draw_bar_chart(c, 70, y, cost_data)
    y -= 60

    # Service Mapping Table Title
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Service Mapping:")
    y -= 20

    # Service Mapping Table
    map_data = [["Original Service", "GCP Equivalent"]]
    for m in mapping_data:
        map_data.append([
            m.get("source_service", "N/A"),
            m.get("target_service", "N/A")
        ])

    maptable = Table(map_data, colWidths=[200, 200])
    maptable.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgreen),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))
    maptable.wrapOn(c, width, height)
    maptable.drawOn(c, 50, y - len(map_data) * 18)

    # Finalize PDF
    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer
