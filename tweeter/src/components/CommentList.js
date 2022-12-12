import React from 'react'
import Comment from './Comment'

export default function CommentList({ comments }) {
    if(comments == null){
        return <div>No comments yet</div>   
    }else{
        return (
            comments.map(comment => {
                return <Comment key = { comment.id }
                comment = { comment }
                />
            })
        )
    }
}