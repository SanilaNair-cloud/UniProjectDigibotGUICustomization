"""
RSA Decryption Utilities

This file handles RSA-based decryption for secure data transmission.

Functions:
- load_private_key: Loads the RSA private key from a local file.
- decrypt_payload: Decrypts incoming base64-encoded, RSA-encrypted text using the private key.
"""

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
import base64

def load_private_key():
    """
    Reads the private RSA key from the 'keys/private.pem' file.
    
    This key is used to decrypt data that was encrypted using 
    the matching public key.
    """
    with open("keys/private.pem", "rb") as key_file:
        return serialization.load_pem_private_key(
            key_file.read(),
            password=None,
        )

def decrypt_payload(encrypted_text: str) -> str:
    """
    Decrypts a base64-encoded encrypted message.

    The message is first decoded from base64, then decrypted using the RSA private key.
    Returns the original plaintext string.
    """
    private_key = load_private_key()
    decrypted_data = private_key.decrypt(
        base64.b64decode(encrypted_text),
        padding.PKCS1v15()
    )
    return decrypted_data.decode("utf-8")
