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

## [Sample](https://github.com/yanskun/slack-file-upload-action/blob/main/.github/workflows/sample.yaml)

Get the diff against the latest release

```yaml
name: Sample

on:
  workflow_dispatch:

jobs:
  git:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set the value in bash
        id: step_one
        run: |
          mkdir result
          git diff $(git describe --tags $(git rev-list --tags --max-count=1)) ./README.md >> result/diff.diff

      - name: Archive Artifact 📮
        uses: actions/upload-artifact@master
        with:
          name: result
          path: result

  slack:
    name: Send Slack
    needs: git
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎
        uses: actions/checkout@master

      - name: Download Artifact 📬
        uses: actions/download-artifact@master
        with:
          name: result
          path: result
      - name: Upload File to Slack
        uses: yanskun/slack-file-upload-action@v1
        with:
          token: ${{ secrets.SLACK_TOKEN }}
          path: result/diff.diff
          channel_id: CV2RB3ZDJ
```

### Output

![image](https://github.com/user-attachments/assets/ef221b6c-dc6e-4887-aa29-9fddd4ab3fd8)
