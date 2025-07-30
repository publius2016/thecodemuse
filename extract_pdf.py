import PyPDF2
import sys

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

if __name__ == "__main__":
    pdf_path = "Technical Design for Blog .pdf"
    text = extract_text_from_pdf(pdf_path)
    if text:
        with open("blog_design_extracted.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("Text extracted successfully to blog_design_extracted.txt")
    else:
        print("Failed to extract text") 