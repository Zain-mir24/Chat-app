const users = []

//adduser, removeuser,getuser ,getusersinroom

const adduser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate  the data

    if (!username || !room) {
        return {
            error: 'username and room are required'
        }
    }
    // check for  existin user  
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username in use'
        }
    }
    //Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeuser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

}


adduser({
    id: 22,
    username: 'Andrew',
    room: 'South Philly'
})
adduser({
    id: 42,
    username: 'zain',
    room: 'Rawalpindi'
})
adduser({
    id: 52,
    username: 'Ahmed',
    room: 'Lahore'
})
const getusersinroom = (room) => {
    room =room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}



const getuser = (id) => {
    return users.find((user) => user.id === id)
}


module.exports={
    adduser,
    getuser,
    getusersinroom,
    removeuser
}
