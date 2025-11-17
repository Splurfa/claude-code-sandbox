#!/bin/bash
# Security Scanner for Session Management
# Scans for vulnerabilities and security issues

SESSION_ID=$(cat .current-session)
SECURITY_REPORT="sessions/$SESSION_ID/artifacts/docs/security-scan-results.md"

cat > "$SECURITY_REPORT" <<'HEADER'
# Security Scan Results
**Generated:** $(date)
**Scope:** Session management infrastructure

## Security Findings

HEADER

echo "=== SECURITY SCANNER ==="

# 1. Check for hardcoded secrets
echo "Scanning for hardcoded secrets..."
if grep -r "password\|secret\|key\|token" sessions/ 2>/dev/null | grep -v ".git" | grep -v "test" > /tmp/secrets.txt; then
    cat >> "$SECURITY_REPORT" <<FINDING

### ⚠️ Potential Hardcoded Secrets
Found potential secrets in codebase:
\`\`\`
$(cat /tmp/secrets.txt | head -20)
\`\`\`

FINDING
    echo "⚠️  Found potential secrets"
else
    cat >> "$SECURITY_REPORT" <<FINDING

### ✓ No Hardcoded Secrets
No obvious hardcoded secrets found.

FINDING
    echo "✓ No hardcoded secrets found"
fi

# 2. Check file permissions
echo "Checking file permissions..."
insecure_files=$(find sessions/ -type f -perm -002 2>/dev/null | wc -l)
if [ "$insecure_files" -gt 0 ]; then
    cat >> "$SECURITY_REPORT" <<FINDING

### ⚠️ Insecure File Permissions
Found $insecure_files world-writable files.

FINDING
    echo "⚠️  Found $insecure_files world-writable files"
else
    cat >> "$SECURITY_REPORT" <<FINDING

### ✓ Secure File Permissions
All files have appropriate permissions.

FINDING
    echo "✓ File permissions are secure"
fi

# 3. Check for symlink attacks
echo "Checking for suspicious symlinks..."
suspicious_symlinks=$(find sessions/ -type l 2>/dev/null | wc -l)
if [ "$suspicious_symlinks" -gt 0 ]; then
    cat >> "$SECURITY_REPORT" <<FINDING

### ⚠️ Symbolic Links Found
Found $suspicious_symlinks symbolic links (potential attack vector).

FINDING
    echo "⚠️  Found $suspicious_symlinks symlinks"
else
    cat >> "$SECURITY_REPORT" <<FINDING

### ✓ No Suspicious Symlinks
No symbolic links found.

FINDING
    echo "✓ No suspicious symlinks"
fi

# 4. Validate JSON integrity
echo "Validating JSON integrity..."
corrupt_json=0
for json_file in $(find sessions/ -name "*.json" 2>/dev/null); do
    if ! jq . "$json_file" >/dev/null 2>&1; then
        corrupt_json=$((corrupt_json + 1))
    fi
done

if [ "$corrupt_json" -gt 0 ]; then
    cat >> "$SECURITY_REPORT" <<FINDING

### ⚠️ Corrupt JSON Files
Found $corrupt_json corrupt JSON files.

FINDING
    echo "⚠️  Found $corrupt_json corrupt JSON files"
else
    cat >> "$SECURITY_REPORT" <<FINDING

### ✓ JSON Integrity
All JSON files are well-formed.

FINDING
    echo "✓ All JSON files valid"
fi

# 5. Check for command injection vectors
echo "Scanning for command injection vectors..."
injection_patterns=$(grep -r '\$(' sessions/ 2>/dev/null | grep -v ".git" | grep -v "test" | wc -l)
if [ "$injection_patterns" -gt 0 ]; then
    cat >> "$SECURITY_REPORT" <<FINDING

### ⚠️ Potential Command Injection
Found $injection_patterns instances of command substitution.

FINDING
    echo "⚠️  Found $injection_patterns command substitution patterns"
else
    cat >> "$SECURITY_REPORT" <<FINDING

### ✓ No Command Injection Vectors
No obvious command injection patterns found.

FINDING
    echo "✓ No command injection vectors"
fi

cat >> "$SECURITY_REPORT" <<FOOTER

## Recommendations

1. **Secrets Management**: Never commit secrets to version control
2. **File Permissions**: Ensure sensitive files are not world-readable
3. **Input Validation**: Sanitize all user inputs
4. **Path Traversal**: Validate all file paths before operations
5. **JSON Validation**: Always validate JSON before parsing

## Next Steps

- Review all security findings above
- Implement fixes for high-priority issues
- Add automated security scanning to CI/CD
- Regular security audits

FOOTER

echo ""
echo "Security scan complete: $SECURITY_REPORT"
