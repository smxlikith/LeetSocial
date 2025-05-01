import axios from 'axios';

function extractTitleSlug(url) {
    const match = url.match(/problems\/([^/]+)\//);
    return match ? match[1] : null;
}

async function getByLink(problemUrl) {
    const titleSlug = extractTitleSlug(problemUrl);
    if (!titleSlug) throw new Error('Invalid LeetCode URL');

    const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        titleSlug
        title
        difficulty
        questionFrontendId
        topicTags{
            name 
        }
      }
    }
  `;

    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { titleSlug },
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response.data.data.question);
        return response.data.data.question;
    } catch (error) {
        console.error('Error fetching LeetCode problem:', error.message);
        throw error;
    }
}

async function getByDiffTag(diff, tag) {
    try {
        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query: `
          query randomQuestionV2($favoriteSlug: String, $categorySlug: String, $searchKeyword: String, $filtersV2: QuestionFilterInput) {
            randomQuestionV2(
              favoriteSlug: $favoriteSlug
              categorySlug: $categorySlug
              filtersV2: $filtersV2
              searchKeyword: $searchKeyword
            ) {
              titleSlug
              title
              difficulty
              questionFrontendId
              topicTags{
                name
              }
            }
          }
        `,
                variables: {
                    categorySlug: "all-code-essentials",
                    searchKeyword: "",
                    filtersV2: {
                        filterCombineType: "ALL",
                        statusFilter: { questionStatuses: [], operator: "IS" },
                        difficultyFilter: { difficulties: [diff], operator: "IS" },
                        languageFilter: { languageSlugs: [], operator: "IS" },
                        topicFilter: { topicSlugs: [...tag], operator: "IS" },
                        companyFilter: { companySlugs: [], operator: "IS" },
                        positionFilter: { positionSlugs: [], operator: "IS" },
                        premiumFilter: { premiumStatus: [], operator: "IS" },
                        acceptanceFilter: {},
                        frequencyFilter: {},
                        lastSubmittedFilter: {},
                        publishedFilter: {}
                    }
                },
                operationName: "randomQuestionV2"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Add your cookie for personalization if needed:
                    // 'Cookie': 'LEETCODE_SESSION=your_session_here; csrftoken=...'
                }
            }
        );
        return response.data?.data?.randomQuestionV2;
    } catch (err) {
        console.log(err);
        console.error("❌ Error fetching question:", err.message);
    }
}

export { getByLink, getByDiffTag };
