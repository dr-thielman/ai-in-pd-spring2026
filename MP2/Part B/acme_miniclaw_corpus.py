"""ACME Robotics Internal Knowledge Base — MiniClaw Project.

For use in ME 493B MP2 Part B.

Load with:
    from acme_miniclaw_corpus import acme_documents
    print(f"Loaded {len(acme_documents)} ACME documents")
"""

import json
import os

_HERE = os.path.dirname(os.path.abspath(__file__))
_CORPUS_DIR = os.path.join(_HERE, "corpus")


def _load_corpus():
    """Load all ACME documents from the corpus/ folder."""
    manifest_path = os.path.join(_CORPUS_DIR, "manifest.json")
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    documents = []
    for entry in manifest:
        txt_path = os.path.join(_CORPUS_DIR, entry["filename"])
        with open(txt_path, "r", encoding="utf-8") as f:
            text = f.read()
        documents.append({
            "id": entry["id"],
            "title": entry["title"],
            "type": entry["type"],
            "date": entry["date"],
            "author": entry["author"],
            "text": text,
        })
    return documents


acme_documents = _load_corpus()
