import { getInput, setFailed } from "@actions/core";
import { slackClient } from "./slackClient";
import * as fs from "fs";
import axios from "axios";
import FormData from "form-data";

const path = getInput("path");

if (!path) {
  setFailed("No filename provided!");
}

const channelId = getInput("channel_id");

if (!channelId) {
  setFailed("No channel ID provided!");
}

const filename = path.split("/").at(-1) ?? path;

function postFile() {
  let fileSize = 0;

  try {
    const stats = fs.statSync(path);
    fileSize = stats.size;
    console.log("File size: ", fileSize);
    console.log("Filename: ", filename);
    return slackClient.files.getUploadURLExternal({
      length: fileSize,
      filename,
    });
  } catch {
    setFailed("Error getting file stats");
  }
}

async function uploadFile(fileId: string) {
  try {
    slackClient.files.completeUploadExternal({
      files: [
        {
          id: fileId ?? "",
          title: filename,
        },
      ],
      channel_id: channelId,
    });
  } catch {
    setFailed("Error uploading file");
  }
}

async function main() {
  const postFileResult = await postFile();
  if (!postFileResult?.ok) {
    setFailed("Error posting file");
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(path), filename);

  if (!postFileResult?.upload_url) {
    setFailed("Error getting upload URL");
  } else {
    try {
      await axios.post(postFileResult.upload_url, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      setFailed("Error uploading file");
    }
  }

  if (!postFileResult?.file_id) {
    setFailed("Error getting file ID");
  } else {
    uploadFile(postFileResult.file_id);
  }
}

main().catch((error) => {
  console.error("Error in main function:", error);
  setFailed("Error in main function");
});
