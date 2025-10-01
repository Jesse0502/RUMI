import json, re, fitz
import vercel_blob

def extract_text_from_pdf(content: bytes) -> str:
    text = ""
    doc = fitz.open(stream=content, filetype="pdf")
    for page in doc:
        text += page.get_text()
    return text

def extract_json(text: str):
    m = re.search(r'<<<PREFERENCES_JSON>>>(.*?)<<<END_PREFERENCES_JSON>>>', text, re.S)
    if m:
        try:
            return [json.loads(m.group(1).strip()), ""]
        except:
            return [None, text.strip()]
    return [None, text.strip()]

def upload_to_blob(file_content: bytes, filename: str) -> str:
    try:
        uploaded_blob = vercel_blob.put(filename, file_content)
        print(f"File uploaded successfully: {uploaded_blob['url']}")
    except Exception as e:
        print(f"Error uploading file: {e}")

def list_blobs():
    try:
        blobs = vercel_blob.list()
        for blob in blobs['blobs']:
            print(f"Blob: {blob['pathname']}, URL: {blob['url']}")
    except Exception as e:
        print(f"Error listing blobs: {e}")


EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
def is_valid_email(email: str) -> bool:
    return bool(EMAIL_RE.match(email))