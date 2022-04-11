const {REACT_APP_URL} = process.env;
export async function deleteUser(userId){
    await fetch(`${REACT_APP_URL}/admin/delete/user`,{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId:userId}),
                mode: 'cors'
            })
            .then(response =>{
                //console.log(response.status)
                response.json().then(df=>{
                        window.alert(df.msg)
                })
            })
}

export async function deletePost(postObjectId){
    await fetch(`${REACT_APP_URL}/admin/delete/post`,{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({postObjectId:postObjectId}),
                mode: 'cors'
            })
            .then(response =>{
                //console.log(response.status)
                response.json().then(df=>{
                        window.alert(df.msg)
                        
                })
            })
}

export async function deleteComment(commentObjectId){
    await fetch(`${REACT_APP_URL}/admin/delete/comment`,{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({commentObjectId:commentObjectId}),
                mode: 'cors'
            })
            .then(response =>{
                //console.log(response.status)
                response.json().then(df=>{
                        window.alert(df.msg)
                })
            })
}

export async function deletePrivateChat(chatObjectId){
    await fetch(`${REACT_APP_URL}/admin/delete/privateChat`,{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({chatObjectId:chatObjectId}),
                mode: 'cors'
            })
            .then(response =>{
                //console.log(response.status)
                response.json().then(df=>{
                        window.alert(df.msg)
                })
            })
}

export async function deleteGroupChat(roomObjectId){
    await fetch(`${REACT_APP_URL}/admin/delete/groupChat`,{
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({roomObjectId:roomObjectId}),
                mode: 'cors'
            })
            .then(response =>{
                //console.log(response.status)
                response.json().then(df=>{
                        window.alert(df.msg)
                })
            })
}