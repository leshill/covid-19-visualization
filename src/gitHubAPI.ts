const URL =
  'https://api.github.com/repos/nytimes/covid-19-data/branches/master';

async function commitSHA(): Promise<string> {
  return fetch(URL)
    .then((response) => response.json())
    .then((json) => {
      return json.commit.sha
    }
)
}

export default commitSHA;
