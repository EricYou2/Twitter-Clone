import React from 'react'
import Tweet from './Tweet'

export default function TweetList({ tweets, likeTweet, commentTweet, followUser, deleteTweet}) {
    if(tweets != null && tweets.length != 0){
        return (
            tweets.map(tweet => {
                    return <Tweet key = { tweet.id }
                    likeTweet = { likeTweet }
                    tweet = { tweet }
                    commentTweet = {commentTweet}
                    followUser = {followUser}
                    deleteTweet = {deleteTweet}/>
            })
        )
    }else{
        return <div>No Tweets Yet</div>
    }
}