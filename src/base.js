class SubredditBase {
    constructor(subreddit, clientId = null, clientSecret = null, userAgent = null) {
        this.subreddit = subreddit
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.userAgent = null
    }
}

class UserBase {
    constructor(subreddit, clientId = null, clientSecret = null, userAgent = null) {
        this.user = subreddit
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.userAgent = null
    }
}

function checkForApiError(response) {
    if ("message" in response.keys()) {
        throw RequestError(`${response['error']} ${response['message']}`)
    }
}


function getRequest(user_agent, client_id, rtype, slash, rfor) {
    const url = `https://www.reddit.com/${slash}/${rfor}/${rfor}.json`

    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.setRequestHeader("User-Agent", user_agent);
    xmlHttp.setRequestHeader(
        "Authorization",
        `Basic ${btoa(unescape(encodeURIComponent(`CLIENT_ID:${client_id}`)))}`
    )
    xmlHttp.send(null);

    return JSON.parse(xmlHttp.responseText)
}



function getPost(self, rtype, slash, rfor) {

    const meme = getRequest(self.userAgent, self.clientId, rtype, rfor, slash);
    checkForApiError(meme)

    const post = meme["data"]["children"]

    let stickied;
    let spoiler;
    let s;
    let media;
    let randompost;
    let nsfw;
    let flairPost;
    let flairAuthor;
    let contentText;
    let isMedia;
    let contentType;
    let mediaMetadata;

    try {
        try {
            randompost = Math.floor(Math.random() * meme["data"]["dist"]);
            if (post[randompost]["data"]["stickied"]) {
                randompost++
            }
            nsfw = post[randompost]["data"]["over_18"]
        } catch (e) {
            randompost = 0
            if (post[randompost]["data"]["stickied"]) {
                randompost++
            }
            nsfw = post[randompost]["data"]["over_18"]
        }

        stickied = post[randompost]["data"]["stickied"]
        spoiler = post[randompost]["data"]["spoiler"]
        s = post[randompost]["data"]["created"]
        media = post[randompost]["data"]["media"]

        try {
            flairAuthor = post[randompost]["data"]["author_flair_text"]
        } catch (e) {
            flairAuthor = null
        }

        try {
            flairPost = post[randompost]["data"]["link_flair_text"]
        } catch (e) {
            flairPost = null
        }

        try {
            mediaMetadata = post[randompost]["data"]["media_metadata"]
        } catch (e) {
            mediaMetadata = null
        }

        if (mediaMetadata) {
            let mediaList = []
            let galleryData = post[randompost]["data"]["gallery_data"]["items"]

            for (let i in galleryData.length) {
                mediaList.push({
                    "id": mediaMetadata.keys(),
                    "media": mediaMetadata[mediaMetadata.keys()[i]]["s"]["u"],
                    "caption": galleryData[i]["caption"] ? "caption" in galleryData[i] : null
                })
            }

            contentText = {
                "mediaCount": mediaMetadata.length,
                "media": mediaList,
                "fullData": mediaMetadata
            }

        } else if (media == null) {
            contentText = post[randompost]["data"]["selftext"]
            if (contentText === "") {
                try {
                    contentText = post[randompost]["data"]["url_overridden_by_dest"]
                } catch (e) {
                    contentText = null
                }
            }
        } else if (media) {
            try {
                contentText = post[randompost]["data"]["media"]["oembed"]["thumbnail_url"]
            } catch (e) {
                contentText = post[randompost]["data"]["secure_media_embed"]["media_domain_url"]
            }
        } else {
            contentText = post[randompost]["data"]["url_overridden_by_dest"]
        }

        isMedia = !post[randompost]["data"]["domain"].startsWith("self")

        let regexUrl = RegExp("^(?:http|ftp)s?://")
        let regexUrlImage = RegExp("(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?")

        if (post[randompost]["data"]["media_metadata"]) {
            contentType = "Gallery"
        } else if (regexUrlImage.test(contentText)) {
            contentType = "Image"
        } else if (post[randompost]["data"]["is_video"]) {
            contentType = "Video"
        } else if (regexUrl.test(contentText)) {
            contentType = "URL"
        } else {
            contentType = "Text"
        }

        return Reddit(
            this.content = contentText,
            this.title = post[randompost]["data"]["title"],
            this.upvoteRatio = post[randompost]["data"]["upvote_ratio"],
            this.totalAwards = post[randompost]["data"]["total_awards_received"],
            this.score = post[randompost]["data"]["score"],
            this.downvotes = post[randompost]["data"]["downs"],
            this.createdAt = parseInt(s),
            this.nsfw = nsfw,
            this.author = post[randompost]["data"]["author"],
            this.postUrl = `https://reddit.com${post[randompost]['data']['permalink']}`
                .replace("https://reddit.com/r/u_", " https://reddit.com/u/"),
            this.stickied = stickied,
            this.spoiler = spoiler,
            this.postFlair = flairPost,
            this.authorFlair = flairAuthor,
            this.subredditSubscribers = post[randompost]["data"]["subreddit_subscribers"],
            this.commentCount = post[randompost]["data"]["num_comments"],
            this.isMedia = isMedia,
            this.subredditName = post[randompost]["data"]["subreddit"],
            this.contentType = contentType
        )
    } catch (e) {

    }
}