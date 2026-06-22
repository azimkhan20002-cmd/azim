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
    "Finance and analytics professional with two years of experience across FP&amp;A, consulting, and business "
    "intelligence, focused on financial modeling, forecasting, and quantitative analysis that support "
    "senior-leadership and capital-allocation decisions. Builds projection and valuation models in Excel "
    "(DCF, comparables), runs regression-based forecasting, scenario analysis, and sensitivity/stress-testing, "
    "and synthesizes data from multiple sources into executive-ready presentations. Direct experience in the "
    "fintech and consumer-payments sector, with applied research on emerging technologies and automation. "
    "Seeking to apply a rigorous, metrics-driven analytical foundation to investment due diligence and execution.",
    body))

story.append(hr_section("Professional Experience"))

story.append(job_header("Populus Financial Group — Financial Analyst (FP&amp;A)", "Feb 2025 – Aug 2025"))
story.append(Paragraph("Irving, TX", jobsub))
story.append(bullets([
    "Built financial projection and forecasting models in Excel and Python supporting ~$1.35M in monthly revenue across money-transfer, money-order, and bill-pay product lines, applying scenario analysis to evaluate revenue and cost outcomes under multiple assumptions.",
    "Conducted quantitative analysis of transaction cycles and revenue streams in the consumer-fintech/payments sector, using variance and trend models to identify revenue-leakage patterns and inform leadership decisions.",
    "Performed a cost-benefit and valuation analysis of data-center consolidation alternatives, quantifying multi-year savings and delivering a recommendation that functioned as a capital-allocation due-diligence review.",
    "Applied sensitivity and stress-testing to forecast assumptions to assess downside scenarios and improve forecast reliability for executive planning.",
    "Synthesized data from SQL, Excel, and Power BI into consolidated dashboards and reporting packages used in executive-level decision-making.",
]))

story.append(Spacer(1, 2))
story.append(job_header("Ernst &amp; Young — Technology Consultant (Client: Hunt Oil Company)", "Aug 2024 – Jan 2025"))
story.append(Paragraph("Dallas, TX", jobsub))
story.append(bullets([
    "Conducted industry and performance research across seven years of oil-and-gas price differentials, building interactive Power BI models that supported planning, forecasting, and sector analysis.",
    "Synthesized data from multiple enterprise systems (SAP HANA, SQL Server) into a real-time reporting pipeline using stored procedures and data virtualization, accelerating refresh speed and enabling timely analysis.",
    "Partnered with engineering teams to migrate the AFENAV application to Salesforce APEX, improving data integrity and removing dependence on an external vendor system.",
]))

story.append(Spacer(1, 2))
story.append(job_header("InfoServe BI LLC — Business Intelligence Reporting Analyst (Client: Holman Enterprises)", "Jun 2023 – Aug 2024"))
story.append(Paragraph("Dallas, TX", jobsub))
story.append(bullets([
    "Developed advanced SQL queries and ETL workflows to consolidate data from multiple sources, strengthening data consistency and reliability across reporting environments.",
    "Managed an SAP BusinessObjects environment serving 790+ users and 70+ data universes, ensuring availability and timely issue resolution.",
    "Automated recurring BI reporting by integrating SAP BusinessObjects 4.2 with Oracle databases and scheduling tools, reducing manual effort and improving operational efficiency.",
]))

story.append(Spacer(1, 2))
story.append(job_header("Baylor Scott &amp; White Medical Center — IT Intern (Process &amp; Data Analysis)", "Jun 2020 – Aug 2020"))
story.append(Paragraph("Dallas, TX", jobsub))
story.append(bullets([
    "Resolved supply-chain inconsistencies affecting critical medical supplies during COVID-19 surges and partnered with ICU staff to redesign the patient intake workflow, improving availability and reducing wait times.",
]))

story.append(hr_section("Technical &amp; Analytical Skills"))
story.append(bullets([
    "<b>Valuation &amp; Financial Modeling:</b> DCF, comparable-company analysis, LBO concepts, financial projections, budgeting, forecasting, scenario analysis, variance analysis",
    "<b>Quantitative &amp; Econometric Analysis:</b> Regression analysis, forecasting models, sensitivity and stress-testing, risk modeling, trend analysis",
    "<b>Programming &amp; Data:</b> Python, SQL (T-SQL, PL/SQL), VBA, Java",
    "<b>Business Intelligence &amp; Presentation:</b> Power BI, Tableau, SAP BusinessObjects, Salesforce (APEX), advanced Excel, PowerPoint/MS Office",
    "<b>Data Systems:</b> Oracle, SAP HANA, SQL Server, ETL workflows, data warehousing",
]))

story.append(hr_section("Selected Achievements"))
story.append(bullets([
    "<b>Capital Allocation:</b> Built valuation and cost-benefit models that identified multi-year infrastructure savings through consolidation analysis.",
    "<b>Sector Analysis:</b> Analyzed revenue patterns and operational gaps across $1.35M+ in monthly fintech/payments volume using variance and trend modeling.",
    "<b>Automation:</b> Implemented AI-driven forecasting and Python automation to streamline data consolidation and scenario analysis, reducing manual effort and improving precision.",
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
