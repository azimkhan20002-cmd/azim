#!/usr/bin/env python3
"""Generate a one-page resume tailored to the BlackRock Associate role.

Formatting matches Azim's source resume exactly: Times family, 26pt name,
11.5pt bold section headers with a 1pt full-width rule, 9.5pt justified body,
bold company/date line, italic title/location line, ~0.64in side margins.
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.colors import black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

PAGE_W, PAGE_H = letter
LMARGIN = 46          # ~0.64in, matches source
RMARGIN = 46
CONTENT_W = PAGE_W - LMARGIN - RMARGIN   # 520pt, == rule width in source

styles = getSampleStyleSheet()

name = ParagraphStyle("name", parent=styles["Normal"], fontName="Times-Roman",
                      fontSize=26, leading=28, alignment=TA_CENTER, spaceAfter=1, textColor=black)
contact = ParagraphStyle("contact", parent=styles["Normal"], fontName="Times-Roman",
                         fontSize=9.2, leading=11, alignment=TA_CENTER, textColor=black, spaceAfter=2)
section = ParagraphStyle("section", parent=styles["Normal"], fontName="Times-Bold",
                         fontSize=11.5, leading=12.5, textColor=black)
body = ParagraphStyle("body", parent=styles["Normal"], fontName="Times-Roman",
                      fontSize=9.5, leading=10.4, alignment=TA_JUSTIFY, textColor=black)
jobtitle = ParagraphStyle("jobtitle", parent=styles["Normal"], fontName="Times-Bold",
                          fontSize=9.5, leading=11.5, textColor=black)
jobdate = ParagraphStyle("jobdate", parent=styles["Normal"], fontName="Times-Bold",
                         fontSize=9.5, leading=11.5, textColor=black, alignment=2)
subtitle = ParagraphStyle("subtitle", parent=styles["Normal"], fontName="Times-Italic",
                          fontSize=9.5, leading=11, textColor=black)
subloc = ParagraphStyle("subloc", parent=styles["Normal"], fontName="Times-Italic",
                        fontSize=9.5, leading=11, textColor=black, alignment=2)
bullet = ParagraphStyle("bullet", parent=styles["Normal"], fontName="Times-Roman",
                        fontSize=9.5, leading=10.3, alignment=TA_JUSTIFY, textColor=black)


def hr_section(title, space_before=4):
    """Bold section header with a 1pt full-width rule directly below."""
    p = Paragraph(title.upper(), section)
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 1.0, black),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), space_before),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return t


def two_col(left_text, left_style, right_text, right_style):
    t = Table([[Paragraph(left_text, left_style), Paragraph(right_text, right_style)]],
              colWidths=[CONTENT_W - 130, 130])
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
    ]))
    return t


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(i, bullet), leftIndent=11, value="•") for i in items],
        bulletType="bullet", start="•", leftIndent=12, bulletFontSize=8,
        bulletFontName="Times-Roman", spaceBefore=1, spaceAfter=0,
    )


def job(company, date, title, location, items):
    out = [two_col(company, jobtitle, date, jobdate),
           two_col(title, subtitle, location, subloc),
           bullets(items)]
    return out


story = []

story.append(Paragraph("AZIM PATHAN", name))
story.append(Paragraph(
    "New York, NY (Open to Relocation) &#8212; 682-556-0400 &#8212; "
    "azimkhan20002@gmail.com &#8212; linkedin.com/in/azimipathan &#8212; U.S. Citizen",
    contact))

# SUMMARY
story.append(hr_section("Summary", space_before=4))
story.append(Spacer(1, 1))
story.append(Paragraph(
    "Analytical, metrics-driven finance professional with experience across portfolio finance, capital planning, "
    "FP&amp;A, and consulting. Skilled in financial modeling, valuation (DCF, comparables), forecasting, and "
    "quantitative analysis. Strong record managing budgeting, variance "
    "analysis, and capital-allocation governance across a $71M, 60+ project portfolio, preparing committee-level "
    "materials, and delivering scenario and sensitivity analysis that supports senior-leadership investment and "
    "resource decisions. Direct exposure to the fintech and consumer-payments sector.",
    body))

# EXPERIENCE
story.append(hr_section("Professional Experience"))
for flow in job(
    "NextEra Energy (NEER)", "Dec 2025 - Present",
    "Financial Analyst, Portfolio Finance &amp; Capital Planning", "Juno Beach, FL",
    [
        "Manage budgeting, forecasting, and variance analysis across a $71M portfolio of 60+ enterprise projects, delivering monthly steering-committee materials that inform executive capital-allocation decisions.",
        "Performed portfolio audits reconciling WBS charge codes and budget line items against live dashboards, identifying $1.2M in misallocated charges and strengthening data integrity.",
        "Built manager-level budget and forecasting workbooks in Excel with automated actuals mapping from SAP BusinessObjects, reducing manual data entry by 40% and accelerating month-close reporting cycles.",
        "Designed dashboard templates with RAG status indicators and YTD pace variance, synthesizing portfolio data into real-time decision materials for senior leadership.",
    ]):
    story.append(flow)

story.append(Spacer(1, 1))
for flow in job(
    "Populus Financial Group", "Feb 2025 - Aug 2025",
    "Financial Analyst (FP&amp;A)", "Irving, TX",
    [
        "Built forecasting and projection models in Excel and Python with scenario and sensitivity analysis, supporting ~$1.35M in monthly revenue across money-transfer, money-order, and bill-pay (consumer-fintech) product lines.",
        "Analyzed transaction cycles and revenue streams using variance and trend models to identify revenue-leakage patterns informing executive decisions.",
        "Evaluated data-center consolidation alternatives through cost-benefit and valuation analysis, identifying ~$500K in annualized savings, and automated recurring reporting across SQL, Excel, and Power BI.",
    ]):
    story.append(flow)

story.append(Spacer(1, 1))
for flow in job(
    "Ernst &amp; Young", "Aug 2024 - Jan 2025",
    "Technology Consultant (Client: Hunt Oil Company)", "Dallas, TX",
    [
        "Developed interactive Power BI dashboards visualizing seven years of oil-and-gas differentials to support planning, forecasting, and sector analysis.",
        "Built a real-time data connection between SAP HANA and SQL Server using stored procedures and data virtualization, enhancing refresh speed and enabling timely reporting.",
        "Partnered with developers to migrate the AFENAV application to Salesforce APEX, improving data integrity and eliminating external vendor dependency.",
    ]):
    story.append(flow)

story.append(Spacer(1, 1))
for flow in job(
    "InfoServe BI LLC", "Jun 2023 - Aug 2024",
    "Business Intelligence Reporting Analyst (Client: Holman Enterprises)", "Dallas, TX",
    [
        "Managed an SAP BusinessObjects environment supporting 790+ users and 70+ data universes, ensuring report availability and timely issue resolution.",
        "Automated BI reporting by connecting SAP BusinessObjects 4.2 with Oracle databases and scheduling tools, reducing manual effort and improving efficiency.",
        "Developed advanced SQL queries and ETL workflows to consolidate data sources and enhance consistency across reporting environments.",
    ]):
    story.append(flow)

# TECHNICAL SKILLS
story.append(hr_section("Technical Skills"))
story.append(bullets([
    "<b>Financial Analysis &amp; Modeling:</b> Budgeting, forecasting, valuation methods (DCF, comparables, LBO), scenario analysis, sensitivity/stress-testing, variance analysis",
    "<b>Programming &amp; Data:</b> Python, SQL (T-SQL, PL/SQL), Java, VBA",
    "<b>Business Intelligence:</b> Power BI, Tableau, SAP Business Objects, Salesforce (APEX), InfoBurst",
    "<b>Database &amp; ERP Systems:</b> Oracle, SAP HANA, SAP S/4 HANA, SQL Server, ETL workflows, Data Warehousing",
    "<b>Tools:</b> Advanced Excel, SAP Fieldglass, MS Office Suite, Project Coordination, Stakeholder Communication",
]))

# KEY ACHIEVEMENTS
story.append(hr_section("Key Achievements"))
story.append(bullets([
    "<b>Portfolio Governance:</b> Established standardized budget reporting and dashboard frameworks across a $71M, 60+ project portfolio, improving transparency and executive decision support.",
    "<b>Cost Optimization:</b> Developed analytical models that identified ~$500K in annualized infrastructure cost savings through consolidation analysis.",
    "<b>Revenue Enhancement:</b> Identified revenue patterns and operational gaps influencing $1.35M+ monthly volume through variance and trend analysis.",
]))

# EDUCATION
story.append(hr_section("Education"))
story.append(two_col("<b>Thomas Edison State University</b>", body, "2024 - 2025", jobdate))
story.append(two_col("<i>Bachelor of Arts, Liberal Studies</i>", body, "", body))
story.append(two_col("<b>The University of Texas at Dallas</b>", body, "2020 - 2024", jobdate))
story.append(two_col("<i>Bachelor of Science, Information Technology and Systems</i>", body, "", body))

doc = SimpleDocTemplate(
    "/home/user/azim/Azim_Pathan_Resume_BlackRock_Associate.pdf",
    pagesize=letter,
    leftMargin=LMARGIN, rightMargin=RMARGIN,
    topMargin=33, bottomMargin=30,
    title="Azim Pathan Resume", author="Azim Pathan",
)
doc.build(story)
print("PDF written")
