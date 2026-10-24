package com.network.kanban.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EncryptionUtilTest {

    private final EncryptionUtil encryptionUtil = new EncryptionUtil("TaskFlowSecretKey2026!");

    @Test
    void testEncryptAndDecrypt() {
        String originalPassword = "Pass@123";
        String encrypted = encryptionUtil.encrypt(originalPassword);
        System.out.println("DEBUG_ENCRYPTED_Pass@123=" + encrypted);
        assertNotNull(encrypted);
        assertNotEquals(originalPassword, encrypted);

        String decrypted = encryptionUtil.decrypt(encrypted);
        System.out.println("DEBUG_DECRYPTED=" + decrypted);
        assertEquals(originalPassword, decrypted);

        String originalPassword2 = "123456";
        String encrypted2 = encryptionUtil.encrypt(originalPassword2);
        System.out.println("DEBUG_ENCRYPTED_123456=" + encrypted2);
        assertEquals(originalPassword2, encryptionUtil.decrypt(encrypted2));
    }
}
