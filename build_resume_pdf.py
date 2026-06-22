#!/usr/bin/env python3
"""Generate a one-page, ATS-friendly PDF resume tailored to the BlackRock Associate role."""
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

DARK = HexColor("#1a1a1a")
GREY = HexColor("#444444")

styles = getSampleStyleSheet()

name = ParagraphStyle("name", parent=styles["Normal"], fontName="Helvetica-Bold",
                      fontSize=20, leading=22, alignment=1, spaceAfter=2, textColor=DARK)
contact = ParagraphStyle("contact", parent=styles["Normal"], fontName="Helvetica",
                         fontSize=8.5, leading=11, alignment=1, textColor=GREY, spaceAfter=8)
section = ParagraphStyle("section", parent=styles["Normal"], fontName="Helvetica-Bold",
                         fontSize=10.5, leading=12, textColor=DARK, spaceBefore=6, spaceAfter=2)
body = ParagraphStyle("body", parent=styles["Normal"], fontName="Helvetica",
                      fontSize=8.6, leading=10.3, alignment=TA_JUSTIFY, textColor=DARK)
jobtitle = ParagraphStyle("jobtitle", parent=styles["Normal"], fontName="Helvetica-Bold",
                          fontSize=9.5, leading=11.5, textColor=DARK)
jobdate = ParagraphStyle("jobdate", parent=styles["Normal"], fontName="Helvetica-Oblique",
                         fontSize=8.5, leading=11.5, textColor=GREY, alignment=2)
jobsub = ParagraphStyle("jobsub", parent=styles["Normal"], fontName="Helvetica-Oblique",
                        fontSize=8.5, leading=10, textColor=GREY, spaceAfter=2)
bullet = ParagraphStyle("bullet", parent=styles["Normal"], fontName="Helvetica",
                        fontSize=8.6, leading=10.1, alignment=TA_JUSTIFY, textColor=DARK)


def hr_section(title):
    """Section header with an underline rule."""
    p = Paragraph(title.upper(), section)
    t = Table([[p]], colWidths=[7.5 * inch])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 1.2, DARK),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return t


def job_header(title, date):
    t = Table([[Paragraph(title, jobtitle), Paragraph(date, jobdate)]],
              colWidths=[5.6 * inch, 1.9 * inch])
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
    ]))
    return t


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(i, bullet), leftIndent=10, value="•") for i in items],
        bulletType="bullet", start="•", leftIndent=12, bulletFontSize=8,
        spaceBefore=2, spaceAfter=0,
    )


story = []

story.append(Paragraph("AZIM PATHAN", name))
story.append(Paragraph(
    "New York, NY (Open to Relocation)&nbsp;&nbsp;•&nbsp;&nbsp;682-556-0400&nbsp;&nbsp;•&nbsp;&nbsp;"
    "azimkhan20002@gmail.com&nbsp;&nbsp;•&nbsp;&nbsp;linkedin.com/in/azimipathan&nbsp;&nbsp;•&nbsp;&nbsp;U.S. Citizen",
    contact))

story.append(hr_section("Summary"))
story.append(Spacer(1, 1))
story.append(Paragraph(
    "Finance professional with experience across portfolio finance, capital planning, FP&amp;A, and consulting, "
    "focused on financial modeling, forecasting, and quantitative analysis that drive executive capital-allocation "
    "decisions. Manages budgeting, variance analysis, and portfolio governance across a $71M, 60+ project portfolio, "
    "and builds projection and valuation models in Excel (DCF, comparables) with regression-based forecasting, "
    "scenario analysis, and sensitivity testing. Prepares steering- and committee-level materials that synthesize data "
    "from multiple sources, with direct experience in the fintech and consumer-payments sector. Seeking to apply a "
    "rigorous, metrics-driven analytical foundation to investment due diligence and execution.",
    body))

story.append(hr_section("Professional Experience"))

story.append(job_header("NextEra Energy (NEER) — Financial Analyst, Portfolio Finance &amp; Capital Planning", "Dec 2025 – Present"))
story.append(Paragraph("Juno Beach, FL", jobsub))
story.append(bullets([
    "Manage budgeting, forecasting, and variance analysis across a $71M portfolio of 60+ enterprise projects, preparing monthly steering-committee materials that inform executive capital-allocation decisions.",
    "Conducted portfolio audits reconciling WBS charge codes and budget line items against live dashboards, identifying $1.2M in misallocated charges and strengthening data integrity.",
    "Built manager-level budget and forecasting workbooks in Excel with automated actuals mapping from SAP, reducing manual data entry 40% and accelerating month-close reporting cycles.",
    "Designed dashboard frameworks with RAG status indicators and YTD pace-variance tracking, synthesizing portfolio data into real-time decision materials for senior leadership.",
]))

