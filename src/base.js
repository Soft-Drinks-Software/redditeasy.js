// useless strftime shit ignore
Date.prototype.strftime = function(format) {
    const options = {
        "day_names": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "abbr_day_names": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        "month_names": [null,"January","February","March","April","May","June","July","August","September","October","November","December"],
        "abbr_month_names": [null,"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    }

    const date = this;

    if (!options) {
        return date.toString();
    }

    options.meridian = options.meridian || ["AM", "PM"];

    const weekDay = date.getDay();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const hour = date.getHours();
    let hour12 = hour;
    const meridian = hour > 11 ? 1 : 0;
    const secs = date.getSeconds();
    const mins = date.getMinutes();
    const offset = date.getTimezoneOffset();
    const absOffsetHours = Math.floor(Math.abs(offset / 60));
    const absOffsetMinutes = Math.abs(offset) - (absOffsetHours * 60);
    const timezoneoffset = (offset > 0 ? "-" : "+") + (absOffsetHours.toString().length < 2 ? "0" + absOffsetHours : absOffsetHours) + (absOffsetMinutes.toString().length < 2 ? "0" + absOffsetMinutes : absOffsetMinutes);

    if (hour12 > 12) {
        hour12 = hour12 - 12;
    } else if (hour12 === 0) {
        hour12 = 12;
    }

    const padding = function (n) {
        const s = "0" + n.toString();
        return s.substr(s.length - 2);
    };

    let f = format;
    f = f.replace("%a", options.abbr_day_names[weekDay]);
    f = f.replace("%A", options.day_names[weekDay]);
    f = f.replace("%b", options.abbr_month_names[month]);
    f = f.replace("%B", options.month_names[month]);
    f = f.replace("%d", padding(day));
    f = f.replace("%-d", day);
    f = f.replace("%H", padding(hour));
    f = f.replace("%-H", hour);
    f = f.replace("%I", padding(hour12));
    f = f.replace("%-I", hour12);
    f = f.replace("%m", padding(month));
    f = f.replace("%-m", month);
    f = f.replace("%M", padding(mins));
    f = f.replace("%-M", mins);
    f = f.replace("%p", options.meridian[meridian]);
    f = f.replace("%S", padding(secs));
    f = f.replace("%-S", secs);
    f = f.replace("%w", weekDay);
    f = f.replace("%y", padding(year));
    f = f.replace("%-y", padding(year).replace(/^0+/, ""));
    f = f.replace("%Y", year);
    f = f.replace("%z", timezoneoffset);

    return f;
};


// real shit starts here
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

    const meme = getRequest(self.userAgent, rtype, rfor, slash);
    checkForApiError(meme)

    const post = meme["data"]["children"]

    let stickied;
    let spoiler;
    let s;
    let media;
    let updated;
    let randompost;
    let nsfw;

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
        updated = Date.prototype.strftime("%d-%m-%Y %I:%M:%S UTC")
    } catch (e) {

    }
}