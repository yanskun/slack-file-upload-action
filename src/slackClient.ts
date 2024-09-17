import { getInput, setFailed } from "@actions/core";
import { WebClient } from "@slack/web-api";

const token = getInput("token");

if (!token) {
  setFailed("No token provided!");
}

export const slackClient = new WebClient(token);
