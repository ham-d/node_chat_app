//es6 class

//example: 
      //uppercase is conventional in naming class
// class Person {
//     //constructor gets called by default
//         //acts similarly to prototype in es5
//     constructor(name, age) {
//         //this refers to the calling instance 
//         this.name = name;
//         this.age = age;
//     }
//     getUserDescription() {
//         return `${this.name} is ${this.age} yaer(s) old.`;
//     }
// }

// var me = new Person('bill', 25);
// var description = me.getUserDescription();


class Users {
    constructor() {
        this.users = [];
    }
    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        var user = this.users.filter((user) => {
            return (user.id === id);
        })[0];
        //or
        //var user = this.getUser(id);
        
        if (user) {
            this.users = this.users.filter((user) => {
                return user.id !== id;
            });
        }
        
        return user;
    }
    getUser (id) {
        return this.users.filter((user) => {
            return (user.id === id);
        })[0];
    }
    getUserList (room) {
        var users = this.users.filter((user) => {
            return user.room === room;
        });
        var namesArray = users.map((user) => {
            return user.name;
        });
        
        return namesArray;
    }
}

module.exports = {Users};