
import { getByDiffTag, getByLink } from "./getLeetCode.js";


function getTopTags(allTagsArrays, topN = 3) {
    const tagCount = new Map();

    for (const tags of allTagsArrays) {
        for (const tag of tags) {
            const tagName = tag.name;
            tagCount.set(tagName, (tagCount.get(tagName) || 0) + 1);
        }
    }

    const sortedTags = Array.from(tagCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)

    return sortedTags.map(([tag]) => tag);
}


export async function getProps(obj) {
    const valid = Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
            return true;
        })
    );

    const allTags = [];

    const problems = await Promise.all(
        valid.problemsList.map(async (ele) => {
            let problem = ele.url
                ? await getByLink(ele.url)
                : await getByDiffTag(ele.difficulty.toUpperCase(), ele.tags);

            if (problem && Array.isArray(problem.topicTags)) {
                allTags.push(problem.topicTags);
            }

            return problem;
        })
    );

    valid.topics = getTopTags(allTags);
    valid.problems = problems.filter(Boolean);
    delete valid.problemsList;
    return valid;
}
/*
console.log(await getProps({
    "contestName": "some contestName",
    "problemsList": [
        {
            "id": 1,
            "difficulty": "easy",
            "tags": ["tree"],
            "random": true,
            "url": ""
        },
        {
            "id": 2,
            "difficulty": "medium",
            "tags": ["tree"],
            "random": true,
            "url": ""
        },
        {
            "id": 3,
            "difficulty": "medium",
            "tags": ["tree"],
            "random": true,
            "url": ""
        },
        {
            "id": 4,
            "difficulty": "medium",
            "tags": ["tree"],
            "random": true,
            "url": ""
        },
        {
            "id": 5,
            "difficulty": "hard",
            "tags": ["tree"],
            "random": true,
            "url": ""
        }
    ],
    "maxUser": 45,
    "inviteOnly": false,
    "public": true
}));
*/