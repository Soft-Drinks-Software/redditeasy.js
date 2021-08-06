class Reddit {
    constructor(content, title, upvoteRatio, totalAwards, score, downvotes, createdAt, nsfw, author, postUrl,
                stickied, spoiler, postFlair, authorFlair, subredditSubscribers, commentCount, isMedia,
                subredditName, contentType) {

        this.content = content
        this.title = title
        this.upvoteRatio = upvoteRatio
        this.totalAwards = totalAwards
        this.score = score
        this.downvotes = downvotes
        this.createdAt = createdAt
        this.nsfw = nsfw
        this.author = author
        this.postUrl = postUrl
        this.stickied = stickied
        this.spoiler = spoiler
        this.postFlair = postFlair
        this.authorFlair = authorFlair
        this.subredditSubscribers = subredditSubscribers
        this.commentCount = commentCount
        this.isMedia = isMedia
        this.subredditName = subredditName
        this.contentType = contentType
    }
}