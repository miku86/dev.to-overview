require("dotenv").config();
const axios = require("axios");
var summary = require("summary");

const API_BASE = "https://dev.to/api/articles";
const API_ARTICLES_MINE = "/me?per_page=1000";
const URL_ARTICLES_MINE = API_BASE + API_ARTICLES_MINE;

const fetchPosts = () => {
  return axios({
    method: "GET",
    url: URL_ARTICLES_MINE,
    headers: { "api-key": process.env.DEVTO_API_KEY },
  });
};
const getRawData = (data, prop) => data.map((post) => post[prop]);
const getSummary = (views) => summary(views, true);
const generateStats = (data) => ({
  total: data.sum(),
  mean: Number(data.mean().toFixed(0)),
  median: Number(data.median().toFixed(0)),
});
const getMessage = ({ data, objProp, title }) => {
  const raw = getRawData(data, objProp);
  const summary = getSummary(raw);
  const output = generateStats(summary);
  console.log(`${title}`, output);
};

(async () => {
  try {
    const { data } = await fetchPosts();

    getMessage({ data, objProp: "page_views_count", title: "Views" });
    getMessage({ data, objProp: "public_reactions_count", title: "Reactions" });
  } catch (error) {
    throw new Error("No data available");
  }
})();
