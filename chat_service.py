from sqlalchemy.orm import Session
from app.models.models import ChatSession
import os
import glob


class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.portfolio_text = self._load_portfolio_data()

    def _load_portfolio_data(self) -> str:
        """Extract text from all PDF and Word files in the data/ directory."""
        data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
        text_parts = []

        for pdf_path in glob.glob(os.path.join(data_dir, "*.pdf")):
            try:
                import pypdf
                reader = pypdf.PdfReader(pdf_path)
                text = "\n".join(
                    page.extract_text() for page in reader.pages
                    if page.extract_text()
                )
                if text:
                    text_parts.append(f"[From {os.path.basename(pdf_path)}]\n{text}")
            except Exception as e:
                print(f"Warning: could not load {pdf_path}: {e}")

        for docx_path in glob.glob(os.path.join(data_dir, "*.docx")):
            try:
                from docx import Document
                doc = Document(docx_path)
                text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
                if text:
                    text_parts.append(f"[From {os.path.basename(docx_path)}]\n{text}")
            except Exception as e:
                print(f"Warning: could not load {docx_path}: {e}")

        if not text_parts:
            print(f"Warning: no PDF or Word files found in {data_dir}")
            return ""

        return "\n\n---\n\n".join(text_parts)

    async def get_response(self, message: str, session: ChatSession) -> str:
        """Generate a response using OpenAI with resume/portfolio text as context."""
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])

        if self.portfolio_text:
            system_prompt = (
                "You are a professional assistant presenting information about Mr. Venkat Penumarthi. "
                "Always refer to him in the third person — use 'Mr. Penumarthi', 'he', 'his', or 'him'. "
                "Never speak as if you are him or on his behalf. "
                "ONLY answer questions about Mr. Penumarthi's professional experience, skills, education, and background "
                "based strictly on the provided document. "
                "If a question is unrelated to Mr. Penumarthi or his professional background, "
                "decline with a single witty one-liner that ties the off-topic subject back to his tech skills, "
                "then redirect the user to ask about his background. "
                "Never suggest external resources, websites, or advice for off-topic questions — just decline and redirect. "
                "Never provide information, instructions, or advice on topics outside the document. "
                "Format responses using bullet points or numbered lists where appropriate.\n\n"

                f"--- RESUME / PORTFOLIO ---\n{self.portfolio_text}\n--- END ---"
            )

        else:
            system_prompt = (
                "You are a professional assistant. "
                "No resume or portfolio files were found in the data/ directory."
            )

        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            max_tokens=500,
            temperature=0.3,
        )

        return completion.choices[0].message.content