story.append(Spacer(1, 2))
story.append(job_header("Populus Financial Group — Financial Analyst (FP&amp;A)", "Feb 2025 – Aug 2025"))
story.append(Paragraph("Irving, TX", jobsub))
story.append(bullets([
    "Built financial projection and forecasting models in Excel and Python supporting ~$1.35M in monthly revenue across money-transfer, money-order, and bill-pay product lines, applying scenario and sensitivity analysis under multiple assumptions.",
    "Performed quantitative analysis of transaction cycles and revenue streams in the consumer-fintech/payments sector, using variance and trend models to surface revenue-leakage patterns for leadership.",
    "Conducted a cost-benefit and valuation analysis of data-center consolidation alternatives, identifying ~$500K in annualized savings in a capital-allocation due-diligence review.",
]))

story.append(Spacer(1, 2))
story.append(job_header("Ernst &amp; Young — Technology Consultant (Client: Hunt Oil Company)", "Aug 2024 – Jan 2025"))
story.append(Paragraph("Dallas, TX", jobsub))
story.append(bullets([
    "Conducted industry and performance research across seven years of oil-and-gas price differentials, building interactive Power BI models that supported planning, forecasting, and sector analysis.",
    "Synthesized data from multiple enterprise systems (SAP HANA, SQL Server) into a real-time reporting pipeline using stored procedures and data virtualization, accelerating refresh speed and enabling timely analysis.",
    "Partnered with engineering teams to migrate the AFENAV application to Salesforce APEX, improving data integrity and eliminating external vendor dependency.",
]))

story.append(Spacer(1, 2))
story.append(job_header("InfoServe BI LLC — Business Intelligence Reporting Analyst (Client: Holman Enterprises)", "Jun 2023 – Aug 2024"))
story.append(Paragraph("Dallas, TX", jobsub))
story.append(bullets([
    "Developed advanced SQL queries and ETL workflows to consolidate data from multiple sources, strengthening data consistency and reliability across reporting environments.",
    "Managed an SAP BusinessObjects environment serving 790+ users and 70+ data universes, and automated recurring reporting against Oracle databases to reduce manual effort.",
]))

story.append(hr_section("Technical &amp; Analytical Skills"))
story.append(bullets([
    "<b>Valuation &amp; Financial Modeling:</b> DCF, comparable-company analysis, LBO concepts, financial projections, budgeting, forecasting, scenario analysis, variance analysis",
    "<b>Quantitative &amp; Econometric Analysis:</b> Regression analysis, forecasting models, sensitivity and stress-testing, risk modeling, trend analysis",
    "<b>Programming &amp; Data:</b> Python, SQL (T-SQL, PL/SQL), VBA, Java",
    "<b>Business Intelligence &amp; Presentation:</b> Power BI, Tableau, SAP BusinessObjects, Salesforce (APEX), advanced Excel, PowerPoint/MS Office",
    "<b>Data &amp; ERP Systems:</b> Oracle, SAP HANA, SAP S/4 HANA, SAP Fieldglass, SQL Server, ETL workflows, data warehousing",
]))

story.append(hr_section("Selected Achievements"))
story.append(bullets([
    "<b>Portfolio Governance:</b> Established standardized budget reporting and dashboard frameworks across a $71M, 60+ project portfolio, improving transparency and executive decision support.",
    "<b>Capital Allocation:</b> Built valuation and cost-benefit models that identified ~$500K in annualized infrastructure savings through consolidation analysis.",
    "<b>Sector Analysis:</b> Analyzed revenue patterns and operational gaps across $1.35M+ in monthly fintech/payments volume using variance and trend modeling.",
]))

story.append(hr_section("Education"))
edu = Table([
    [Paragraph("<b>Thomas Edison State University</b> — Bachelor of Arts, Liberal Studies", body),
     Paragraph("2024 – 2025", jobdate)],
    [Paragraph("<b>The University of Texas at Dallas</b> — Bachelor of Science, Information Technology and Systems", body),
     Paragraph("2020 – 2024", jobdate)],
], colWidths=[6.0 * inch, 1.5 * inch])
edu.setStyle(TableStyle([
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 2),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
]))
story.append(Spacer(1, 1))
story.append(edu)

doc = SimpleDocTemplate(
    "/home/user/azim/Azim_Pathan_Resume_BlackRock_Associate.pdf",
    pagesize=letter,
    leftMargin=0.55 * inch, rightMargin=0.55 * inch,
    topMargin=0.4 * inch, bottomMargin=0.35 * inch,
    title="Azim Pathan Resume", author="Azim Pathan",
)
doc.build(story)
print("PDF written")
