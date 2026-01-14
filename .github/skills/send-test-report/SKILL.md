---
name: send-test-report
description: |
  When an agent detects a test result report (e.g., HTML file) is ready, use this skill to send the report to a designated email address. Useful for OpenSpec, CI, or automation agents after test completion, archiving, or PR merge.
license: MIT
---

## Usage

1. Agent detects a test report (e.g., test_report.html) is ready to send.
2. Agent invokes this skill by calling a mail API, script, or workflow to send the report as an email attachment.
3. Skill handles the sending logic and returns the result to the agent.

## Example: Call mail API

```bash
curl -X POST https://mail.example.com/api/send \
  -H "Authorization: Bearer $MAIL_API_TOKEN" \
  -F "to=you@example.com" \
  -F "subject=[OpenSpec] Test Report" \
  -F "body=請查收附件的自動化測試報告。" \
  -F "attachment=@test_report.html"
```

## Example: Python script

```python
import requests
with open('test_report.html', 'rb') as f:
    files = {'attachment': f}
    data = {'to': 'you@example.com', 'subject': '[OpenSpec] Test Report', 'body': '請查收附件的自動化測試報告。'}
    headers = {'Authorization': f'Bearer {MAIL_API_TOKEN}'}
    requests.post('https://mail.example.com/api/send', data=data, files=files, headers=headers)
```

## Security

- Store credentials (API keys, passwords) in secrets, not plaintext.
- Only authorized recipients should receive test reports.

---
This skill can be reused in other repos or by any agent. Adjust details as needed for your environment.