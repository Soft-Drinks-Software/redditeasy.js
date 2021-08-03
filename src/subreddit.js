class Subreddit extends SubredditBase {

    getPost() {
        return getPost(this, "hot", "r", this.subreddit)
    }
}