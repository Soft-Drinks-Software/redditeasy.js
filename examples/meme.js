const subreddit =  Subreddit(
    "dankmemes",
    "",
    "",
    "",
)

const post = subreddit.getPost()

console.log(
    `Posts Title: ${post.title}\n`
    `Posts Content: ${post.content}\n`
    `Posts Author: u/${post.author}\n`
    `Posts URL: ${post.postUrl}\n`
    `Spoiler?: ${post.spoiler}\n`
    `Post Created At: ${post.createdAt}\n`
    `Posts Upvote Count: ${post.score}\n`
    `Posts Upvote Ratio: ${post.upvoteRatio}\n`
    `Posts Downvote Count: ${post.downvotes}\n`
    `Posts Award Count: ${post.totalAwards}\n`
    `NSFW?: ${post.nsfw}\n`
    `Post Flair: ${post.postFlair}\n`
    `User Flair: ${post.authorFlair}\n`
    `Subreddit Subscribers: ${post.subredditSubscribers}\n`
    `Comment count: ${post.commentCount}\n`
    `Is Media?: ${post.isMedia}\n`
    `Subreddit Name: ${post.subredditName}\n`
    `Content Type: ${post.contentType}`
)
