import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import Loader from '../Loader'
const Home  = ()=>{
    const [data,setData] = useState()
    const [comment,setComment] = useState()
    const [more,setMore] = useState()
    const [loader,setLoader] = useState(false)
    const [cloader,setCLoader] = useState(false)
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
       fetch('/allpost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setData(result.posts)
       })
    },[])

    const likePost = (id)=>{
          fetch('/like',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
                   //   console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    }
    const unlikePost = (id)=>{
          fetch('/unlike',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
            //   console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
        setCLoader(true)
          fetch('/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId,
                  text
              })
          }).then(res=>res.json())
          .then(result=>{
              console.log(result)
              const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
             })
            setData(newData)
            setCLoader(false)
          }).catch(err=>{
              console.log(err)
              setCLoader(false)
          })
        setComment("")
    }

    const deletePost = (postid)=>{
        setLoader(true)
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setLoader(false)
            setData(newData)
        })
    }

   return (
       <div className="home">
       
           {
               data?data.map(item=>{
                   return(
                      <div >
                      {/* style={{display:'flex'}} */}
                          <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> {item.postedBy._id == state._id 
                            &&  <>
                            {
                                loader?
                                <i className="fa fa-spinner fa-spin" style={{float:"right"}}></i>
                                :
                                <i className="material-icons"
                                 style={{float:"right",cursor:'pointer'}} 
                                 onClick={()=>deletePost(item._id)}
                                 >delete</i>
                            }                            
                            </>
                            }</h5>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            {item.likes.includes(state._id)
                            ? 
                             <i className="material-icons"
                                    onClick={()=>{unlikePost(item._id)}}
                              >thumb_down</i>
                            : 
                            <i className="material-icons"
                            onClick={()=>{likePost(item._id)}}
                            >thumb_up</i>
                            }
                            
                           
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.slice(0, more).map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <p className="center">
                                    <Link to="#" onClick={()=>setMore(20)}><i className="material-icons ">expand_more</i></Link>
                                </p>
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(comment,item._id)
                                }}>
                                {
                                    cloader?
                                    <>
                                    <i className="fa fa-spinner fa-spin" ></i> 
                                    <input type="text" value={comment}  onChange={(e)=>setComment(e.target.value)} placeholder="add a comment" disabled/>                                   
                                    </>
                                    :
                                    <input type="text" value={comment}  onChange={(e)=>setComment(e.target.value)} placeholder="add a comment" />                                   
                                }
                                    
                                </form>
                                
                            </div>
                        </div> 
                   
                          
                 </div>

                   )
               }):<Loader/>
           }
          
          
       </div>
   )
}


export default Home