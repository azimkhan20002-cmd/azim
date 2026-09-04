#!/usr/bin/env python3
"""Generate a one-page resume tailored to the Amazon WWSO Senior Financial Analyst role.

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
    "FP&amp;A professional who builds the KPI dashboards, driver-based financial models, and planning processes "
    "senior leaders use to run the business. Currently own annual planning, budgeting, and monthly forecasting for "
    "a $71M, 60+ project portfolio, partnering directly with executives through steering-committee reviews that set "
    "funding decisions. Pair finance depth with hands-on data skills &#8212; SQL, Python, Power BI/Tableau, and "
    "automated ERP integrations &#8212; to turn large, multi-source datasets into productivity metrics and "
    "decision-ready reporting at scale. Seeking to bring this blend of financial rigor and data fluency to "
    "strategic finance supporting a global go-to-market organization.",
    body))

# EXPERIENCE
story.append(hr_section("Professional Experience"))
for flow in job(
    "NextEra Energy (NEER)", "Dec 2025 - Present",
    "Financial Analyst, Portfolio Finance &amp; Capital Planning", "Juno Beach, FL",
    [
        "Own annual planning, budgeting, and monthly forecasting/variance analysis for a $71M, 60+ project portfolio, partnering with senior business and finance leaders through monthly steering-committee reviews that drive investment and funding decisions.",
        "Built and maintain portfolio KPI dashboards (RAG status, YTD pace-to-plan, spend productivity) that synthesize multi-source data into real-time decision views for senior leadership.",
        "Designed driver-based budget and forecasting models in Excel with automated SAP actuals integration, cutting manual data entry 40% and compressing the month-close reporting cycle.",
        "Dove deep into portfolio actuals to surface $1.2M in misallocated charges, reconciling WBS charge codes against live actuals and tightening data integrity ahead of executive review.",
    ]):
    story.append(flow)

story.append(Spacer(1, 1))
for flow in job(
    "Populus Financial Group", "Feb 2025 - Aug 2025",
    "Financial Analyst (FP&amp;A)", "Irving, TX",
    [
        "Built forecasting and scenario/sensitivity models in Excel and Python across ~$1.35M in monthly revenue spanning a consumer-fintech lender's money-transfer, money-order, and bill-pay lines.",
        "Analyzed transaction-volume and productivity trends across product pipelines, diagnosing revenue-leakage drivers and converting findings into pricing and operational actions for executive leadership.",
        "Developed an NPV / cost-benefit model evaluating data-center consolidation alternatives, quantifying ~$500K in annualized savings to support the business-investment decision.",
    ]):
    story.append(flow)

story.append(Spacer(1, 1))
for flow in job(
    "Ernst &amp; Young", "Aug 2024 - Jan 2025",
    "Technology Consultant (Client: Hunt Oil Company)", "Dallas, TX",
    [
        "Modeled seven years of oil-and-gas price differentials in Power BI for a major energy client, supporting sector planning, forecasting, and performance analysis.",
        "Engineered a real-time SAP HANA-to-SQL Server data pipeline (stored procedures, data virtualization) that accelerated refresh speed and enabled timely self-service reporting for business teams.",
        "Led migration of the AFENAV application to Salesforce APEX, improving data integrity and eliminating external vendor dependency.",
    ]):
    story.append(flow)

story.append(Spacer(1, 1))
for flow in job(
    "InfoServe BI LLC", "Jun 2023 - Aug 2024",
    "Business Intelligence Reporting Analyst (Client: Holman Enterprises)", "Dallas, TX",
    [
        "Administered an SAP BusinessObjects environment serving 790+ users and 70+ data universes, sustaining high availability for enterprise-wide KPI reporting.",
        "Automated recurring reporting (SAP BusinessObjects 4.2 to Oracle, scheduled refresh), eliminating manual effort and improving turnaround for business stakeholders.",
        "Wrote advanced SQL and ETL workflows that consolidated disparate sources into consistent, decision-ready metrics.",
    ]):
    story.append(flow)

# TECHNICAL SKILLS
story.append(hr_section("Technical Skills"))
story.append(bullets([
    "<b>Financial Planning &amp; Analysis:</b> Annual planning and budgeting, forecasting, variance analysis, scenario/sensitivity modeling, NPV / cost-benefit analysis, productivity and pipeline metrics",
    "<b>Data &amp; Programming:</b> SQL (T-SQL, PL/SQL), Python, VBA, ETL workflows, large multi-source datasets",
    "<b>BI &amp; Dashboards:</b> Power BI, Tableau, SAP BusinessObjects, KPI dashboard design and automation",
    "<b>ERP &amp; Systems:</b> SAP HANA, SAP S/4 HANA, Oracle, SQL Server, Salesforce (APEX), Data Warehousing",
    "<b>Tools:</b> Advanced Excel (driver-based models, automation), MS Office Suite, Stakeholder Communication",
]))

# KEY ACHIEVEMENTS
story.append(hr_section("Key Achievements"))
story.append(bullets([
    "<b>Planning Ownership:</b> Built the annual planning, budgeting, and forecasting framework governing a $71M, 60+ project portfolio, directly informing executive investment decisions.",
    "<b>Dive Deep:</b> Surfaced $1.2M in misallocated charges through independent reconciliation of portfolio actuals, protecting budget integrity ahead of leadership review.",
    "<b>Decision Support:</b> Quantified ~$500K in annualized savings via an NPV / cost-benefit model that drove an infrastructure investment decision.",
]))

# EDUCATION
story.append(hr_section("Education"))
story.append(two_col("<b>Thomas Edison State University</b>", body, "2024 - 2025", jobdate))
story.append(two_col("<i>Bachelor of Arts, Liberal Studies</i>", body, "", body))
story.append(two_col("<b>The University of Texas at Dallas</b>", body, "2020 - 2024", jobdate))
story.append(two_col("<i>Bachelor of Science, Information Technology and Systems</i>", body, "", body))

doc = SimpleDocTemplate(
    "/home/user/azim/Azim_Pathan_Resume_Amazon_WWSO_Finance.pdf",
    pagesize=letter,
    leftMargin=LMARGIN, rightMargin=RMARGIN,
    topMargin=33, bottomMargin=30,
    title="Azim Pathan Resume", author="Azim Pathan",
)
doc.build(story)
print("PDF written")
