from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from io import BytesIO
import base64
from reportlab.lib.utils import ImageReader
import io

def draw_bar_chart(c, x, y, data):
    bar_width = 25
    gap = 90
    max_height = 150
    base_y = y

    max_cost = max(
        max(float(item.get("aws_cost", 0) or 0),
            float(item.get("azure_cost", 0) or 0),
            float(item.get("gcp_cost", 0) or 0))
        for item in data
    ) or 1

    for i, item in enumerate(data):
        left = x + i * gap
        aws_height = (float(item.get("aws_cost", 0)) / max_cost) * max_height
        azure_height = (float(item.get("azure_cost", 0)) / max_cost) * max_height
        gcp_height = (float(item.get("gcp_cost", 0)) / max_cost) * max_height

        c.setFillColor(colors.blue)
        c.rect(left, base_y, bar_width, aws_height, fill=True)

        c.setFillColor(colors.gray)
        c.rect(left + bar_width + 3, base_y, bar_width, azure_height, fill=True)

        c.setFillColor(colors.green)
        c.rect(left + 2 * (bar_width + 3), base_y, bar_width, gcp_height, fill=True)

        service = item.get("service", "Unnamed")
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 7)
        c.drawString(left, base_y - 12, service[:10])

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

def generate_pdf_report(cost_data, mapping_data, chart_image_base64=None):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 50

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "CloudCost Analyzer Report")
    y -= 30

    # Cost Comparison Table
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Cost Comparison Table:")
    y -= 20

    table_data = [["Service", "AWS ($)", "Azure ($)", "GCP ($)"]]
    total_aws = total_azure = total_gcp = 0

    for item in cost_data or []:
        try:
            aws = float(item.get("aws_cost", 0) or 0)
            azure = float(item.get("azure_cost", 0) or 0)
            gcp = float(item.get("gcp_cost", 0) or 0)
            service = item.get("service", "N/A")

            table_data.append([
                service,
                f"{aws:.2f}",
                f"{azure:.2f}",
                f"{gcp:.2f}"
            ])
            total_aws += aws
            total_azure += azure
            total_gcp += gcp
        except Exception:
            continue

    table_data.append(["Total", f"{total_aws:.2f}", f"{total_azure:.2f}", f"{total_gcp:.2f}"])

    table = Table(table_data, colWidths=[120]*4)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightblue),
        ("BACKGROUND", (0, -1), (-1, -1), colors.beige),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("ALIGN", (1, 1), (-1, -1), "CENTER"),
    ]))
    table.wrapOn(c, width, height)
    table.drawOn(c, 50, y - len(table_data) * 18)
    y -= (len(table_data) * 18) + 40

    # Bar Chart
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Cost Comparison Chart:")
    y -= 180
    if cost_data:
        draw_bar_chart(c, 70, y, cost_data)
    y -= 100

    # Optional Image Chart
    if chart_image_base64:
        try:
            chart_data = base64.b64decode(chart_image_base64.split(",")[-1])
            chart_image = ImageReader(io.BytesIO(chart_data))
            c.drawImage(chart_image, 50, y - 250, width=500, height=220)
            y -= 280
        except Exception as e:
            print("Failed to add image to PDF:", e)

    # Service Mapping Table
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Service Mapping:")
    y -= 20

    map_data = [["Original Service", "GCP Equivalent"]]
    for m in mapping_data or []:
        source = m.get("source_service") or m.get("original_service") or "N/A"
        target = m.get("target_service") or m.get("gcp_equivalent") or "N/A"
        if source.lower() != "unknown" and target.lower() != "unknown":
            map_data.append([source, target])

    if len(map_data) == 1:
        map_data.append(["No valid mappings found", "-"])

    maptable = Table(map_data, colWidths=[200, 200])
    maptable.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgreen),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))
    maptable.wrapOn(c, width, height)
    maptable.drawOn(c, 50, y - len(map_data) * 18)
    y -= (len(map_data) * 18) + 30

    # Footer
    c.setFont("Helvetica-Oblique", 8)
    c.drawRightString(width - 50, 30, "Generated by CloudCost Analyzer | © 2025")

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer
