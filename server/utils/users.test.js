const expect = require("expect");

const {Users} = require("./users");

describe('Users', () => {
    var users;
    
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'John',
            room: 'Hello'
        }, {
            id: '2',
            name: 'Matt',
            room: 'world'
        }, {
            id: '3',
            name: 'Jim',
            room: 'Hello'
        }]
    });
    
    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: "Bill",
            room: "Batman"
        };
        
        var resUsers = users.addUser(user.id, user.name, user.room);
               //1st users = from above
               //2nd users = from users.js
                                    //user from above
        expect(users.users).toEqual([user]);
    });
    
    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);
        
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });
    
    it('should not remove a user', () => {
        var userId = '99';
        var user = users.removeUser(userId);
        
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });
    
    it('should find a user', () => {
        var userId = '2';
        var user = users.getUser(userId);
        
        expect(user.id).toBe(userId);
    });
    
    it('should not find a user', () => {
        var userId = '99';
        var user = users.getUser(userId);
        
        expect(user).toNotExist();
    });
    
    it('should return names for Hello room', () => {
        var userList = users.getUserList('Hello');
        
        expect(userList).toEqual(['John', 'Jim']);
    });
    
    it('should return names for world room', () => {
        var userList = users.getUserList('world');
        
        expect(userList).toEqual(['Matt']);
    });
})