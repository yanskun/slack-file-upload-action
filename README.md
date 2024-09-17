# Slack File Upload

GitHub Action for uploading a file to Slack

Inspired by https://github.com/adrey/slack-file-upload-action

# Usage

```yaml
- uses: yanskun/slack-file-upload-action@v1
  with:
    # Required
    # Slack app token
    # Permission: files:write
    token: ${{ secrets.SLACK_TOKEN }}
    # Required
    # Path to file
    path: test.txt
    # Required
    # Slack Channel ID fo upload
    channel_id: ''
```
