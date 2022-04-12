import React,{useEffect, useState} from "react"
import {useParams,Link} from "react-router-dom"
import {UserContent} from "../profile/Profile"

const {REACT_APP_URL} = process.env;
function OtherProfile(props){
    let searchedId = useParams().searchedId
    let [isfrd, setIsfrd] = useState(false)
    let [isUser, setIsUser] = useState(false)
    
    useEffect(async()=>{
        if(searchedId == props.userId){
            setIsUser(true)
        }
        const response = await fetch(`${REACT_APP_URL}/${props.userId}/viewAllfrd`);
        const res = await response.json();
        const friend = await res.friend.find(element=>{
            if (element.userId==searchedId){
                setIsfrd(true)
            }
        })
    })
    const invite = () =>{
        //console.log(JSON.stringify({inviter:parseInt(props.userId),invitee:searchedId}))
        fetch(`${REACT_APP_URL}/friend/invite`,{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({inviterId:props.userId,inviteeId:searchedId}),
                mode: 'cors'
            })
            .then(response =>{
                response.json().then(df=>{
                    window.alert(df.msg)
                })
            })
    }
    return(
        <>
        <div className="d-flex justify-content-end">
            <Link to = {`/user/${props.userId}/searchUser`}>back to search</Link>    
        </div>
        <UserContent userId = {searchedId} />
        {isUser?null:
            isfrd?
            <button className="btn btn-primary">Already Friend</button>:
            <button className="btn btn-primary" onClick={invite}>Add Friend</button>
        }
        </>
    )
}

export {OtherProfile};