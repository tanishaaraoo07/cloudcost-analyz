from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Table, TableStyle
from io import BytesIO
import matplotlib.pyplot as plt


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

    cost_table_data = [["Service", "Provider", "AWS Cost ($)", "Azure Cost ($)", "GCP Cost ($)"]]
    for item in cost_data:
        cost_table_data.append([
            item.get("service", "-"),
            item.get("provider", "-"),
            item.get("aws_cost", "-"),
            item.get("azure_cost", "-"),
            item.get("gcp_cost", "-")
        ])

    cost_table = Table(cost_table_data, colWidths=[100, 80, 80, 80, 80])
    cost_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightblue),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))
    cost_table.wrapOn(c, width, height)
    cost_table.drawOn(c, 50, y - (len(cost_table_data) * 20))
    y -= (len(cost_table_data) * 20) + 40

    # Chart
    services = [item.get("service") for item in cost_data]
    aws = [item.get("aws_cost", 0) for item in cost_data]
    azure = [item.get("azure_cost", 0) for item in cost_data]
    gcp = [item.get("gcp_cost", 0) for item in cost_data]

    fig, ax = plt.subplots(figsize=(6, 3))
    x = range(len(services))
    bar_width = 0.2

    ax.bar([i - bar_width for i in x], aws, width=bar_width, label='AWS', color='blue')
    ax.bar(x, azure, width=bar_width, label='Azure', color='orange')
    ax.bar([i + bar_width for i in x], gcp, width=bar_width, label='GCP', color='green')

    ax.set_xticks(x)
    ax.set_xticklabels(services)
    ax.set_ylabel('Cost ($)')
    ax.set_title('Cloud Cost Comparison')
    ax.legend()

    img_buffer = BytesIO()
    plt.tight_layout()
    plt.savefig(img_buffer, format='PNG')
    plt.close()
    img_buffer.seek(0)

    c.drawImage(img_buffer, 50, y - 250, width=500, height=250)
    y -= 260

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

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer
