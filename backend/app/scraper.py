import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str) -> dict:
    headers = {
        "User-Agent": "WikiQuizBot/1.0"
    }
    r = requests.get(url, headers=headers, timeout=15)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")

    # Title
    title_tag = soup.find("h1", id="firstHeading")
    title = title_tag.get_text(strip=True) if title_tag else "Unknown Title"

    # Remove unwanted elements
    for tag in soup(["script", "style", "sup", "table", "nav"]):
        tag.decompose()

    content_div = soup.find("div", id="mw-content-text")
    paragraphs = content_div.find_all("p") if content_div else []

    text_blocks = []
    for p in paragraphs:
        t = p.get_text(" ", strip=True)
        if len(t) > 40:
            text_blocks.append(t)

    full_text = "\n".join(text_blocks)

    # Sections
    sections = []
    for h in content_div.find_all(["h2", "h3"]):
        span = h.find("span", class_="mw-headline")
        if span:
            sections.append(span.get_text(strip=True))

    return {
        "url": url,
        "title": title,
        "sections": sections[:10],
        "content": full_text
    }