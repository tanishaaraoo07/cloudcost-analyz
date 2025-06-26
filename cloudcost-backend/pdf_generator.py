from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from io import BytesIO

def draw_bar_chart(c, x, y, data):
    bar_width = 40
    gap = 60
    max_height = 150
    base_y = y

    max_cost = max(
        max(item.get("current_cost", 0), item.get("gcp_cost", 0))
        for item in data
        if isinstance(item.get("current_cost", 0), (int, float))
    )

    for i, item in enumerate(data):
        left = x + i * gap
        current_height = (item.get("current_cost", 0) / max_cost) * max_height if max_cost else 0
        gcp_height = (item.get("gcp_cost", 0) / max_cost) * max_height if max_cost else 0

        # Current Provider (Blue)
        c.setFillColor(colors.blue)
        c.rect(left, base_y, bar_width, current_height, fill=True)

        # GCP (Green)
        c.setFillColor(colors.green)
        c.rect(left + bar_width + 5, base_y, bar_width, gcp_height, fill=True)

        # Labels
        c.setFillColor(colors.black)
        c.drawString(left, base_y - 15, item.get("type", "Unknown"))

    # Legend
    c.setFillColor(colors.blue)
    c.rect(x, base_y + max_height + 20, 10, 10, fill=True)
    c.setFillColor(colors.black)
    c.drawString(x + 15, base_y + max_height + 20, "Current Provider")

    c.setFillColor(colors.green)
    c.rect(x + 120, base_y + max_height + 20, 10, 10, fill=True)
    c.drawString(x + 135, base_y + max_height + 20, "GCP")

def generate_pdf_report(cost_data, mapping_data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 50

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "CloudCost Analyzer Report")
    y -= 30

    # Cost Comparison Table
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Cost Comparison Table:")
    y -= 20

    table_data = [["Type", "Current Provider", "Current Cost ($)", "GCP Cost ($)", "Savings ($)"]]
    for item in cost_data:
        table_data.append([
            item.get("type", "N/A"),
            item.get("current_provider", "N/A"),
            item.get("current_cost", 0),
            item.get("gcp_cost", 0),
            item.get("savings", 0)
        ])

    table = Table(table_data, colWidths=[90]*5)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightblue),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))
    table.wrapOn(c, width, height)
    table.drawOn(c, 50, y - len(table_data) * 18)
    y -= (len(table_data) * 18) + 40

    # Chart
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Cost Comparison Chart:")
    y -= 180
    draw_bar_chart(c, 70, y, cost_data)
    y -= 40

    # Mapping Table
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Service Mapping:")
    y -= 20

    map_data = [["Original Service", "GCP Equivalent"]]
    for m in mapping_data:
        map_data.append([
            m.get("source_service", "N/A"),
            m.get("target_service", "N/A")
        ])

    maptable = Table(map_data, colWidths=[180, 180])
    maptable.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgreen),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))
    maptable.wrapOn(c, width, height)
    maptable.drawOn(c, 50, y - len(map_data) * 18)

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer
