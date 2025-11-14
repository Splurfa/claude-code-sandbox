# Real Session Management Test

## What You'll Do

1. Open a **new Claude Code chat** (completely fresh session)
2. Ask Claude to create a simple hello world script
3. Check if files land in the session folder automatically

That's it. No commands from you.

## The Test

**In the new chat, just say:**

```
Create a hello world script in JavaScript
```

## What Should Happen Automatically

Claude Code should automatically:

1. **Create session folder** at `sessions/session-YYYYMMDD-HHMMSS-hello-world/`
2. **Create artifacts structure** with subdirectories (`code/`, `tests/`, `docs/`, etc.)
3. **Write the script** to `sessions/.../artifacts/code/hello.js`
4. **Create session summary** at `sessions/.../session-summary.md`
5. **Create metadata** at `sessions/.../metadata.json`

## Expected Result

```
sessions/
└── session-20251113-HHMMSS-hello-world/
    ├── artifacts/
    │   ├── code/
    │   │   └── hello.js          ← Script should be HERE
    │   ├── tests/
    │   ├── docs/
    │   ├── scripts/
    │   └── notes/
    ├── session-summary.md         ← Auto-created
    └── metadata.json              ← Auto-created
```

**NOT** in root directory like `hello.js` or `scripts/hello.js`

## How To Verify

After Claude responds, run this in the test chat:

```bash
# Show me what was created
ls -la sessions/

# Show the session folder contents
ls -la sessions/session-*/

# Show where the hello.js file ended up
find . -name "hello.js" -type f
```

## Success Criteria

✅ **PASS** if:
- Session folder exists with timestamp and topic
- `hello.js` is in `sessions/.../artifacts/code/hello.js`
- `session-summary.md` and `metadata.json` exist
- No files created in root directory

❌ **FAIL** if:
- No session folder created
- `hello.js` is in root directory or `scripts/hello.js`
- Session metadata missing
- Claude asks you to run manual commands

## Report Back

Come back to the orchestration chat and tell me:

1. **Pass or Fail?**
2. **What path was the file created at?**
3. **Copy the output of** `ls -la sessions/session-*/`

Then we'll know if the automatic session management is working.
