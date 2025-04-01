# backend/rsa_utils.py
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
import base64

def load_private_key():
    with open("keys/private.pem", "rb") as key_file:
        return serialization.load_pem_private_key(
            key_file.read(),
            password=None,
        )

def decrypt_payload(encrypted_text: str) -> str:
    private_key = load_private_key()
    decrypted_data = private_key.decrypt(
        base64.b64decode(encrypted_text),
        padding.PKCS1v15()
    )
    return decrypted_data.decode("utf-8")
